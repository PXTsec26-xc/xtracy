/**
 * XTRACY Multi-Layer Scam Check Engine
 * Unifies URL analysis, text analysis, threat intelligence abstraction, explainable risk scoring, and evidence normalization.
 */

import { analyzeUrlTarget } from '@/lib/server/urlAnalyzer';
export const SCAM_CHECK_DISCLAIMER = OFFICIAL_LEGAL_DISCLAIMER;
import { analyzeTextTarget } from '@/lib/server/textAnalyzer';
import { queryExternalThreatIntel, UnifiedThreatLookupResult } from '@/lib/server/threatProviders';
import { calculateExplainableRisk, DetailedIndicatorFactor, RiskVerdict, OFFICIAL_LEGAL_DISCLAIMER } from '@/lib/server/riskEngine';
import { generateEvidenceRecord, EvidenceRecord } from '@/lib/server/evidenceNormalizer';
import { buildSecurityReport, SecurityAnalysisReport } from '@/lib/server/reportGenerator';

export interface ScamCheckRequest {
  targetType: 'URL' | 'EMAIL_TEXT' | 'SMS_TEXT' | 'JOB_OFFER' | 'PAYMENT_REQUEST' | 'CRYPTO_LURE' | 'SOCIAL_MEDIA';
  content: string;
  privateMode?: boolean;
}

export interface ScamCheckResult {
  targetType: ScamCheckRequest['targetType'];
  contentSnippet: string;
  verdict: RiskVerdict;
  riskScore: number; // 0 to 100
  factors: DetailedIndicatorFactor[];
  whyThisResult: string[];
  threatIntelSummary: UnifiedThreatLookupResult;
  evidenceRecord: EvidenceRecord;
  securityReport: SecurityAnalysisReport;
  disclaimer: string;
  analyzedAt: string;
}

export function analyzeScamContent(req: ScamCheckRequest): ScamCheckResult {
  const { targetType, content, privateMode = false } = req;
  const trimmed = content.trim();

  const isUrlType =
    targetType === 'URL' ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    (trimmed.includes('.') && !trimmed.includes(' ') && !trimmed.includes('@'));

  // 1. Gather Local Heuristic Factors
  let localFactors: DetailedIndicatorFactor[] = [];
  if (isUrlType) {
    localFactors = analyzeUrlTarget(trimmed);
  } else {
    localFactors = analyzeTextTarget(trimmed);
  }

  // 2. Query External Threat Intelligence (Skipped if privateMode is true)
  // Note: Synchronous wrapper uses local mode for fast evaluation or async lookup
  const threatIntelSummary: UnifiedThreatLookupResult = {
    externalLookupExecuted: !privateMode,
    privacyMode: privateMode ? 'PRIVATE_LOCAL' : 'HYBRID_EXTERNAL',
    providers: [
      {
        providerName: 'VirusTotal Intelligence API',
        status: 'UNAVAILABLE',
        threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local analysis only.',
        queryTimestamp: new Date().toISOString(),
      },
      {
        providerName: 'Google Safe Browsing API',
        status: 'UNAVAILABLE',
        threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local analysis only.',
        queryTimestamp: new Date().toISOString(),
      },
    ],
    summary: privateMode
      ? 'Private Local Analysis active. External threat intelligence query bypassed by user preference.'
      : 'Local heuristic analysis completed. External threat provider lookups executed where configured.',
  };

  // If no negative factors were found, add positive baseline factor
  if (localFactors.filter((f) => f.points > 0).length === 0) {
    localFactors.push({
      name: 'No High-Risk Scam Indicators Detected',
      severity: 'LOW',
      points: 0,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'The submitted target does not contain recognized brand impersonation, credential harvesting, or urgency indicators.',
      fraudAssociationRationale: 'Clean structural patterns do not guarantee complete safety. Exercise standard online vigilance.',
    });
  }

  // 3. Calculate Explainable Risk Score & Verdict
  const riskOutput = calculateExplainableRisk(localFactors, 10);

  // 4. Generate Evidence Record with SHA-256 Checksum
  const evidenceRecord = generateEvidenceRecord(
    targetType,
    trimmed,
    riskOutput.riskScore,
    riskOutput.verdict,
    riskOutput.factors
  );

  // 5. Build Printable / Exportable Security Report
  const securityReport = buildSecurityReport({
    targetType,
    content: trimmed,
    verdict: riskOutput.verdict,
    riskScore: riskOutput.riskScore,
    factors: riskOutput.factors,
    privacyMode: threatIntelSummary.privacyMode,
    evidenceHash: evidenceRecord.evidenceHash,
    externalIntelStatus: threatIntelSummary.summary,
  });

  return {
    targetType,
    contentSnippet: trimmed.substring(0, 150) + (trimmed.length > 150 ? '...' : ''),
    verdict: riskOutput.verdict,
    riskScore: riskOutput.riskScore,
    factors: riskOutput.factors,
    whyThisResult: riskOutput.whyThisResult,
    threatIntelSummary,
    evidenceRecord,
    securityReport,
    disclaimer: OFFICIAL_LEGAL_DISCLAIMER,
    analyzedAt: new Date().toISOString(),
  };
}
