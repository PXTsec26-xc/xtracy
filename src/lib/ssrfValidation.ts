/**
 * Isomorphic SSRF Input & IP Validation Helpers
 * Pure client+server safe URL and private/loopback IP range validation.
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

  for (const prefix of PRIVATE_IP_PREFIXES) {
    if (ip.startsWith(prefix)) {
      return true;
    }
  }

  // Check IPv6 Private Ranges (fc00::/7, fe80::/10, fec0::/10)
  if (
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe8') ||
    ip.startsWith('fe9') ||
    ip.startsWith('fea') ||
    ip.startsWith('feb') ||
    ip.startsWith('fec')
  ) {
    return true;
  }

  const ipv4Parts = ip.split('.').map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b, c] = ipv4Parts;
    if (a === 127) return true;
    if (a === 10) return true;
    if (a === 0) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;
    if (a >= 224) return true;
  }

  // Numeric decimal integer representation of an IP (e.g. 2130706433)
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

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(formattedUrl)) {
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      return { allowed: false, reason: 'Forbidden protocol scheme. Only HTTP and HTTPS are permitted.' };
    }
  } else {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { allowed: false, reason: `Forbidden protocol '${parsed.protocol}'. Only HTTP and HTTPS are permitted.` };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return { allowed: false, reason: `Security Exception: Hostname '${hostname}' is restricted by SSRF protection policies.` };
    }

    if (isPrivateIp(hostname)) {
      return { allowed: false, reason: `Security Exception: Internal or private IP destination '${hostname}' is restricted.` };
    }

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
