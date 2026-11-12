import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { enforceRateLimit, extractBearerToken } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-organization', 40);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to access Organization Mode.' },
      status: 401,
    });
  }

  const demoOrg = {
    id: 'org-demo-preview',
    name: 'Organization Workspace Preview',
    role: 'ADMIN',
    membersCount: 2,
    members: [
      { id: 'm1', name: user.fullName || 'User', email: user.email, role: 'ADMIN' },
      { id: 'm2', name: 'Sample Analyst Seat', email: 'analyst.example@invalid', role: 'ANALYST' },
    ],
    casesCount: 0,
    isolatedTenantId: `tenant-${user.id.substring(0, 8)}`,
    isDemoWorkspace: true,
  };

  return createApiResponse({
    data: demoOrg,
    dataTrust: {
      status: 'DEMO',
      sourceName: 'XTRACY Organization Mode Preview',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
