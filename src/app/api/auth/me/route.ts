import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || '';

  if (!token) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'No authentication session token supplied.' },
      status: 401,
    });
  }

  const user = await getUserBySessionToken(token);
  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Session token invalid or expired.' },
      status: 401,
    });
  }

  return createApiResponse({
    data: { user },
  });
}
