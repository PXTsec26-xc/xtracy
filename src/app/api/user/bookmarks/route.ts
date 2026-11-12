import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbSavedReport } from '@/lib/server/models';
import { userBookmarksStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-bookmarks-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const items = userBookmarksStore.get(user.id) || [];
  return createApiResponse({ data: items });
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-bookmarks-post', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to save bookmarks.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 16384);
  if (error) return error;

  const { reportId, title, category, severity } = body || {};

  if (!reportId || typeof reportId !== 'string' || !title || typeof title !== 'string') {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'reportId and title are required.' },
      status: 400,
    });
  }

  const newItem: DbSavedReport = {
    id: 'bm-' + crypto.randomBytes(6).toString('hex'),
    userId: user.id,
    reportId: reportId.slice(0, 100),
    title: title.slice(0, 160),
    category: typeof category === 'string' ? category.slice(0, 60) : 'General',
    severity: typeof severity === 'string' ? severity.slice(0, 20) : 'MEDIUM',
    savedAt: new Date().toISOString(),
    storageStatus: 'SESSION_ONLY',
  };

  const existing = userBookmarksStore.get(user.id) || [];
  userBookmarksStore.set(user.id, [newItem, ...existing].slice(0, 200));

  return createApiResponse({ data: newItem });
}

export async function DELETE(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-bookmarks-delete', 30);
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
  const bookmarkId = searchParams.get('id');

  if (bookmarkId) {
    const existing = userBookmarksStore.get(user.id) || [];
    userBookmarksStore.set(
      user.id,
      existing.filter((item) => item.id !== bookmarkId)
    );
  } else {
    userBookmarksStore.delete(user.id);
  }

  return createApiResponse({ data: { message: 'Bookmark removed.' } });
}
