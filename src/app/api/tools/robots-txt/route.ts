import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { safeHttpFetch } from '@/lib/ssrfProtection';
import { enforceRateLimit, parseBoundedJsonBody, sanitizePublicError, XTRACY_USER_AGENT_BASE } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'tools-robots-txt', 30);
  if (limited) return limited;

  const { data: body, error } = await parseBoundedJsonBody<{ domain?: string }>(req, 16384);
  if (error) return error;

  try {
    const { domain = '' } = body || {};

    if (!domain || typeof domain !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Domain name is required.' },
        status: 400,
      });
    }

    let cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    const robotsUrl = `https://${cleanDomain}/robots.txt`;
    let rawContent = '';

    try {
      const { response: res } = await safeHttpFetch(robotsUrl, {
        headers: { 'User-Agent': `XTRACY-Robots-Inspector/1.0 (+${XTRACY_USER_AGENT_BASE})` },
      });

      if (!res.ok) {
        return createApiResponse({
          data: {
            domain: cleanDomain,
            isFound: false,
            message: `robots.txt not found (HTTP ${res.status}). Search crawlers will assume all public pages are indexable.`,
          },
          dataTrust: {
            status: 'LIVE',
            sourceName: 'XTRACY Robots.txt Parser',
            lastRefreshed: new Date().toISOString(),
          },
        });
      }

      rawContent = await res.text();
    } catch (err: any) {
      const msg = sanitizePublicError(err, `Could not connect to ${robotsUrl}.`);
      return createApiResponse({
        error: {
          code: 'FETCH_ERROR',
          message: msg,
        },
        status: msg.startsWith('SSRF Blocked:') ? 400 : 502,
      });
    }

    const lines = rawContent.split('\n');
    const userAgents: Record<string, { allow: string[]; disallow: string[] }> = {};
    const sitemaps: string[] = [];
    const disallowRules: string[] = [];
    let currentAgent = '*';

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
        const val = trimmed.slice(colonIdx + 1).trim();

        if (key === 'user-agent') {
          currentAgent = val;
          if (!userAgents[currentAgent]) {
            userAgents[currentAgent] = { allow: [], disallow: [] };
          }
        } else if (key === 'disallow') {
          if (val) {
            if (!userAgents[currentAgent]) userAgents[currentAgent] = { allow: [], disallow: [] };
            userAgents[currentAgent].disallow.push(val);
            disallowRules.push(val);
          }
        } else if (key === 'allow') {
          if (val) {
            if (!userAgents[currentAgent]) userAgents[currentAgent] = { allow: [], disallow: [] };
            userAgents[currentAgent].allow.push(val);
          }
        } else if (key === 'sitemap') {
          sitemaps.push(val);
        }
      }
    });

    // Sensitive path exposure check in Disallow rules
    const sensitiveKeywords = ['admin', 'backend', 'config', 'secret', 'internal', 'backup', 'db', 'database', 'private', 'staging', 'dev', 'api/v1/auth', 'portal'];
    const exposedSensitivePaths = disallowRules.filter((path) =>
      sensitiveKeywords.some((kw) => path.toLowerCase().includes(kw))
    );

    return createApiResponse({
      data: {
        domain: cleanDomain,
        isFound: true,
        endpointUrl: robotsUrl,
        userAgents,
        sitemaps,
        totalDisallowRules: disallowRules.length,
        exposedSensitivePaths,
        securityInsight:
          exposedSensitivePaths.length > 0
            ? `Security Note: robots.txt exposes ${exposedSensitivePaths.length} potentially sensitive directory path(s) in Disallow directives. Attackers often inspect robots.txt to discover hidden admin endpoints.`
            : 'No obvious sensitive administrative path names exposed in Disallow directives.',
        rawContent,
        inspectedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Robots.txt Parser',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: sanitizePublicError(err, 'robots.txt inspection failed.') },
      status: 500,
    });
  }
}
