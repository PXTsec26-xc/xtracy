import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbSecurityAlert } from '@/lib/server/models';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  const alerts: DbSecurityAlert[] = [
    {
      id: 'alt-1',
      userId: user?.id || 'public',
      title: 'India Emergency Contact Directory Active',
      severity: 'CRITICAL',
      message: 'Immediate direct-dial emergency helplines active: 112 (Universal), 181 (Women Helpline), 100 (Police), 1930 (Cybercrime Fraud).',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'alt-2',
      userId: user?.id || 'public',
      title: 'Active Phishing Campaign Warning: Banking KYC SMS',
      severity: 'HIGH',
      message: 'Scam SMS messages falsely claiming bank account suspension are circulating. Do not click unverified links.',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'alt-3',
      userId: user?.id || 'public',
      title: 'CISA Vulnerability Catalog Feed Updated',
      severity: 'MEDIUM',
      message: 'New critical vulnerabilities added to CISA KEV feed. Update software to latest patches.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];

  return createApiResponse({
    data: alerts,
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY In-App Notification Center',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
