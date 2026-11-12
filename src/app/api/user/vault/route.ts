import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbVaultNote } from '@/lib/server/models';
import { userVaultStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-vault-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to access Safe Vault notes.' },
      status: 401,
    });
  }

  const items = userVaultStore.get(user.id) || [];
  return createApiResponse({ data: items });
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-vault-post', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to store Safe Vault notes.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 65536);
  if (error) return error;

  const { title, category, encryptedContent, iv, salt } = body || {};

  if (
    typeof encryptedContent !== 'string' ||
    typeof iv !== 'string' ||
    typeof salt !== 'string' ||
    !encryptedContent ||
    !iv ||
    !salt
  ) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Encrypted payload (encryptedContent, iv, salt) is required.' },
      status: 400,
    });
  }

  const newItem: DbVaultNote = {
    id: 'vault-' + crypto.randomBytes(6).toString('hex'),
    userId: user.id,
    title: typeof title === 'string' && title.trim() ? title.trim().slice(0, 120) : 'Encrypted Note',
    category: typeof category === 'string' && category.trim() ? category.trim().slice(0, 60) : 'General Safety Note',
    encryptedContent,
    iv,
    salt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    storageStatus: 'SESSION_ONLY',
  };

  const existing = userVaultStore.get(user.id) || [];
  userVaultStore.set(user.id, [newItem, ...existing].slice(0, 200));

  return createApiResponse({ data: newItem });
}

export async function DELETE(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-vault-delete', 30);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const noteId = searchParams.get('id');

  if (noteId) {
    const existing = userVaultStore.get(user.id) || [];
    userVaultStore.set(
      user.id,
      existing.filter((item) => item.id !== noteId)
    );
  } else {
    userVaultStore.delete(user.id);
  }

  return createApiResponse({ data: { message: 'Vault record deleted.' } });
}
