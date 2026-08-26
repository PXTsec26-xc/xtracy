/**
 * XTRACY Evidence Integrity Normalizer
 * Computes SHA-256 integrity checksums, Case IDs, and local vault records.
 * Explicitly distinguishes "Integrity Checksum" from "Legally Certified Court Evidence".
 */

import crypto from 'crypto';

export interface EvidenceRecord {
  caseId: string;
  analyzedAt: string;
  inputCategory: string;
  inputSnippet: string;
  riskScore: number;
  verdict: string;
  evidenceHash: string; // SHA-256 checksum
  engineVersion: string;
  integrityNotice: string;
}

export function generateEvidenceRecord(
  inputCategory: string,
  inputContent: string,
  riskScore: number,
  verdict: string,
  factors: any[]
): EvidenceRecord {
  const analyzedAt = new Date().toISOString();
  const caseId = `XTR-${Math.floor(100000 + Math.random() * 900000)}`;
  const engineVersion = 'XTRACY_NEXUS_ENGINE_v2.1';

  // Compute SHA-256 hash over normalized evidence payload
  const rawPayload = JSON.stringify({
    caseId,
    analyzedAt,
    inputCategory,
    inputContent,
    riskScore,
    verdict,
    factorsCount: factors.length,
    engineVersion,
  });

  const evidenceHash = crypto.createHash('sha256').update(rawPayload).digest('hex');

  const integrityNotice =
    'Integrity Checksum: SHA-256 hash guarantees data continuity and local tamper-detection. It does not constitute official police certification or court-admissible legal proof.';

  return {
    caseId,
    analyzedAt,
    inputCategory,
    inputSnippet: inputContent.substring(0, 150) + (inputContent.length > 150 ? '...' : ''),
    riskScore,
    verdict,
    evidenceHash,
    engineVersion,
    integrityNotice,
  };
}
