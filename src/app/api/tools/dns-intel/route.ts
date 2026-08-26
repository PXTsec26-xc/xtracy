import { NextRequest } from 'next/server';
import dns from 'dns';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain = '' } = body;

    if (!domain || typeof domain !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Domain name is required for DNS intelligence.' },
        status: 400,
      });
    }

    // Normalize domain input (strip http://, https://, paths, ports, leading/trailing whitespace)
    let cleanDomain = domain.trim().toLowerCase();
    if (cleanDomain.startsWith('http://') || cleanDomain.startsWith('https://')) {
      try {
        const url = new URL(cleanDomain);
        cleanDomain = url.hostname;
      } catch {
        cleanDomain = cleanDomain.replace(/^https?:\/\//, '').split('/')[0];
      }
    }
    cleanDomain = cleanDomain.split('/')[0].split(':')[0].trim();

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(cleanDomain)) {
      return createApiResponse({
        error: {
          code: 'INVALID_DOMAIN',
          message: `Invalid domain format '${cleanDomain}'. Please enter a valid FQDN (e.g. google.com).`,
        },
        status: 400,
      });
    }

    const records: {
      a: string[];
      aaaa: string[];
      mx: { exchange: string; priority: number }[];
      txt: string[];
      ns: string[];
      cname: string[];
    } = {
      a: [],
      aaaa: [],
      mx: [],
      txt: [],
      ns: [],
      cname: [],
    };

    const errors: Record<string, string> = {};

    // Helper to safely execute DNS queries
    const queryDns = async <T>(
      fn: () => Promise<T>,
      key: string
    ): Promise<T | null> => {
      try {
        return await fn();
      } catch (err: any) {
        if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
          errors[key] = `No ${key.toUpperCase()} records found for this domain.`;
        } else {
          errors[key] = err.message || 'Lookup timeout / failure';
        }
        return null;
      }
    };

    // Parallel DNS Resolution
    const [aRes, aaaaRes, mxRes, txtRes, nsRes, cnameRes] = await Promise.all([
      queryDns(() => dns.promises.resolve4(cleanDomain), 'a'),
      queryDns(() => dns.promises.resolve6(cleanDomain), 'aaaa'),
      queryDns(() => dns.promises.resolveMx(cleanDomain), 'mx'),
      queryDns(() => dns.promises.resolveTxt(cleanDomain), 'txt'),
      queryDns(() => dns.promises.resolveNs(cleanDomain), 'ns'),
      queryDns(() => dns.promises.resolveCname(cleanDomain), 'cname'),
    ]);

    if (aRes) records.a = aRes;
    if (aaaaRes) records.aaaa = aaaaRes;
    if (mxRes) records.mx = mxRes.sort((x, y) => x.priority - y.priority);
    if (txtRes) records.txt = txtRes.map((entry) => entry.join(' '));
    if (nsRes) records.ns = nsRes;
    if (cnameRes) records.cname = cnameRes;

    const totalRecordsFound =
      records.a.length +
      records.aaaa.length +
      records.mx.length +
      records.txt.length +
      records.ns.length +
      records.cname.length;

    // Check if domain exists at all
    if (totalRecordsFound === 0 && errors.a?.includes('ENOTFOUND')) {
      return createApiResponse({
        error: {
          code: 'NXDOMAIN',
          message: `Domain '${cleanDomain}' does not exist (NXDOMAIN) or has no public DNS zone records.`,
        },
        status: 404,
      });
    }

    // Heuristics on DNS records
    const securityInsights: string[] = [];
    const hasSpf = records.txt.some((t) => t.toLowerCase().startsWith('v=spf1'));
    if (hasSpf) {
      securityInsights.push('SPF email authentication record detected in TXT zone.');
    } else {
      securityInsights.push('Missing SPF record on primary domain. Increases spoofing vulnerability.');
    }

    if (records.mx.length > 0) {
      securityInsights.push(`Configured with ${records.mx.length} active Mail eXchanger (MX) endpoint(s).`);
    }

    if (records.aaaa.length > 0) {
      securityInsights.push('IPv6 (AAAA) dual-stack connectivity enabled.');
    }

    return createApiResponse({
      data: {
        domain: cleanDomain,
        records,
        errors,
        totalRecordsFound,
        securityInsights,
        recordExplanations: {
          A: 'Maps domain to IPv4 addresses (e.g. 192.0.2.1).',
          AAAA: 'Maps domain to 128-bit IPv6 addresses.',
          MX: 'Mail Exchanger records defining mail servers and delivery priorities.',
          TXT: 'Arbitrary text records used for SPF verification, ownership verification, and security policies.',
          NS: 'Authoritative Name Servers that host the DNS zone for this domain.',
          CNAME: 'Canonical Name alias mapping one domain name to another.',
        },
        queriedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Server-Side DNS Intelligence Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `DNS query failed: ${err.message || 'Unknown network error'}` },
      status: 500,
    });
  }
}
