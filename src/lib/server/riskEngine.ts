/**
 * XTRACY Deterministic Risk Scoring & Confidence Engine
 * Evaluates evidence factors with traceable points, score clamping (0-100), and separate analysis confidence ratings.
 */

export type RiskVerdict =
  | 'Low Risk Signals'
  | 'Moderate Risk Signals'
  | 'High Risk Signals'
  | 'Critical Risk Signals'
  | 'Rejected Target';

export type AnalysisConfidence = 'LOW' | 'MEDIUM' | 'HIGH' | 'N/A';

export interface DetailedIndicatorFactor {
  id?: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  points: number;
  source: string;
  technicalExplanation: string;
  fraudAssociationRationale: string;
  evidence?: string;
  timestamp?: string;
}

export interface DeterministicRiskOutput {
  riskScore: number;
  verdict: RiskVerdict;
  analysisConfidence: AnalysisConfidence;
  factors: DetailedIndicatorFactor[];
  whyThisResult: string[];
  limitationsNotice: string;
}

export function calculateDeterministicRisk(
  factors: DetailedIndicatorFactor[],
  externalIntelAvailable = false
): DeterministicRiskOutput {
  // Score begins only from accumulated factor points (no hardcoded default score)
  let rawScore = 0;

  for (const factor of factors) {
    rawScore += factor.points;
  }

  // Clamp final score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine Risk Verdict Level based on deterministic score thresholds
  let verdict: RiskVerdict = 'Low Risk Signals';
  if (clampedScore >= 75) {
    verdict = 'Critical Risk Signals';
  } else if (clampedScore >= 50) {
    verdict = 'High Risk Signals';
  } else if (clampedScore >= 25) {
    verdict = 'Moderate Risk Signals';
  } else {
    verdict = 'Low Risk Signals';
  }

  // Calculate Analysis Confidence independently from risk
  let analysisConfidence: AnalysisConfidence = 'LOW';
  const totalFactorsCount = factors.length;

  if (externalIntelAvailable && totalFactorsCount >= 3) {
    analysisConfidence = 'HIGH';
  } else if (totalFactorsCount >= 2) {
    analysisConfidence = 'MEDIUM';
  } else {
    analysisConfidence = 'LOW';
  }

  const whyThisResult = factors.map(
    (f) => `[${f.severity}] ${f.name} (${f.points > 0 ? '+' : ''}${f.points} pts): ${f.technicalExplanation}`
  );

  const limitationsNotice = externalIntelAvailable
    ? 'Analysis incorporates local heuristic evaluation and configured threat intelligence providers.'
    : 'Local heuristic evaluation active. External threat intelligence providers unconfigured or unavailable; confidence rating reflects local scope.';

  return {
    riskScore: clampedScore,
    verdict,
    analysisConfidence,
    factors,
    whyThisResult,
    limitationsNotice,
  };
}

export const OFFICIAL_LEGAL_DISCLAIMER =
  'XTRACY Security Analysis provides deterministic diagnostic indicators and risk scoring for defensive decision support. It does not replace independent security audits or court-certified forensic analysis.';
