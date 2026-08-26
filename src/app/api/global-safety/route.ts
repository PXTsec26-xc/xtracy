import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { GLOBAL_SAFETY_RESOURCES, GLOBAL_DISCLAIMER } from '@/lib/globalSafetyData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get('countryCode')?.toUpperCase();
  const category = searchParams.get('category');

  let filtered = GLOBAL_SAFETY_RESOURCES;

  if (countryCode) {
    filtered = filtered.filter(
      (r) => r.countryCode === countryCode || r.countryCode === 'GLOBAL'
    );
  }

  if (category) {
    filtered = filtered.filter((r) => r.category === category);
  }

  return createApiResponse({
    data: {
      resources: filtered,
      disclaimer: GLOBAL_DISCLAIMER,
      totalCount: filtered.length,
    },
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Global Safety Directory',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
