/**
 * SSRF (Server-Side Request Forgery) Protection & Safe Fetch Module
 * Prevents URL fetchers and scanning services from querying internal, loopback,
 * private IP networks, cloud metadata endpoints, malicious DNS-rebound domains,
 * or following redirects to internal targets.
 */

import { isPrivateIp, validateUrlForSSRF, type SSRFCheckResult } from './ssrfValidation';
export { isPrivateIp, validateUrlForSSRF, type SSRFCheckResult };

/**
 * Async SSRF validation that performs DNS lookup to ensure domain does not resolve to a private IP
 */
export async function validateUrlForSSRFAsync(inputUrl: string): Promise<SSRFCheckResult> {
  const syncCheck = validateUrlForSSRF(inputUrl);
  if (!syncCheck.allowed) {
    return syncCheck;
  }

  try {
    const parsed = new URL(syncCheck.normalizedUrl!);
    const hostname = parsed.hostname.replace(/^\[|\]$/g, '');

    // If hostname is already an IP, we verified it in syncCheck
    const isDirectIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':');
    if (isDirectIp) {
      return syncCheck;
    }

    // Resolve DNS to verify resolved IP address if running in Node server environment
    if (typeof window === 'undefined') {
      try {
        const dns = await import('node:dns');
        const lookup = await dns.promises.lookup(hostname, { all: true });
        if (!lookup || lookup.length === 0) {
          return { allowed: false, reason: 'Domain could not be resolved via DNS.' };
        }

        for (const record of lookup) {
          if (isPrivateIp(record.address)) {
            return {
              allowed: false,
              reason: 'Security Policy: Target domain resolves to a restricted or non-public IP range.',
            };
          }
        }

        return {
          allowed: true,
          normalizedUrl: syncCheck.normalizedUrl,
          resolvedIp: lookup[0]?.address,
        };
      } catch {
        // Fail closed on DNS lookup failure to prevent blind or rebinding-prone outbound calls
        return { allowed: false, reason: 'DNS resolution failed or domain could not be verified.' };
      }
    }

    return syncCheck;
  } catch {
    return { allowed: false, reason: 'Invalid URL or unresolvable target host.' };
  }
}

export async function executePinnedHttpRequest(
  targetUrl: string,
  pinnedIp: string | undefined,
  options: RequestInit = {},
  timeoutMs: number = 6000
): Promise<Response> {
  const parsed = new URL(targetUrl);
  const isHttps = parsed.protocol === 'https:';
  const httpMod = isHttps ? await import('node:https') : await import('node:http');

  const headersObj: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
    } else if (Array.isArray(options.headers)) {
      for (const [k, v] of options.headers) headersObj[k] = v;
    } else {
      Object.assign(headersObj, options.headers as Record<string, string>);
    }
  }

  const MAX_BODY_BYTES = 512 * 1024; // 512 KB cap to prevent response-body DoS

  return new Promise<Response>((resolve, reject) => {
    const family = pinnedIp && pinnedIp.includes(':') ? 6 : 4;
    const reqOptions: any = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: `${parsed.pathname}${parsed.search}`,
      method: options.method || 'GET',
      headers: headersObj,
      timeout: timeoutMs,
      ...(pinnedIp
        ? {
            lookup: (
              _hostname: string,
              opts: any,
              cb: (err: Error | null, address?: any, family?: number) => void
            ) => {
              if (opts && opts.all) {
                cb(null, [{ address: pinnedIp, family }]);
              } else {
                cb(null, pinnedIp, family);
              }
            },
          }
        : {}),
    };

    const req = httpMod.request(reqOptions, (res) => {
      const chunks: Buffer[] = [];
      let totalBytes = 0;

      res.on('data', (chunk: Buffer) => {
        totalBytes += chunk.length;
        if (totalBytes <= MAX_BODY_BYTES) {
          chunks.push(chunk);
        } else {
          res.destroy();
        }
      });

      res.on('end', () => {
        const resHeaders = new Headers();
        for (const [key, val] of Object.entries(res.headers)) {
          if (val === undefined) continue;
          if (Array.isArray(val)) {
            resHeaders.set(key, val.join(', '));
          } else {
            resHeaders.set(key, val);
          }
        }
        const status = res.statusCode || 200;
        const noBodyStatus = status === 204 || status === 304 || (options.method || 'GET').toUpperCase() === 'HEAD';
        const body = noBodyStatus ? null : new Uint8Array(Buffer.concat(chunks));
        resolve(new Response(body, { status, statusText: res.statusMessage || '', headers: resHeaders }));
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Request timed out after 6000ms.'));
    });
    req.on('error', (err) => reject(err));

    if (typeof options.body === 'string' || options.body instanceof Uint8Array) {
      req.write(options.body);
    }
    req.end();
  });
}

/**
 * Safe HTTP fetch helper that enforces DNS-pinned SSRF validation on the initial URL
 * AND on every redirect hop (up to maxRedirects) to prevent DNS rebinding and redirect SSRF.
 */
export async function safeHttpFetch(
  initialUrl: string,
  options: RequestInit = {},
  maxRedirects = 3
): Promise<{ response: Response; finalUrl: string }> {
  let currentUrl = initialUrl;
  let redirectsRemaining = maxRedirects;

  while (true) {
    const check = await validateUrlForSSRFAsync(currentUrl);
    if (!check.allowed || !check.normalizedUrl) {
      throw new Error(`SSRF Blocked: ${check.reason || 'Restricted target'}`);
    }

    const res = await executePinnedHttpRequest(check.normalizedUrl, check.resolvedIp, options);

    // If response is a redirect, validate the new Location before proceeding
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (!location) {
        return { response: res, finalUrl: currentUrl };
      }

      if (redirectsRemaining <= 0) {
        throw new Error('Too many redirects (exceeded maximum limit of 3 hops).');
      }

      redirectsRemaining--;

      // Resolve relative redirect paths against current URL
      const nextTarget = new URL(location, currentUrl).toString();
      currentUrl = nextTarget;
      continue;
    }

    return { response: res, finalUrl: currentUrl };
  }
}
