import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { EMERGENCY_SCENARIOS } from '@/lib/mockData/emergencyScenarios';

export async function GET(req: NextRequest) {
  return createApiResponse({
    data: EMERGENCY_SCENARIOS,
    dataTrust: {
      status: 'CACHED',
      sourceName: 'XTRACY Verified Incident Triage Flow Store',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
