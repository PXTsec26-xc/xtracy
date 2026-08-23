import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { analyzeScamContent } from '@/lib/scamRules';

export interface CommunitySubmissionItem {
  id: string;
  submitterName: string;
  category: 'Phishing URL' | 'Scam SMS' | 'Impersonation' | 'Deepfake' | 'Malware / Ransomware' | 'Other';
  sampleContent: string;
  targetPlatform: string;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'FLAGGED';
  riskScore: number;
  upvotesCount: number;
  submittedAt: string;
  warningSigns: string[];
}

const communitySubmissionsStore: CommunitySubmissionItem[] = [
  {
    id: 'sub-101',
    submitterName: 'Anonymous Community Member',
    category: 'Phishing URL',
    sampleContent: 'https://security-verify-sbi-bank-login.net/update-kyc',
    targetPlatform: 'SMS / Web Browser',
    status: 'VERIFIED',
    riskScore: 92,
    upvotesCount: 48,
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    warningSigns: ['Fake banking domain spoofing SBI', 'Urgent KYC update lure', 'Insecure HTTP TLD'],
  },
  {
    id: 'sub-102',
    submitterName: 'Student Safety Group',
    category: 'Scam SMS',
    sampleContent: 'Congratulations! You won Rs 50,000 lottery from Kaun Banega Crorepati. Claim now via WhatsApp link.',
    targetPlatform: 'WhatsApp / SMS',
    status: 'VERIFIED',
    riskScore: 88,
    upvotesCount: 32,
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    warningSigns: ['Lottery prize lure', 'Unsolicited message', 'Urges off-platform WhatsApp contact'],
  },
  {
    id: 'sub-103',
    submitterName: 'Cyber Guard Learner',
    category: 'Impersonation',
    sampleContent: 'Fake Instagram profile using stolen profile photos of college student offering part-time crypto jobs.',
    targetPlatform: 'Instagram',
    status: 'PENDING_REVIEW',
    riskScore: 75,
    upvotesCount: 14,
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    warningSigns: ['Stolen profile pictures', 'Promotes high-yield crypto investment', 'Unverified account'],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let filtered = communitySubmissionsStore;
  if (status && status !== 'ALL') {
    filtered = filtered.filter((s) => s.status === status);
  }

  return createApiResponse({
    data: filtered,
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Public Community Threat Directory',
      lastRefreshed: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);

  if (!rate.success) {
    return createApiResponse({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please wait before submitting another report.' },
      status: 429,
    });
  }

  try {
    const body = await req.json();
    const { category, sampleContent, targetPlatform, submitterName } = body;

    if (!sampleContent || typeof sampleContent !== 'string' || sampleContent.trim().length < 5) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Threat sample content (min 5 characters) is required.' },
        status: 400,
      });
    }

    if (sampleContent.length > 2000) {
      return createApiResponse({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Submission content exceeds 2000 characters limit.' },
        status: 413,
      });
    }

    // Run heuristic risk analysis
    const heuristic = analyzeScamContent(sampleContent, 'text');

    const newSubmission: CommunitySubmissionItem = {
      id: 'sub-' + Date.now(),
      submitterName: submitterName ? submitterName.trim().substring(0, 50) : 'Anonymous Member',
      category: category || 'Other',
      sampleContent: sampleContent.trim(),
      targetPlatform: targetPlatform ? targetPlatform.trim().substring(0, 50) : 'Web / Mobile',
      status: 'PENDING_REVIEW',
      riskScore: heuristic.riskScore,
      upvotesCount: 1,
      submittedAt: new Date().toISOString(),
      warningSigns: heuristic.warningSigns,
    };

    communitySubmissionsStore.unshift(newSubmission);

    return createApiResponse({
      data: newSubmission,
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Community Threat Verification Queue',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to record community submission.' },
      status: 500,
    });
  }
}
