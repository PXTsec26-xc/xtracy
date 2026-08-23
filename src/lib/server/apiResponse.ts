import { NextResponse } from 'next/server';
import { DataTrustInfo } from '@/types';

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data?: T;
  dataTrust?: DataTrustInfo;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export function createApiResponse<T>({
  data,
  dataTrust,
  error,
  status = 200,
  headers = {},
}: {
  data?: T;
  dataTrust?: DataTrustInfo;
  error?: { code: string; message: string; details?: any };
  status?: number;
  headers?: Record<string, string>;
}): NextResponse {
  const body: ApiResponseEnvelope<T> = {
    success: !error,
    ...(data !== undefined && { data }),
    ...(dataTrust && { dataTrust }),
    ...(error && { error }),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-XTRACY-Platform': 'Security-Intelligence-Network-v2A',
      ...headers,
    },
  });
}
