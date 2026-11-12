import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbScanHistoryItem } from '@/lib/server/models';
import { userScansStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-scans-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
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
      status: 'LOCAL',
      sourceName: 'XTRACY Ephemeral Session Scan Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-scans-post', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to save scan history.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 32768);
  if (error) return error;

  const { inputType, inputSample, riskScore, riskLevel, warningSignsCount } = body || {};

  const resolvedInputType: DbScanHistoryItem['inputType'] = ['url', 'text', 'email'].includes(inputType) ? inputType : 'text';
  const resolvedRiskLevel: DbScanHistoryItem['riskLevel'] = ['LOW', 'MEDIUM', 'HIGH'].includes(riskLevel) ? riskLevel : 'LOW';

  const newItem: DbScanHistoryItem = {
    id: 'scan-' + crypto.randomBytes(6).toString('hex'),
    userId: user.id,
    inputType: resolvedInputType,
    inputSample: typeof inputSample === 'string' ? inputSample.substring(0, 150) : '',
    riskScore: typeof riskScore === 'number' && Number.isFinite(riskScore) ? riskScore : 0,
    riskLevel: resolvedRiskLevel,
    warningSignsCount: typeof warningSignsCount === 'number' && Number.isFinite(warningSignsCount) ? warningSignsCount : 0,
    analyzedAt: new Date().toISOString(),
    storageStatus: 'SESSION_ONLY',
  };

  const existing = userScansStore.get(user.id) || [];
  userScansStore.set(user.id, [newItem, ...existing].slice(0, 200));

  return createApiResponse({
    data: newItem,
    dataTrust: {
      status: 'LOCAL',
      sourceName: 'XTRACY Ephemeral Session Scan Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function DELETE(req: NextRequest) {
  const limited = enforceRateLimit(req, 'user-scans-delete', 30);
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
