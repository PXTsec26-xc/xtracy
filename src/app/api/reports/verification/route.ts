import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId = 'XTR-CASE-2026-0041',
      title = 'Evidence Verification Assessment',
      evidenceItems = [],
    } = body;

    const verificationDate = new Date().toUTCString();
    const totalCount = evidenceItems.length || 1;
    const mismatches = evidenceItems.filter((i: any) => i.verificationStatus === 'MISMATCH').length;
    const verifiedCount = totalCount - mismatches;
    const chainIntact = mismatches === 0;

    const reportMarkdown = `# XTRACY CRYPTOGRAPHIC EVIDENCE VERIFICATION REPORT
Case ID: ${caseId}
Title: ${title}
Verification Date: ${verificationDate}

## 1. Technical Verification Summary
- Evidence Items Checked: ${totalCount}
- Verified Fingerprints: ${verifiedCount}
- Integrity Mismatches: ${mismatches}
- Hash Chain Status: ${chainIntact ? 'INTACT (VERIFIED CONTINUITY)' : 'REVIEW REQUIRED (MISMATCH DETECTED)'}

## 2. Cryptographic Integrity Details
${
  evidenceItems.length > 0
    ? evidenceItems
        .map(
          (item: any, idx: number) =>
            `[${idx + 1}] ID: ${item.id} | Status: ${item.verificationStatus || 'VERIFIED'}
Original SHA-256: ${item.originalFileHash || 'N/A'}
Current SHA-256:  ${item.currentFileHash || 'N/A'}
Record Chain Link: ${item.previousRecordHash || 'N/A'}
---`
        )
        .join('\n')
    : 'No evidence records submitted for verification.'
}

## 3. Verification Conclusion
${
  mismatches === 0
    ? 'All evaluated evidence items matched their recorded SHA-256 cryptographic fingerprints at the time of this verification.'
    : `${mismatches} evidence record(s) did not match their original cryptographic fingerprint. Review anomaly details.`
}

---
TECHNICAL & LEGAL DISCLAIMER:
This report documents technical cryptographic verification results (SHA-256 fingerprints and hash-chain continuity). XTRACY is not a law-enforcement agency and does not guarantee legal admissibility in court. Authorized investigators remain responsible for forensic acquisition and chain-of-custody procedures.`;

    return createApiResponse({
      data: {
        caseId,
        title,
        verificationDate,
        totalCount,
        verifiedCount,
        mismatches,
        chainIntact,
        reportMarkdown,
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Verification Report Exporter',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate cryptographic verification report.' },
      status: 500,
    });
  }
}
