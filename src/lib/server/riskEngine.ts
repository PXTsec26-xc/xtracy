/**
 * XTRACY Explainable Risk Scoring Engine
 * Evaluates indicator findings into an explainable 0-100 risk score and strict production verdicts.
 */

export type RiskVerdict =
  | 'Critical Risk'
  | 'High Risk'
  | 'Elevated Risk'
  | 'Suspicious'
  | 'Low Risk Indicators'
  | 'Insufficient Evidence';

export interface DetailedIndicatorFactor {
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  points: number;
  source: 'Local Heuristic Engine' | 'External Threat Intelligence';
  technicalExplanation: string;
  fraudAssociationRationale: string;
}

export interface ExplainableRiskOutput {
  riskScore: number; // 0 to 100
  verdict: RiskVerdict;
  verdictDescription: string;
  factors: DetailedIndicatorFactor[];
  whyThisResult: string[];
  disclaimer: string;
}

export const OFFICIAL_LEGAL_DISCLAIMER =
  'XTRACY automated analysis provides evidence-based risk indicators to assist user decision-making. It does not replace independent forensic verification, official police complaints, or administrative verification.';

export function calculateExplainableRisk(
  factors: DetailedIndicatorFactor[],
  initialScore = 10
): ExplainableRiskOutput {
  let score = initialScore;

  for (const f of factors) {
    score += f.points;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let verdict: RiskVerdict = 'Low Risk Indicators';
  let verdictDescription = 'No significant high-risk scam or phishing indicators identified in submitted target.';

  if (finalScore >= 85) {
    verdict = 'Critical Risk';
    verdictDescription = 'Multiple severe phishing or scam indicators identified. Immediate defensive action recommended.';
  } else if (finalScore >= 70) {
    verdict = 'High Risk';
    verdictDescription = 'High-risk brand impersonation, urgency, or credential harvesting lure detected.';
  } else if (finalScore >= 50) {
    verdict = 'Elevated Risk';
    verdictDescription = 'Suspicious structural or keyword patterns detected requiring user caution.';
  } else if (finalScore >= 35) {
    verdict = 'Suspicious';
    verdictDescription = 'Moderate risk indicators present. Independent verification recommended before proceeding.';
  } else if (finalScore < 10) {
    verdict = 'Insufficient Evidence';
    verdictDescription = 'Target provided does not contain sufficient technical indicators for automated scoring.';
  }

  const whyThisResult = factors.map(
    (f) => `[${f.severity}] ${f.name} (+${f.points} pts): ${f.technicalExplanation}`
  );

  return {
    riskScore: finalScore,
    verdict,
    verdictDescription,
    factors,
    whyThisResult,
    disclaimer: OFFICIAL_LEGAL_DISCLAIMER,
  };
}
