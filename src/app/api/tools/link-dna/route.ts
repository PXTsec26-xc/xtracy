import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { validateUrlForSSRFAsync, executePinnedHttpRequest } from '@/lib/ssrfProtection';
import { enforceRateLimit, parseBoundedJsonBody, sanitizePublicError, XTRACY_USER_AGENT_BASE } from '@/lib/server/securityUtils';

interface RedirectHop {
  step: number;
  url: string;
  statusCode: number;
  locationHeader: string | null;
  host: string;
}

const KNOWN_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'lnkd.in',
];

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'tools-link-dna', 30);
  if (limited) return limited;

  const { data: body, error } = await parseBoundedJsonBody<{ url?: string }>(req, 16384);
  if (error) return error;

  try {
    const { url = '' } = body || {};
    if (!url || typeof url !== 'string' || !url.trim()) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'A valid target URL is required for Link DNA tracing.' },
        status: 400,
      });
    }

    const hops: RedirectHop[] = [];
    let currentUrl = url.trim();
    const maxHops = 5;

    for (let step = 1; step <= maxHops + 1; step++) {
      const check = await validateUrlForSSRFAsync(currentUrl);
      if (!check.allowed || !check.normalizedUrl || !check.resolvedIp) {
        if (hops.length === 0) {
          return createApiResponse({
            error: {
              code: 'SSRF_RESTRICTED',
              message: check.reason || 'Target URL blocked by SSRF security controls.',
            },
            status: 400,
          });
        }
        break;
      }

      const parsed = new URL(check.normalizedUrl);
      const res = await executePinnedHttpRequest(
        check.normalizedUrl,
        check.resolvedIp,
        {
          method: 'HEAD',
          headers: {
            'User-Agent': `XTRACY-Link-DNA-Tracer/1.0 (+${XTRACY_USER_AGENT_BASE})`,
            Accept: '*/*',
          },
        },
        4500
      );

      const locationHeader = res.headers.get('location');
      hops.push({
        step,
        url: check.normalizedUrl,
        statusCode: res.status,
        locationHeader,
        host: parsed.hostname,
      });

      if (res.status >= 300 && res.status < 400 && locationHeader && step <= maxHops) {
        currentUrl = new URL(locationHeader, check.normalizedUrl).href;
      } else {
        break;
      }
    }

    const initialHost = hops[0]?.host || '';
    const finalUrl = hops[hops.length - 1]?.url || url.trim();
    const finalParsed = new URL(finalUrl);
    const trackingParams: string[] = [];
    finalParsed.searchParams.forEach((_, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.startsWith('utm_') ||
        ['fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid', 'ref', 'ref_src', 'yclid'].includes(lowerKey)
      ) {
        trackingParams.push(key);
      }
    });

    const isShortener = KNOWN_SHORTENERS.some((s) => initialHost === s || initialHost.endsWith(`.${s}`));
    const crossedDomains = new Set(hops.map((h) => h.host)).size > 1;
    const protocolDowngrade = hops.some((h) => h.url.startsWith('http://'));

    return createApiResponse({
      data: {
        originalUrl: hops[0]?.url || url.trim(),
        finalUrl,
        finalHost: finalParsed.hostname,
        hopCount: Math.max(0, hops.length - 1),
        hops,
        isShortener,
        crossedDomains,
        protocolDowngrade,
        trackingParamsFound: trackingParams,
        safetyAssessment:
          protocolDowngrade
            ? 'CAUTION: Plaintext HTTP hop detected in redirect path.'
            : crossedDomains
            ? 'NOTICE: URL redirects across multiple distinct domains. Inspect final destination carefully.'
            : 'STANDARD: Direct or same-origin resolution.',
        inspectedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Bounded Redirect & Link DNA Inspector',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    const msg = sanitizePublicError(err, 'Unable to trace link redirect chain (remote server unreachable or timed out).');
    return createApiResponse({
      error: { code: 'TRACE_ERROR', message: msg },
      status: msg.startsWith('SSRF Blocked:') ? 400 : 502,
    });
  }
}
