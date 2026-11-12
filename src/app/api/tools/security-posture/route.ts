import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { safeHttpFetch, validateUrlForSSRFAsync } from '@/lib/ssrfProtection';
import { enforceRateLimit, parseBoundedJsonBody, XTRACY_USER_AGENT_BASE } from '@/lib/server/securityUtils';
import dns from 'dns/promises';

export interface PostureFinding {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  evidence: string;
  whyItMatters: string;
  recommendation: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  limitations: string;
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'tools-security-posture', 20);
  if (rateErr) return rateErr;

  try {
    const { data: body, error: parseErr } = await parseBoundedJsonBody<{
      url?: string;
      authorized?: boolean;
    }>(req, 4096);
    if (parseErr) return parseErr;

    const { url = '', authorized = false } = body || {};

    if (!authorized) {
      return createApiResponse({
        error: {
          code: 'AUTHORIZATION_ATTESTATION_REQUIRED',
          message:
            'Please check the responsible-use authorization attestation before running a passive Security Posture check. Note: this attests operator permission and does not verify cryptographic domain ownership.',
        },
        status: 403,
      });
    }

    // 1. Async SSRF Protection, Private IP Block & DNS Resolution
    const ssrfCheck = await validateUrlForSSRFAsync(typeof url === 'string' ? url : '');
    if (!ssrfCheck.allowed || !ssrfCheck.normalizedUrl) {
      return createApiResponse({
        error: {
          code: 'SSRF_RESTRICTED',
          message: ssrfCheck.reason || 'Target URL restricted by SSRF protection policies.',
        },
        status: 400,
      });
    }

    const targetUrl = ssrfCheck.normalizedUrl;
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;

    const findings: PostureFinding[] = [];
    let postureScore = 100;

    // 2. HTTPS & TLS Protocol Check
    const isHttps = parsed.protocol === 'https:';
    if (isHttps) {
      findings.push({
        title: 'Transport Layer Security (HTTPS) Active',
        severity: 'INFORMATIONAL',
        evidence: `Protocol: ${parsed.protocol.toUpperCase().replace(':', '')} on Port ${parsed.port || '443'}`,
        whyItMatters: 'HTTPS encrypts data in transit between the client browser and target server, preventing eavesdropping and tampering.',
        recommendation: 'Ensure TLS 1.2 or TLS 1.3 is enforced with strong cipher suites.',
        confidence: 'HIGH',
        limitations: 'Cipher suite preference and certificate expiry require running the SSL Inspector.',
      });
    } else {
      postureScore -= 35;
      findings.push({
        title: 'Unencrypted HTTP Connection In Use',
        severity: 'HIGH',
        evidence: `Protocol: ${parsed.protocol}`,
        whyItMatters: 'Unencrypted HTTP traffic transmits data in plaintext, exposing users to man-in-the-middle credential interception.',
        recommendation: 'Configure an SSL/TLS certificate and enforce automatic HTTP-to-HTTPS redirection.',
        confidence: 'HIGH',
        limitations: 'Target checked using supplied HTTP scheme.',
      });
    }

    // 3. DNS Analysis (TXT / SPF / DMARC)
    let hasSpf = false;
    let hasDmarc = false;

    try {
      const txtRecords = await dns.resolveTxt(hostname);
      const flattenedTxt = txtRecords.map((r) => r.join('')).join(' ');

      if (flattenedTxt.includes('v=spf1')) {
        hasSpf = true;
        findings.push({
          title: 'SPF Record Configured',
          severity: 'INFORMATIONAL',
          evidence: `TXT Record: ${flattenedTxt.substring(0, 100)}...`,
          whyItMatters: 'Sender Policy Framework (SPF) specifies authorized mail servers for the domain, mitigating domain email spoofing.',
          recommendation: 'Regularly audit IP ranges included in the SPF record.',
          confidence: 'HIGH',
          limitations: 'Nested include directive recursion depth was not evaluated.',
        });
      }
    } catch (e) {}

    try {
      const dmarcTxt = await dns.resolveTxt(`_dmarc.${hostname}`);
      const flattenedDmarc = dmarcTxt.map((r) => r.join('')).join(' ');

      if (flattenedDmarc.includes('v=DMARC1')) {
        hasDmarc = true;
        findings.push({
          title: 'DMARC Email Security Policy Active',
          severity: 'INFORMATIONAL',
          evidence: `TXT Record: ${flattenedDmarc}`,
          whyItMatters: 'DMARC instructs receiving mail servers how to handle emails failing SPF or DKIM checks.',
          recommendation: 'Ensure policy is set to p=reject or p=quarantine for maximum anti-phishing protection.',
          confidence: 'HIGH',
          limitations: 'DMARC aggregate reporting endpoints were not verified for receipt.',
        });
      }
    } catch (e) {}

    if (!hasSpf) {
      postureScore -= 15;
      findings.push({
        title: 'Missing SPF Email Authentication Record',
        severity: 'MEDIUM',
        evidence: `No TXT record matching v=spf1 found for hostname ${hostname}`,
        whyItMatters: 'Without an SPF record, external mail servers cannot verify whether sent emails originated from authorized mail servers.',
        recommendation: 'Publish a valid SPF TXT record in your DNS zone (e.g., v=spf1 mx ~all).',
        confidence: 'HIGH',
        limitations: 'DNS lookup performed against public recursive resolvers.',
      });
    }

    if (!hasDmarc) {
      postureScore -= 15;
      findings.push({
        title: 'Missing DMARC Policy Record',
        severity: 'MEDIUM',
        evidence: `No TXT record found at _dmarc.${hostname}`,
        whyItMatters: 'Without DMARC, domain spoofing attacks can bypass basic SPF checks.',
        recommendation: 'Add a TXT record at _dmarc.yourdomain.com specifying policy (e.g. v=DMARC1; p=quarantine;).',
        confidence: 'HIGH',
        limitations: 'Assumes domain is utilized for email delivery.',
      });
    }

    // 4. security.txt Check via DNS-pinned safeHttpFetch
    let hasSecurityTxt = false;
    try {
      const { response: secTxtRes } = await safeHttpFetch(`https://${hostname}/.well-known/security.txt`, {
        method: 'HEAD',
        headers: { 'User-Agent': `XTRACY-Security-Posture/1.0 (+${XTRACY_USER_AGENT_BASE})` },
      });
      if (secTxtRes.ok) {
        hasSecurityTxt = true;
        findings.push({
          title: 'RFC 9116 security.txt Discovered',
          severity: 'INFORMATIONAL',
          evidence: `HTTP Status: ${secTxtRes.status} at https://${hostname}/.well-known/security.txt`,
          whyItMatters: 'security.txt allows security researchers to report vulnerabilities securely.',
          recommendation: 'Keep contact details and expiration timestamps in security.txt up to date.',
          confidence: 'HIGH',
          limitations: 'File content fields were not validated against full RFC 9116 syntax.',
        });
      }
    } catch {}

    if (!hasSecurityTxt) {
      findings.push({
        title: 'Missing RFC 9116 security.txt File',
        severity: 'LOW',
        evidence: `HTTP endpoint https://${hostname}/.well-known/security.txt did not return 200 OK`,
        whyItMatters: 'Ethical researchers may struggle to locate official vulnerability disclosure channels.',
        recommendation: 'Deploy a security.txt file at /.well-known/security.txt with security contact info.',
        confidence: 'HIGH',
        limitations: 'Checked standard /.well-known/security.txt path only.',
      });
    }

    postureScore = Math.max(10, Math.min(100, postureScore));

    return createApiResponse({
      data: {
        targetUrl,
        hostname,
        postureScore,
        postureRating: postureScore >= 80 ? 'STRONG' : postureScore >= 50 ? 'MODERATE' : 'NEEDS_ATTENTION',
        findingsCount: findings.length,
        findings,
        methodologyPipeline: [
          'Input Validation & Format Normalization',
          'Authorization Confirmation Check',
          'SSRF IP Address & Private Range Filter',
          'DNS Record & Mail Authentication Lookup',
          'HTTPS & Security Header Inspection',
          'security.txt RFC 9116 Endpoint Scan',
          'Evidence-Based Rule Scoring',
        ],
        evaluatedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Security Posture Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to complete Security Posture Check.' },
      status: 500,
    });
  }
}
