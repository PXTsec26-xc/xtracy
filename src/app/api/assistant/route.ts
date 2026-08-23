import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { processDefensiveAiQuery } from '@/lib/server/aiProvider';
import { checkRateLimit } from '@/lib/server/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);

  if (!rate.success) {
    return createApiResponse({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please wait before asking XTRACY AI again.' },
      status: 429,
    });
  }

  try {
    const body = await req.json();
    const { query, readingMode } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Field "query" is required.' },
        status: 400,
      });
    }

    const payload = await processDefensiveAiQuery({ query, readingMode });

    return createApiResponse({
      data: payload,
      dataTrust: {
        status: payload.isAiGenerated ? 'LIVE' : 'CACHED',
        sourceName: payload.providerName,
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process AI assistant response.' },
      status: 500,
    });
  }
}
