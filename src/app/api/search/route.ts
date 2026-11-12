import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { enforceRateLimit } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-search', 60);
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').slice(0, 200);

    if (!query.trim()) {
      return createApiResponse({
        data: { query: '', resultsCount: 0, items: [] },
        dataTrust: { status: 'LOCAL', sourceName: 'XTRACY Platform Search Index', lastRefreshed: new Date().toISOString() },
      });
    }

    const qLower = query.toLowerCase();

    // Queryable Index of Platform Resources, Tools, and Cases
    const indexItems = [
      { id: 'SRC-01', title: 'XTRACY Scam Check Engine', category: 'TOOL', href: '/scam-check', snippet: 'Multi-layer URL & text scam analysis engine with private local mode.' },
      { id: 'SRC-02', title: 'XTRACY NEXUS Central Intelligence', category: 'NEXUS', href: '/nexus', snippet: 'Central intelligence layer for URL, Domain, IP, and Hash inspection.' },
      { id: 'SRC-03', title: 'EvidencePulse SHA-256 Hashing', category: 'EVIDENCE', href: '/evidencepulse', snippet: 'WebCrypto browser-native SHA-256 integrity hash calculator.' },
      { id: 'SRC-04', title: 'Digital Evidence Preparation Center', category: 'CASE', href: '/evidence', snippet: 'Organize evidence cases, compute SHA-256 hash chains, and track original files.' },
      { id: 'SRC-05', title: 'Cryptographic Integrity Verifier', category: 'VERIFIER', href: '/verifier', snippet: 'Verify digital report checksum matches and payload integrity.' },
      { id: 'SRC-06', title: 'Investigation Copilot', category: 'COPILOT', href: '/assistant', snippet: 'Ask defensive security queries, IT troubleshooting steps, and evidence triage guidance.' },
      { id: 'SRC-07', title: 'Global Safety Resource Directory', category: 'SAFETY', href: '/global-safety', snippet: 'Official national CERTs, cybercrime portals, emergency numbers, and response playbooks across 50+ countries.' },
      { id: 'SRC-08', title: 'Trust & Governance Center', category: 'GOVERNANCE', href: '/trust', snippet: 'Security disclosures, privacy guarantees, honest limitations, and auditability.' },
      { id: 'SRC-09', title: 'Platform System Status Console', category: 'STATUS', href: '/status', snippet: 'Real-time status matrix for local WebCrypto engines and external API integrations.' },
      { id: 'SRC-10', title: 'Cybersecurity Knowledge Base', category: 'LEARNING', href: '/learning', snippet: '100+ verified guides from NIST, CISA, OWASP, MITRE, and RFCs.' },
      { id: 'SRC-11', title: 'Encrypted Safe Vault', category: 'VAULT', href: '/safe-vault', snippet: 'Local browser AES-256-GCM encrypted notes protected by PBKDF2 passphrase derivation.' },
      { id: 'SRC-12', title: 'All Security Tools Hub', category: 'TOOLS', href: '/tools', snippet: 'URL Guard, DNS Intel, SSL Inspector, Header Auditor, PhishLens, Link DNA, and more.' },
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
        status: 'LOCAL',
        sourceName: 'XTRACY Platform Search Index',
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
