import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { MOCK_THREAT_REPORTS } from '@/lib/mockData/threats';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let filtered = MOCK_THREAT_REPORTS;
  if (category && category !== 'ALL') {
    filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }

  return createApiResponse({
    data: filtered,
    dataTrust: {
      status: 'CACHED',
      sourceName: 'XTRACY Aggregated Security News & Advisories Feed',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
