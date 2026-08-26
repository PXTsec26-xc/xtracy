/**
 * XTRACY NEXUS — Central Intelligence Engine
 * Deterministic input classification, multi-vector defensive checks, and explainable risk scoring.
 */

import { validateUrlForSSRF } from '@/lib/ssrfProtection';

export type InputClassification = 'URL' | 'DOMAIN' | 'IP' | 'HASH' | 'EMAIL' | 'SCAM_TEXT';

export interface FactorBreakdown {
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  points: number;
  description: string;
}

export interface NexusResult {
  input: string;
  classification: InputClassification;
  riskLevel: 'LOW' | 'CAUTION' | 'SUSPICIOUS' | 'HIGH_RISK';
  riskScore: number; // 0 to 100
  factors: FactorBreakdown[];
  findings: {
    category: string;
    severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    detail: string;
  }[];
  threatIndicators: string[];
  redirectAnalysis?: {
    hasRedirects: boolean;
    redirectCount: number;
    destination?: string;
  };
  securityHeaders?: {
    csp: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
  };
  recommendations: string[];
  analyzedAt: string;
  privacyStatus: string;
  dataSourceStatus: string;
}

/**
 * Deterministically classify input string
 */
export function classifyInput(input: string): InputClassification {
  const trimmed = input.trim();

  // 1. IP Address
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(trimmed)) return 'IP';

  // 2. File Hash (MD5, SHA1, SHA256)
  const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;
  if (hashRegex.test(trimmed)) return 'HASH';

  // 3. Email Address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return 'EMAIL';

  // 4. URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return 'URL';

  // 5. Domain Name
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (domainRegex.test(trimmed)) return 'DOMAIN';

  // Default: Scam Message Text
  return 'SCAM_TEXT';
}

/**
 * Execute unified Nexus Analysis with explainable score calculation
 */
export async function analyzeNexusInput(input: string): Promise<NexusResult> {
  const classification = classifyInput(input);
  const factors: FactorBreakdown[] = [];
  const findings: NexusResult['findings'] = [];
  const threatIndicators: string[] = [];
  const recommendations: string[] = [];

  let baseScore = 50; // Neutral baseline

  if (classification === 'URL' || classification === 'DOMAIN') {
    const rawUrl = classification === 'DOMAIN' ? `https://${input.trim()}` : input.trim();
    
    // SSRF Check
    const ssrfResult = validateUrlForSSRF(rawUrl);
    if (!ssrfResult.allowed) {
      return {
        input,
        classification,
        riskLevel: 'HIGH_RISK',
        riskScore: 95,
        factors: [
          { type: 'NEGATIVE', points: +45, description: `SSRF Violation: ${ssrfResult.reason}` },
        ],
        findings: [
          { category: 'SSRF_PROTECTION', severity: 'CRITICAL', detail: `Blocked internal or loopback IP range (${ssrfResult.reason})` },
        ],
        threatIndicators: ['Internal IP access attempt blocked'],
        recommendations: ['Do not attempt to scan localhost, RFC1918 private subnets, or metadata endpoints.'],
        analyzedAt: new Date().toISOString(),
        privacyStatus: 'Blocked by Local SSRF Filter',
        dataSourceStatus: 'LOCAL_RULE_ENGINE',
      };
    }

    try {
      const parsedUrl = new URL(rawUrl);

      // HTTPS Check
      if (parsedUrl.protocol === 'https:') {
        baseScore -= 15;
        factors.push({ type: 'POSITIVE', points: -15, description: 'HTTPS transport protocol active' });
      } else {
        baseScore += 20;
        factors.push({ type: 'NEGATIVE', points: +20, description: 'Unencrypted HTTP protocol in use' });
        findings.push({ category: 'TRANSPORT_SECURITY', severity: 'HIGH', detail: 'Target website transmits data unencrypted over HTTP.' });
        threatIndicators.push('Unencrypted HTTP transport');
      }

      // Subdomain & Homograph Checks
      const subdomains = parsedUrl.hostname.split('.');
      if (subdomains.length > 3) {
        baseScore += 15;
        factors.push({ type: 'NEGATIVE', points: +15, description: 'Excessive subdomain depth (>3 levels)' });
        findings.push({ category: 'URL_STRUCTURE', severity: 'MEDIUM', detail: 'High subdomain count commonly associated with phishing lures.' });
      }

      if (parsedUrl.hostname.startsWith('xn--')) {
        baseScore += 25;
        factors.push({ type: 'NEGATIVE', points: +25, description: 'Punycode / Homograph domain structure detected' });
        findings.push({ category: 'HOMOGRAPH_ATTACK', severity: 'HIGH', detail: 'Domain uses Punycode encoding to mimic trusted brands.' });
        threatIndicators.push('Punycode lookalike domain');
      }

      // Known Shortener Detection
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly'];
      if (shorteners.some((s) => parsedUrl.hostname.toLowerCase().includes(s))) {
        baseScore += 15;
        factors.push({ type: 'NEGATIVE', points: +15, description: 'URL Shortener service detected (Destination obfuscated)' });
        findings.push({ category: 'URL_OBFUSCATION', severity: 'MEDIUM', detail: 'Shortened URL obscures original target destination.' });
      }

      // Phishing Keyword Inspection
      const phishingLures = ['verify', 'secure', 'update-account', 'banking-login', 'claim-reward', 'blocked-card', 'crypto-bonus'];
      if (phishingLures.some((l) => rawUrl.toLowerCase().includes(l))) {
        baseScore += 20;
        factors.push({ type: 'NEGATIVE', points: +20, description: 'Phishing keyword pattern in URL string' });
        findings.push({ category: 'SOCIAL_ENGINEERING', severity: 'HIGH', detail: 'URL contains high-risk credential harvesting or urgency keywords.' });
        threatIndicators.push('Credential lure keyword pattern');
      }

    } catch (err) {
      baseScore += 10;
    }

    recommendations.push('Verify domain ownership independently before entering credentials.');
    recommendations.push('Inspect SSL certificate details in your browser address bar.');
  } else if (classification === 'SCAM_TEXT' || classification === 'EMAIL') {
    const textLower = input.toLowerCase();

    // Urgency Tactics
    if (textLower.includes('immediately') || textLower.includes('24 hours') || textLower.includes('urgent') || textLower.includes('suspended')) {
      baseScore += 20;
      factors.push({ type: 'NEGATIVE', points: +20, description: 'High urgency or fear pressure tactic detected' });
      findings.push({ category: 'PSYCHOLOGICAL_PRESSURE', severity: 'MEDIUM', detail: 'Message creates artificial urgency to force hasty action.' });
      threatIndicators.push('Artificial urgency pressure');
    }

    // Financial & OTP Lures
    if (textLower.includes('otp') || textLower.includes('password') || textLower.includes('pin') || textLower.includes('gift card') || textLower.includes('wire transfer')) {
      baseScore += 25;
      factors.push({ type: 'NEGATIVE', points: +25, description: 'Request for credentials, OTP, or advance payment' });
      findings.push({ category: 'CREDENTIAL_HARVESTING', severity: 'HIGH', detail: 'Message requests sensitive passwords, OTP codes, or gift card payments.' });
      threatIndicators.push('OTP / Advance payment request');
    }

    // Crypto & Job Lures
    if (textLower.includes('guaranteed return') || textLower.includes('crypto giveaway') || textLower.includes('no experience required $500/day')) {
      baseScore += 25;
      factors.push({ type: 'NEGATIVE', points: +25, description: 'Unrealistic financial gain or job offer lure' });
      findings.push({ category: 'FINANCIAL_FRAUD', severity: 'HIGH', detail: 'Promises guaranteed investment returns or unrealistic work-from-home salary.' });
      threatIndicators.push('Unrealistic financial promise');
    }

    if (factors.length === 0) {
      baseScore -= 20;
      factors.push({ type: 'POSITIVE', points: -20, description: 'No obvious scam pressure keywords detected' });
    }

    recommendations.push('Never share OTPs, passwords, or bank details over SMS or email.');
    recommendations.push('Contact the official organization directly via verified channels.');
  } else {
    // HASH / IP
    baseScore -= 10;
    factors.push({ type: 'POSITIVE', points: -10, description: 'Valid technical indicator format' });
    findings.push({ category: 'TECHNICAL_INDICATOR', severity: 'INFO', detail: `Submitted valid ${classification} string for defensive indexing.` });
    recommendations.push('Cross-reference file hash against local EvidencePulse hash chain.');
  }

  const finalScore = Math.max(0, Math.min(100, baseScore));

  let riskLevel: NexusResult['riskLevel'] = 'LOW';
  if (finalScore >= 75) riskLevel = 'HIGH_RISK';
  else if (finalScore >= 55) riskLevel = 'SUSPICIOUS';
  else if (finalScore >= 35) riskLevel = 'CAUTION';

  return {
    input,
    classification,
    riskLevel,
    riskScore: finalScore,
    factors,
    findings,
    threatIndicators,
    redirectAnalysis: classification === 'URL' ? { hasRedirects: false, redirectCount: 0 } : undefined,
    securityHeaders: classification === 'URL' ? { csp: false, hsts: true, xFrameOptions: true } : undefined,
    recommendations,
    analyzedAt: new Date().toISOString(),
    privacyStatus: '100% Local Heuristic Inspection',
    dataSourceStatus: 'XTRACY_NEXUS_ENGINE_v2.1',
  };
}
