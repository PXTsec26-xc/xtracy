import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { IntelligenceAnalysisResult, evaluateRiskLevel } from '@/lib/server/intelligenceEngine';
import { validateUrlForSSRF } from '@/lib/ssrfProtection';

interface NexusCaseRecord {
  caseId: string;
  title: string;
  analysisType: string;
  status: 'ANALYZED' | 'INVESTIGATING' | 'RESOLVED';
  inputPayload: string;
  result: IntelligenceAnalysisResult;
  createdAt: string;
}

// Thread-safe memory store fallback for NEXUS cases
const memoryNexusCasesStore: Map<string, NexusCaseRecord[]> = new Map();

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);
  const userId = user?.id || 'guest-session';

  const userCases = memoryNexusCasesStore.get(userId) || [];

  return createApiResponse({
    data: userCases,
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY NEXUS Case Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const user = await getUserBySessionToken(token);
    const userId = user?.id || 'guest-session';

    const body = await req.json();
    const { title, analysisType = 'URL', inputPayload = '' } = body;

    if (!inputPayload || typeof inputPayload !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Input payload is required to open a NEXUS Case.' },
        status: 400,
      });
    }

    const caseId = `NEXUS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    const facts: string[] = [];
    const heuristics: string[] = [];
    const externalIntel: string[] = [];
    const unknowns: string[] = [];
    const limitations: string[] = [
      'NEXUS investigation is based on automated indicators and heuristic analysis.',
      'Always confirm identity through out-of-band channels before proceeding.',
    ];

    let riskScore = 20;

    if (analysisType === 'URL') {
      const ssrfCheck = validateUrlForSSRF(inputPayload);
      if (!ssrfCheck.allowed) {
        return createApiResponse({
          error: { code: 'SSRF_RESTRICTED', message: ssrfCheck.reason || 'Target URL restricted by SSRF protection policies.' },
          status: 400,
        });
      }

      facts.push(`Target URL validated: ${ssrfCheck.normalizedUrl}`);
      const parsed = new URL(ssrfCheck.normalizedUrl!);
      if (parsed.protocol === 'https:') {
        facts.push('HTTPS Transport Layer Security detected.');
      } else {
        heuristics.push('Plain HTTP connection detected (No TLS encryption).');
        riskScore += 25;
      }
    } else {
      facts.push(`Input payload received (${inputPayload.length} chars).`);
      if (inputPayload.toLowerCase().includes('otp') || inputPayload.toLowerCase().includes('urgent')) {
        heuristics.push('Urgency tactics or sensitive credential keywords detected in payload.');
        riskScore += 35;
      }
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    const analysisResult: IntelligenceAnalysisResult = {
      caseId,
      analysisType: analysisType as any,
      riskScore,
      riskLevel: evaluateRiskLevel(riskScore),
      confidenceLevel: 'HIGH',
      explainability: {
        facts,
        heuristics,
        externalIntelligence: externalIntel,
        unknowns,
        limitations,
      },
      evidence: [...facts, ...heuristics],
      recommendedActions: [
        'Do not click unverified links or enter passwords.',
        'Ask XTRACY AI Copilot for a breakdown of this case.',
      ],
      timestamp: new Date().toISOString(),
    };

    const newCase: NexusCaseRecord = {
      caseId,
      title: title || `Case Investigation for ${analysisType}`,
      analysisType,
      status: 'ANALYZED',
      inputPayload,
      result: analysisResult,
      createdAt: new Date().toISOString(),
    };

    const existing = memoryNexusCasesStore.get(userId) || [];
    memoryNexusCasesStore.set(userId, [newCase, ...existing]);

    return createApiResponse({
      data: newCase,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY NEXUS Intelligence Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create NEXUS Case investigation.' },
      status: 500,
    });
  }
}
