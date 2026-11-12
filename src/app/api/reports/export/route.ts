import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { enforceRateLimit, parseBoundedJsonBody, sanitizeReportText } from '@/lib/server/securityUtils';

interface ExportFindingInput {
  title?: string;
  severity?: string;
  confidence?: string;
  evidence?: string;
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'reports-export', 30);
  if (rateErr) return rateErr;

  try {
    const { data: body, error: parseErr } = await parseBoundedJsonBody<{
      caseId?: string;
      title?: string;
      target?: string;
      format?: string;
      postureScore?: number;
      postureRating?: string;
      findings?: ExportFindingInput[];
      recommendations?: string[];
    }>(req, 65536);
    if (parseErr) return parseErr;

    const safeCaseId = sanitizeReportText(body?.caseId || 'ANALYSIS-UNASSIGNED', 80);
    const safeTitle = sanitizeReportText(body?.title || 'XTRACY Security Analysis Report', 120);
    const safeTarget = sanitizeReportText(body?.target || 'unspecified-target', 160);
    const format = body?.format === 'EXECUTIVE' || body?.format === 'SIMPLE' ? body.format : 'TECHNICAL';

    const findings = Array.isArray(body?.findings) ? body!.findings.slice(0, 50) : [];
    const criticalOrHighCount = findings.filter((f) => {
      const sev = String(f.severity || '').toUpperCase();
      return sev === 'CRITICAL' || sev === 'HIGH';
    }).length;

    const scoreProvided = typeof body?.postureScore === 'number' && Number.isFinite(body.postureScore);
    const scoreDisplay = scoreProvided
      ? `${Math.max(0, Math.min(100, Math.round(body!.postureScore!)))}/100${body?.postureRating ? ` (${sanitizeReportText(body.postureRating, 30)})` : ''}`
      : 'Not supplied in export request (run a scan first to include measured posture score)';

    const recs =
      Array.isArray(body?.recommendations) && body.recommendations.length > 0
        ? body.recommendations.slice(0, 15).map((r, idx) => `${idx + 1}. ${sanitizeReportText(r, 220)}`)
        : [
            '1. Enable phishing-resistant or authenticator-app Multi-Factor Authentication (MFA) on critical accounts.',
            '2. Verify transport security (HTTPS/TLS) and email authentication records (SPF/DMARC).',
          ];

    let reportMarkdown = '';
    const timestamp = new Date().toUTCString();

    if (format === 'EXECUTIVE') {
      reportMarkdown = `# ${safeTitle} (Executive Summary)
Target: ${safeTarget}
Date: ${timestamp}
Analysis ID: ${safeCaseId}

## Measured Summary
- Evaluated Score: ${scoreDisplay}
- Submitted Findings Count: ${findings.length}
- High / Critical Findings Supplied: ${criticalOrHighCount}

## Recommended Priorities
${recs.join('\n')}
`;
    } else if (format === 'SIMPLE') {
      reportMarkdown = `# ${safeTitle} (Plain-Language Brief)
Target Reviewed: ${safeTarget}
Date: ${timestamp}
Reference ID: ${safeCaseId}

## Summary From Submitted Checks
- Checks Included: ${findings.length}
- High/Critical Warnings Flagged: ${criticalOrHighCount}
- Evaluated Score: ${scoreDisplay}

## Safe Next Steps
${recs.join('\n')}
`;
    } else {
      const findingsRows =
        findings.length > 0
          ? findings
              .map(
                (f) =>
                  `| ${sanitizeReportText(f.title || 'Finding', 80)} | ${sanitizeReportText(f.severity || 'INFO', 20)} | ${sanitizeReportText(f.confidence || 'N/A', 20)} | ${sanitizeReportText(f.evidence || 'No evidence details passed', 140)} |`
              )
              .join('\n')
          : '| No findings supplied in export payload | INFO | N/A | Run an inspection tool first and pass its findings to export |';

      reportMarkdown = `# ${safeTitle}
Analysis ID: ${safeCaseId}
Target: ${safeTarget}
Generated At: ${timestamp}
Evaluated Score: ${scoreDisplay}

## 1. Submitted Findings Matrix
| Finding | Severity | Confidence | Evidence |
| :--- | :--- | :--- | :--- |
${findingsRows}

## 2. Recommended Defensive Actions
${recs.join('\n')}

---
Disclaimer: XTRACY automated exports summarize user-submitted and passive heuristic checks. They do not substitute for full penetration testing or legal proof.`;
    }

    return createApiResponse({
      data: {
        caseId: safeCaseId,
        target: safeTarget,
        format,
        reportMarkdown,
        generatedAt: timestamp,
      },
      dataTrust: {
        status: 'LOCAL',
        sourceName: 'XTRACY Deterministic Report Formatter',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate security analysis report.' },
      status: 500,
    });
  }
}
