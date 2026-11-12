import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { analyzeScamContent } from '@/lib/scamRules';
import { enforceRateLimit, parseBoundedJsonBody } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-scan', 40);
  if (limited) return limited;

  const { data: body, error } = await parseBoundedJsonBody<{ content?: string; inputType?: string }>(req, 32768);
  if (error) return error;

  try {
    const { content, inputType = 'text' } = body || {};

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
        status: 'LOCAL',
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
