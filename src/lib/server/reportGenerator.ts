/**
 * XTRACY Automated Security Analysis Report Generator
 * Formats printable / exportable analysis documents with Report ID, timestamp, technical evidence, and official disclaimers.
 */

export interface SecurityAnalysisReport {
  reportId: string;
  generatedAt: string;
  platformVersion: string;
  targetType: string;
  targetInputSnippet: string;
  verdict: string;
  riskScore: number; // 0 to 100
  factors: {
    name: string;
    severity: string;
    points: number;
    source: string;
    technicalExplanation: string;
  }[];
  externalIntelStatus: string;
  privacyMode: string;
  integrityHash: string;
  defensiveRecommendations: string[];
  disclaimerNotice: string;
}

export function buildSecurityReport(payload: {
  targetType: string;
  content: string;
  verdict: string;
  riskScore: number;
  factors: any[];
  privacyMode: string;
  evidenceHash: string;
  externalIntelStatus: string;
}): SecurityAnalysisReport {
  const generatedAt = new Date().toISOString();
  const reportId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;

  const defensiveRecommendations: string[] = [];

  if (payload.riskScore >= 50) {
    defensiveRecommendations.push('Do not click additional links or enter account credentials.');
    defensiveRecommendations.push('Do not transfer funds, gift cards, or cryptocurrency.');
    defensiveRecommendations.push('Preserve screenshots and original headers/SMS for evidence logging.');
    defensiveRecommendations.push('Contact the official institution directly via independently verified channels.');
    defensiveRecommendations.push('If financial information was exposed, notify your bank or card issuer immediately.');
  } else {
    defensiveRecommendations.push('Maintain standard security posture: verify SSL certificates and sender addresses.');
    defensiveRecommendations.push('Enable Multi-Factor Authentication (MFA) across sensitive accounts.');
  }

  return {
    reportId,
    generatedAt,
    platformVersion: 'XTRACY NEXUS 2.1 — Production Platform',
    targetType: payload.targetType,
    targetInputSnippet: payload.content.substring(0, 200) + (payload.content.length > 200 ? '...' : ''),
    verdict: payload.verdict,
    riskScore: payload.riskScore,
    factors: payload.factors.map((f) => ({
      name: f.name || f.indicator,
      severity: f.severity || f.weight || 'MEDIUM',
      points: f.points || (f.weight === 'HIGH' ? 25 : 15),
      source: f.source || 'Local Heuristic Engine',
      technicalExplanation: f.technicalExplanation || f.reasoning || 'Diagnostic indicator pattern identified.',
    })),
    externalIntelStatus: payload.externalIntelStatus,
    privacyMode: payload.privacyMode,
    integrityHash: payload.evidenceHash,
    defensiveRecommendations,
    disclaimerNotice:
      'XTRACY Automated Security Analysis Report is an evidence-based risk diagnostic generated for security awareness and evidence organization. It is not an official police report, court certification, or government enforcement action.',
  };
}
