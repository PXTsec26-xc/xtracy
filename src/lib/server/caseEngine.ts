/**
 * XTRACY Investigation Case Workspace Engine
 * Manages end-to-end investigation cases: CASE -> TARGET -> INDICATORS -> EVIDENCE -> ANALYSIS -> FINDINGS -> TIMELINE -> VERIFICATION -> REPORT.
 */

import { buildEvidenceGraph, IntelligenceGraph } from '@/lib/server/graphEngine';
import { buildTemporalTimeline, TemporalTimeline } from '@/lib/server/temporalEngine';
import { generateSecurityTwin, SecurityTwinState } from '@/lib/server/securityTwin';

export interface InvestigationCase {
  caseId: string;
  title: string;
  targetInput: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAtUtc: string;
  lastUpdatedUtc: string;
  evidenceGraph: IntelligenceGraph;
  temporalTimeline: TemporalTimeline;
  securityTwin: SecurityTwinState;
  notes: string[];
  verdictSummary: string;
}

export function createInvestigationCase(
  title: string,
  targetInput: string,
  analysisData: any
): InvestigationCase {
  const caseId = `XTR-CASE-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();
  const factors = Array.isArray(analysisData?.factors) ? analysisData.factors : [];

  const evidenceGraph = buildEvidenceGraph(targetInput, 'DOMAIN', factors);
  const temporalTimeline = buildTemporalTimeline(targetInput, factors);
  const securityTwin = generateSecurityTwin(targetInput, analysisData);

  return {
    caseId,
    title: title || `Investigation: ${targetInput}`,
    targetInput,
    status: 'OPEN',
    priority: (analysisData?.riskScore ?? 0) >= 50 ? 'HIGH' : 'MEDIUM',
    createdAtUtc: timestamp,
    lastUpdatedUtc: timestamp,
    evidenceGraph,
    temporalTimeline,
    securityTwin,
    notes: [
      `Case initialized for target ${targetInput}.`,
      `Initial risk score: ${analysisData?.riskScore ?? 'N/A'}/100 (${analysisData?.verdict || 'Unassessed'}).`,
    ],
    verdictSummary: analysisData?.verdict || 'Preliminary Investigation Initialized',
  };
}
