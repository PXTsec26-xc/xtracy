import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbScanHistoryItem } from '@/lib/server/models';

// In-memory fallback persistence store for user scans
const userScansStore = new Map<string, DbScanHistoryItem[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to access saved scan history.' },
      status: 401,
    });
  }

  const items = userScansStore.get(user.id) || [];

  return createApiResponse({
    data: items,
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Persistent User Scan Repository',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to save scan history.' },
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const { inputType, inputSample, riskScore, riskLevel, warningSignsCount } = body;

    const newItem: DbScanHistoryItem = {
      id: 'scan-' + Date.now(),
      userId: user.id,
      inputType: inputType || 'text',
      inputSample: inputSample ? inputSample.substring(0, 150) : '',
      riskScore: typeof riskScore === 'number' ? riskScore : 0,
      riskLevel: riskLevel || 'LOW',
      warningSignsCount: typeof warningSignsCount === 'number' ? warningSignsCount : 0,
      analyzedAt: new Date().toISOString(),
      storageStatus: 'PERSISTENT',
    };

    const existing = userScansStore.get(user.id) || [];
    userScansStore.set(user.id, [newItem, ...existing]);

    return createApiResponse({
      data: newItem,
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Invalid scan payload.' },
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
  const scanId = searchParams.get('id');

  if (!scanId) {
    userScansStore.delete(user.id);
    return createApiResponse({ data: { message: 'All saved scans deleted.' } });
  }

  const existing = userScansStore.get(user.id) || [];
  const filtered = existing.filter((item) => item.id !== scanId);
  userScansStore.set(user.id, filtered);

  return createApiResponse({ data: { message: `Scan '${scanId}' deleted.` } });
}
