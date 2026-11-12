import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbIncidentRecord } from '@/lib/server/models';
import { userCasesStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'cases-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to access Case Vault.' },
      status: 401,
    });
  }

  const items = userCasesStore.get(user.id) || [];
  return createApiResponse({
    data: items,
    dataTrust: {
      status: 'LOCAL',
      sourceName: 'XTRACY Ephemeral Session Case Vault Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'cases-post', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to create incident cases.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 32768);
  if (error) return error;

  const { scenarioId, title, status, notes, checklistState } = body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Case title is required.' },
      status: 400,
    });
  }

  const validStatuses = ['IN_PROGRESS', 'RESOLVED', 'RECOVERING'] as const;
  const resolvedStatus = validStatuses.includes(status) ? (status as DbIncidentRecord['status']) : 'IN_PROGRESS';

  const newCase: DbIncidentRecord = {
    id: 'case-' + crypto.randomBytes(6).toString('hex'),
    userId: user.id,
    scenarioId: typeof scenarioId === 'string' && scenarioId.trim() ? scenarioId.trim().slice(0, 80) : 'custom-incident',
    title: title.trim().slice(0, 160),
    status: resolvedStatus,
    checklistState: checklistState && typeof checklistState === 'object' ? checklistState : {},
    notes: typeof notes === 'string' ? notes.slice(0, 10000) : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    storageStatus: 'SESSION_ONLY',
  };

  const existing = userCasesStore.get(user.id) || [];
  userCasesStore.set(user.id, [newCase, ...existing].slice(0, 200));

  return createApiResponse({ data: newCase });
}

export async function DELETE(req: NextRequest) {
  const limited = enforceRateLimit(req, 'cases-delete', 30);
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
  const caseId = searchParams.get('id');

  if (caseId) {
    const existing = userCasesStore.get(user.id) || [];
    userCasesStore.set(
      user.id,
      existing.filter((item) => item.id !== caseId)
    );
  } else {
    userCasesStore.delete(user.id);
  }

  return createApiResponse({ data: { message: 'Incident case record deleted.' } });
}
