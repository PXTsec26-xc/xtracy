import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbVaultNote } from '@/lib/server/models';

const userVaultStore = new Map<string, DbVaultNote[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
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
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to store Safe Vault notes.' },
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { title, category, encryptedContent, iv, salt } = body;

    if (!encryptedContent || !iv || !salt) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Encrypted payload (encryptedContent, iv, salt) is required.' },
        status: 400,
      });
    }

    const newItem: DbVaultNote = {
      id: 'vault-' + Date.now(),
      userId: user.id,
      title: title || 'Encrypted Note',
      category: category || 'General Safety Note',
      encryptedContent,
      iv,
      salt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageStatus: 'PERSISTENT',
    };

    const existing = userVaultStore.get(user.id) || [];
    userVaultStore.set(user.id, [newItem, ...existing]);

    return createApiResponse({ data: newItem });
  } catch (err) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Invalid payload.' },
      status: 400,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
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
