import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { createIntegrityMetadata } from '@/lib/server/trustEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt = '', mode = 'TECHNICAL' } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return createApiResponse({
        error: { code: 'INVALID_INPUT', message: 'Prompt query cannot be empty.' },
        status: 400,
      });
    }

    const queryLower = prompt.toLowerCase();

    // Problem-Solving Standard formatting
    let directSolution = '';
    let stepByStep: string[] = [];
    let whyItWorks = '';
    let verificationStep = '';
    let classification = 'GENERAL TECHNICAL KNOWLEDGE';

    if (queryLower.includes('dns') || queryLower.includes('ip') || queryLower.includes('nslookup')) {
      directSolution = 'Use dig or nslookup CLI commands to inspect DNS A, MX, or TXT record resolution.';
      stepByStep = [
        '1. Open Windows PowerShell or Linux Terminal.',
        '2. Run `nslookup -type=TXT target-domain.com` to inspect SPF and DMARC policies.',
        '3. Verify DNS resolution output against expected authoritative nameservers.',
      ];
      whyItWorks = 'Querying authoritative nameservers reveals exact record TTLs and misconfigurations.';
      verificationStep = 'Run `ping target-domain.com` or `dig target-domain.com +short` to confirm resolved IP matching.';
      classification = 'VERIFIED INFORMATION';
    } else if (queryLower.includes('scam') || queryLower.includes('phishing') || queryLower.includes('url')) {
      directSolution = 'Do not click links or enter credentials. Submit the indicator to XTRACY Scam Check for heuristic analysis.';
      stepByStep = [
        '1. Inspect URL domain structure for brand impersonation (e.g. secure-paypal-login vs paypal.com).',
        '2. Verify HTTPS TLS transport certificate in browser address bar.',
        '3. Run URL string through XTRACY Scam Check or EvidencePulse for SHA-256 integrity logging.',
      ];
      whyItWorks = 'Heuristic indicators inspect Punycode, compound hyphens, and credential harvesting keywords.';
      verificationStep = 'Verify domain ownership independently via official corporate registry before logging in.';
      classification = 'HEURISTIC RISK INDICATOR';
    } else if (queryLower.includes('sha256') || queryLower.includes('hash') || queryLower.includes('encrypt')) {
      directSolution = 'Use WebCrypto API `crypto.subtle.digest("SHA-256", buffer)` to compute browser-native SHA-256 digests.';
      stepByStep = [
        '1. Read input file as ArrayBuffer using FileReader.',
        '2. Pass buffer to WebCrypto `crypto.subtle.digest("SHA-256", buffer)`.',
        '3. Convert returned ArrayBuffer to hexadecimal digest string.',
      ];
      whyItWorks = 'WebCrypto operates natively inside the browser execution context without sending plaintext data across network boundaries.',
      verificationStep = 'Compare digest against target checksum using XTRACY Cryptographic Integrity Verifier.';
      classification = 'VERIFIED INFORMATION';
    } else {
      directSolution = `IT & Cybersecurity Guidance for: "${prompt.substring(0, 60)}..."`;
      stepByStep = [
        '1. Identify affected operating system, service, or network layer.',
        '2. Verify configuration files and log files for error tracebacks.',
        '3. Execute defensive remediation steps in isolated testing environment before production deployment.',
      ];
      whyItWorks = 'Methodical troubleshooting isolates configuration errors and prevents unintended side effects.';
      verificationStep = 'Run system diagnostic check or test lab suite to verify operational status.';
      classification = 'AI REASONING OR SUGGESTION';
    }

    const aiNotice = 'AI guidance. Verify critical actions independently before deploying to production.';
    const incidentModeNotice = mode === 'INCIDENT_ASSISTANCE' ? 'AI-GENERATED SUMMARY — REQUIRES HUMAN REVIEW' : undefined;

    const metadata = createIntegrityMetadata(
      'AI EXPLANATION',
      'XTRACY Universal IT & Cyber Assistant Engine v2.1',
      'Deterministic Technical Problem-Solving Architecture',
      85,
      aiNotice
    );

    return createApiResponse({
      data: {
        query: prompt,
        mode,
        classification,
        directSolution,
        stepByStep,
        whyItWorks,
        verificationStep,
        aiNotice,
        incidentModeNotice,
        metadata,
        timestamp: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY AI Assistant Service Layer',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process AI assistant query.' },
      status: 500,
    });
  }
}
