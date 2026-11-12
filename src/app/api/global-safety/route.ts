import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import {
  COUNTRY_PROFILES,
  GLOBAL_DISCLAIMER,
  GLOBAL_SAFETY_RESOURCES,
} from '@/lib/globalSafetyData';
import { enforceRateLimit } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'api-global-safety', 60);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get('countryCode')?.trim().toUpperCase();
  const region = searchParams.get('region')?.trim();
  const category = searchParams.get('category')?.trim().toUpperCase();
  const q = searchParams.get('q')?.trim().toLowerCase() || '';

  let filtered = GLOBAL_SAFETY_RESOURCES;

  if (countryCode && countryCode !== 'GLOBAL' && countryCode !== 'ALL') {
    filtered = filtered.filter(
      (r) => r.countryCode === countryCode || r.countryCode === 'GLOBAL'
    );
  }

  if (region && region !== 'ALL') {
    filtered = filtered.filter(
      (r) => r.region.toLowerCase() === region.toLowerCase() || r.countryCode === 'GLOBAL'
    );
  }

  if (category && category !== 'ALL') {
    const normalizedCat = category === 'WOMENS_SAFETY' ? 'WOMENS_CHILD_SAFETY' : category;
    filtered = filtered.filter(
      (r) => r.category === normalizedCat || r.category === category
    );
  }

  if (q) {
    filtered = filtered.filter(
      (r) =>
        r.countryName.toLowerCase().includes(q) ||
        r.orgName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.sourceDomain.toLowerCase().includes(q)
    );
  }

  const selectedProfile =
    COUNTRY_PROFILES.find((c) => c.countryCode === (countryCode || 'GLOBAL')) ||
    COUNTRY_PROFILES[0];

  return createApiResponse({
    data: {
      resources: filtered,
      countries: COUNTRY_PROFILES,
      selectedProfile,
      disclaimer: GLOBAL_DISCLAIMER,
      totalCount: filtered.length,
      countryCount: COUNTRY_PROFILES.filter((c) => c.countryCode !== 'GLOBAL').length,
    },
    dataTrust: {
      status: 'LOCAL',
      sourceName: 'XTRACY Verified Global Safety Directory',
      lastRefreshed: '2026-11-11T00:00:00.000Z',
    },
  });
}
