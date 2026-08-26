/**
 * XTRACY Text & Message Analyzer
 * Deterministic message diagnostic for SMS, WhatsApp, Email lures, Job scams, Payment pressure, and Crypto guarantees.
 */

import { DetailedIndicatorFactor } from '@/lib/server/riskEngine';

export function analyzeTextTarget(text: string): DetailedIndicatorFactor[] {
  const factors: DetailedIndicatorFactor[] = [];
  const textLower = text.toLowerCase();

  // 1. Urgency & Account Suspension Pressure
  if (
    textLower.includes('immediately') ||
    textLower.includes('24 hours') ||
    textLower.includes('account blocked') ||
    textLower.includes('suspended') ||
    textLower.includes('legal action')
  ) {
    factors.push({
      name: 'Artificial Urgency & Account Suspension Pressure',
      severity: 'HIGH',
      points: 25,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message contains high-pressure urgency keywords ("immediately", "suspended", "24 hours").',
      fraudAssociationRationale: 'Scammers manufacture artificial panic to bypass rational user scrutiny and force rapid actions.',
    });
  }

  // 2. Sensitive OTP & Credential Harvesting
  if (
    textLower.includes('otp') ||
    textLower.includes('one time password') ||
    textLower.includes('pin') ||
    textLower.includes('cvv') ||
    textLower.includes('password reset')
  ) {
    factors.push({
      name: 'Sensitive OTP / Password Harvesting Request',
      severity: 'CRITICAL',
      points: 35,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message directly requests One-Time Passwords (OTP), PIN numbers, or credentials.',
      fraudAssociationRationale: 'Legitimate institutions never request OTP authentication codes or PIN numbers over SMS or chat.',
    });
  }

  // 3. Advance Fee & Gift Card / Wire Payment Lure
  if (
    textLower.includes('gift card') ||
    textLower.includes('wire transfer') ||
    textLower.includes('zelle') ||
    textLower.includes('crypto payment') ||
    textLower.includes('registration fee')
  ) {
    factors.push({
      name: 'Irreversible Payment or Gift Card Lure',
      severity: 'HIGH',
      points: 30,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message requests payment via non-refundable methods (gift cards, wire transfers, crypto).',
      fraudAssociationRationale: 'Irreversible payment channels prevent victims from filing chargebacks once fraud is recognized.',
    });
  }

  // 4. Fake Job Offer / Task Scam
  if (
    textLower.includes('no experience required') ||
    textLower.includes('earn $500/day') ||
    textLower.includes('telegram interview') ||
    textLower.includes('starter kit fee')
  ) {
    factors.push({
      name: 'Advance-Fee Task / Work-From-Home Job Lure',
      severity: 'HIGH',
      points: 25,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message promises unrealistic daily wages for minimal work requiring advance registration fees.',
      fraudAssociationRationale: 'Employment scams promise high pay for simple liking/rating tasks, demanding crypto deposits to unlock earnings.',
    });
  }

  // 5. Unrealistic Financial Guarantee / Crypto Giveaway
  if (
    textLower.includes('guaranteed return') ||
    textLower.includes('double your bitcoin') ||
    textLower.includes('crypto giveaway') ||
    textLower.includes('100% risk free')
  ) {
    factors.push({
      name: 'Unrealistic Financial Return Guarantee',
      severity: 'HIGH',
      points: 25,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message guarantees fixed high-yield investment returns without market risk.',
      fraudAssociationRationale: 'Financial investments carry inherent market risks. Guaranteed fixed multipliers indicate Ponzi scheme patterns.',
    });
  }

  // 6. Remote Desktop Tool Request
  if (
    textLower.includes('anydesk') ||
    textLower.includes('teamviewer') ||
    textLower.includes('quicksupport') ||
    textLower.includes('install remote access')
  ) {
    factors.push({
      name: 'Remote Access Desktop Software Request',
      severity: 'CRITICAL',
      points: 35,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'Message requests installation of remote administration tools (AnyDesk, TeamViewer).',
      fraudAssociationRationale: 'Remote access tools give attackers complete screen and keyboard control over online banking sessions.',
    });
  }

  return factors;
}
