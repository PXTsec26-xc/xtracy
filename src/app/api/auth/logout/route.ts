import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { revokeSessionToken } from '@/lib/server/authProvider';
import { extractBearerToken } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const token = extractBearerToken(req);
  const revoked = token ? revokeSessionToken(token) : false;

  return createApiResponse({
    data: {
      message: 'Session terminated successfully.',
      sessionRevoked: revoked,
    },
  });
}
