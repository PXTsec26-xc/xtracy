/**
 * XTRACY URL & Domain Analyzer
 * Comprehensive deterministic URL, domain, homoglyph, Punycode, subdomain, and brand impersonation parser.
 */

import { DetailedIndicatorFactor } from '@/lib/server/riskEngine';
import { validateUrlForSSRF } from '@/lib/ssrfProtection';
import { ClassificationResult } from '@/lib/server/inputClassifier';

const TARGETED_BRANDS = [
  { name: 'PayPal', keyword: 'paypal', officialDomain: 'paypal.com' },
  { name: 'Bank of America', keyword: 'bankofamerica', officialDomain: 'bankofamerica.com' },
  { name: 'Chase Bank', keyword: 'chase', officialDomain: 'chase.com' },
  { name: 'Wells Fargo', keyword: 'wellsfargo', officialDomain: 'wellsfargo.com' },
  { name: 'Apple', keyword: 'apple', officialDomain: 'apple.com' },
  { name: 'Microsoft', keyword: 'microsoft', officialDomain: 'microsoft.com' },
  { name: 'Google', keyword: 'google', officialDomain: 'google.com' },
  { name: 'Amazon', keyword: 'amazon', officialDomain: 'amazon.com' },
  { name: 'Netflix', keyword: 'netflix', officialDomain: 'netflix.com' },
  { name: 'Facebook / Meta', keyword: 'facebook', officialDomain: 'facebook.com' },
  { name: 'Instagram', keyword: 'instagram', officialDomain: 'instagram.com' },
  { name: 'Binance', keyword: 'binance', officialDomain: 'binance.com' },
  { name: 'Coinbase', keyword: 'coinbase', officialDomain: 'coinbase.com' },
  { name: 'Stripe', keyword: 'stripe', officialDomain: 'stripe.com' },
];

const SENSITIVE_KEYWORDS = [
  'secure',
  'security',
  'login',
  'signin',
  'auth',
  'verify',
  'verification',
  'account',
  'update',
  'credential',
  'banking',
  'service',
  'support',
  'alert',
  'billing',
  'confirm',
];

export function analyzeUrlTarget(
  inputUrl: string,
  classResult?: ClassificationResult
): DetailedIndicatorFactor[] {
  const factors: DetailedIndicatorFactor[] = [];
  let rawUrl = inputUrl.trim();

  // If no scheme was provided, default to https:// ONLY for URL parsing purposes, but do NOT award HTTPS points unless explicitly verified!
  let isExplicitHttps = classResult?.isHttpsVerified ?? false;
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = 'https://' + rawUrl;
  } else if (rawUrl.startsWith('https://')) {
    isExplicitHttps = true;
  }

  // SSRF Protection Check
  const ssrfCheck = validateUrlForSSRF(rawUrl);
  if (!ssrfCheck.allowed) {
    factors.push({
      name: 'SSRF Boundary Violation',
      severity: 'CRITICAL',
      points: 75,
      source: 'Local Heuristic Engine',
      technicalExplanation: `Target URL attempts to reach internal loopback or private IP range (${ssrfCheck.reason}).`,
      fraudAssociationRationale: 'Attackers target internal IP addresses or cloud metadata endpoints via Server-Side Request Forgery.',
    });
    return factors;
  }

  try {
    const parsed = new URL(rawUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // Reserved RFC 2606 Test Domains (.example, .test, .invalid, .localhost)
    const isTestTld =
      hostname.endsWith('.example') ||
      hostname.endsWith('.test') ||
      hostname.endsWith('.invalid') ||
      hostname.endsWith('.localhost');

    if (isTestTld) {
      factors.push({
        name: 'Reserved Test TLD Notice (RFC 2606)',
        severity: 'LOW',
        points: 0,
        source: 'Local Heuristic Engine',
        technicalExplanation: `Domain TLD '${hostname.substring(hostname.lastIndexOf('.'))}' is a reserved RFC 2606 test domain. Host is non-routable for testing, but structure is analyzed for simulated phishing indicators.`,
        fraudAssociationRationale: 'RFC 2606 reserved domains allow safe defensive testing without triggering live network probes.',
      });
    }

    // Strict HTTPS Transport Check: ONLY award points if explicitly verified from parsed input
    if (isExplicitHttps) {
      factors.push({
        name: 'HTTPS Encrypted Transport',
        severity: 'LOW',
        points: -10,
        source: 'Local Heuristic Engine',
        technicalExplanation: 'Target website scheme explicitly specifies HTTPS TLS transport encryption.',
        fraudAssociationRationale: 'HTTPS protects transit data, though phishing sites also use free SSL certificates.',
      });
    } else if (classResult?.classification === 'VALID_URL' && parsed.protocol === 'http:') {
      factors.push({
        name: 'Unencrypted HTTP Transport',
        severity: 'HIGH',
        points: 20,
        source: 'Local Heuristic Engine',
        technicalExplanation: 'Target website transmits credentials or forms unencrypted over HTTP.',
        fraudAssociationRationale: 'Lack of HTTPS exposes sensitive data to interception and indicates sub-standard security.',
      });
    } else if (classResult?.classification === 'DOMAIN') {
      factors.push({
        name: 'Unverified Domain Transport',
        severity: 'LOW',
        points: 0,
        source: 'Local Heuristic Engine',
        technicalExplanation: 'Target submitted as raw domain string; HTTPS availability not inferred without live lookup.',
        fraudAssociationRationale: 'Raw domain analysis evaluates hostname structure without making transport protocol assumptions.',
      });
    }

    // Brand Impersonation Pattern Check
    for (const brand of TARGETED_BRANDS) {
      if (hostname.includes(brand.keyword) && !hostname.endsWith(`.${brand.officialDomain}`) && hostname !== brand.officialDomain) {
        factors.push({
          name: `Brand Impersonation Pattern (${brand.name})`,
          severity: 'HIGH',
          points: 35,
          source: 'Local Heuristic Engine',
          technicalExplanation: `Domain '${hostname}' incorporates target brand keyword '${brand.name}' on an unofficial domain.`,
          fraudAssociationRationale: 'Phishers frequently register domains containing famous brand names to visually trick victims.',
        });
        break;
      }
    }

    // Misleading Security & Account Verification Keywords
    const matchedDomainKw = SENSITIVE_KEYWORDS.filter((kw) => hostname.includes(kw));
    const matchedPathKw = SENSITIVE_KEYWORDS.filter((kw) => pathname.includes(kw));
    if (matchedDomainKw.length > 0 || matchedPathKw.length > 0) {
      const allKw = Array.from(new Set([...matchedDomainKw, ...matchedPathKw]));
      factors.push({
        name: 'Misleading Security & Account Verification Keywords',
        severity: 'HIGH',
        points: 25,
        source: 'Local Heuristic Engine',
        technicalExplanation: `URL contains sensitive verification keywords (${allKw.map((k) => `'${k}'`).join(', ')}).`,
        fraudAssociationRationale: 'Phishing URLs combine words like "secure", "login", or "verify-account" to simulate legitimate authentication portals.',
      });
    }

    // Deceptive Hyphenated Domain Pattern
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 2) {
      factors.push({
        name: 'Deceptive Hyphenated Domain Pattern',
        severity: 'MEDIUM',
        points: 15,
        source: 'Local Heuristic Engine',
        technicalExplanation: `Domain hostname uses ${hyphenCount} hyphens ('${hostname}').`,
        fraudAssociationRationale: 'Attackers chain multiple hyphenated words (e.g. secure-bank-login-update) to confuse users.',
      });
    }

    // Subdomain Depth
    const subdomains = hostname.split('.');
    if (subdomains.length > 3 && !isTestTld) {
      factors.push({
        name: 'Excessive Subdomain Depth',
        severity: 'MEDIUM',
        points: 15,
        source: 'Local Heuristic Engine',
        technicalExplanation: `Hostname contains ${subdomains.length} domain label levels ('${hostname}').`,
        fraudAssociationRationale: 'Excessive subdomains obscure the true registered apex domain.',
      });
    }

    // Punycode / IDN Homograph
    if (hostname.startsWith('xn--')) {
      factors.push({
        name: 'Punycode / IDN Homograph Obfuscation',
        severity: 'HIGH',
        points: 30,
        source: 'Local Heuristic Engine',
        technicalExplanation: `Domain uses Punycode encoding ('${hostname}').`,
        fraudAssociationRationale: 'Punycode domains allow attackers to substitute lookalike Unicode characters (e.g. Cyrillic "а" for Latin "a").',
      });
    }

    // IP Hostname
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
      factors.push({
        name: 'IP Address Hostname Usage',
        severity: 'HIGH',
        points: 30,
        source: 'Local Heuristic Engine',
        technicalExplanation: `URL uses raw IP address '${hostname}' instead of a registered domain name.`,
        fraudAssociationRationale: 'Legitimate services use registered domains. Raw IPs are used in automated phishing infrastructure.',
      });
    }

    // URL Shortener
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly'];
    if (shorteners.some((s) => hostname.includes(s))) {
      factors.push({
        name: 'URL Shortener Service Obfuscation',
        severity: 'MEDIUM',
        points: 15,
        source: 'Local Heuristic Engine',
        technicalExplanation: `Domain matches known shortener service ('${hostname}').`,
        fraudAssociationRationale: 'URL shorteners conceal the ultimate destination domain until followed by the victim.',
      });
    }
  } catch (err) {
    factors.push({
      name: 'Malformed URL Syntax',
      severity: 'MEDIUM',
      points: 15,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Submitted input could not be cleanly parsed as a valid URL standard.',
      fraudAssociationRationale: 'Malformed URLs are used to bypass simple text pattern matchers.',
    });
  }

  return factors;
}
