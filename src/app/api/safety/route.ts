import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { WOMEN_SAFETY_GUIDES, SOCIAL_PRIVACY_CHECKLISTS } from '@/lib/mockData/womensSafety';

export async function GET(req: NextRequest) {
  return createApiResponse({
    data: {
      guides: WOMEN_SAFETY_GUIDES,
      checklists: SOCIAL_PRIVACY_CHECKLISTS,
    },
    dataTrust: {
      status: 'CACHED',
      sourceName: 'XTRACY Women\'s Safety & Privacy Directory',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
