/**
 * XTRACY Real Scam Check Engine
 * Evidence-based scam indicator analysis for text, messages, job lures, and URLs.
 */

export interface ScamCheckRequest {
  targetType: 'URL' | 'EMAIL_TEXT' | 'SMS_TEXT' | 'JOB_OFFER' | 'PAYMENT_REQUEST' | 'CRYPTO_LURE';
  content: string;
}

export interface ScamCheckFactor {
  indicator: string;
  weight: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'SUSPICIOUS' | 'DEFENSIVE_POSITIVE';
  reasoning: string;
}

export interface ScamCheckResult {
  targetType: ScamCheckRequest['targetType'];
  contentSnippet: string;
  verdictCategory: 'LOW RISK' | 'CAUTION' | 'SUSPICIOUS' | 'HIGH RISK';
  riskScore: number; // 0 to 100
  factors: ScamCheckFactor[];
  summary: string;
  whyThisResult: string[];
  disclaimer: string;
  analyzedAt: string;
}

export const SCAM_CHECK_DISCLAIMER =
  'Automated scam analysis provides evidence-based risk indicators to assist user decision-making. It does not replace independent verification or official administrative confirmation.';

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

const SECURITY_LOGIN_KEYWORDS = [
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

export function analyzeScamContent(req: ScamCheckRequest): ScamCheckResult {
  const { targetType, content } = req;
  const trimmedContent = content.trim();
  const textLower = trimmedContent.toLowerCase();
  const factors: ScamCheckFactor[] = [];
  let score = 10; // Baseline low risk

  const isUrlType =
    targetType === 'URL' ||
    trimmedContent.startsWith('http://') ||
    trimmedContent.startsWith('https://') ||
    (trimmedContent.includes('.') && !trimmedContent.includes(' '));

  if (isUrlType) {
    let parsedUrl: URL | null = null;
    let rawUrl = trimmedContent;

    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }

    try {
      parsedUrl = new URL(rawUrl);
    } catch (err) {
      parsedUrl = null;
    }

    if (parsedUrl) {
      const hostname = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname.toLowerCase();

      // Check Reserved Test Domains (.example, .test, .invalid, .localhost)
      const isTestTld =
        hostname.endsWith('.example') ||
        hostname.endsWith('.test') ||
        hostname.endsWith('.invalid') ||
        hostname.endsWith('.localhost');

      if (isTestTld) {
        factors.push({
          indicator: 'Reserved Test TLD Notice (RFC 2606)',
          weight: 'LOW',
          impact: 'DEFENSIVE_POSITIVE',
          reasoning: `Domain TLD '${hostname.substring(hostname.lastIndexOf('.'))}' is a reserved RFC 2606 test domain. Host is non-routable for testing, but URL structure is analyzed for simulated phishing indicators.`,
        });
      }

      // 1. Brand Impersonation Pattern Check
      for (const brand of TARGETED_BRANDS) {
        if (hostname.includes(brand.keyword) && !hostname.endsWith(`.${brand.officialDomain}`) && hostname !== brand.officialDomain) {
          score += 35;
          factors.push({
            indicator: `Brand Impersonation Lure Pattern (${brand.name})`,
            weight: 'HIGH',
            impact: 'SUSPICIOUS',
            reasoning: `Domain '${hostname}' contains the target brand keyword '${brand.name}' on an unofficial domain. Phishers use brand names in subdomains or hyphenated strings to deceive users.`,
          });
          break;
        }
      }

      // 2. Misleading Security & Account Verification Keywords in Domain or Path
      const matchedDomainKeywords = SECURITY_LOGIN_KEYWORDS.filter((kw) => hostname.includes(kw));
      const matchedPathKeywords = SECURITY_LOGIN_KEYWORDS.filter((kw) => pathname.includes(kw));

      if (matchedDomainKeywords.length > 0 || matchedPathKeywords.length > 0) {
        const allKeywords = Array.from(new Set([...matchedDomainKeywords, ...matchedPathKeywords]));
        score += 25;
        factors.push({
          indicator: 'Misleading Security & Account Verification Keywords',
          weight: 'HIGH',
          impact: 'SUSPICIOUS',
          reasoning: `URL contains high-risk account verification keywords (${allKeywords.map((k) => `'${k}'`).join(', ')}) commonly used in credential harvesting lures.`,
        });
      }

      // 3. Deceptive Hyphenation & Compound Phishing Strings
      const hyphenCount = (hostname.match(/-/g) || []).length;
      if (hyphenCount >= 2) {
        score += 15;
        factors.push({
          indicator: 'Deceptive Hyphenated Domain Pattern',
          weight: 'MEDIUM',
          impact: 'SUSPICIOUS',
          reasoning: `Domain uses multiple hyphens (${hyphenCount} hyphens: '${hostname}') to construct deceptive compound brand strings.`,
        });
      }

      // 4. Excessive Subdomains
      const subdomains = hostname.split('.');
      if (subdomains.length > 3 && !isTestTld) {
        score += 15;
        factors.push({
          indicator: 'Excessive Subdomain Obfuscation',
          weight: 'MEDIUM',
          impact: 'SUSPICIOUS',
          reasoning: 'Domain contains multiple subdomains (>3 levels), which is often used to hide the true destination host.',
        });
      }

      // 5. Punycode / IDN Homograph
      if (hostname.startsWith('xn--')) {
        score += 30;
        factors.push({
          indicator: 'Punycode / IDN Homograph Obfuscation',
          weight: 'HIGH',
          impact: 'SUSPICIOUS',
          reasoning: 'Domain uses Punycode encoding (xn--) which can visually mimic legitimate character strings in browsers.',
        });
      }

      // 6. IP-Based URL
      if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
        score += 30;
        factors.push({
          indicator: 'IP Address Hostname Usage',
          weight: 'HIGH',
          impact: 'SUSPICIOUS',
          reasoning: 'URL uses a raw IP address instead of a registered domain name, bypassing standard domain reputation systems.',
        });
      }

      // 7. URL Shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly'];
      if (shorteners.some((s) => hostname.includes(s))) {
        score += 15;
        factors.push({
          indicator: 'URL Shortener Service Obfuscation',
          weight: 'MEDIUM',
          impact: 'SUSPICIOUS',
          reasoning: 'Shortened URL hides the final destination website until redirected.',
        });
      }
    }
  } else {
    // Text/Message Analysis
    if (
      textLower.includes('immediately') ||
      textLower.includes('24 hours') ||
      textLower.includes('account blocked') ||
      textLower.includes('suspended') ||
      textLower.includes('legal action')
    ) {
      score += 25;
      factors.push({
        indicator: 'Artificial Urgency & Fear Pressure',
        weight: 'HIGH',
        impact: 'SUSPICIOUS',
        reasoning: 'Scammers create artificial time pressure to force hasty decisions before users can verify claims.',
      });
    }

    if (
      textLower.includes('otp') ||
      textLower.includes('one time password') ||
      textLower.includes('pin') ||
      textLower.includes('cvv') ||
      textLower.includes('gift card') ||
      textLower.includes('wire transfer') ||
      textLower.includes('zelle') ||
      textLower.includes('crypto payment')
    ) {
      score += 30;
      factors.push({
        indicator: 'Credential, OTP, or Irreversible Payment Lure',
        weight: 'HIGH',
        impact: 'SUSPICIOUS',
        reasoning: 'Legitimate institutions never request OTP passwords, PIN numbers, or payment via gift cards.',
      });
    }

    if (
      textLower.includes('no experience required') ||
      textLower.includes('earn $500/day') ||
      textLower.includes('registration fee') ||
      textLower.includes('starter kit payment')
    ) {
      score += 25;
      factors.push({
        indicator: 'Advance-Fee Job / Task Scam Pattern',
        weight: 'HIGH',
        impact: 'SUSPICIOUS',
        reasoning: 'Fake job offers often promise high daily wages but require upfront fees for equipment or registration.',
      });
    }

    if (
      textLower.includes('guaranteed return') ||
      textLower.includes('double your bitcoin') ||
      textLower.includes('crypto giveaway')
    ) {
      score += 25;
      factors.push({
        indicator: 'Unrealistic Financial Guarantee Lure',
        weight: 'HIGH',
        impact: 'SUSPICIOUS',
        reasoning: 'No legitimate investment can guarantee fixed double-digit returns without risk.',
      });
    }
  }

  // Positive Factors (If no suspicious indicators found)
  if (factors.filter((f) => f.impact === 'SUSPICIOUS').length === 0) {
    score = 10;
    factors.push({
      indicator: 'No High-Risk Scam Patterns Detected',
      weight: 'LOW',
      impact: 'DEFENSIVE_POSITIVE',
      reasoning: 'The submitted target does not contain recognized brand impersonation, credential harvesting, or urgency indicators.',
    });
  }

  const finalScore = Math.min(100, score);

  let category: ScamCheckResult['verdictCategory'] = 'LOW RISK';
  let summary = 'No significant scam indicators detected in submitted target.';

  if (finalScore >= 70) {
    category = 'HIGH RISK';
    summary = 'Multiple high-risk scam indicators detected. Severe caution recommended.';
  } else if (finalScore >= 50) {
    category = 'SUSPICIOUS';
    summary = 'Suspicious brand impersonation or credential verification indicators identified. Independent verification required.';
  } else if (finalScore >= 30) {
    category = 'CAUTION';
    summary = 'Moderate risk indicators present. Proceed with caution.';
  }

  const whyThisResult = factors.map((f) => `${f.indicator}: ${f.reasoning}`);

  return {
    targetType,
    contentSnippet: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
    verdictCategory: category,
    riskScore: finalScore,
    factors,
    summary,
    whyThisResult,
    disclaimer: SCAM_CHECK_DISCLAIMER,
    analyzedAt: new Date().toISOString(),
  };
}
