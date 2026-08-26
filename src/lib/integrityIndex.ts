/**
 * XTRACY Integrity Index™ & CaseReadiness™ Engine
 * Deterministic evidence health scoring and readiness assessment.
 */

import type { EvidenceItem } from './evidencePulse';
import type { CaseSealManifest } from './caseSeal';

export interface IntegrityIndexBreakdown {
  totalScore: number; // 0 to 100
  evidenceHashScore: number; // Max 40
  chainHealthScore: number; // Max 20
  metadataScore: number; // Max 15
  timelineScore: number; // Max 10
  caseSealScore: number; // Max 10
  anomalyScore: number; // Max 5
  formulaExplanation: string[];
}

export interface CaseReadinessResult {
  status: 'READY' | 'REVIEW_REQUIRED';
  readinessScore: number; // 0 to 100
  passedChecks: string[];
  attentionItems: string[];
}

export function calculateIntegrityIndex(
  items: EvidenceItem[],
  caseSeal?: CaseSealManifest | null
): IntegrityIndexBreakdown {
  if (!items || items.length === 0) {
    return {
      totalScore: 100,
      evidenceHashScore: 40,
      chainHealthScore: 20,
      metadataScore: 15,
      timelineScore: 10,
      caseSealScore: 10,
      anomalyScore: 5,
      formulaExplanation: ['No evidence items recorded. Baseline health 100/100.'],
    };
  }

  const total = items.length;

  // 1. Evidence Hash Verification (40%)
  const verifiedHashes = items.filter((i) => i.verificationStatus === 'VERIFIED').length;
  const evidenceHashScore = Math.round((verifiedHashes / total) * 40);

  // 2. Chain Health (20%)
  let chainIntact = true;
  for (let i = 1; i < items.length; i++) {
    if (items[i].previousRecordHash !== items[i - 1].currentRecordHash && items[i].previousRecordHash !== items[i - 1].manifestHash) {
      chainIntact = false;
      break;
    }
  }
  const chainHealthScore = chainIntact ? 20 : 0;

  // 3. Metadata Completeness (15%)
  const completeMetadata = items.filter(
    (i) => i.incidentTimestamp && i.platform && i.description
  ).length;
  const metadataScore = Math.round((completeMetadata / total) * 15);

  // 4. Timeline Consistency (10%)
  let timelineConsistent = true;
  for (let i = 1; i < items.length; i++) {
    const prevTime = new Date(items[i - 1].incidentTimestamp).getTime();
    const currTime = new Date(items[i].incidentTimestamp).getTime();
    if (!isNaN(prevTime) && !isNaN(currTime) && currTime < prevTime) {
      timelineConsistent = false;
      break;
    }
  }
  const timelineScore = timelineConsistent ? 10 : 5;

  // 5. CaseSeal Verification (10%)
  const caseSealScore = caseSeal && caseSeal.chainStatus === 'INTACT' ? 10 : caseSeal ? 5 : 0;

  // 6. Anomaly Resolution (5%)
  const anomalyCount = items.filter((i) => i.verificationStatus === 'MISMATCH').length;
  const anomalyScore = anomalyCount === 0 ? 5 : 0;

  const totalScore = Math.min(
    100,
    evidenceHashScore +
      chainHealthScore +
      metadataScore +
      timelineScore +
      caseSealScore +
      anomalyScore
  );

  return {
    totalScore,
    evidenceHashScore,
    chainHealthScore,
    metadataScore,
    timelineScore,
    caseSealScore,
    anomalyScore,
    formulaExplanation: [
      `Evidence Fingerprints: ${evidenceHashScore}/40 (${verifiedHashes}/${total} verified)`,
      `Chain Continuity: ${chainHealthScore}/20 (${chainIntact ? 'INTACT' : 'BROKEN'})`,
      `Metadata Completeness: ${metadataScore}/15 (${completeMetadata}/${total} complete)`,
      `Timeline Order: ${timelineScore}/10 (${timelineConsistent ? 'Consistent' : 'Out of Order'})`,
      `CaseSeal Snapshot: ${caseSealScore}/10 (${caseSeal ? 'Recorded' : 'Missing'})`,
      `Anomaly Resolution: ${anomalyScore}/5 (${anomalyCount} mismatches)`,
    ],
  };
}

export function evaluateCaseReadiness(
  items: EvidenceItem[],
  caseSeal?: CaseSealManifest | null
): CaseReadinessResult {
  const passed: string[] = [];
  const attention: string[] = [];

  if (!items || items.length === 0) {
    return {
      status: 'REVIEW_REQUIRED',
      readinessScore: 0,
      passedChecks: [],
      attentionItems: ['No evidence records indexed in case dossier.'],
    };
  }

  passed.push(`${items.length} evidence records indexed`);

  const mismatches = items.filter((i) => i.verificationStatus === 'MISMATCH').length;
  if (mismatches === 0) {
    passed.push('All evidence file SHA-256 fingerprints verified');
  } else {
    attention.push(`${mismatches} evidence item(s) have integrity mismatches`);
  }

  const missingTimestamps = items.filter((i) => !i.incidentTimestamp).length;
  if (missingTimestamps === 0) {
    passed.push('All incident timestamps provided');
  } else {
    attention.push(`${missingTimestamps} record(s) missing incident timestamps`);
  }

  if (caseSeal) {
    passed.push(`CaseSeal Version #${caseSeal.snapshotVersion} recorded`);
  } else {
    attention.push('CaseSeal snapshot not yet generated for this case');
  }

  const readinessScore = Math.max(0, 100 - attention.length * 20);

  return {
    status: attention.length === 0 ? 'READY' : 'REVIEW_REQUIRED',
    readinessScore,
    passedChecks: passed,
    attentionItems: attention,
  };
}
