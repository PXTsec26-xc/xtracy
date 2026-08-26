import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { safeHttpFetch } from '@/lib/ssrfProtection';

interface HeaderEvaluation {
  name: string;
  value: string | null;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'WEAK' | 'MISSING' | 'LEAK';
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  scoreImpact: number;
  description: string;
  remediation: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url = '' } = body;

    if (!url || typeof url !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'URL is required for Security Headers Audit.' },
        status: 400,
      });
    }

    const startTime = Date.now();
    let response: Response;
    let finalTargetUrl: string;

    try {
      const fetchResult = await safeHttpFetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'XTRACY-Security-Audit-Engine/1.0 (+https://xtracy.org)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      response = fetchResult.response;
      finalTargetUrl = fetchResult.finalUrl;
    } catch (err: any) {
      return createApiResponse({
        error: {
          code: 'FETCH_ERROR',
          message: err.message.includes('SSRF')
            ? err.message
            : `Unable to connect to target URL: ${err.message || 'Connection timeout or refused.'}`,
        },
        status: err.message.includes('SSRF') ? 400 : 502,
      });
    }

    const targetUrl = finalTargetUrl;

    const latencyMs = Date.now() - startTime;
    const rawHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      rawHeaders[key.toLowerCase()] = val;
    });

    const isHttps = targetUrl.startsWith('https://');
    let totalScore = 0;
    const maxPossibleScore = 100;
    const evaluations: HeaderEvaluation[] = [];

    // 1. Content-Security-Policy (CSP)
    const csp = rawHeaders['content-security-policy'];
    if (csp) {
      const isWeak = csp.includes("'unsafe-inline'") && csp.includes("'unsafe-eval'");
      evaluations.push({
        name: 'Content-Security-Policy',
        value: csp,
        status: isWeak ? 'WEAK' : 'OPTIMAL',
        importance: 'CRITICAL',
        scoreImpact: isWeak ? 15 : 25,
        description: 'Restricts script execution sources and mitigates Cross-Site Scripting (XSS).',
        remediation: isWeak ? 'Refactor inline scripts to remove unsafe-inline and unsafe-eval.' : 'CSP configured properly.',
      });
      totalScore += isWeak ? 15 : 25;
    } else {
      evaluations.push({
        name: 'Content-Security-Policy',
        value: null,
        status: 'MISSING',
        importance: 'CRITICAL',
        scoreImpact: 0,
        description: 'Missing CSP header leaves application exposed to unauthorized script injection and XSS.',
        remediation: "Add: Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
      });
    }

    // 2. Strict-Transport-Security (HSTS)
    const hsts = rawHeaders['strict-transport-security'];
    if (hsts && isHttps) {
      const hasPreload = hsts.includes('preload');
      const hasSubdomains = hsts.includes('includesubdomains');
      evaluations.push({
        name: 'Strict-Transport-Security (HSTS)',
        value: hsts,
        status: hasSubdomains ? 'OPTIMAL' : 'ACCEPTABLE',
        importance: 'CRITICAL',
        scoreImpact: hasSubdomains ? 20 : 15,
        description: 'Enforces HTTPS encryption and protects against SSL stripping attacks.',
        remediation: hasSubdomains ? 'HSTS optimal.' : 'Consider adding includeSubDomains and preload.',
      });
      totalScore += hasSubdomains ? 20 : 15;
    } else {
      evaluations.push({
        name: 'Strict-Transport-Security (HSTS)',
        value: null,
        status: 'MISSING',
        importance: 'CRITICAL',
        scoreImpact: 0,
        description: 'Missing HSTS header allows downgrade to insecure plaintext HTTP.',
        remediation: 'Add: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
      });
    }

    // 3. X-Content-Type-Options
    const xcto = rawHeaders['x-content-type-options'];
    if (xcto && xcto.toLowerCase().includes('nosniff')) {
      evaluations.push({
        name: 'X-Content-Type-Options',
        value: xcto,
        status: 'OPTIMAL',
        importance: 'HIGH',
        scoreImpact: 15,
        description: 'Prevents browsers from MIME-sniffing a response away from declared content-type.',
        remediation: 'Header configured optimal.',
      });
      totalScore += 15;
    } else {
      evaluations.push({
        name: 'X-Content-Type-Options',
        value: xcto || null,
        status: 'MISSING',
        importance: 'HIGH',
        scoreImpact: 0,
        description: 'Missing nosniff flag allows browsers to interpret non-executable MIME types as executable.',
        remediation: 'Add: X-Content-Type-Options: nosniff',
      });
    }

    // 4. X-Frame-Options
    const xfo = rawHeaders['x-frame-options'];
    if (xfo && (xfo.toLowerCase().includes('deny') || xfo.toLowerCase().includes('sameorigin'))) {
      evaluations.push({
        name: 'X-Frame-Options',
        value: xfo,
        status: 'OPTIMAL',
        importance: 'HIGH',
        scoreImpact: 15,
        description: 'Defends against Clickjacking by controlling whether the site can be rendered in an iframe.',
        remediation: 'Configured optimal.',
      });
      totalScore += 15;
    } else if (csp && csp.includes('frame-ancestors')) {
      evaluations.push({
        name: 'X-Frame-Options (via CSP frame-ancestors)',
        value: 'Handled by CSP frame-ancestors',
        status: 'OPTIMAL',
        importance: 'HIGH',
        scoreImpact: 15,
        description: 'Clickjacking protection satisfied via modern CSP frame-ancestors directive.',
        remediation: 'Configured optimal via CSP.',
      });
      totalScore += 15;
    } else {
      evaluations.push({
        name: 'X-Frame-Options',
        value: xfo || null,
        status: 'MISSING',
        importance: 'HIGH',
        scoreImpact: 0,
        description: 'Vulnerable to clickjacking/UI-redressing attacks inside third-party frames.',
        remediation: 'Add: X-Frame-Options: DENY or SAMEORIGIN',
      });
    }

    // 5. Referrer-Policy
    const refPol = rawHeaders['referrer-policy'];
    if (refPol) {
      evaluations.push({
        name: 'Referrer-Policy',
        value: refPol,
        status: 'OPTIMAL',
        importance: 'MEDIUM',
        scoreImpact: 15,
        description: 'Governs how much referrer information is sent with requests.',
        remediation: 'Configured properly.',
      });
      totalScore += 15;
    } else {
      evaluations.push({
        name: 'Referrer-Policy',
        value: null,
        status: 'MISSING',
        importance: 'MEDIUM',
        scoreImpact: 0,
        description: 'Missing Referrer-Policy may leak sensitive path or query tokens to third-party destinations.',
        remediation: 'Add: Referrer-Policy: strict-origin-when-cross-origin',
      });
    }

    // 6. Permissions-Policy
    const permPol = rawHeaders['permissions-policy'] || rawHeaders['feature-policy'];
    if (permPol) {
      evaluations.push({
        name: 'Permissions-Policy',
        value: permPol,
        status: 'OPTIMAL',
        importance: 'MEDIUM',
        scoreImpact: 10,
        description: 'Explicitly restricts browser hardware and API permissions (camera, microphone, geolocation).',
        remediation: 'Configured properly.',
      });
      totalScore += 10;
    } else {
      evaluations.push({
        name: 'Permissions-Policy',
        value: null,
        status: 'MISSING',
        importance: 'MEDIUM',
        scoreImpact: 0,
        description: 'Allows default browser access to powerful device features unless restricted.',
        remediation: 'Add: Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()',
      });
    }

    // 7. Information Leakage Headers (Server & X-Powered-By)
    const serverHeader = rawHeaders['server'];
    const poweredBy = rawHeaders['x-powered-by'];
    if (serverHeader || poweredBy) {
      evaluations.push({
        name: 'Information Leakage (Server / X-Powered-By)',
        value: [serverHeader ? `Server: ${serverHeader}` : '', poweredBy ? `X-Powered-By: ${poweredBy}` : '']
          .filter(Boolean)
          .join(', '),
        status: 'LEAK',
        importance: 'LOW',
        scoreImpact: -5,
        description: 'Exposes exact server version and framework, aiding targeted vulnerability exploits.',
        remediation: 'Remove or mask Server and X-Powered-By headers in web server configuration.',
      });
      totalScore -= 5;
    }

    totalScore = Math.max(0, Math.min(100, totalScore));
    const grade = totalScore >= 90 ? 'A+' : totalScore >= 80 ? 'A' : totalScore >= 65 ? 'B' : totalScore >= 50 ? 'C' : totalScore >= 35 ? 'D' : 'F';

    return createApiResponse({
      data: {
        targetUrl,
        statusCode: response.status,
        statusText: response.statusText,
        latencyMs,
        isHttps,
        securityScore: totalScore,
        grade,
        evaluations,
        rawHeaders,
        summary: {
          optimalCount: evaluations.filter((e) => e.status === 'OPTIMAL').length,
          missingCount: evaluations.filter((e) => e.status === 'MISSING').length,
          weakCount: evaluations.filter((e) => e.status === 'WEAK').length,
          leakCount: evaluations.filter((e) => e.status === 'LEAK').length,
        },
        auditedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Live HTTP Security Header Auditor',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Header audit failed: ${err.message || 'Unknown processing error'}` },
      status: 500,
    });
  }
}
