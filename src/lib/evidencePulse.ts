/**
 * XTRACY EvidencePulse™ — Cryptographic Evidence Continuity Engine
 * Integrates RFC 8785 JCS, SHA-256 hash chaining, sequence numbering, and tamper-evident verification.
 */

import { canonicalizeJson } from './rfc8785';

export interface EvidenceManifest {
  schemaVersion: '2.1.0';
  canonicalization: 'RFC-8785-JCS';
  hashAlgorithm: 'SHA-256';
  evidenceId: string;
  caseId: string;
  sequence: number;
  incidentTimestamp: string;
  acquiredAt: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileHash: string;
  previousRecordHash: string;
}

export interface EvidenceItem {
  id: string; // e.g. XTR-EVD-2026-001
  caseId: string;
  sequence: number;
  title: string;
  category: 'STALKING' | 'PHISHING' | 'HARASSMENT' | 'IMPERSONATION' | 'FRAUD' | 'SUSPICIOUS_COMMUNICATION' | 'OTHER';
  platform: string;
  description: string;
  incidentTimestamp: string; // User-provided incident date/time
  acquiredAt: string; // System record acquisition timestamp
  createdTimestamp?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  originalFileHash: string; // SHA-256 of file bytes
  currentFileHash: string; // Current SHA-256 of file bytes
  previousRecordHash: string; // Link to previous record
  manifestHash: string; // SHA-256 of RFC 8785 canonical manifest
  currentRecordHash: string; // Current overall record hash
  schemaVersion: '2.1.0';
  verificationStatus: 'VERIFIED' | 'MISMATCH' | 'UNVERIFIED';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    senderHandle?: string;
    urlTarget?: string;
  };
}

export interface IntegritySummary {
  totalItems: number;
  verifiedCount: number;
  hashChainIntact: boolean;
  missingMetadataCount: number;
  duplicateCount: number;
  anomalyCount: number;
  continuityScore: number; // 0 to 100
}

export interface AnomalyReport {
  evidenceId: string;
  issueType: 'SHA256_MISMATCH' | 'CHAIN_BROKEN' | 'TIMELINE_OUT_OF_ORDER' | 'MISSING_METADATA' | 'DUPLICATE_HASH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  expectedValue: string;
  currentValue: string;
  recommendation: string;
}

export const GENESIS_HASH = 'GENESIS_RECORD_0000000000000000000000000000000000000000000000000000000000000000';

export async function calculateSHA256(data: string | ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = typeof data === 'string' ? encoder.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function constructEvidenceManifest(item: {
  evidenceId: string;
  caseId: string;
  sequence: number;
  incidentTimestamp: string;
  acquiredAt: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileHash: string;
  previousRecordHash: string;
}): EvidenceManifest {
  return {
    schemaVersion: '2.1.0',
    canonicalization: 'RFC-8785-JCS',
    hashAlgorithm: 'SHA-256',
    evidenceId: item.evidenceId,
    caseId: item.caseId,
    sequence: item.sequence,
    incidentTimestamp: item.incidentTimestamp,
    acquiredAt: item.acquiredAt,
    fileName: item.fileName,
    mimeType: item.mimeType,
    fileSize: item.fileSize,
    fileHash: item.fileHash,
    previousRecordHash: item.previousRecordHash,
  };
}

export async function calculateManifestHash(manifest: EvidenceManifest): Promise<string> {
  const canonicalString = canonicalizeJson(manifest);
  return calculateSHA256(canonicalString);
}

export async function calculateRecordHash(item: EvidenceItem): Promise<string> {
  const recordObject = {
    id: item.id,
    caseId: item.caseId,
    sequence: item.sequence,
    manifestHash: item.manifestHash,
    previousRecordHash: item.previousRecordHash,
  };
  const canonicalString = canonicalizeJson(recordObject);
  return calculateSHA256(canonicalString);
}

export async function verifyEvidenceChain(items: EvidenceItem[]): Promise<{
  summary: IntegritySummary;
  anomalies: AnomalyReport[];
}> {
  if (!items || items.length === 0) {
    return {
      summary: {
        totalItems: 0,
        verifiedCount: 0,
        hashChainIntact: true,
        missingMetadataCount: 0,
        duplicateCount: 0,
        anomalyCount: 0,
        continuityScore: 100,
      },
      anomalies: [],
    };
  }

  const anomalies: AnomalyReport[] = [];
  let verifiedCount = 0;
  let missingMetadataCount = 0;
  let duplicateCount = 0;
  let hashChainIntact = true;

  const seenHashes = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 1. File Hash Consistency Check
    if (item.originalFileHash && item.currentFileHash) {
      if (item.originalFileHash === item.currentFileHash) {
        verifiedCount++;
      } else {
        anomalies.push({
          evidenceId: item.id,
          issueType: 'SHA256_MISMATCH',
          severity: 'CRITICAL',
          expectedValue: item.originalFileHash,
          currentValue: item.currentFileHash,
          recommendation: 'Integrity mismatch detected. Verify the original evidence source before relying on this copy.',
        });
      }
    } else {
      verifiedCount++;
    }

    // 2. Duplicate Hash Check
    if (item.originalFileHash) {
      if (seenHashes.has(item.originalFileHash)) {
        duplicateCount++;
        anomalies.push({
          evidenceId: item.id,
          issueType: 'DUPLICATE_HASH',
          severity: 'LOW',
          expectedValue: 'Unique SHA-256 fingerprint',
          currentValue: item.originalFileHash,
          recommendation: 'Duplicate file hash detected. Confirm if this is an intentional copy across incident entries.',
        });
      } else {
        seenHashes.add(item.originalFileHash);
      }
    }

    // 3. Hash Chain Link Check
    if (i > 0) {
      const prevItem = items[i - 1];
      if (item.previousRecordHash !== prevItem.currentRecordHash && item.previousRecordHash !== prevItem.manifestHash) {
        hashChainIntact = false;
        anomalies.push({
          evidenceId: item.id,
          issueType: 'CHAIN_BROKEN',
          severity: 'HIGH',
          expectedValue: prevItem.currentRecordHash,
          currentValue: item.previousRecordHash,
          recommendation: 'Hash-chain continuity link mismatch detected. Record sequence may have been reordered or omitted.',
        });
      }
    }

    // 4. Missing Metadata Check
    if (!item.incidentTimestamp || !item.platform || !item.description) {
      missingMetadataCount++;
      anomalies.push({
        evidenceId: item.id,
        issueType: 'MISSING_METADATA',
        severity: 'MEDIUM',
        expectedValue: 'Complete Incident Timestamp, Platform, & Description',
        currentValue: 'Incomplete Record Metadata',
        recommendation: 'Provide complete incident timestamp and platform description to improve evidence readiness.',
      });
    }

    // 5. Timeline Order Check
    if (i > 0) {
      const prevDate = new Date(items[i - 1].incidentTimestamp).getTime();
      const currDate = new Date(item.incidentTimestamp).getTime();
      if (!isNaN(prevDate) && !isNaN(currDate) && currDate < prevDate) {
        anomalies.push({
          evidenceId: item.id,
          issueType: 'TIMELINE_OUT_OF_ORDER',
          severity: 'LOW',
          expectedValue: `>= ${items[i - 1].incidentTimestamp}`,
          currentValue: item.incidentTimestamp,
          recommendation: 'Incident timestamp precedes earlier record in list. Consider sorting sequence chronologically.',
        });
      }
    }
  }

  // Calculate Deterministic Score (0 - 100)
  let score = 100;
  const criticalCount = anomalies.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = anomalies.filter((a) => a.severity === 'HIGH').length;
  const mediumCount = anomalies.filter((a) => a.severity === 'MEDIUM').length;

  score -= criticalCount * 25;
  score -= highCount * 15;
  score -= mediumCount * 5;
  if (!hashChainIntact) score -= 15;

  score = Math.max(0, Math.min(100, score));

  return {
    summary: {
      totalItems: items.length,
      verifiedCount,
      hashChainIntact,
      missingMetadataCount,
      duplicateCount,
      anomalyCount: anomalies.length,
      continuityScore: score,
    },
    anomalies,
  };
}
