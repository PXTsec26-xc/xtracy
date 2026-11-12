import { randomBytes } from 'crypto';
import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';
import { IntelligenceAnalysisResult, evaluateRiskLevel } from '@/lib/server/intelligenceEngine';
import { validateUrlForSSRFAsync } from '@/lib/ssrfProtection';
import { nexusCasesStore } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';

interface NexusCaseRecord {
  caseId: string;
  title: string;
  analysisType: string;
  status: 'ANALYZED' | 'INVESTIGATING' | 'RESOLVED';
  inputPayload: string;
  result: IntelligenceAnalysisResult;
  createdAt: string;
}

function resolveScopedBucketKey(req: NextRequest, authenticatedUserId?: string): string | null {
  if (authenticatedUserId) return `user:${authenticatedUserId}`;
  const callerSession = req.headers.get('x-xtracy-guest-id')?.trim() || '';
  if (/^[a-zA-Z0-9_-]{24,64}$/.test(callerSession)) {
    return `guest:${callerSession}`;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'nexus-cases-get', 40);
  if (rateErr) return rateErr;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);
  const bucketKey = resolveScopedBucketKey(req, user?.id);

  // Never expose a shared guest-session store across anonymous callers
  const userCases = bucketKey ? (nexusCasesStore.get(bucketKey) as NexusCaseRecord[]) || [] : [];

  return createApiResponse({
    data: userCases,
    dataTrust: {
      status: 'LOCAL',
      sourceName: 'XTRACY NEXUS Scoped Runtime Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'nexus-cases-post', 20);
  if (rateErr) return rateErr;

  try {
    const token = extractBearerToken(req);
    const user = await getUserBySessionToken(token);
    const bucketKey = resolveScopedBucketKey(req, user?.id) || `ephemeral:${randomBytes(16).toString('hex')}`;

    const { data: body, error: parseErr } = await parseBoundedJsonBody<{
      title?: string;
      analysisType?: string;
      inputPayload?: string;
    }>(req, 16384);
    if (parseErr) return parseErr;

    const { title, analysisType = 'URL', inputPayload = '' } = body || {};

    if (!inputPayload || typeof inputPayload !== 'string' || inputPayload.length > 5000) {
      return createApiResponse({
        error: {
          code: 'BAD_REQUEST',
          message: 'A valid input payload (max 5,000 characters) is required to open a NEXUS Case.',
        },
        status: 400,
      });
    }

    const caseId = `NEXUS-${randomBytes(4).toString('hex').toUpperCase()}`;

    const facts: string[] = [];
    const heuristics: string[] = [];
    const externalIntel: string[] = [];
    const unknowns: string[] = ['Live external breach or proprietary threat-feed correlation was not queried locally.'];
    const limitations: string[] = [
      'NEXUS triage scores structural URL and text indicators locally. Absence of flags does not prove safety.',
      'Always verify sender identity through independent out-of-band channels.',
    ];

    let riskScore = 15;

    if (analysisType === 'URL') {
      const ssrfCheck = await validateUrlForSSRFAsync(inputPayload);
      if (!ssrfCheck.allowed) {
        return createApiResponse({
          error: {
            code: 'SSRF_RESTRICTED',
            message: ssrfCheck.reason || 'Target URL restricted by SSRF protection policies.',
          },
          status: 400,
        });
      }

      facts.push(`Target URL passed syntax and public-network SSRF filter: ${ssrfCheck.normalizedUrl}`);
      const parsed = new URL(ssrfCheck.normalizedUrl!);
      if (parsed.protocol === 'https:') {
        facts.push('HTTPS scheme specified (live TLS handshake requires SSL Inspector).');
      } else {
        heuristics.push('Plain HTTP connection specified (unencrypted transport).');
        riskScore += 30;
      }
      if (parsed.hostname.includes('xn--')) {
        heuristics.push('Punycode IDN label detected in hostname (homograph risk).');
        riskScore += 25;
      }
    } else {
      facts.push(`Input payload received (${inputPayload.length} chars).`);
      if (/(otp|urgent|verify your account|suspended|wire transfer|gift card)/i.test(inputPayload)) {
        heuristics.push('Urgency tactics or sensitive credential/payment lure keywords detected.');
        riskScore += 40;
      }
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    const analysisResult: IntelligenceAnalysisResult = {
      caseId,
      analysisType: analysisType as any,
      riskScore,
      riskLevel: evaluateRiskLevel(riskScore),
      confidenceLevel: 'MODERATE',
      explainability: {
        facts,
        heuristics,
        externalIntelligence: externalIntel,
        unknowns,
        limitations,
      },
      evidence: [...facts, ...heuristics],
      recommendedActions: [
        'Do not click unverified links or share credentials / one-time passcodes.',
        'Run Web Header Analyzer or PhishLens for deeper structural inspection.',
      ],
      timestamp: new Date().toISOString(),
    };

    const newCase: NexusCaseRecord = {
      caseId,
      title: (typeof title === 'string' && title.trim().slice(0, 120)) || `Case Triage (${analysisType})`,
      analysisType,
      status: 'ANALYZED',
      inputPayload,
      result: analysisResult,
      createdAt: new Date().toISOString(),
    };

    if (!bucketKey.startsWith('ephemeral:')) {
      const existing = (nexusCasesStore.get(bucketKey) as NexusCaseRecord[]) || [];
      nexusCasesStore.set(bucketKey, [newCase, ...existing].slice(0, 50));
    }

    return createApiResponse({
      data: newCase,
      dataTrust: {
        status: 'LOCAL',
        sourceName: 'XTRACY NEXUS Heuristic Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create NEXUS Case triage record.' },
      status: 500,
    });
  }
}
