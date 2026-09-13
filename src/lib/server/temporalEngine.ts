/**
 * XTRACY Temporal Intelligence Engine
 * Tracks chronological state changes over time with strict category separation: FACT, OBSERVATION, INFERENCE, RECOMMENDATION.
 */

export type TemporalCategory = 'FACT' | 'OBSERVATION' | 'INFERENCE' | 'RECOMMENDATION';

export interface TemporalEvent {
  id: string;
  category: TemporalCategory;
  timestampUtc: string;
  title: string;
  previousValue?: string;
  newValue?: string;
  evidenceReference: string;
  confidence: number;
  whatChanged: string;
  potentialMeaning: string;
  investigationNextStep: string;
}

export interface TemporalTimeline {
  target: string;
  events: TemporalEvent[];
  lastUpdated: string;
  totalEventsCount: number;
}

export function buildTemporalTimeline(
  target: string,
  historicalEntries: any[]
): TemporalTimeline {
  const timestamp = new Date().toISOString();
  const events: TemporalEvent[] = [];

  // 1. Record Initial Acquisition Fact
  events.push({
    id: 'EVT-001',
    category: 'FACT',
    timestampUtc: timestamp,
    title: 'Target Target Indexed in XTRACY Workspace',
    whatChanged: `Target '${target}' submitted for defensive security indexing.`,
    evidenceReference: 'System Input Log',
    confidence: 100,
    potentialMeaning: 'Establishes baseline temporal marker for ongoing investigation.',
    investigationNextStep: 'Execute deterministic URL structure and TLS transport checks.',
  });

  // 2. Map Historical Analysis Entries to Explicit Categories
  historicalEntries.forEach((entry, idx) => {
    events.push({
      id: `EVT-${(idx + 2).toString().padStart(3, '0')}`,
      category: entry.points > 30 ? 'OBSERVATION' : 'INFERENCE',
      timestampUtc: entry.timestamp || timestamp,
      title: entry.name || `Analysis Event ${idx + 1}`,
      whatChanged: entry.technicalExplanation || 'Observed security parameter change.',
      evidenceReference: entry.source || 'Local Diagnostic Engine',
      confidence: entry.confidence || 85,
      potentialMeaning: entry.fraudAssociationRationale || 'Indicates potential risk signal modification.',
      investigationNextStep: 'Verify target SSL certificate and domain WHOIS registration data.',
    });
  });

  // 3. Add Structured Defensive Recommendation Event
  events.push({
    id: `EVT-${(events.length + 1).toString().padStart(3, '0')}`,
    category: 'RECOMMENDATION',
    timestampUtc: timestamp,
    title: 'Defensive Recommendation & Verification Action',
    whatChanged: 'Action plan generated from accumulated evidence.',
    evidenceReference: 'XTRACY Risk Scoring Model v2.1',
    confidence: 90,
    potentialMeaning: 'Defensive measures mitigate risk exposure while continuous monitoring tracks state shifts.',
    investigationNextStep: 'Monitor target DNS A-record changes over subsequent 24-hour window.',
  });

  return {
    target,
    events,
    lastUpdated: timestamp,
    totalEventsCount: events.length,
  };
}
