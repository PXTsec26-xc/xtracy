import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  return createApiResponse({
    data: { message: 'Logged out successfully.' },
  });
}
