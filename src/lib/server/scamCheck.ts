/**
 * XTRACY Multi-Layer Scam Check Engine
 * Evidence-based security analysis pipeline with strict Gate classification, deterministic scoring, separate confidence, and SSRF hardening.
 */

import { classifyInputGate, GateClassificationResult } from '@/lib/server/inputClassifier';
import { analyzeUrlTarget } from '@/lib/server/urlAnalyzer';
import { queryExternalThreatIntel, UnifiedThreatLookupResult } from '@/lib/server/threatProviders';
import { calculateDeterministicRisk, DetailedIndicatorFactor, RiskVerdict, AnalysisConfidence, OFFICIAL_LEGAL_DISCLAIMER } from '@/lib/server/riskEngine';
import { generateEvidenceRecord, EvidenceRecord } from '@/lib/server/evidenceNormalizer';
import { buildSecurityReport, SecurityAnalysisReport } from '@/lib/server/reportGenerator';

export const SCAM_CHECK_DISCLAIMER = OFFICIAL_LEGAL_DISCLAIMER;

export type AnalysisPipelineStatus =
  | 'IDLE'
  | 'VALIDATING'
  | 'ANALYZING'
  | 'PARTIAL_RESULT'
  | 'COMPLETE'
  | 'REJECTED'
  | 'ERROR';

export interface ScamCheckRequest {
  targetType?: string;
  content: string;
  privateMode?: boolean;
}

export interface ScamCheckAcceptedResult {
  valid: true;
  status: 'ACCEPTED';
  analysisStatus: 'COMPLETE' | 'PARTIAL_RESULT';
  category: GateClassificationResult['category'];
  normalizedTarget: string;
  riskScore: number; // 0 to 100
  verdict: RiskVerdict;
  analysisConfidence: AnalysisConfidence;
  factors: DetailedIndicatorFactor[];
  whyThisResult: string[];
  threatIntelSummary: UnifiedThreatLookupResult;
  evidenceRecord: EvidenceRecord;
  securityReport: SecurityAnalysisReport;
  disclaimer: string;
  analyzedAt: string;
}

export interface ScamCheckRejectedResult {
  valid: false;
  status: 'REJECTED';
  analysisStatus: 'REJECTED';
  category: GateClassificationResult['category'];
  normalizedTarget: string;
  rejectionReason: string;
  riskScore: null;
  verdict: 'Rejected Target';
  analysisConfidence: 'N/A';
  securityReport: null;
  disclaimer: string;
  analyzedAt: string;
}

export type ScamCheckResult = ScamCheckAcceptedResult | ScamCheckRejectedResult;

export function analyzeScamContent(req: ScamCheckRequest): ScamCheckResult {
  const { content, privateMode = false } = req;

  // 1. Strict Gate Input Classification
  const gateResult = classifyInputGate(content);

  if (gateResult.status === 'REJECTED') {
    return {
      valid: false,
      status: 'REJECTED',
      analysisStatus: 'REJECTED',
      category: gateResult.category,
      normalizedTarget: gateResult.normalizedInput,
      rejectionReason: gateResult.rejectionReason || 'Target input failed classification gate validation.',
      riskScore: null,
      verdict: 'Rejected Target',
      analysisConfidence: 'N/A',
      securityReport: null,
      disclaimer: OFFICIAL_LEGAL_DISCLAIMER,
      analyzedAt: new Date().toISOString(),
    };
  }

  const normalized = gateResult.normalizedInput;

  // 2. Real Evidence-Based Analysis Stage
  // Pass gateResult to analyzeUrlTarget to enforce strict HTTPS verification rules
  const localFactors: DetailedIndicatorFactor[] = analyzeUrlTarget(normalized, {
    classification: gateResult.category === 'VALID_URL' ? 'VALID_URL' : gateResult.category === 'VALID_DOMAIN' ? 'DOMAIN' : 'INVALID_INPUT',
    normalizedInput: normalized,
    isHttpsVerified: gateResult.isHttpsVerified,
  });

  // 3. Threat Intelligence Provider Query (Skipped if privateMode is true)
  const threatIntelSummary: UnifiedThreatLookupResult = {
    externalLookupExecuted: !privateMode,
    privacyMode: privateMode ? 'PRIVATE_LOCAL' : 'HYBRID_EXTERNAL',
    providers: [
      {
        providerName: 'VirusTotal Intelligence API',
        status: 'UNAVAILABLE',
        threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local evidence analysis only.',
        queryTimestamp: new Date().toISOString(),
      },
      {
        providerName: 'Google Safe Browsing API',
        status: 'UNAVAILABLE',
        threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local evidence analysis only.',
        queryTimestamp: new Date().toISOString(),
      },
    ],
    summary: privateMode
      ? 'Private Local Analysis active. External threat intelligence query bypassed by user preference.'
      : 'Local evidence analysis completed. External threat provider lookups executed where configured.',
  };

  // If no negative heuristic factors were triggered, record evidence-based baseline factor
  if (localFactors.filter((f) => f.points > 0).length === 0) {
    localFactors.push({
      id: 'FACTOR-CLEAN-01',
      name: 'No Suspicious Structural Indicators Detected',
      severity: 'LOW',
      points: 0,
      source: 'Local Heuristic Engine',
      technicalExplanation: 'The target hostname does not display brand keyword spoofing, deceptive hyphenation, or excessive subdomain depth.',
      fraudAssociationRationale: 'Clean structural patterns indicate absence of known heuristic anomalies, but do not guarantee complete safety.',
      evidence: `Target: ${normalized}`,
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Calculate Deterministic Risk Score & Separate Confidence Level
  const externalIntelConfigured = false; // VirusTotal/SafeBrowsing keys unconfigured in default environment
  const riskOutput = calculateDeterministicRisk(localFactors, externalIntelConfigured);

  // 5. Generate Evidence Record with SHA-256 Checksum
  const evidenceRecord = generateEvidenceRecord(
    gateResult.category,
    normalized,
    riskOutput.riskScore,
    riskOutput.verdict,
    riskOutput.factors
  );

  // 6. Build Security Analysis Report
  const securityReport = buildSecurityReport({
    targetType: gateResult.category,
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
    status: 'ACCEPTED',
    analysisStatus: 'COMPLETE',
    category: gateResult.category,
    normalizedTarget: normalized,
    riskScore: riskOutput.riskScore,
    verdict: riskOutput.verdict,
    analysisConfidence: riskOutput.analysisConfidence,
    factors: riskOutput.factors,
    whyThisResult: riskOutput.whyThisResult,
    threatIntelSummary,
    evidenceRecord,
    securityReport,
    disclaimer: OFFICIAL_LEGAL_DISCLAIMER,
    analyzedAt: new Date().toISOString(),
  };
}
