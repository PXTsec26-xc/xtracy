import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return createApiResponse({
        data: { query: '', resultsCount: 0, items: [] },
        dataTrust: { status: 'LIVE', sourceName: 'XTRACY Unified Search Layer', lastRefreshed: new Date().toISOString() },
      });
    }

    const qLower = query.toLowerCase();

    // Queryable Index of Platform Resources, Tools, and Cases
    const indexItems = [
      { id: 'SRC-01', title: 'XTRACY Scam Check Engine', category: 'TOOL', href: '/scam-check', snippet: 'Multi-layer URL & text scam analysis engine with private local mode.' },
      { id: 'SRC-02', title: 'XTRACY NEXUS Central Intelligence', category: 'NEXUS', href: '/nexus', snippet: 'Central intelligence layer for URL, Domain, IP, and Hash inspection.' },
      { id: 'SRC-03', title: 'EvidencePulse™ SHA-256 Hashing', category: 'EVIDENCE', href: '/evidencepulse', snippet: 'WebCrypto browser-native SHA-256 integrity hash calculator.' },
      { id: 'SRC-04', title: 'Digital Evidence Preparation Center', category: 'CASE', href: '/evidence', snippet: 'Organize evidence cases, compute SHA-256 hash chains, and track original files.' },
      { id: 'SRC-05', title: 'Cryptographic Integrity Verifier™', category: 'VERIFIER', href: '/verifier', snippet: 'Verify digital report checksum matches and payload integrity.' },
      { id: 'SRC-06', title: 'Investigation Copilot AI', category: 'COPILOT', href: '/assistant', snippet: 'Ask evidence queries, request IT troubleshooting steps, and inspect evidence trails.' },
      { id: 'SRC-07', title: 'Security Governance & Pilot Readiness', category: 'GOVERNANCE', href: '/governance', snippet: 'Responsible vulnerability disclosure policy, remediation tracking, and pilot readiness.' },
      { id: 'SRC-08', title: 'Platform System Status Console', category: 'STATUS', href: '/status', snippet: 'Real-time status matrix for local WebCrypto engines and external API lookups.' },
      { id: 'SRC-09', title: 'Verified Knowledge & Learning Center', category: 'LEARNING', href: '/learning', snippet: '13 academic IT & cybersecurity domains with NIST/RFC references.' },
    ];

    const matchedItems = indexItems.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.snippet.toLowerCase().includes(qLower) ||
        item.category.toLowerCase().includes(qLower)
    );

    return createApiResponse({
      data: {
        query,
        resultsCount: matchedItems.length,
        items: matchedItems,
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Unified Search Layer',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process unified search query.' },
      status: 500,
    });
  }
}
