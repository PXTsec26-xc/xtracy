import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { INDIA_EMERGENCY_CONTACTS } from '@/components/emergency/IndiaEmergencyCenter';

export async function GET(req: NextRequest) {
  return createApiResponse({
    data: {
      country: 'India',
      emergencyContacts: INDIA_EMERGENCY_CONTACTS,
      disclaimer: 'XTRACY provides verified quick contact links. It does not replace emergency dispatch services or automatically call authorities.',
    },
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Verified Helpline & Resource Directory',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
