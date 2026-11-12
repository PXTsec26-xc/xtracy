import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { enforceRateLimit, parseBoundedJsonBody, sanitizeReportText } from '@/lib/server/securityUtils';

interface VerificationEvidenceInput {
  id?: string;
  verificationStatus?: string;
  originalFileHash?: string;
  currentFileHash?: string;
  previousRecordHash?: string;
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'reports-verification', 30);
  if (rateErr) return rateErr;

  try {
    const { data: body, error: parseErr } = await parseBoundedJsonBody<{
      caseId?: string;
      title?: string;
      evidenceItems?: VerificationEvidenceInput[];
    }>(req, 65536);
    if (parseErr) return parseErr;

    const safeCaseId = sanitizeReportText(body?.caseId || 'UNASSIGNED-CASE', 80);
    const safeTitle = sanitizeReportText(body?.title || 'Evidence Verification Assessment', 120);
    const evidenceItems = Array.isArray(body?.evidenceItems) ? body!.evidenceItems.slice(0, 100) : [];

    const verificationDate = new Date().toUTCString();
    const totalCount = evidenceItems.length;

    let mismatches = 0;
    let unverified = 0;
    let verifiedCount = 0;

    const evaluatedRows = evidenceItems.map((item, idx) => {
      const origHash = typeof item.originalFileHash === 'string' ? item.originalFileHash.trim().toLowerCase() : '';
      const currHash = typeof item.currentFileHash === 'string' ? item.currentFileHash.trim().toLowerCase() : '';
      const validSha = /^[0-9a-f]{64}$/.test(origHash) && /^[0-9a-f]{64}$/.test(currHash);

      let computedStatus = 'UNVERIFIED';
      if (item.verificationStatus === 'MISMATCH' || (validSha && origHash !== currHash)) {
        computedStatus = 'MISMATCH';
        mismatches++;
      } else if (validSha && origHash === currHash) {
        computedStatus = 'VERIFIED_MATCH';
        verifiedCount++;
      } else {
        unverified++;
      }

      return `[${idx + 1}] ID: ${sanitizeReportText(item.id || `ITEM-${idx + 1}`, 60)} | Result: ${computedStatus}
Original SHA-256: ${sanitizeReportText(origHash || 'N/A', 70)}
Current SHA-256:  ${sanitizeReportText(currHash || 'N/A', 70)}
Record Chain Link: ${sanitizeReportText(item.previousRecordHash || 'N/A', 70)}
---`;
    });

    const chainIntact = totalCount > 0 && mismatches === 0 && unverified === 0;

    const reportMarkdown = `# XTRACY CRYPTOGRAPHIC EVIDENCE VERIFICATION REPORT
Case ID: ${safeCaseId}
Title: ${safeTitle}
Verification Date: ${verificationDate}

## 1. Technical Verification Summary
- Evidence Items Submitted: ${totalCount}
- Verified SHA-256 Matches: ${verifiedCount}
- Integrity Mismatches: ${mismatches}
- Unverified / Incomplete Hash Items: ${unverified}
- Verification Status: ${totalCount === 0 ? 'NO_ITEMS_SUBMITTED' : chainIntact ? 'SHA256_MATCH_CONFIRMED' : mismatches > 0 ? 'MISMATCH_DETECTED' : 'INCOMPLETE_HASH_DATA'}

## 2. Cryptographic Integrity Details
${evaluatedRows.length > 0 ? evaluatedRows.join('\n') : 'No evidence records were submitted for verification.'}

---
TECHNICAL & LEGAL DISCLAIMER:
This report compares user-supplied SHA-256 checksums and continuity metadata. XTRACY is not a law-enforcement agency and cannot attest chain-of-custody or legal admissibility in court without authorized forensic acquisition records.`;

    return createApiResponse({
      data: {
        caseId: safeCaseId,
        title: safeTitle,
        totalCount,
        verifiedCount,
        mismatches,
        unverified,
        chainIntact,
        reportMarkdown,
        verificationDate,
      },
      dataTrust: {
        status: 'LOCAL',
        sourceName: 'XTRACY Hash Verification Formatter',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate verification report.' },
      status: 500,
    });
  }
}
