/**
 * XTRACY Text & PhishLens Social Engineering Analyzer
 * Calibrated deterministic indicator weighting, multi-vector combination logic, and score floors for social engineering diagnostics.
 */

import { DetailedIndicatorFactor } from '@/lib/server/riskEngine';

export interface PhishLensAnalysisResult {
  riskScore: number; // 0 to 100
  verdict: 'Low Risk Signals' | 'Moderate Risk Signals' | 'High Risk Signals' | 'Critical Risk Signals';
  analysisConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedTactics: string[];
  factors: DetailedIndicatorFactor[];
  beginnerExplanation: string;
  whatToVerify: string[];
  analyzedAt: string;
}

export function analyzePhishLensMessage(text: string): PhishLensAnalysisResult {
  const factors: DetailedIndicatorFactor[] = [];
  const textLower = text.toLowerCase();
  const detectedTactics: string[] = [];

  // Track specific indicator presence for combination logic
  let hasOtp = false;
  let hasPassword = false;
  let hasUsername = false;
  let hasSuspiciousUrl = false;
  let hasUrgency = false;
  let hasImpersonation = false;
  let hasEmployeeId = false;

  // 1. OTP / PIN / Authentication Code Request (CRITICAL: +40 pts)
  if (
    textLower.includes('otp') ||
    textLower.includes('one time password') ||
    textLower.includes('one-time password') ||
    textLower.includes('pin') ||
    textLower.includes('verification code') ||
    textLower.includes('security code') ||
    textLower.includes('2fa code') ||
    textLower.includes('mfa code') ||
    textLower.includes('auth code') ||
    textLower.includes('authentication code')
  ) {
    hasOtp = true;
    detectedTactics.push('Critical Authentication OTP / PIN Harvesting Request');
    factors.push({
      id: 'FACTOR-OTP-01',
      name: 'Critical Authentication OTP / PIN Harvesting Request',
      severity: 'CRITICAL',
      points: 40,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message directly requests One-Time Passwords (OTP), PINs, or 2FA authentication codes.',
      fraudAssociationRationale: 'Legitimate banks and services never ask users to reveal 2FA/OTP codes over SMS or chat.',
    });
  }

  // 2. Explicit Password / Credential Request (HIGH: +35 pts)
  if (
    textLower.includes('password') ||
    textLower.includes('passcode') ||
    textLower.includes('login credentials') ||
    textLower.includes('account credentials') ||
    textLower.includes('user credentials') ||
    textLower.includes('secret key') ||
    textLower.includes('master key')
  ) {
    hasPassword = true;
    detectedTactics.push('Explicit Password & Credential Theft Request');
    factors.push({
      id: 'FACTOR-PASS-01',
      name: 'Explicit Password & Credential Harvesting Request',
      severity: 'HIGH',
      points: 35,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message explicitly requests user account passwords or secret credentials.',
      fraudAssociationRationale: 'Passwords are private secrets; authentic services rely on secure login forms, never message requests.',
    });
  }

  // 3. Username / Account Identifier Request (MEDIUM: +15 pts)
  if (
    textLower.includes('username') ||
    textLower.includes('user id') ||
    textLower.includes('userid') ||
    textLower.includes('login id') ||
    textLower.includes('user handle')
  ) {
    hasUsername = true;
    detectedTactics.push('Username / Account Identifier Query');
    factors.push({
      id: 'FACTOR-USER-01',
      name: 'Username / Account Identifier Query',
      severity: 'MEDIUM',
      points: 15,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message asks for username or account identification handle.',
      fraudAssociationRationale: 'Usernames combined with passwords enable automated brute-force or credential stuffing attacks.',
    });
  }

  // 4. Suspicious / Deceptive URL Lure (HIGH: +25 pts)
  if (
    textLower.includes('http://') ||
    textLower.includes('https://') ||
    textLower.includes('click here') ||
    textLower.includes('click link') ||
    textLower.includes('verify-') ||
    textLower.includes('login-') ||
    textLower.includes('bit.ly') ||
    textLower.includes('tinyurl.com')
  ) {
    hasSuspiciousUrl = true;
    detectedTactics.push('Suspicious External Link / Deceptive URL Lure');
    factors.push({
      id: 'FACTOR-URL-01',
      name: 'Suspicious External Link / Deceptive URL Lure',
      severity: 'HIGH',
      points: 25,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message incorporates embedded external links or shortened/deceptive URL patterns.',
      fraudAssociationRationale: 'Phishing messages use deceptive link anchors to redirect victims to credential-harvesting landing pages.',
    });
  }

  // 5. Artificial Urgency & Coercive Pressure (HIGH: +25 pts)
  if (
    textLower.includes('urgent') ||
    textLower.includes('immediately') ||
    textLower.includes('2 hours') ||
    textLower.includes('24 hours') ||
    textLower.includes('account blocked') ||
    textLower.includes('suspended') ||
    textLower.includes('legal action') ||
    textLower.includes('unauthorized access') ||
    textLower.includes('act now')
  ) {
    hasUrgency = true;
    detectedTactics.push('Artificial Urgency & Coercive Threat Manipulation');
    factors.push({
      id: 'FACTOR-URG-01',
      name: 'Artificial Urgency & Account Suspension Threat',
      severity: 'HIGH',
      points: 25,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message applies coercive pressure ("urgent", "suspended", "immediately").',
      fraudAssociationRationale: 'Attackers create artificial panic to impair critical judgment and force hasty compliance.',
    });
  }

  // 6. Organization / Trust Impersonation (HIGH: +25 pts)
  if (
    textLower.includes('bank') ||
    textLower.includes('paypal') ||
    textLower.includes('chase') ||
    textLower.includes('wellsfargo') ||
    textLower.includes('citibank') ||
    textLower.includes('stripe') ||
    textLower.includes('hdfc') ||
    textLower.includes('sbi') ||
    textLower.includes('icici') ||
    textLower.includes('it department') ||
    textLower.includes('helpdesk') ||
    textLower.includes('sysadmin') ||
    textLower.includes('system administrator') ||
    textLower.includes('it support') ||
    textLower.includes('corporate security') ||
    textLower.includes('hr department')
  ) {
    hasImpersonation = true;
    detectedTactics.push('Organization & Authority Brand Impersonation');
    factors.push({
      id: 'FACTOR-IMP-01',
      name: 'Organization & Authority Brand Impersonation',
      severity: 'HIGH',
      points: 25,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message claims authority from a bank, corporate IT department, or security desk.',
      fraudAssociationRationale: 'Impersonating trusted authorities leverages compliance habits to elicit confidential information.',
    });
  }

  // 7. Low-Sensitivity Corporate Identifier Request (MEDIUM: +15 pts)
  if (
    textLower.includes('employee id') ||
    textLower.includes('staff id') ||
    textLower.includes('badge number') ||
    textLower.includes('emp id')
  ) {
    hasEmployeeId = true;
    detectedTactics.push('Corporate Employee ID / Staff Identifier Query');
    factors.push({
      id: 'FACTOR-EMPID-01',
      name: 'Corporate Employee ID / Staff Identifier Query',
      severity: 'MEDIUM',
      points: 15,
      source: 'Local PhishLens Engine',
      technicalExplanation: 'Message requests low-sensitivity internal employee or badge identifiers.',
      fraudAssociationRationale: 'Employee IDs are low-sensitivity identifiers, but when combined with IT impersonation they pose moderate social engineering risk.',
    });
  }

  // ----------------------------------------------------
  // MULTI-INDICATOR COMBINATION LOGIC & SCORE FLOORS
  // ----------------------------------------------------
  let rawScore = 10; // Baseline starting score for non-empty text input
  for (const f of factors) {
    rawScore += f.points;
  }

  // Combination 1: Username + Password
  if (hasUsername && hasPassword) {
    factors.push({
      id: 'COMBO-USER-PASS',
      name: 'Combination Bonus: Username + Password Theft Attempt',
      severity: 'HIGH',
      points: 20,
      source: 'PhishLens Combination Engine',
      technicalExplanation: 'Request seeks both username and password credentials simultaneously.',
      fraudAssociationRationale: 'Pairing username with password provides complete account takeover access.',
    });
    rawScore += 20;
  }

  // Combination 2: Password + OTP (MFA Bypass Attempt) -> Minimum Floor: 85/100
  let floorScore = 0;
  if (hasPassword && hasOtp) {
    factors.push({
      id: 'COMBO-PASS-OTP',
      name: 'Combination Bonus: Password + OTP Multi-Factor Authentication Bypass',
      severity: 'CRITICAL',
      points: 25,
      source: 'PhishLens Combination Engine',
      technicalExplanation: 'Request targets both primary password and secondary OTP 2FA verification code.',
      fraudAssociationRationale: 'Simultaneous password and OTP requests indicate real-time man-in-the-middle account takeover.',
    });
    rawScore += 25;
    floorScore = Math.max(floorScore, 85);
  }

  // Combination 3: Password + Suspicious URL -> Minimum Floor: 80/100
  if (hasPassword && hasSuspiciousUrl) {
    factors.push({
      id: 'COMBO-PASS-URL',
      name: 'Combination Bonus: Password Request + Deceptive Link Lure',
      severity: 'CRITICAL',
      points: 20,
      source: 'PhishLens Combination Engine',
      technicalExplanation: 'Password harvesting request is combined with an embedded link lure.',
      fraudAssociationRationale: 'Directing users to external links to collect passwords is the classic web phishing vector.',
    });
    rawScore += 20;
    floorScore = Math.max(floorScore, 80);
  }

  // Combination 4: Multi-Vector Targeted Campaign (Urgency/Impersonation + Password/OTP + URL) -> Minimum Floor: 90/100
  if ((hasUrgency || hasImpersonation) && (hasPassword || hasOtp) && (hasSuspiciousUrl || hasOtp)) {
    factors.push({
      id: 'COMBO-MULTIVECTOR',
      name: 'Combination Bonus: Multi-Vector Targeted Credential Theft Campaign',
      severity: 'CRITICAL',
      points: 25,
      source: 'PhishLens Combination Engine',
      technicalExplanation: 'Message combines urgency, organizational impersonation, credential requests, and link lures.',
      fraudAssociationRationale: 'Multi-vector phishing messages exhibit highest statistical probability of active malicious intent.',
    });
    rawScore += 25;
    floorScore = Math.max(floorScore, 90);
  }

  // Apply floor calibrations and clamp score between 0 and 100
  let finalScore = Math.max(rawScore, floorScore);
  finalScore = Math.min(100, Math.max(0, finalScore));

  // Determine Verdict Level
  let verdict: 'Low Risk Signals' | 'Moderate Risk Signals' | 'High Risk Signals' | 'Critical Risk Signals' = 'Low Risk Signals';
  if (finalScore >= 75) {
    verdict = 'Critical Risk Signals';
  } else if (finalScore >= 50) {
    verdict = 'High Risk Signals';
  } else if (finalScore >= 25) {
    verdict = 'Moderate Risk Signals';
  } else {
    verdict = 'Low Risk Signals';
  }

  // Beginner Explanation
  const beginnerExplanation =
    finalScore >= 75
      ? 'CRITICAL WARNING: This message displays severe phishing and credential theft patterns. It attempts to steal passwords, 2FA/OTP codes, or lead you to malicious fake websites. Never share passwords or OTP codes with anyone!'
      : finalScore >= 25
      ? 'MODERATE WARNING: This message contains potential social engineering or corporate inquiry indicators. Verify the sender identity through official internal channels before responding.'
      : 'LOW RISK: This message does not display obvious phishing tactics. Maintain standard vigilance when interacting with external links.';

  return {
    riskScore: finalScore,
    verdict,
    analysisConfidence: factors.length >= 3 ? 'HIGH' : factors.length >= 1 ? 'MEDIUM' : 'LOW',
    detectedTactics,
    factors,
    beginnerExplanation,
    whatToVerify: [
      'Verify the sender handle or phone number against official contacts.',
      'Never share 6-digit OTP codes, PINs, or passwords over chat or SMS.',
      'Navigate directly to official corporate websites or mobile apps instead of clicking links.',
    ],
    analyzedAt: new Date().toISOString(),
  };
}

export function analyzeTextTarget(text: string): DetailedIndicatorFactor[] {
  const result = analyzePhishLensMessage(text);
  return result.factors;
}
