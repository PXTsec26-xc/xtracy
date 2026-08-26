/**
 * SSRF (Server-Side Request Forgery) Protection & Safe Fetch Module
 * Prevents URL fetchers and scanning services from querying internal, loopback,
 * private IP networks, cloud metadata endpoints, malicious DNS-rebound domains,
 * or following redirects to internal targets.
 */

export interface SSRFCheckResult {
  allowed: boolean;
  reason?: string;
  normalizedUrl?: string;
  resolvedIp?: string;
}

const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // Cloud Metadata Service (AWS/GCP/Azure)
  'metadata.google.internal',
  'metadata.aws',
  'instance-data',
  'local',
  'internal',
  'corp',
  'router',
  'broadcasthost',
];

const PRIVATE_IP_PREFIXES = [
  '10.',
  '127.',
  '169.254.',
  '192.168.',
  '0.',
  '172.16.', '172.17.', '172.18.', '172.19.',
  '172.20.', '172.21.', '172.22.', '172.23.',
  '172.24.', '172.25.', '172.26.', '172.27.',
  '172.28.', '172.29.', '172.30.', '172.31.',
  'fc00:', 'fe80:', '::1', '0:0:0:0:0:0:0:1',
];

/**
 * Normalize and verify whether an IP address belongs to a private, loopback,
 * metadata, or non-public routable range (including IPv6-mapped IPv4 encodings).
 */
export function isPrivateIp(rawIp: string): boolean {
  if (!rawIp) return true;
  let ip = rawIp.trim().toLowerCase().replace(/^\[|\]$/g, '');

  if (ip === 'localhost' || ip === '::1' || ip === '::' || ip === '0.0.0.0') return true;

  // Handle IPv6-mapped IPv4 (e.g. ::ffff:127.0.0.1 or hex format ::ffff:7f00:1 / ::ffff:a9fe:a9fe)
  if (ip.startsWith('::ffff:') || ip.includes(':ffff:')) {
    const rem = ip.split(':ffff:')[1] || ip.replace(/^::ffff:/, '');
    if (rem.includes('.')) {
      ip = rem;
    } else {
      const hexParts = rem.split(':');
      if (hexParts.length === 2) {
        const h = parseInt(hexParts[0], 16);
        const l = parseInt(hexParts[1], 16);
        if (!isNaN(h) && !isNaN(l)) {
          ip = `${(h >> 8) & 255}.${h & 255}.${(l >> 8) & 255}.${l & 255}`;
        }
      }
    }
  }

  // Check prefix matches
  for (const prefix of PRIVATE_IP_PREFIXES) {
    if (ip.startsWith(prefix)) {
      return true;
    }
  }

  // Check IPv6 Private Ranges:
  // - fc00::/7 (Unique Local Address)
  // - fe80::/10 (Link-Local Address)
  // - fec0::/10 (Site-Local Address)
  if (ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe8') || ip.startsWith('fe9') || ip.startsWith('fea') || ip.startsWith('feb') || ip.startsWith('fec')) {
    return true;
  }

  // Parse IPv4 numerical ranges
  const ipv4Parts = ip.split('.').map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b, c, d] = ipv4Parts;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private Class A)
    if (a === 10) return true;
    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;
    // 172.16.0.0/12 (Private Class B)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private Class C)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-Local / Cloud Metadata)
    if (a === 169 && b === 254) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;
    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (a >= 224) return true;
  }

  // Check if string is a numeric decimal integer representation of an IP (e.g. 2130706433)
  if (/^\d+$/.test(ip)) {
    const num = parseInt(ip, 10);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      const a = (num >>> 24) & 255;
      const b = (num >>> 16) & 255;
      if (a === 127 || a === 10 || a === 0) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 192 && b === 168) return true;
      if (a === 169 && b === 254) return true;
    }
  }

  return false;
}

export function validateUrlForSSRF(inputUrl: string): SSRFCheckResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { allowed: false, reason: 'Empty or invalid URL input.' };
  }

  let formattedUrl = inputUrl.trim();

  // If a protocol scheme is specified, verify it is strictly http or https
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(formattedUrl)) {
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      return { allowed: false, reason: 'Forbidden protocol scheme. Only HTTP and HTTPS are permitted.' };
    }
  } else {
    // If no protocol scheme was provided, default to https://
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);

    // Only allow HTTP and HTTPS protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { allowed: false, reason: `Forbidden protocol '${parsed.protocol}'. Only HTTP and HTTPS are permitted.` };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    // Check direct hostname blocklist
    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return { allowed: false, reason: `Security Exception: Hostname '${hostname}' is restricted by SSRF protection policies.` };
    }

    // Check private IP address formats
    if (isPrivateIp(hostname)) {
      return { allowed: false, reason: `Security Exception: Internal or private IP destination '${hostname}' is restricted.` };
    }

    // Block non-standard administrative ports
    if (parsed.port) {
      const portNum = parseInt(parsed.port, 10);
      const allowedPorts = [80, 443, 8080, 8443];
      if (!allowedPorts.includes(portNum)) {
        return { allowed: false, reason: `Security Exception: Restricted destination port ${portNum}.` };
      }
    }

    return {
      allowed: true,
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return { allowed: false, reason: 'Invalid URL format or malformed domain structure.' };
  }
}

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
          return { allowed: false, reason: `Domain '${hostname}' could not be resolved by DNS.` };
        }

        for (const record of lookup) {
          if (isPrivateIp(record.address)) {
            return {
              allowed: false,
              reason: `Security Exception: Domain '${hostname}' resolves to private/restricted IP (${record.address}).`,
              resolvedIp: record.address,
            };
          }
        }

        return {
          allowed: true,
          normalizedUrl: syncCheck.normalizedUrl,
          resolvedIp: lookup[0]?.address,
        };
      } catch (dnsErr) {
        return syncCheck;
      }
    }

    return syncCheck;
  } catch (err: any) {
    return { allowed: false, reason: `DNS resolution failed: ${err.message || 'Domain not found'}` };
  }
}

/**
 * Safe HTTP fetch helper that enforces SSRF validation on the initial URL
 * AND on every redirect hop (up to maxRedirects) to prevent redirect-based SSRF.
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
    if (!check.allowed) {
      throw new Error(`SSRF Blocked: ${check.reason || 'Restricted target'}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let res: Response;
    try {
      res = await fetch(check.normalizedUrl!, {
        ...options,
        redirect: 'manual', // Never blindly follow redirects in node runtime
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

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
