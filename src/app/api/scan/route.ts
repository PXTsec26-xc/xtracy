import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { analyzeScamContent } from '@/lib/scamRules';
import { checkRateLimit } from '@/lib/server/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);

  if (!rate.success) {
    return createApiResponse({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please wait before scanning again.' },
      status: 429,
    });
  }

  try {
    const body = await req.json();
    const { content, inputType = 'text' } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Field "content" string is required.' },
        status: 400,
      });
    }

    if (content.length > 5000) {
      return createApiResponse({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Input text exceeds 5000 characters limit.' },
        status: 413,
      });
    }

    const analysis = analyzeScamContent(content, inputType as any);

    return createApiResponse({
      data: analysis,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Server Heuristic Risk Analyzer Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process pattern analysis.' },
      status: 500,
    });
  }
}
