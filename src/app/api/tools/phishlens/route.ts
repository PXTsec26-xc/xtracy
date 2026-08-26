import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { analyzePhishLensMessage } from '@/lib/server/textAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = '' } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Content string is required for PhishLens analysis.' },
        status: 400,
      });
    }

    const analysis = analyzePhishLensMessage(content);

    return createApiResponse({
      data: {
        riskScore: analysis.riskScore,
        riskLevel: analysis.verdict === 'Critical Risk Signals' || analysis.verdict === 'High Risk Signals' ? 'HIGH' : analysis.verdict === 'Moderate Risk Signals' ? 'MEDIUM' : 'LOW',
        verdict: analysis.verdict,
        analysisConfidence: analysis.analysisConfidence,
        detectedTactics: analysis.detectedTactics,
        factors: analysis.factors,
        beginnerExplanation: analysis.beginnerExplanation,
        whatToVerify: analysis.whatToVerify,
        analyzedAt: analysis.analyzedAt,
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY PhishLens Social Engineering Analyzer v2.1',
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
