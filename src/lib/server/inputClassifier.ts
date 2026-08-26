/**
 * XTRACY Strict Input Classification Gate
 * Classifies target inputs into VALID_URL, VALID_DOMAIN, VALID_IP, INVALID_INPUT, or RESTRICTED_TARGET.
 */

import { isPrivateIp, validateUrlForSSRF } from '@/lib/ssrfProtection';

export type InputCategory =
  | 'VALID_URL'
  | 'VALID_DOMAIN'
  | 'VALID_IP'
  | 'INVALID_INPUT'
  | 'RESTRICTED_TARGET';

export interface GateClassificationResult {
  category: InputCategory;
  status: 'ACCEPTED' | 'REJECTED';
  normalizedInput: string;
  rejectionReason?: string;
  isHttpsVerified?: boolean;
}

export function classifyInputGate(rawInput: string): GateClassificationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      category: 'INVALID_INPUT',
      status: 'REJECTED',
      normalizedInput: '',
      rejectionReason: 'Input is empty or missing.',
    };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length === 0) {
    return {
      category: 'INVALID_INPUT',
      status: 'REJECTED',
      normalizedInput: '',
      rejectionReason: 'Input string cannot be empty or whitespace only.',
    };
  }

  const lower = trimmed.toLowerCase();

  // 1. Reject Unsupported & Dangerous Protocol Schemes Immediately
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('ftp:') ||
    lower.startsWith('blob:') ||
    lower === 'https://' ||
    lower === 'http://' ||
    lower === 'https:' ||
    lower === 'http:'
  ) {
    return {
      category: 'INVALID_INPUT',
      status: 'REJECTED',
      normalizedInput: trimmed,
      rejectionReason: `Unsupported or dangerous scheme prefix '${trimmed.substring(0, 15)}'. Only HTTP/HTTPS URLs, public domains, or public IPs are allowed.`,
    };
  }

  // 2. Check RESTRICTED_TARGET (Localhost, Loopback, Private Subnets)
  if (
    lower === 'localhost' ||
    lower === 'localhost.localdomain' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.startsWith('127.') ||
    lower.startsWith('192.168.') ||
    lower.startsWith('10.') ||
    lower.startsWith('169.254.') ||
    isPrivateIp(trimmed)
  ) {
    return {
      category: 'RESTRICTED_TARGET',
      status: 'REJECTED',
      normalizedInput: trimmed,
      rejectionReason: `Restricted Destination: Target '${trimmed}' is in a private, loopback, or internal IP subnet and cannot be scanned for security reasons.`,
    };
  }

  // 3. Check VALID_URL (Requires http:// or https:// scheme)
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    const ssrfCheck = validateUrlForSSRF(trimmed);
    if (!ssrfCheck.allowed) {
      return {
        category: 'RESTRICTED_TARGET',
        status: 'REJECTED',
        normalizedInput: trimmed,
        rejectionReason: ssrfCheck.reason || 'Restricted target destination.',
      };
    }

    try {
      const parsed = new URL(trimmed);
      const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

      if (!hostname || hostname.length === 0) {
        return {
          category: 'INVALID_INPUT',
          status: 'REJECTED',
          normalizedInput: trimmed,
          rejectionReason: 'URL does not contain a valid hostname.',
        };
      }

      if (isPrivateIp(hostname)) {
        return {
          category: 'RESTRICTED_TARGET',
          status: 'REJECTED',
          normalizedInput: trimmed,
          rejectionReason: `Restricted Destination: Hostname '${hostname}' resolves to a restricted private or internal IP.`,
        };
      }

      const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
      const hasTld = hostname.includes('.');

      if (!hasTld && !isIp) {
        return {
          category: 'INVALID_INPUT',
          status: 'REJECTED',
          normalizedInput: trimmed,
          rejectionReason: 'URL hostname must specify a valid public domain with TLD or public IP address.',
        };
      }

      return {
        category: 'VALID_URL',
        status: 'ACCEPTED',
        normalizedInput: parsed.toString(),
        isHttpsVerified: parsed.protocol === 'https:',
      };
    } catch {
      return {
        category: 'INVALID_INPUT',
        status: 'REJECTED',
        normalizedInput: trimmed,
        rejectionReason: 'Malformed URL syntax cannot be parsed by standard URL specs.',
      };
    }
  }

  // 4. Check VALID_IP (Public IPv4 Address)
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(trimmed)) {
    if (isPrivateIp(trimmed)) {
      return {
        category: 'RESTRICTED_TARGET',
        status: 'REJECTED',
        normalizedInput: trimmed,
        rejectionReason: `Restricted IP: '${trimmed}' is a private/internal IP address.`,
      };
    }

    return {
      category: 'VALID_IP',
      status: 'ACCEPTED',
      normalizedInput: trimmed,
      isHttpsVerified: false,
    };
  }

  // 5. Check VALID_DOMAIN (No spaces, contains TLD or reserved test TLD)
  if (!trimmed.includes(' ') && !trimmed.includes('\n') && !trimmed.includes('\r')) {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i;
    const isTestTld =
      lower.endsWith('.example') ||
      lower.endsWith('.test') ||
      lower.endsWith('.invalid') ||
      lower.endsWith('.localhost');

    if (domainRegex.test(trimmed) || isTestTld) {
      if (isPrivateIp(lower)) {
        return {
          category: 'RESTRICTED_TARGET',
          status: 'REJECTED',
          normalizedInput: trimmed,
          rejectionReason: `Restricted Domain: '${trimmed}' resolves to a restricted target.`,
        };
      }

      return {
        category: 'VALID_DOMAIN',
        status: 'ACCEPTED',
        normalizedInput: lower,
        isHttpsVerified: false,
      };
    }
  }

  // 6. Default Fallback -> INVALID_INPUT
  return {
    category: 'INVALID_INPUT',
    status: 'REJECTED',
    normalizedInput: trimmed,
    rejectionReason: 'Submitted target is neither a valid HTTP/HTTPS URL, public domain name, nor public IP address.',
  };
}
