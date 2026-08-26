import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawHeaders = '' } = body;

    if (!rawHeaders || typeof rawHeaders !== 'string' || rawHeaders.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Raw email headers string is required for forensics analysis.' },
        status: 400,
      });
    }

    const headersText = rawHeaders.toLowerCase();
    const findings: string[] = [];
    const evidence: string[] = [];
    let riskScore = 15;

    // 1. Received Hops Count
    const receivedMatches = rawHeaders.match(/^Received:/gmi) || [];
    evidence.push(`Received Hops Count: ${receivedMatches.length}`);

    // 2. SPF Results
    if (headersText.includes('spf=pass')) {
      findings.push('SPF Authentication Result: PASS');
    } else if (headersText.includes('spf=fail') || headersText.includes('spf=softfail')) {
      riskScore += 30;
      findings.push('SPF Authentication Failure Detected (spf=fail/softfail)');
      evidence.push('Received-SPF / Authentication-Results indicates SPF validation failure.');
    }

    // 3. DKIM Results
    if (headersText.includes('dkim=pass')) {
      findings.push('DKIM Signature Result: PASS');
    } else if (headersText.includes('dkim=fail')) {
      riskScore += 25;
      findings.push('DKIM Signature Failure Detected');
    }

    // 4. DMARC Results
    if (headersText.includes('dmarc=pass')) {
      findings.push('DMARC Alignment Result: PASS');
    } else if (headersText.includes('dmarc=fail')) {
      riskScore += 30;
      findings.push('DMARC Alignment Failure Detected');
    }

    // 5. Reply-To Mismatch
    const fromMatch = rawHeaders.match(/^From:\s*(.+)$/mi);
    const replyToMatch = rawHeaders.match(/^Reply-To:\s*(.+)$/mi);
    let replyToMismatch = false;

    if (fromMatch && replyToMatch) {
      evidence.push(`From Header: ${fromMatch[1].trim()}`);
      evidence.push(`Reply-To Header: ${replyToMatch[1].trim()}`);
      if (!fromMatch[1].includes(replyToMatch[1])) {
        replyToMismatch = true;
        riskScore += 25;
        findings.push('Reply-To Mismatch Detected (Lure address differs from From address)');
      }
    }

    riskScore = Math.min(100, riskScore);

    const technicalExplanation = `Forensics evaluation parsed ${receivedMatches.length} Received hop(s). SPF/DKIM/DMARC status flags evaluated alongside header From/Reply-To alignment.`;
    const simpleExplanation =
      riskScore > 50
        ? 'Suspicious indicators detected in email headers! The sender address or authentication check failed, meaning this email may be impersonating a real company.'
        : 'The email headers appear consistent with standard mail server authentication rules.';

    return createApiResponse({
      data: {
        riskScore,
        riskRating: riskScore >= 60 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW',
        technicalExplanation,
        simpleExplanation,
        findings,
        evidence,
        confidenceLevel: 'HIGH',
        analysisLimitations: 'Forensics analysis relies on submitted header text headers without validating destination inbox server logs.',
        evaluatedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Email Header Forensics Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to complete Email Header Forensics analysis.' },
      status: 500,
    });
  }
}
