import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse } from './apiResponse';
import { checkRateLimit, extractClientKey } from './rateLimit';

/**
 * Shared API security utilities: rate limiting, bounded JSON parsing,
 * markdown/HTML sanitization, and error message redaction.
 */

export function enforceRateLimit(
  req: NextRequest,
  bucketName: string,
  maxRequestsPerWindow?: number
): NextResponse | null {
  const clientKey = `${bucketName}:${extractClientKey(req.headers)}`;
  const status = checkRateLimit(clientKey, maxRequestsPerWindow);

  if (!status.success) {
    return createApiResponse({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests in the current window. Please wait briefly before retrying.',
      },
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil(status.resetMs / 1000))),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  return null;
}

export async function parseBoundedJsonBody<T = Record<string, any>>(
  req: NextRequest,
  maxBytes: number = 65536
): Promise<{ data?: T; error?: NextResponse }> {
  try {
    const contentLengthHeader = req.headers.get('content-length');
    if (contentLengthHeader) {
      const len = parseInt(contentLengthHeader, 10);
      if (Number.isFinite(len) && len > maxBytes) {
        return {
          error: createApiResponse({
            error: {
              code: 'PAYLOAD_TOO_LARGE',
              message: `Request body exceeds maximum allowed size (${maxBytes} bytes).`,
            },
            status: 413,
          }),
        };
      }
    }

    const rawText = await req.text();
    if (Buffer.byteLength(rawText, 'utf8') > maxBytes) {
      return {
        error: createApiResponse({
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: `Request body exceeds maximum allowed size (${maxBytes} bytes).`,
          },
          status: 413,
        }),
      };
    }

    if (!rawText.trim()) {
      return { data: {} as T };
    }

    const parsed = JSON.parse(rawText) as T;
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        error: createApiResponse({
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be a valid JSON object.',
          },
          status: 400,
        }),
      };
    }

    return { data: parsed };
  } catch {
    return {
      error: createApiResponse({
        error: {
          code: 'INVALID_JSON',
          message: 'Malformed JSON request payload.',
        },
        status: 400,
      }),
    };
  }
}

export function extractBearerToken(req: NextRequest): string {
  const header = req.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

export function sanitizeReportText(input: unknown, maxLength: number = 250): string {
  const str = typeof input === 'string' ? input : String(input ?? '');
  return str
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[<>`*_[\]()\\#]/g, (ch) => `\\${ch}`)
    .trim()
    .slice(0, maxLength);
}

export function sanitizePublicError(err: unknown, fallbackMessage: string): string {
  if (err instanceof Error && err.message.startsWith('SSRF Blocked:')) {
    return err.message;
  }
  return fallbackMessage;
}

export const XTRACY_USER_AGENT_BASE = 'https://xtracy.vercel.app';
