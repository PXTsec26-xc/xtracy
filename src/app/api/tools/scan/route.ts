import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { validateUrlForSSRF } from '@/lib/ssrfProtection';
import { IntelligenceAnalysisResult, evaluateRiskLevel } from '@/lib/server/intelligenceEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, inputType = 'URL' } = body;

    if (!input || typeof input !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Input string is required for X-Scan analysis.' },
        status: 400,
      });
    }

    const facts: string[] = [];
    const heuristics: string[] = [];
    const externalIntel: string[] = [];
    const unknowns: string[] = [];
    const limitations: string[] = [
      'X-Scan heuristic analysis cannot guarantee 100% safety or detection accuracy.',
      'Results should be cross-verified before taking financial or security actions.',
    ];

    let riskScore = 15;
    let confidenceLevel: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';

    if (inputType === 'URL') {
      const ssrfCheck = validateUrlForSSRF(input);
      if (!ssrfCheck.allowed) {
        return createApiResponse({
          error: { code: 'SSRF_RESTRICTED', message: ssrfCheck.reason || 'URL restricted by SSRF protection policies.' },
          status: 400,
        });
      }

      const targetUrl = ssrfCheck.normalizedUrl!;
      const urlObj = new URL(targetUrl);

      facts.push(`Protocol: ${urlObj.protocol.toUpperCase().replace(':', '')}`);
      facts.push(`Normalized Hostname: ${urlObj.hostname}`);

      if (urlObj.protocol === 'https:') {
        facts.push('Transport Layer Security (HTTPS) is active.');
      } else {
        heuristics.push('Unencrypted HTTP connection detected.');
        riskScore += 25;
      }

      const hostname = urlObj.hostname.toLowerCase();
      const suspiciousTLDs = ['.xyz', '.top', '.phish', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.zip'];
      if (suspiciousTLDs.some((tld) => hostname.endsWith(tld))) {
        heuristics.push(`Domain uses high-risk top-level domain (${hostname.substring(hostname.lastIndexOf('.'))}).`);
        riskScore += 25;
      }

      const parts = hostname.split('.');
      if (parts.length > 3) {
        heuristics.push('Excessive subdomain depth commonly associated with phishing lures.');
        riskScore += 20;
      }

      const sensitiveKeywords = ['login', 'verify', 'update', 'account', 'secure', 'banking', 'kyc', 'wallet', 'paypal', 'support'];
      if (sensitiveKeywords.some((kw) => hostname.includes(kw))) {
        heuristics.push('Domain name contains sensitive verification keywords often used in brand impersonation.');
        riskScore += 30;
      }

      unknowns.push('Domain registration owner identity could not be independently verified.');
    } else {
      facts.push(`Submitted text length: ${input.length} characters.`);

      const text = input.toLowerCase();
      if (text.includes('urgent') || text.includes('suspended') || text.includes('immediately') || text.includes('24 hours')) {
        heuristics.push('Urgency and deadline pressure tactics detected in text.');
        riskScore += 25;
      }

      if (text.includes('otp') || text.includes('pin') || text.includes('password') || text.includes('cvv')) {
        heuristics.push('Sensitive credential or PIN request phrases detected.');
        riskScore += 35;
      }
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    const result: IntelligenceAnalysisResult = {
      analysisType: inputType as any,
      riskScore,
      riskLevel: evaluateRiskLevel(riskScore),
      confidenceLevel,
      explainability: {
        facts,
        heuristics,
        externalIntelligence: externalIntel,
        unknowns,
        limitations,
      },
      evidence: [...facts, ...heuristics],
      recommendedActions:
        riskScore > 50
          ? ['Do not click unverified links or enter credentials.', 'Verify through official phone numbers or mobile apps directly.']
          : ['Exercise standard web hygiene and ensure 2FA is active.'],
      timestamp: new Date().toISOString(),
    };

    return createApiResponse({
      data: result,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'X-Scan Intelligence Heuristic Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to complete X-Scan analysis.' },
      status: 500,
    });
  }
}
