import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = '' } = body;

    if (!content || typeof content !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Content is required for PhishLens analysis.' },
        status: 400,
      });
    }

    const text = content.toLowerCase();

    const detectedTactics: string[] = [];
    const suspiciousPhrases: string[] = [];
    let riskScore = 10;

    if (text.includes('urgent') || text.includes('suspended') || text.includes('block') || text.includes('2 hours') || text.includes('immediately')) {
      detectedTactics.push('Urgency Manipulation & Threat of Action');
      suspiciousPhrases.push('Account will be suspended immediately');
      riskScore += 30;
    }

    if (text.includes('otp') || text.includes('password') || text.includes('verify your account') || text.includes('pin')) {
      detectedTactics.push('Credential / OTP Harvesting Lure');
      suspiciousPhrases.push('Share OTP / Verify password link');
      riskScore += 35;
    }

    if (text.includes('won') || text.includes('lottery') || text.includes('cashback') || text.includes('refund') || text.includes('rs.')) {
      detectedTactics.push('Financial Reward & Lottery Scam Lure');
      suspiciousPhrases.push('Claim instant prize or refund');
      riskScore += 25;
    }

    if (text.includes('customer service') || text.includes('support team') || text.includes('bank support') || text.includes('helpdesk')) {
      detectedTactics.push('Brand & Technical Support Impersonation');
      suspiciousPhrases.push('Unverified support representative');
      riskScore += 20;
    }

    riskScore = Math.min(100, riskScore);

    const beginnerExplanation =
      riskScore > 50
        ? 'This message is trying to trick you! It uses fake panic ("your account is blocked") or promises free money to get you to click a link or share secret passwords/OTPs. Real companies will never ask you for an OTP or password over SMS or chat.'
        : 'This message does not show obvious scam signs, but always make sure you know who sent it before clicking any links.';

    return createApiResponse({
      data: {
        riskScore,
        riskLevel: riskScore >= 70 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW',
        detectedTactics,
        suspiciousPhrases,
        beginnerExplanation,
        whatToVerify: [
          'Check the sender handle or phone number carefully.',
          'Never share 6-digit OTP codes or passwords with anyone.',
          'Log in through the official mobile app or verified website directly.',
        ],
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'PhishLens Social Engineering Analyzer',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process PhishLens analysis.' },
      status: 500,
    });
  }
}
