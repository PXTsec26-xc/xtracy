import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { analyzeScamContent } from '@/lib/server/scamCheck';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetType = 'SMS_TEXT', content = '', privateMode = false } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return createApiResponse({
        error: { code: 'INVALID_INPUT', message: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.' },
        status: 400,
      });
    }

    const result = analyzeScamContent({ targetType, content, privateMode });

    if (!result.valid) {
      return createApiResponse({
        error: { code: 'INVALID_INPUT', message: result.message },
        status: 400,
      });
    }

    return createApiResponse({
      data: result,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Multi-Layer Scam Check Engine v2.1',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to execute scam analysis.' },
      status: 500,
    });
  }
}
