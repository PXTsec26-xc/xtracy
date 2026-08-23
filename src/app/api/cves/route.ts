import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { fetchLiveThreatIntelligence } from '@/lib/server/cisaProvider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const { threats, dataTrust } = await fetchLiveThreatIntelligence();

  if (!id) {
    return createApiResponse({
      data: threats.map((t) => ({ cve: t.professional.cve, title: t.title, severity: t.severity })),
      dataTrust,
    });
  }

  const found = threats.find(
    (t) => t.id === id || (t.professional.cve && t.professional.cve.toLowerCase() === id.toLowerCase())
  );

  if (!found) {
    return createApiResponse({
      error: { code: 'NOT_FOUND', message: `CVE or Report ID '${id}' not found in active advisory catalog.` },
      status: 404,
    });
  }

  return createApiResponse({
    data: found,
    dataTrust,
  });
}
