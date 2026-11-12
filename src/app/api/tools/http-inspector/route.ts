import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { safeHttpFetch } from '@/lib/ssrfProtection';
import { enforceRateLimit, parseBoundedJsonBody, sanitizePublicError, XTRACY_USER_AGENT_BASE } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'tools-http-inspector', 30);
  if (limited) return limited;

  const { data: body, error } = await parseBoundedJsonBody<{ url?: string; method?: string }>(req, 16384);
  if (error) return error;

  try {
    const { url = '', method = 'GET' } = body || {};

    if (!url || typeof url !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Target URL is required.' },
        status: 400,
      });
    }

    const validMethods = ['GET', 'HEAD', 'OPTIONS'];
    const chosenMethod = typeof method === 'string' && validMethods.includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';
    const startTime = Date.now();

    let response: Response;
    let finalTargetUrl: string;

    try {
      const fetchResult = await safeHttpFetch(url, {
        method: chosenMethod,
        headers: {
          'User-Agent': `XTRACY-HTTP-Inspector/1.0 (+${XTRACY_USER_AGENT_BASE})`,
          Accept: '*/*',
        },
      });
      response = fetchResult.response;
      finalTargetUrl = fetchResult.finalUrl;
    } catch (err: any) {
      const msg = sanitizePublicError(err, 'HTTP inspection failed: unable to connect to target.');
      return createApiResponse({
        error: {
          code: 'HTTP_FETCH_ERROR',
          message: msg,
        },
        status: msg.startsWith('SSRF Blocked:') ? 400 : 502,
      });
    }

    const targetUrl = finalTargetUrl;
    const latencyMs = Date.now() - startTime;

    const headers: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      headers[k] = v;
    });

    // Check Set-Cookie headers for security attributes
    const rawSetCookie = response.headers.get('set-cookie');
    const cookieAudits: { name: string; hasHttpOnly: boolean; hasSecure: boolean; sameSite: string | null }[] = [];

    if (rawSetCookie) {
      const cookieEntries = rawSetCookie.split(/,(?=\s*[a-zA-Z0-9_\-]+=[^;]+)/);
      cookieEntries.forEach((c) => {
        const parts = c.split(';').map((p) => p.trim());
        const nameVal = parts[0];
        const hasHttpOnly = parts.some((p) => p.toLowerCase() === 'httponly');
        const hasSecure = parts.some((p) => p.toLowerCase() === 'secure');
        const sameSitePart = parts.find((p) => p.toLowerCase().startsWith('samesite='));
        const sameSite = sameSitePart ? sameSitePart.split('=')[1] : null;

        cookieAudits.push({
          name: nameVal.split('=')[0],
          hasHttpOnly,
          hasSecure,
          sameSite,
        });
      });
    }

    let responseBodyPreview = '';
    if (chosenMethod === 'GET') {
      try {
        const text = await response.text();
        responseBodyPreview = text.slice(0, 1000); // 1KB snippet
      } catch {
        // Not text or stream error
      }
    }

    return createApiResponse({
      data: {
        targetUrl,
        finalUrl: response.url || targetUrl,
        method: chosenMethod,
        statusCode: response.status,
        statusText: response.statusText,
        latencyMs,
        contentType: response.headers.get('content-type') || 'Unknown',
        headers,
        cookieAudits,
        bodyPreview: responseBodyPreview,
        inspectedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Live HTTP Inspector',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'HTTP_FETCH_ERROR', message: sanitizePublicError(err, 'HTTP inspection failed.') },
      status: 502,
    });
  }
}
