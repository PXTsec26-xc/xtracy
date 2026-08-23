import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';

export interface FootprintItem {
  id: string;
  serviceName: string;
  category: 'Email Provider' | 'Social Media' | 'Digital Banking' | 'Cloud Storage' | 'Other';
  exposureRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyChecklist: { task: string; done: boolean }[];
}

const userFootprintsStore = new Map<string, FootprintItem[]>();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
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
    const { serviceName, category, exposureRisk } = body;

    const newItem: FootprintItem = {
      id: 'fp-' + Date.now(),
      serviceName: serviceName || 'New Service',
      category: category || 'Other',
      exposureRisk: exposureRisk || 'MEDIUM',
      privacyChecklist: [
        { task: 'Enable Two-Factor Authentication (2FA)', done: false },
        { task: 'Review public profile exposure settings', done: false },
        { task: 'Audit connected third-party app access', done: false },
      ],
    };

    const existing = userFootprintsStore.get(user.id) || [];
    userFootprintsStore.set(user.id, [newItem, ...existing]);

    return createApiResponse({ data: newItem });
  } catch (err) {
    return createApiResponse({
      error: { code: 'BAD_REQUEST', message: 'Invalid payload.' },
      status: 400,
    });
  }
}
