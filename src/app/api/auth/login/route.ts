import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { authenticateUser } from '@/lib/server/authProvider';
import { checkRateLimit } from '@/lib/server/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);

  if (!rate.success) {
    return createApiResponse({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please try again shortly.' },
      status: 429,
    });
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Email and password are required.' },
        status: 400,
      });
    }

    const result = await authenticateUser({ email, password });

    if (result.error) {
      return createApiResponse({
        error: { code: 'UNAUTHORIZED', message: result.error },
        status: 401,
      });
    }

    return createApiResponse({
      data: {
        user: result.user,
        token: result.token,
        provider: result.providerName,
        isDevFallback: result.isDevFallback,
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Authentication Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Authentication failed.' },
      status: 500,
    });
  }
}
