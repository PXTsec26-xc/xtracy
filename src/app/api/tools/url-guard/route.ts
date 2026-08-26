import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { validateUrlForSSRFAsync } from '@/lib/ssrfProtection';
import { env } from '@/lib/server/env';

interface ScoringFactor {
  name: string;
  category: 'PROTOCOL' | 'DOMAIN' | 'STRUCTURE' | 'HEURISTIC' | 'REPUTATION';
  impact: number; // positive = increased risk, negative = safe indicator
  description: string;
  type: 'SAFE' | 'WARNING' | 'CRITICAL';
}

function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const map: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    map[char] = (map[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in map) {
    const p = map[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url = '' } = body;

    if (!url || typeof url !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'URL string is required for XTRACY URL Guard analysis.' },
        status: 400,
      });
    }

    const ssrfCheck = await validateUrlForSSRFAsync(url);
    if (!ssrfCheck.allowed) {
      return createApiResponse({
        error: {
          code: 'SSRF_RESTRICTED',
          message: ssrfCheck.reason || 'Target URL is restricted by SSRF protection policies.',
        },
        status: 400,
      });
    }

    const targetUrl = ssrfCheck.normalizedUrl!;
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    const fullUrlLower = targetUrl.toLowerCase();

    const scoringFactors: ScoringFactor[] = [];
    let baseScore = 0; // 0 = lowest risk / safe, 100 = critical risk

    // 1. Protocol & Transport Security
    const isHttps = parsed.protocol === 'https:';
    if (isHttps) {
      scoringFactors.push({
        name: 'TLS/HTTPS Encryption Active',
        category: 'PROTOCOL',
        impact: -10,
        description: 'Connection uses encrypted HTTPS protocol.',
        type: 'SAFE',
      });
    } else {
      scoringFactors.push({
        name: 'Unencrypted Plaintext HTTP Protocol',
        category: 'PROTOCOL',
        impact: 30,
        description: 'Data transmitted in cleartext without SSL/TLS encryption. Vulnerable to interception.',
        type: 'WARNING',
      });
      baseScore += 30;
    }

    // 2. IP as Hostname Detection
    const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':');
    if (isIpHost) {
      scoringFactors.push({
        name: 'Direct IP Address Hostname',
        category: 'DOMAIN',
        impact: 35,
        description: 'URL uses raw numerical IP address instead of registered domain name.',
        type: 'CRITICAL',
      });
      baseScore += 35;
    }

    // 3. High-Risk / Suspicious TLDs
    const highRiskTLDs = ['.xyz', '.top', '.phish', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.zip', '.mov', '.work', '.casa', '.surf'];
    const matchedTld = highRiskTLDs.find((tld) => hostname.endsWith(tld));
    if (matchedTld) {
      scoringFactors.push({
        name: `High-Risk Top-Level Domain (${matchedTld})`,
        category: 'DOMAIN',
        impact: 25,
        description: `Domain utilizes '${matchedTld}' TLD with statistically elevated phishing/spam prevalence.`,
        type: 'WARNING',
      });
      baseScore += 25;
    }

    // 4. Subdomain Depth & Length
    const domainParts = hostname.split('.');
    if (domainParts.length > 3 && !isIpHost) {
      scoringFactors.push({
        name: `Excessive Subdomain Depth (${domainParts.length} levels)`,
        category: 'STRUCTURE',
        impact: 20,
        description: 'Multi-level nested subdomains often disguise brand impersonation destinations.',
        type: 'WARNING',
      });
      baseScore += 20;
    }

    // 5. Hostname Shannon Entropy (Random String Detection)
    const hostnameEntropy = calculateEntropy(hostname);
    if (hostnameEntropy > 3.8 && hostname.length > 15) {
      scoringFactors.push({
        name: `High Shannon Entropy Domain (${hostnameEntropy} bits/char)`,
        category: 'STRUCTURE',
        impact: 20,
        description: 'Domain name exhibits high lexical randomness characteristic of Domain Generation Algorithms (DGA).',
        type: 'WARNING',
      });
      baseScore += 20;
    }

    // 6. Punycode / Internationalized Domain Name (IDN Homograph) Detection
    const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
    if (isPunycode) {
      scoringFactors.push({
        name: 'Punycode / IDN Homograph Sequence',
        category: 'DOMAIN',
        impact: 25,
        description: 'Punycode prefix (xn--) detected. Possible visual spoofing/homograph impersonation.',
        type: 'WARNING',
      });
      baseScore += 25;
    }

    // 7. Sensitive Brand & Verification Keywords in URL
    const brandKeywords = [
      'paypal', 'apple', 'microsoft', 'google', 'netflix', 'amazon', 'chase', 'bankofamerica',
      'wellsfargo', 'coinbase', 'binance', 'metamask', 'ledger', 'login', 'verify', 'update',
      'security-alert', 'kyc-verify', 'account-blocked', 'recover-fund', 'support-desk'
    ];
    const detectedKeywords = brandKeywords.filter((kw) => fullUrlLower.includes(kw));
    if (detectedKeywords.length > 0 && !hostname.endsWith('.google.com') && !hostname.endsWith('.microsoft.com') && !hostname.endsWith('.apple.com') && !hostname.endsWith('.amazon.com') && !hostname.endsWith('.paypal.com')) {
      scoringFactors.push({
        name: `Brand / Security Keywords Found: ${detectedKeywords.slice(0, 3).join(', ')}`,
        category: 'HEURISTIC',
        impact: 30,
        description: 'Contains sensitive verification/banking keywords on non-canonical domain.',
        type: 'CRITICAL',
      });
      baseScore += 30;
    }

    // 8. Suspicious Double Extensions or Executable Filenames in Path
    const suspiciousExtensions = ['.exe', '.scr', '.vbs', '.bat', '.ps1', '.iso', '.apk', '.jar', '.double.ext'];
    const matchedExt = suspiciousExtensions.find((ext) => pathname.endsWith(ext));
    if (matchedExt) {
      scoringFactors.push({
        name: `Executable / Package File Extension (${matchedExt})`,
        category: 'STRUCTURE',
        impact: 35,
        description: `URL points directly to an executable/container file payload (${matchedExt}).`,
        type: 'CRITICAL',
      });
      baseScore += 35;
    }

    // 9. Non-standard Port
    if (parsed.port && !['80', '443'].includes(parsed.port)) {
      scoringFactors.push({
        name: `Non-Standard Web Port (${parsed.port})`,
        category: 'STRUCTURE',
        impact: 15,
        description: `Service runs on uncommon TCP port ${parsed.port} rather than standard web ports 80/443.`,
        type: 'WARNING',
      });
      baseScore += 15;
    }

    // 10. External Reputation Provider Check (If configured)
    let reputationData: any = {
      provider: 'None (Heuristic Mode Active)',
      isConfigured: false,
      status: 'UNCONFIGURED',
      notes: 'Configure VIRUSTOTAL_API_KEY or SAFE_BROWSING_API_KEY in .env for multi-engine reputation lookups.',
    };

    if (env.VIRUSTOTAL_API_KEY) {
      try {
        const vtUrlId = Buffer.from(targetUrl).toString('base64url');
        const vtRes = await fetch(`https://www.virustotal.com/api/v3/urls/${vtUrlId}`, {
          headers: { 'x-apikey': env.VIRUSTOTAL_API_KEY },
          signal: AbortSignal.timeout(4000),
        });
        if (vtRes.ok) {
          const vtData = await vtRes.json();
          const stats = vtData?.data?.attributes?.last_analysis_stats;
          if (stats) {
            reputationData = {
              provider: 'VirusTotal API v3',
              isConfigured: true,
              status: stats.malicious > 0 ? 'MALICIOUS_DETECTED' : 'CLEAN',
              stats,
            };
            if (stats.malicious > 0) {
              scoringFactors.push({
                name: `VirusTotal: ${stats.malicious} Security Engines Flagged Target`,
                category: 'REPUTATION',
                impact: 50,
                description: `${stats.malicious} independent antivirus engines categorized this URL as malicious/phishing.`,
                type: 'CRITICAL',
              });
              baseScore += 50;
            }
          }
        }
      } catch {
        // Fallback gracefully to heuristic scoring
      }
    }

    // Normalize final score between 0 and 100
    const finalRiskScore = Math.min(100, Math.max(5, baseScore));
    const riskLevel = finalRiskScore >= 70 ? 'HIGH' : finalRiskScore >= 35 ? 'MEDIUM' : 'LOW';

    return createApiResponse({
      data: {
        targetUrl,
        normalizedUrl: targetUrl,
        parsed: {
          protocol: parsed.protocol,
          hostname: parsed.hostname,
          port: parsed.port || (isHttps ? '443' : '80'),
          pathname: parsed.pathname,
          search: parsed.search,
          hash: parsed.hash,
          resolvedIp: ssrfCheck.resolvedIp || 'Resolved via Secure Gateway',
        },
        metrics: {
          hostnameEntropy,
          subdomainDepth: domainParts.length,
          urlLength: targetUrl.length,
          isHttps,
          isPunycode,
          isIpHost,
        },
        riskScore: finalRiskScore,
        riskLevel,
        scoringFactors,
        reputationProvider: reputationData,
        explainability: {
          summary:
            riskLevel === 'HIGH'
              ? 'High-risk indicators detected. Strongly advise against visiting or submitting credentials.'
              : riskLevel === 'MEDIUM'
              ? 'Suspicious structural characteristics identified. Verify sender and domain ownership before interacting.'
              : 'Standard security attributes observed. No critical heuristics or suspicious markers found.',
          actionableAdvice:
            riskLevel === 'HIGH'
              ? ['Do NOT enter passwords, OTPs, or payment card details.', 'Report domain to hosting provider or IT security.']
              : riskLevel === 'MEDIUM'
              ? ['Inspect the full hostname for typosquatting.', 'Access service via bookmark or official app directly.']
              : ['Standard web safety rules apply. Keep browser updated.'],
        },
        timestamp: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY URL Guard Real-Time Heuristic & Security Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Failed to inspect URL: ${err.message || 'Unknown processing error'}` },
      status: 500,
    });
  }
}
