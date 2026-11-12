/**
 * XTRACY Threat Intelligence Provider Abstraction Layer
 * Securely queries external APIs (VirusTotal, Safe Browsing, PhishTank, URLhaus) server-side.
 * Never exposes API keys to client browsers.
 */

export interface ExternalThreatResult {
  providerName: string;
  status: 'CONFIGURED' | 'UNAVAILABLE' | 'QUERY_FAILED';
  detectedMalicious?: boolean;
  positives?: number;
  totalEngines?: number;
  threatDetails?: string;
  queryTimestamp: string;
}

export interface UnifiedThreatLookupResult {
  externalLookupExecuted: boolean;
  privacyMode: 'PRIVATE_LOCAL' | 'HYBRID_EXTERNAL';
  providers: ExternalThreatResult[];
  summary: string;
}

export async function queryExternalThreatIntel(
  target: string,
  privateMode: boolean = false
): Promise<UnifiedThreatLookupResult> {
  // If user enabled Private Local Analysis mode, skip external lookup
  if (privateMode) {
    return {
      externalLookupExecuted: false,
      privacyMode: 'PRIVATE_LOCAL',
      providers: [],
      summary: 'Private Local Analysis active. External threat intelligence query bypassed by user preference.',
    };
  }

  const providers: ExternalThreatResult[] = [];
  const now = new Date().toISOString();

  // 1. VirusTotal Provider
  const vtKey = process.env.VIRUSTOTAL_API_KEY;
  if (!vtKey) {
    providers.push({
      providerName: 'VirusTotal Intelligence API',
      status: 'UNAVAILABLE',
      threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local analysis only.',
      queryTimestamp: now,
    });
  } else {
    try {
      const urlId = Buffer.from(target).toString('base64url');
      const vtRes = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
        headers: { 'x-apikey': vtKey },
        signal: AbortSignal.timeout(5000),
      });
      if (vtRes.ok) {
        const vtJson: any = await vtRes.json();
        const stats = vtJson?.data?.attributes?.last_analysis_stats || {};
        const malicious = Number(stats.malicious || 0) + Number(stats.suspicious || 0);
        const total =
          malicious + Number(stats.harmless || 0) + Number(stats.undetected || 0);
        providers.push({
          providerName: 'VirusTotal Intelligence API',
          status: 'CONFIGURED',
          detectedMalicious: malicious > 0,
          positives: malicious,
          totalEngines: total,
          threatDetails: `VirusTotal analysis returned ${malicious} flagged engine(s) across ${total} scanned engines.`,
          queryTimestamp: now,
        });
      } else {
        providers.push({
          providerName: 'VirusTotal Intelligence API',
          status: vtRes.status === 404 ? 'CONFIGURED' : 'QUERY_FAILED',
          threatDetails:
            vtRes.status === 404
              ? 'Target has no prior scan record in VirusTotal.'
              : `VirusTotal API returned HTTP ${vtRes.status}.`,
          queryTimestamp: now,
        });
      }
    } catch {
      providers.push({
        providerName: 'VirusTotal Intelligence API',
        status: 'QUERY_FAILED',
        threatDetails: 'Failed to communicate with VirusTotal API endpoint.',
        queryTimestamp: now,
      });
    }
  }

  // 2. Google Safe Browsing Provider
  const gsbKey = process.env.SAFE_BROWSING_API_KEY;
  if (!gsbKey) {
    providers.push({
      providerName: 'Google Safe Browsing API',
      status: 'UNAVAILABLE',
      threatDetails: 'External threat intelligence unavailable (API key not configured). Result is based on local analysis only.',
      queryTimestamp: now,
    });
  } else {
    try {
      const gsbRes = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(gsbKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client: { clientId: 'xtracy-platform', clientVersion: '2.1' },
            threatInfo: {
              threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url: target }],
            },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );
      if (gsbRes.ok) {
        const gsbJson: any = await gsbRes.json();
        const matches = Array.isArray(gsbJson?.matches) ? gsbJson.matches : [];
        providers.push({
          providerName: 'Google Safe Browsing API',
          status: 'CONFIGURED',
          detectedMalicious: matches.length > 0,
          positives: matches.length,
          threatDetails:
            matches.length > 0
              ? `Matched ${matches.length} Safe Browsing threat list(s): ${matches.map((m: any) => m.threatType).join(', ')}.`
              : 'No active threat match returned by Google Safe Browsing API.',
          queryTimestamp: now,
        });
      } else {
        providers.push({
          providerName: 'Google Safe Browsing API',
          status: 'QUERY_FAILED',
          threatDetails: `Google Safe Browsing API returned HTTP ${gsbRes.status}.`,
          queryTimestamp: now,
        });
      }
    } catch {
      providers.push({
        providerName: 'Google Safe Browsing API',
        status: 'QUERY_FAILED',
        threatDetails: 'Failed to communicate with Google Safe Browsing API endpoint.',
        queryTimestamp: now,
      });
    }
  }

  // 3. Open Threat Intelligence (PhishTank / URLhaus)
  providers.push({
    providerName: 'URLhaus / PhishTank Open Feed',
    status: 'UNAVAILABLE',
    threatDetails: 'External threat intelligence unavailable (Feed lookup not configured). Result is based on local analysis only.',
    queryTimestamp: now,
  });

  return {
    externalLookupExecuted: true,
    privacyMode: 'HYBRID_EXTERNAL',
    providers,
    summary: 'Local heuristic analysis completed. External threat provider lookups executed where configured.',
  };
}
