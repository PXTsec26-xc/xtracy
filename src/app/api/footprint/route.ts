import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { userFootprintsStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';
import crypto from 'node:crypto';

export interface FootprintItem {
  id: string;
  serviceName: string;
  category: 'Email Provider' | 'Social Media' | 'Digital Banking' | 'Cloud Storage' | 'Other';
  exposureRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyChecklist: { task: string; done: boolean }[];
}

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'footprint-get', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const items = userFootprintsStore.get(user.id) || [
    {
      id: 'fp-1',
      serviceName: 'Google Workspace / Gmail',
      category: 'Email Provider',
      exposureRisk: 'MEDIUM',
      privacyChecklist: [
        { task: 'Enable 2-Step Verification with Authenticator App', done: true },
        { task: 'Review connected 3rd-party app permissions', done: false },
        { task: 'Check Google Location History settings', done: false },
      ],
    },
    {
      id: 'fp-2',
      serviceName: 'Instagram Profile',
      category: 'Social Media',
      exposureRisk: 'HIGH',
      privacyChecklist: [
        { task: 'Set profile to Private Mode', done: false },
        { task: 'Disable "Allow sharing to stories"', done: false },
        { task: 'Review activity status visibility', done: true },
      ],
    },
  ];

  return createApiResponse({
    data: items,
    dataTrust: {
      status: userFootprintsStore.has(user.id) ? 'LOCAL' : 'FALLBACK',
      sourceName: 'XTRACY Account Footprint Tracker',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'footprint-post', 30);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const { data: body, error } = await parseBoundedJsonBody<Record<string, any>>(req, 16384);
  if (error) return error;

  const serviceName = typeof body?.serviceName === 'string' && body.serviceName.trim() ? body.serviceName.trim().slice(0, 120) : 'New Service';
  const category = ['Email Provider', 'Social Media', 'Digital Banking', 'Cloud Storage', 'Other'].includes(body?.category) ? body!.category : 'Other';
  const exposureRisk = ['LOW', 'MEDIUM', 'HIGH'].includes(body?.exposureRisk) ? body!.exposureRisk : 'MEDIUM';

  const newItem: FootprintItem = {
    id: 'fp-' + crypto.randomBytes(6).toString('hex'),
    serviceName,
    category,
    exposureRisk,
    privacyChecklist: [
      { task: 'Enable Two-Factor Authentication (2FA)', done: false },
      { task: 'Review public profile exposure settings', done: false },
      { task: 'Audit connected third-party app access', done: false },
    ],
  };

  const existing = userFootprintsStore.get(user.id) || [];
  userFootprintsStore.set(user.id, [newItem, ...existing]);

  return createApiResponse({
    data: newItem,
    dataTrust: {
      status: 'LOCAL',
      sourceName: 'XTRACY Account Footprint Tracker',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
