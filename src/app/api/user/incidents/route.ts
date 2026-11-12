import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbIncidentRecord } from '@/lib/server/models';
import { userIncidentsStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-incidents-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
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
  const limited = enforceRateLimit(req, 'user-incidents-post', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 32768);
  if (error) return error;

  const { scenarioId, title, checklistState, notes, status } = body || {};

  if (!scenarioId || typeof scenarioId !== 'string' || !title || typeof title !== 'string') {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'scenarioId and title are required.' },
      status: 400,
    });
  }

  const validStatuses = ['IN_PROGRESS', 'RESOLVED', 'RECOVERING'] as const;
  const resolvedStatus = validStatuses.includes(status) ? (status as DbIncidentRecord['status']) : 'IN_PROGRESS';

  const newItem: DbIncidentRecord = {
    id: 'inc-' + crypto.randomBytes(6).toString('hex'),
    userId: user.id,
    scenarioId: scenarioId.slice(0, 80),
    title: title.slice(0, 160),
    status: resolvedStatus,
    checklistState: checklistState && typeof checklistState === 'object' ? checklistState : {},
    notes: typeof notes === 'string' ? notes.slice(0, 10000) : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    storageStatus: 'SESSION_ONLY',
  };

  const existing = userIncidentsStore.get(user.id) || [];
  userIncidentsStore.set(user.id, [newItem, ...existing.filter((i) => i.scenarioId !== newItem.scenarioId)]);

  return createApiResponse({ data: newItem });
}
