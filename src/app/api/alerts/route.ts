import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { DbSecurityAlert } from '@/lib/server/models';
import { enforceRateLimit, extractBearerToken } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-alerts', 60);
  if (limited) return limited;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  const alerts: DbSecurityAlert[] = [
    {
      id: 'alt-1',
      userId: user?.id || 'public',
      title: 'Global Emergency & Cybercrime Directory Updated',
      severity: 'CRITICAL',
      message: 'Verified official cybercrime reporting portals and emergency numbers available offline in Global Safety Center.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alt-2',
      userId: user?.id || 'public',
      title: 'Phishing Advisory: Urgent KYC / Account Suspension Lures',
      severity: 'HIGH',
      message: 'Verify sender domains independently using official bookmarks or XTRACY URL Guard before entering credentials.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alt-3',
      userId: user?.id || 'public',
      title: 'Offline Threat Intelligence Feed Notice',
      severity: 'MEDIUM',
      message: 'Built-in advisory sample feed active. Check CISA KEV or your national CERT portal for real-time CVE alerts.',
      createdAt: new Date().toISOString(),
    },
  ];

  return createApiResponse({
    data: alerts,
    dataTrust: {
      status: 'FALLBACK',
      sourceName: 'XTRACY Built-In Safety Advisory Feed',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
