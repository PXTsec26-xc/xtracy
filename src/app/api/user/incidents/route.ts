import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbIncidentRecord } from '@/lib/server/models';

const userIncidentsStore = new Map<string, DbIncidentRecord[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const items = userIncidentsStore.get(user.id) || [];
  return createApiResponse({ data: items });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { scenarioId, title, checklistState, notes, status } = body;

    const newItem: DbIncidentRecord = {
      id: 'inc-' + Date.now(),
      userId: user.id,
      scenarioId,
      title,
      status: status || 'IN_PROGRESS',
      checklistState: checklistState || {},
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageStatus: 'PERSISTENT',
    };

    const existing = userIncidentsStore.get(user.id) || [];
    userIncidentsStore.set(user.id, [newItem, ...existing.filter((i) => i.scenarioId !== scenarioId)]);

    return createApiResponse({ data: newItem });
  } catch (err) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Invalid payload.' },
      status: 400,
    });
  }
}
