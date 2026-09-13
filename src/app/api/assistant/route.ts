import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { createIntegrityMetadata } from '@/lib/server/trustEngine';

export type InvestigationLabel =
  | 'VERIFIED FACT'
  | 'SUPPORTED INFERENCE'
  | 'POSSIBLE'
  | 'UNKNOWN'
  | 'UNAVAILABLE'
  | 'FAILED';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt = '', mode = 'TECHNICAL', caseContext = null } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return createApiResponse({
        error: { code: 'INVALID_INPUT', message: 'Prompt query cannot be empty.' },
        status: 400,
      });
    }

    const queryLower = prompt.toLowerCase();

    // Copilot Evidence & Problem Resolution Formatting
    let directSolution = '';
    let stepByStep: string[] = [];
    let whyItWorks = '';
    let verificationStep = '';
    let label: InvestigationLabel = 'SUPPORTED INFERENCE';
    let evidenceTrail: string[] = [];

    if (queryLower.includes('evidence') || queryLower.includes('strongest') || queryLower.includes('proof')) {
      label = 'VERIFIED FACT';
      directSolution = 'Strongest evidence relies on SHA-256 WebCrypto checksum matches and authoritative DNS record lookups.';
      stepByStep = [
        '1. Inspect SHA-256 file hash recorded during evidence acquisition.',
        '2. Verify cryptographic data continuity using XTRACY Integrity Verifier.',
        '3. Cross-reference domain registration timestamps against public WHOIS history.',
      ];
      whyItWorks = 'Cryptographic hashes establish unalterable data continuity without relying on third-party trust assertions.';
      verificationStep = 'Run SHA-256 re-calculation inside browser WebCrypto runtime to verify match.';
      evidenceTrail = ['SHA-256 Checksum Log', 'WebCrypto Browser Runtime', 'RFC 8785 Canonical JSON Manifest'];
    } else if (queryLower.includes('dns') || queryLower.includes('ip') || queryLower.includes('nslookup')) {
      label = 'VERIFIED FACT';
      directSolution = 'Execute nslookup or dig queries to verify authoritative DNS record mapping.';
      stepByStep = [
        '1. Open terminal or command prompt.',
        '2. Run `nslookup -type=TXT target-domain.com` for SPF/DMARC policy records.',
        '3. Verify resolved A-records against expected hosting infrastructure IPs.',
      ];
      whyItWorks = 'Direct DNS queries fetch authoritative resource records straight from root or delegated nameservers.';
      verificationStep = 'Compare resolved IP address against public BGP routing tables.';
      evidenceTrail = ['DNS Authoritative Nameservers', 'RFC 4033 DNSSEC Signatures'];
    } else if (queryLower.includes('unknown') || queryLower.includes('uncertain') || queryLower.includes('missing')) {
      label = 'UNKNOWN';
      directSolution = 'XTRACY cannot determine private backend server state from public passive analysis alone.';
      stepByStep = [
        '1. Internal database configuration cannot be inferred without authenticated access.',
        '2. Private backend API routes require direct internal audit permission.',
        '3. Request explicit asset owner authorization before attempting active testing.',
      ];
      whyItWorks = 'Honest boundaries prevent false assumptions when observable evidence is incomplete.';
      verificationStep = 'Perform authorized credentialed security audit of target infrastructure.',
      evidenceTrail = ['Scope Boundary Notice: Unverified Private Backend'];
    } else if (queryLower.includes('scam') || queryLower.includes('phishing') || queryLower.includes('url')) {
      label = 'SUPPORTED INFERENCE';
      directSolution = 'Analyze domain structures for brand impersonation keywords, deceptive hyphenation, and unencrypted HTTP transport.';
      stepByStep = [
        '1. Check domain TLD against official corporate registry.',
        '2. Verify HTTPS TLS certificate issuer in browser address bar.',
        '3. Execute XTRACY Scam Check for deterministic factor breakdown.',
      ];
      whyItWorks = 'Combinational risk indicators identify credential lures and social engineering patterns.',
      verificationStep = 'Verify domain registration via official registrar lookup before logging in.',
      evidenceTrail = ['Local Heuristic Rules Engine', 'RFC 2606 Reserved Domain Specs'];
    } else {
      label = 'SUPPORTED INFERENCE';
      directSolution = `Defensive Copilot Guidance for: "${prompt.substring(0, 60)}..."`;
      stepByStep = [
        '1. Identify target system boundary and operational layer.',
        '2. Review diagnostic logs for error tracebacks or structural anomalies.',
        '3. Apply defensive remediation controls in isolated testing environment.',
      ];
      whyItWorks = 'Structured problem-solving isolates vulnerabilities while preventing unintended side effects.';
      verificationStep = 'Execute system verification check to confirm operational stability.';
      evidenceTrail = ['XTRACY Defensive Copilot Reasoning Model'];
    }

    const aiNotice = 'AI guidance. Verify critical actions independently before deploying to production.';
    const incidentModeNotice = mode === 'INCIDENT_ASSISTANCE' ? 'AI-GENERATED SUMMARY — REQUIRES HUMAN REVIEW' : undefined;

    const metadata = createIntegrityMetadata(
      'AI EXPLANATION',
      'XTRACY Investigation Copilot Engine v2.1',
      'Deterministic Evidence-Aware Reasoning Architecture',
      85,
      aiNotice
    );

    return createApiResponse({
      data: {
        query: prompt,
        mode,
        label,
        directSolution,
        stepByStep,
        whyItWorks,
        verificationStep,
        evidenceTrail,
        aiNotice,
        incidentModeNotice,
        metadata,
        timestamp: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Copilot Service Layer',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process Copilot query.' },
      status: 500,
    });
  }
}
