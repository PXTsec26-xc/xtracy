import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbSavedReport } from '@/lib/server/models';

const userBookmarksStore = new Map<string, DbSavedReport[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
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
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to save bookmarks.' },
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { reportId, title, category, severity } = body;

    const newItem: DbSavedReport = {
      id: 'bm-' + Date.now(),
      userId: user.id,
      reportId,
      title,
      category,
      severity,
      savedAt: new Date().toISOString(),
      storageStatus: 'PERSISTENT',
    };

    const existing = userBookmarksStore.get(user.id) || [];
    userBookmarksStore.set(user.id, [newItem, ...existing]);

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
