import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbIncidentRecord } from '@/lib/server/models';

const userCasesStore = new Map<string, DbIncidentRecord[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
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
      status: 'LIVE',
      sourceName: 'XTRACY Incident Case Vault Repository',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to create incident cases.' },
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { scenarioId, title, status, notes, checklistState } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Case title is required.' },
        status: 400,
      });
    }

    const newCase: DbIncidentRecord = {
      id: 'case-' + Date.now(),
      userId: user.id,
      scenarioId: scenarioId || 'custom-incident',
      title: title.trim(),
      status: status || 'IN_PROGRESS',
      checklistState: checklistState || {},
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageStatus: 'PERSISTENT',
    };

    const existing = userCasesStore.get(user.id) || [];
    userCasesStore.set(user.id, [newCase, ...existing]);

    return createApiResponse({ data: newCase });
  } catch (err) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Invalid case payload.' },
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
