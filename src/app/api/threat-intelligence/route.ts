import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { fetchLiveThreatIntelligence } from '@/lib/server/cisaProvider';
import { checkRateLimit } from '@/lib/server/rateLimit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);

  if (!rate.success) {
    return createApiResponse({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please try again shortly.' },
      status: 429,
    });
  }

  const { threats, dataTrust } = await fetchLiveThreatIntelligence();

  return createApiResponse({
    data: threats,
    dataTrust,
  });
}
