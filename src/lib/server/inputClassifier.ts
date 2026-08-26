/**
 * XTRACY Input Classifier Module
 * Deterministically classifies target inputs into VALID_URL, DOMAIN, MESSAGE_TEXT, or INVALID_INPUT.
 */

import { isPrivateIp } from '@/lib/ssrfProtection';

export type InputTypeClassification = 'VALID_URL' | 'DOMAIN' | 'MESSAGE_TEXT' | 'INVALID_INPUT';

export interface ClassificationResult {
  classification: InputTypeClassification;
  normalizedInput: string;
  errorMessage?: string;
  isHttpsVerified?: boolean;
}

export function classifyTargetInput(rawInput: string): ClassificationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      classification: 'INVALID_INPUT',
      normalizedInput: '',
      errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
    };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length === 0) {
    return {
      classification: 'INVALID_INPUT',
      normalizedInput: '',
      errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
    };
  }

  // 1. Reject Forbidden / Malformed Schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower === 'https://' ||
    lower === 'http://' ||
    lower === 'https:' ||
    lower === 'http:'
  ) {
    return {
      classification: 'INVALID_INPUT',
      normalizedInput: trimmed,
      errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
    };
  }

  // 2. Check VALID_URL (Requires http:// or https://)
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

      if (!hostname || hostname.length === 0) {
        return {
          classification: 'INVALID_INPUT',
          normalizedInput: trimmed,
          errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
        };
      }

      // SSRF / Localhost check
      if (hostname === 'localhost' || hostname === '127.0.0.1' || isPrivateIp(hostname)) {
        return {
          classification: 'INVALID_INPUT',
          normalizedInput: trimmed,
          errorMessage: 'Restricted target: Localhost and private IP addresses are restricted from automated scanning.',
        };
      }

      // Check if hostname has at least one TLD dot or is a valid IP
      const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
      const hasTld = hostname.includes('.');

      if (!hasTld && !isIp) {
        return {
          classification: 'INVALID_INPUT',
          normalizedInput: trimmed,
          errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
        };
      }

      return {
        classification: 'VALID_URL',
        normalizedInput: parsed.toString(),
        isHttpsVerified: parsed.protocol === 'https:',
      };
    } catch {
      return {
        classification: 'INVALID_INPUT',
        normalizedInput: trimmed,
        errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
      };
    }
  }

  // 3. Check DOMAIN (No protocol, no spaces, must match domain regex with TLD)
  if (!trimmed.includes(' ') && !trimmed.includes('\n') && !trimmed.includes('\r')) {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i;
    const isReservedTestTld =
      lower.endsWith('.example') ||
      lower.endsWith('.test') ||
      lower.endsWith('.invalid') ||
      lower.endsWith('.localhost');

    if (domainRegex.test(trimmed) || isReservedTestTld) {
      const hostname = trimmed.toLowerCase();

      if (hostname === 'localhost' || hostname === '127.0.0.1' || isPrivateIp(hostname)) {
        return {
          classification: 'INVALID_INPUT',
          normalizedInput: trimmed,
          errorMessage: 'Restricted target: Localhost and private IP addresses are restricted from automated scanning.',
        };
      }

      return {
        classification: 'DOMAIN',
        normalizedInput: hostname,
        isHttpsVerified: false, // Cannot verify HTTPS for raw domain string without explicit lookup
      };
    }
  }

  // 4. Check MESSAGE_TEXT (Must be a multi-word or long text message)
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2 || trimmed.length >= 15) {
    return {
      classification: 'MESSAGE_TEXT',
      normalizedInput: trimmed,
      isHttpsVerified: false,
    };
  }

  // 5. Default Fallback -> INVALID_INPUT
  return {
    classification: 'INVALID_INPUT',
    normalizedInput: trimmed,
    errorMessage: 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
  };
}
