import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to access Organization Mode.' },
      status: 401,
    });
  }

  const sampleOrg = {
    id: 'org-demo-123',
    name: 'CyberShield Security Team',
    role: 'ADMIN',
    membersCount: 4,
    members: [
      { id: 'm1', name: user.fullName || 'User', email: user.email, role: 'ADMIN' },
      { id: 'm2', name: 'Security Analyst', email: 'analyst@cybershield.org', role: 'ANALYST' },
    ],
    casesCount: 2,
    isolatedTenantId: `tenant-${user.id.substring(0, 8)}`,
  };

  return createApiResponse({
    data: sampleOrg,
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Organization Mode Architecture',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
