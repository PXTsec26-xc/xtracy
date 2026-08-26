/**
 * XTRACY Trust & Result Integrity Engine
 * Classifies every platform output into standardized trust categories with verifiable metadata.
 */

export type TrustLabel =
  | 'LIVE VERIFIED'
  | 'LOCAL ANALYSIS'
  | 'HEURISTIC RISK INDICATOR'
  | 'USER-PROVIDED INFORMATION'
  | 'AI EXPLANATION'
  | 'UNABLE TO VERIFY'
  | 'PROVIDER UNAVAILABLE'
  | 'DEMONSTRATION DATA';

export interface IntegrityMetadata {
  trustLabel: TrustLabel;
  sourceName: string;
  methodology: string;
  queryTimestampUtc: string;
  confidenceScore: number; // 0 to 100
  dataFreshness: string;
  limitationsNotice: string;
  evidenceChecksum?: string;
}

export function createIntegrityMetadata(
  trustLabel: TrustLabel,
  sourceName: string,
  methodology: string,
  confidenceScore = 80,
  limitationsNotice = 'Automated diagnostic calculation. Independent verification recommended.',
  evidenceChecksum?: string
): IntegrityMetadata {
  return {
    trustLabel,
    sourceName,
    methodology,
    queryTimestampUtc: new Date().toISOString(),
    confidenceScore,
    dataFreshness: 'REALTIME_LOCAL',
    limitationsNotice,
    evidenceChecksum,
  };
}
