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

export function analyzeScamContent(req: ScamCheckRequest): ScamCheckResult {
  const { targetType, content } = req;
  const textLower = content.toLowerCase();
  const factors: ScamCheckFactor[] = [];
  let score = 20; // Baseline low risk

  // 1. Urgency & Fear Pressure Checks
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
      reasoning: 'Scammers frequently create artificial time pressure to force hasty decisions before users can verify claims.',
    });
  }

  // 2. Sensitive Credential & Payment Requests
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

  // 3. Job Offer & Advance Fee Lures
  if (
    textLower.includes('no experience required') ||
    textLower.includes('earn $500/day') ||
    textLower.includes('registration fee') ||
    textLower.includes('starter kit payment') ||
    textLower.includes('telegram interview')
  ) {
    score += 25;
    factors.push({
      indicator: 'Advance-Fee Job / Task Scam Pattern',
      weight: 'HIGH',
      impact: 'SUSPICIOUS',
      reasoning: 'Fake job offers often promise high daily wages for trivial tasks but require upfront payments for equipment or registration.',
    });
  }

  // 4. Crypto Giveaway & Guaranteed Return Lures
  if (
    textLower.includes('guaranteed return') ||
    textLower.includes('double your bitcoin') ||
    textLower.includes('crypto giveaway') ||
    textLower.includes('100% risk free')
  ) {
    score += 25;
    factors.push({
      indicator: 'Unrealistic Financial Guarantee Lure',
      weight: 'HIGH',
      impact: 'SUSPICIOUS',
      reasoning: 'No legitimate financial or cryptocurrency investment can guarantee fixed double-digit returns without risk.',
    });
  }

  // 5. Remote Access Software Lures
  if (
    textLower.includes('anydesk') ||
    textLower.includes('teamviewer') ||
    textLower.includes('quicksupport') ||
    textLower.includes('install remote access')
  ) {
    score += 30;
    factors.push({
      indicator: 'Remote Access Tool Installation Request',
      weight: 'HIGH',
      impact: 'SUSPICIOUS',
      reasoning: 'Unsolicited requests to install remote desktop software allow attackers full control over bank sessions.',
    });
  }

  // Positive Factors
  if (factors.length === 0) {
    score = 10;
    factors.push({
      indicator: 'No High-Risk Scam Patterns Detected',
      weight: 'LOW',
      impact: 'DEFENSIVE_POSITIVE',
      reasoning: 'The submitted content does not contain recognized phishing, urgency, or advance-fee payment keywords.',
    });
  }

  const finalScore = Math.min(100, score);

  let category: ScamCheckResult['verdictCategory'] = 'LOW RISK';
  let summary = 'No significant scam indicators detected in submitted text.';

  if (finalScore >= 70) {
    category = 'HIGH RISK';
    summary = 'Multiple high-risk scam indicators detected. Severe caution recommended.';
  } else if (finalScore >= 50) {
    category = 'SUSPICIOUS';
    summary = 'Suspicious coercion or payment indicators identified. Independent verification required.';
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
