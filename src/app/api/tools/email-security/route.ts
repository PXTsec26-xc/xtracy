import { NextRequest } from 'next/server';
import dns from 'dns';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain = '' } = body;

    if (!domain || typeof domain !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Domain name is required for Email Security analysis.' },
        status: 400,
      });
    }

    let cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

    // 1. Resolve MX records
    let mxRecords: any[] = [];
    try {
      const mx = await dns.promises.resolveMx(cleanDomain);
      mxRecords = mx ? mx.sort((a, b) => a.priority - b.priority) : [];
    } catch {
      // No MX
    }

    // 2. Resolve Domain TXT for SPF
    let spfRecord: string | null = null;
    try {
      const txtRecords = await dns.promises.resolveTxt(cleanDomain);
      const matched = txtRecords.find((entry) => entry.join(' ').toLowerCase().startsWith('v=spf1'));
      if (matched) {
        spfRecord = matched.join(' ');
      }
    } catch {
      // No TXT
    }

    // 3. Resolve _dmarc.domain TXT for DMARC
    let dmarcRecord: string | null = null;
    try {
      const dmarcTxt = await dns.promises.resolveTxt(`_dmarc.${cleanDomain}`);
      const matched = dmarcTxt.find((entry) => entry.join(' ').toLowerCase().startsWith('v=dmarc1'));
      if (matched) {
        dmarcRecord = matched.join(' ');
      }
    } catch {
      // No DMARC
    }

    // Evaluate SPF
    let spfScore = 0;
    const spfDetails: string[] = [];
    if (spfRecord) {
      spfScore += 40;
      if (spfRecord.includes('-all')) {
        spfScore += 10;
        spfDetails.push('Strict Fail policy (-all): Rejects unauthorized mail servers.');
      } else if (spfRecord.includes('~all')) {
        spfDetails.push('Soft Fail policy (~all): Marks unauthorized mail as spam.');
      } else if (spfRecord.includes('?all') || spfRecord.includes('+all')) {
        spfScore -= 20;
        spfDetails.push('Neutral/Pass all policy: Allows unauthorized senders (Insecure).');
      }
    } else {
      spfDetails.push('Missing SPF record. Anyone can claim to send emails from your domain.');
    }

    // Evaluate DMARC
    let dmarcScore = 0;
    const dmarcDetails: string[] = [];
    let dmarcPolicy = 'NONE';
    if (dmarcRecord) {
      dmarcScore += 30;
      const policyMatch = dmarcRecord.match(/p=([a-zA-Z]+)/);
      if (policyMatch) {
        dmarcPolicy = policyMatch[1].toUpperCase();
        if (dmarcPolicy === 'REJECT') {
          dmarcScore += 20;
          dmarcDetails.push('Enforcement Policy: REJECT (Highest protection against spoofing).');
        } else if (dmarcPolicy === 'QUARANTINE') {
          dmarcScore += 10;
          dmarcDetails.push('Enforcement Policy: QUARANTINE (Spoofed emails sent to Spam/Junk).');
        } else {
          dmarcDetails.push('Monitoring Policy: NONE (Reports received, but spoofed emails are delivered).');
        }
      }

      if (dmarcRecord.includes('rua=')) {
        dmarcDetails.push('Aggregate reporting address (rua) is configured.');
      }
    } else {
      dmarcDetails.push('Missing DMARC record at _dmarc.' + cleanDomain);
    }

    const totalScore = Math.min(100, spfScore + dmarcScore);
    const postureLevel = totalScore >= 80 ? 'EXCELLENT' : totalScore >= 50 ? 'MODERATE' : 'VULNERABLE_TO_SPOOFING';

    return createApiResponse({
      data: {
        domain: cleanDomain,
        securityScore: totalScore,
        postureLevel,
        mxCount: mxRecords.length,
        mxRecords,
        spf: {
          present: Boolean(spfRecord),
          record: spfRecord,
          score: spfScore,
          details: spfDetails,
        },
        dmarc: {
          present: Boolean(dmarcRecord),
          record: dmarcRecord,
          policy: dmarcPolicy,
          score: dmarcScore,
          details: dmarcDetails,
        },
        dkimGuidance: {
          note: 'DKIM requires a specific selector prefix (e.g. google._domainkey.domain or s1._domainkey.domain). Verify your email provider DNS dashboard for active DKIM selectors.',
        },
        analyzedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY DNS Email Security Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Email security analysis failed: ${err.message}` },
      status: 500,
    });
  }
}
