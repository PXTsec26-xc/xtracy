/**
 * XTRACY Modular Intelligence Engine
 * Standardized explainability framework enforcing 6-part result separation:
 * 1. CONFIRMED FACT
 * 2. HEURISTIC INDICATOR
 * 3. EXTERNAL INTELLIGENCE
 * 4. AI INTERPRETATION
 * 5. UNKNOWN
 * 6. LIMITATION
 */

export interface IntelligenceExplainability {
  facts: string[];
  heuristics: string[];
  externalIntelligence: string[];
  aiInterpretation?: string;
  unknowns: string[];
  limitations: string[];
}

export interface IntelligenceAnalysisResult {
  caseId?: string;
  analysisType: 'URL' | 'EMAIL' | 'SMS' | 'FILE' | 'HEADER' | 'DOMAIN' | 'GENERAL';
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceLevel: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  explainability: IntelligenceExplainability;
  evidence: string[];
  recommendedActions: string[];
  timestamp: string;
}

export function evaluateRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

export function formatIntelligenceSummary(result: IntelligenceAnalysisResult): string {
  return `XTRACY Analysis Summary [Case: ${result.caseId || 'Direct'}]
Risk Score: ${result.riskScore}/100 (${result.riskLevel}) | Confidence: ${result.confidenceLevel}

CONFIRMED FACTS:
${result.explainability.facts.map((f) => `- ${f}`).join('\n') || '- None verified.'}

HEURISTIC INDICATORS:
${result.explainability.heuristics.map((h) => `- ${h}`).join('\n') || '- No suspicious heuristics detected.'}

LIMITATIONS:
${result.explainability.limitations.map((l) => `- ${l}`).join('\n')}
`;
}
