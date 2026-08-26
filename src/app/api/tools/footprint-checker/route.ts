import { NextRequest } from 'next/server';
import dns from 'dns';
import { createApiResponse } from '@/lib/server/apiResponse';

interface ProfileCheckResult {
  platform: string;
  category: 'DEVELOPER' | 'SOCIAL' | 'SECURITY' | 'COMMUNITY';
  url: string;
  exists: boolean;
  statusText: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target = '', queryType = 'USERNAME' } = body;

    if (!target || typeof target !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Target username or domain is required.' },
        status: 400,
      });
    }

    const cleanInput = target.trim();

    if (queryType === 'DOMAIN') {
      let domain = cleanInput.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

      // Domain footprint analysis: DNS, security.txt, robots.txt, MX, SPF, DMARC
      const checks: { name: string; status: 'FOUND' | 'MISSING' | 'SECURED'; detail: string }[] = [];

      let hasMx = false;
      let hasTxt = false;
      let hasDmarc = false;

      try {
        const mx = await dns.promises.resolveMx(domain);
        if (mx && mx.length > 0) {
          hasMx = true;
          checks.push({ name: 'Mail Service (MX)', status: 'FOUND', detail: `${mx.length} mail exchangers configured.` });
        }
      } catch {
        checks.push({ name: 'Mail Service (MX)', status: 'MISSING', detail: 'No mail exchangers found.' });
      }

      try {
        const txt = await dns.promises.resolveTxt(domain);
        const spf = txt.find((t) => t.join(' ').toLowerCase().startsWith('v=spf1'));
        if (spf) {
          hasTxt = true;
          checks.push({ name: 'SPF Email Policy', status: 'SECURED', detail: 'Sender Policy Framework defined.' });
        } else {
          checks.push({ name: 'SPF Email Policy', status: 'MISSING', detail: 'No SPF record detected in zone TXT.' });
        }
      } catch {
        checks.push({ name: 'SPF Email Policy', status: 'MISSING', detail: 'No TXT records found.' });
      }

      try {
        const dmarc = await dns.promises.resolveTxt(`_dmarc.${domain}`);
        if (dmarc && dmarc.length > 0) {
          hasDmarc = true;
          checks.push({ name: 'DMARC Policy', status: 'SECURED', detail: dmarc[0].join(' ') });
        }
      } catch {
        checks.push({ name: 'DMARC Policy', status: 'MISSING', detail: 'No _dmarc record detected.' });
      }

      // Check security.txt presence
      let securityTxtFound = false;
      try {
        const secRes = await fetch(`https://${domain}/.well-known/security.txt`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000),
        });
        if (secRes.ok) {
          securityTxtFound = true;
          checks.push({ name: 'Security.txt (RFC 9116)', status: 'SECURED', detail: 'Vulnerability disclosure policy published.' });
        } else {
          checks.push({ name: 'Security.txt (RFC 9116)', status: 'MISSING', detail: 'Not published at /.well-known/security.txt' });
        }
      } catch {
        checks.push({ name: 'Security.txt (RFC 9116)', status: 'MISSING', detail: 'Endpoint unreachable.' });
      }

      return createApiResponse({
        data: {
          target: domain,
          queryType: 'DOMAIN',
          checks,
          summary: {
            mailActive: hasMx,
            spfProtected: hasTxt,
            dmarcEnforced: hasDmarc,
            securityContactPublished: securityTxtFound,
          },
          disclaimer: 'Domain footprint checks only publicly accessible DNS records and RFC standard endpoints.',
          queriedAt: new Date().toISOString(),
        },
        dataTrust: {
          status: 'LIVE',
          sourceName: 'XTRACY Defensive Domain Footprint Engine',
          lastRefreshed: new Date().toISOString(),
        },
      });
    }

    // USERNAME OSINT Check
    const username = cleanInput.replace(/^@/, '');
    const usernameRegex = /^[a-zA-Z0-9_\-\.]{2,40}$/;

    if (!usernameRegex.test(username)) {
      return createApiResponse({
        error: { code: 'INVALID_USERNAME', message: 'Invalid username format. Must be alphanumeric (2-40 chars).' },
        status: 400,
      });
    }

    const publicPlatforms = [
      { name: 'GitHub', category: 'DEVELOPER' as const, urlTemplate: 'https://github.com/{u}', checkUrl: 'https://api.github.com/users/{u}' },
      { name: 'GitLab', category: 'DEVELOPER' as const, urlTemplate: 'https://gitlab.com/{u}', checkUrl: 'https://gitlab.com/api/v4/users?username={u}' },
      { name: 'Gravatar', category: 'SOCIAL' as const, urlTemplate: 'https://gravatar.com/{u}', checkUrl: 'https://en.gravatar.com/{u}.json' },
      { name: 'Dev.to', category: 'DEVELOPER' as const, urlTemplate: 'https://dev.to/{u}', checkUrl: 'https://dev.to/api/users/by_username?url={u}' },
      { name: 'Reddit', category: 'COMMUNITY' as const, urlTemplate: 'https://reddit.com/user/{u}', checkUrl: 'https://www.reddit.com/user/{u}/about.json' },
      { name: 'HackerNews', category: 'COMMUNITY' as const, urlTemplate: 'https://news.ycombinator.com/user?id={u}', checkUrl: 'https://hacker-news.firebaseio.com/v0/user/{u}.json' },
    ];

    const results: ProfileCheckResult[] = await Promise.all(
      publicPlatforms.map(async (platform) => {
        const targetUrl = platform.urlTemplate.replace('{u}', encodeURIComponent(username));
        const checkUrl = platform.checkUrl.replace('{u}', encodeURIComponent(username));

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(checkUrl, {
            headers: {
              'User-Agent': 'XTRACY-OSINT-Checker/1.0 (+https://xtracy.org)',
              Accept: 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (platform.name === 'GitLab') {
            const arr = await res.json();
            const exists = Array.isArray(arr) && arr.length > 0;
            return {
              platform: platform.name,
              category: platform.category,
              url: targetUrl,
              exists,
              statusText: exists ? 'Public profile found' : 'No public profile found',
            };
          }

          if (platform.name === 'HackerNews') {
            const obj = await res.json();
            const exists = obj && obj.id;
            return {
              platform: platform.name,
              category: platform.category,
              url: targetUrl,
              exists: Boolean(exists),
              statusText: exists ? 'Public profile found' : 'No public profile found',
            };
          }

          const exists = res.status === 200;
          return {
            platform: platform.name,
            category: platform.category,
            url: targetUrl,
            exists,
            statusText: exists ? 'Public profile found' : res.status === 404 ? 'Not found' : 'Undetermined',
          };
        } catch {
          return {
            platform: platform.name,
            category: platform.category,
            url: targetUrl,
            exists: false,
            statusText: 'Query timeout',
          };
        }
      })
    );

    const foundCount = results.filter((r) => r.exists).length;

    return createApiResponse({
      data: {
        username,
        queryType: 'USERNAME',
        results,
        foundCount,
        totalChecked: results.length,
        disclaimer:
          'XTRACY Digital Footprint queries strictly public endpoints to assess username reuse and public exposure. No private data is accessed.',
        queriedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Public OSINT Footprint Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Footprint lookup failed: ${err.message || 'Unknown error'}` },
      status: 500,
    });
  }
}
