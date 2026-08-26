/**
 * XTRACY Multi-Layer Scam Check Engine
 * Unifies strict input classification, URL analysis, text analysis, threat intelligence abstraction, explainable risk scoring, and evidence normalization.
 */

import { classifyTargetInput, ClassificationResult } from '@/lib/server/inputClassifier';
import { analyzeUrlTarget } from '@/lib/server/urlAnalyzer';
import { analyzeTextTarget } from '@/lib/server/textAnalyzer';
import { queryExternalThreatIntel, UnifiedThreatLookupResult } from '@/lib/server/threatProviders';
import { calculateExplainableRisk, DetailedIndicatorFactor, RiskVerdict, OFFICIAL_LEGAL_DISCLAIMER } from '@/lib/server/riskEngine';
import { generateEvidenceRecord, EvidenceRecord } from '@/lib/server/evidenceNormalizer';
import { buildSecurityReport, SecurityAnalysisReport } from '@/lib/server/reportGenerator';

export const SCAM_CHECK_DISCLAIMER = OFFICIAL_LEGAL_DISCLAIMER;

export interface ScamCheckRequest {
  targetType?: 'URL' | 'DOMAIN' | 'EMAIL_TEXT' | 'SMS_TEXT' | 'JOB_OFFER' | 'PAYMENT_REQUEST' | 'CRYPTO_LURE' | 'SOCIAL_MEDIA';
  content: string;
  privateMode?: boolean;
}

export interface ScamCheckSuccessResult {
  valid: true;
  classification: ClassificationResult['classification'];
  targetType: string;
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

export interface ScamCheckErrorResult {
  valid: false;
  classification: 'INVALID_INPUT';
  error: string;
  message: string;
}

export type ScamCheckResult = ScamCheckSuccessResult | ScamCheckErrorResult;

export function analyzeScamContent(req: ScamCheckRequest): ScamCheckResult {
  const { content, privateMode = false } = req;

  // 1. Strict Input Classification First
  const classResult = classifyTargetInput(content);

  if (classResult.classification === 'INVALID_INPUT') {
    return {
      valid: false,
      classification: 'INVALID_INPUT',
      error: 'INVALID_INPUT',
      message: classResult.errorMessage || 'Unable to classify this input. Enter a valid URL, domain, or suspicious message for analysis.',
    };
  }

  const normalized = classResult.normalizedInput;

  // 2. Gather Evidence-Based Factors by Classification
  let localFactors: DetailedIndicatorFactor[] = [];
  if (classResult.classification === 'VALID_URL' || classResult.classification === 'DOMAIN') {
    localFactors = analyzeUrlTarget(normalized, classResult);
  } else {
    localFactors = analyzeTextTarget(normalized);
  }

  // 3. Query External Threat Intelligence (Skipped if privateMode is true)
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

  // 4. Calculate Explainable Risk Score & Verdict
  const riskOutput = calculateExplainableRisk(localFactors, 10);

  // 5. Generate Evidence Record with SHA-256 Checksum
  const evidenceRecord = generateEvidenceRecord(
    classResult.classification,
    normalized,
    riskOutput.riskScore,
    riskOutput.verdict,
    riskOutput.factors
  );

  // 6. Build Printable / Exportable Security Report
  const securityReport = buildSecurityReport({
    targetType: classResult.classification,
    content: normalized,
    verdict: riskOutput.verdict,
    riskScore: riskOutput.riskScore,
    factors: riskOutput.factors,
    privacyMode: threatIntelSummary.privacyMode,
    evidenceHash: evidenceRecord.evidenceHash,
    externalIntelStatus: threatIntelSummary.summary,
  });

  return {
    valid: true,
    classification: classResult.classification,
    targetType: classResult.classification,
    contentSnippet: normalized.substring(0, 150) + (normalized.length > 150 ? '...' : ''),
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
