import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
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
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'A valid email address is required.' },
        status: 400,
      });
    }

    // Generic response to prevent account enumeration
    return createApiResponse({
      data: {
        message: 'If an account exists with this email address, password reset instructions have been sent.',
        email,
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Password recovery request failed.' },
      status: 500,
    });
  }
}
