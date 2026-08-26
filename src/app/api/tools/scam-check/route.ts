import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { analyzeScamContent } from '@/lib/server/scamCheck';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetType = 'URL', content = '', privateMode = false } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return createApiResponse({
        error: { code: 'INVALID_INPUT', message: 'Target input cannot be empty or whitespace only.' },
        status: 400,
      });
    }

    const result = analyzeScamContent({ targetType, content, privateMode });

    if (!result.valid) {
      return createApiResponse({
        data: result,
        error: { code: 'REJECTED_TARGET', message: result.rejectionReason },
        status: 400,
      });
    }

    return createApiResponse({
      data: result,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Evidence-Based Security Analysis Engine v2.1',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to execute security analysis pipeline.' },
      status: 500,
    });
  }
}
