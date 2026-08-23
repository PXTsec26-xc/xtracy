import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { checkDatabaseHealth } from '@/lib/server/db';
import { env } from '@/lib/server/env';

export async function GET(req: NextRequest) {
  const dbHealth = await checkDatabaseHealth();

  return createApiResponse({
    data: {
      status: 'healthy',
      platform: 'XTRACY Digital Safety & Security Intelligence Network',
      version: '2A-Production-Ready',
      environment: env.NODE_ENV,
      database: dbHealth,
      providers: {
        cisaKev: 'Active (Live JSON + Fallback)',
        rateLimiting: 'Active',
      },
    },
    dataTrust: {
      status: 'LIVE',
      sourceName: 'XTRACY Server Health Monitor',
      lastRefreshed: new Date().toISOString(),
    },
  });
}
