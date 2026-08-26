import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { safeHttpFetch, validateUrlForSSRFAsync } from '@/lib/ssrfProtection';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain = '' } = body;

    if (!domain || typeof domain !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Domain name is required.' },
        status: 400,
      });
    }

    let cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

    const candidateUrls = [
      `https://${cleanDomain}/.well-known/security.txt`,
      `https://${cleanDomain}/security.txt`,
    ];

    let foundUrl: string | null = null;
    let rawContent = '';

    for (const url of candidateUrls) {
      try {
        const { response } = await safeHttpFetch(url, {
          headers: { 'User-Agent': 'XTRACY-SecurityTxt-Checker/1.0 (+https://xtracy.org)' },
        });

        if (response.ok) {
          const text = await response.text();
          if (text && (text.includes('Contact:') || text.includes('contact:'))) {
            foundUrl = url;
            rawContent = text;
            break;
          }
        }
      } catch {
        // Try next candidate
      }
    }

    if (!foundUrl) {
      return createApiResponse({
        data: {
          domain: cleanDomain,
          isFound: false,
          message: 'No RFC 9116 security.txt file discovered at standard endpoints (/.well-known/security.txt or /security.txt).',
          rfcTemplate: `Contact: mailto:security@${cleanDomain}\nExpires: ${new Date(Date.now() + 365 * 86400000).toISOString()}\nPreferred-Languages: en\nCanonical: https://${cleanDomain}/.well-known/security.txt\nPolicy: https://${cleanDomain}/security-policy`,
        },
        dataTrust: {
          status: 'LIVE',
          sourceName: 'XTRACY RFC 9116 Checker',
          lastRefreshed: new Date().toISOString(),
        },
      });
    }

    // Parse security.txt directives
    const lines = rawContent.split('\n');
    const fields: Record<string, string[]> = {
      contact: [],
      expires: [],
      encryption: [],
      acknowledgments: [],
      preferredLanguages: [],
      canonical: [],
      policy: [],
      hiring: [],
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
        const val = trimmed.slice(colonIdx + 1).trim();

        if (key === 'contact') fields.contact.push(val);
        else if (key === 'expires') fields.expires.push(val);
        else if (key === 'encryption') fields.encryption.push(val);
        else if (key === 'acknowledgments') fields.acknowledgments.push(val);
        else if (key === 'preferred-languages') fields.preferredLanguages.push(val);
        else if (key === 'canonical') fields.canonical.push(val);
        else if (key === 'policy') fields.policy.push(val);
        else if (key === 'hiring') fields.hiring.push(val);
      }
    });

    const hasContact = fields.contact.length > 0;
    const hasExpires = fields.expires.length > 0;
    let isExpired = false;
    let expiresDateStr = fields.expires[0] || null;

    if (expiresDateStr) {
      const expDate = new Date(expiresDateStr);
      if (!isNaN(expDate.getTime())) {
        isExpired = expDate.getTime() < Date.now();
      }
    }

    const complianceScore = (hasContact ? 50 : 0) + (hasExpires && !isExpired ? 50 : 0);

    return createApiResponse({
      data: {
        domain: cleanDomain,
        isFound: true,
        endpointUrl: foundUrl,
        rawContent,
        compliance: {
          hasRequiredContact: hasContact,
          hasRequiredExpires: hasExpires,
          isExpired,
          complianceScore,
          status: complianceScore === 100 ? 'RFC_9116_COMPLIANT' : 'PARTIAL_COMPLIANCE',
        },
        fields,
        checkedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY RFC 9116 Checker',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `security.txt check failed: ${err.message}` },
      status: 500,
    });
  }
}
