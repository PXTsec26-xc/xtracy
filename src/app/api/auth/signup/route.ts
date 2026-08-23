import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { registerUser } from '@/lib/server/authProvider';
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
    const { email, password, fullName, userRole } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'A valid email address is required.' },
        status: 400,
      });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Password must be at least 8 characters long.' },
        status: 400,
      });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Full name is required.' },
        status: 400,
      });
    }

    const result = await registerUser({ email, password, fullName, userRole });

    if (result.error) {
      return createApiResponse({
        error: { code: 'CONFLICT', message: result.error },
        status: 409,
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
      error: { code: 'INTERNAL_ERROR', message: 'Registration failed due to a server error.' },
      status: 500,
    });
  }
}
