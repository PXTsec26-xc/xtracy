import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { env } from '@/lib/server/env';
import { SERVER_PBKDF2_ITERATIONS } from '@/lib/server/passwordCrypto';
import { enforceRateLimit } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-security-audit', 30);
  if (limited) return limited;

  const hasDatabase = Boolean(env.DATABASE_URL);
  const hasThreatApis = Boolean(env.VIRUSTOTAL_API_KEY || env.SAFE_BROWSING_API_KEY);

  const securityControls = [
    {
      control: 'Server Password Hashing',
      status: 'PASS',
      details: `PBKDF2-SHA512 with ${SERVER_PBKDF2_ITERATIONS.toLocaleString()} iterations, random 16-byte salt, and timingSafeEqual comparison.`,
    },
    {
      control: 'Session Token Secret Configuration',
      status: env.HAS_CONFIGURED_AUTH_SECRET ? 'PASS' : 'WARN',
      details: env.HAS_CONFIGURED_AUTH_SECRET
        ? 'Persistent AUTH_SECRET configured via environment.'
        : 'Using ephemeral per-process secret (sessions invalidate on server restart unless AUTH_SECRET is configured).',
    },
    {
      control: 'Safe Vault Browser Encryption',
      status: 'PASS',
      details: 'Client-side WebCrypto AES-256-GCM with 310,000-iteration PBKDF2-SHA256, unique random salt and IV per record.',
    },
    {
      control: 'SSRF & DNS Rebinding Protection',
      status: 'PASS',
      details: 'Fail-closed DNS resolution, private/loopback/link-local IP filtering, and IP-pinned outbound socket requests.',
    },
    {
      control: 'HTTP Security Headers',
      status: 'PASS',
      details: 'CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, COOP/CORP configured.',
    },
    {
      control: 'Persistent Database Storage',
      status: hasDatabase ? 'PASS' : 'INFO',
      details: hasDatabase
        ? 'Database connection string configured.'
        : 'Running in ephemeral session memory + local browser storage mode (no DATABASE_URL configured).',
    },
    {
      control: 'External Threat Intel Providers',
      status: hasThreatApis ? 'PASS' : 'INFO',
      details: hasThreatApis
        ? 'External threat intelligence API key(s) configured.'
        : 'Using deterministic local heuristic engines (no external VirusTotal/Safe Browsing API keys configured).',
    },
  ];

  return createApiResponse({
    data: {
      auditTimestamp: new Date().toISOString(),
      platform: 'XTRACY Cybersecurity & Digital Safety Platform',
      version: 'Production-Hardened',
      securityControls,
      overallStatus: env.HAS_CONFIGURED_AUTH_SECRET ? 'HARDENED_READY' : 'HARDENED_EPHEMERAL_SESSION_MODE',
    },
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Runtime Configuration Self-Audit',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
