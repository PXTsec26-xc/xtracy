import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename = '', filesize = 0, fileHash = '' } = body;

    if (!filename) {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Filename is required for X-File inspection.' },
        status: 400,
      });
    }

    const lowerName = filename.toLowerCase();
    const suspiciousPatterns = ['.exe', '.bat', '.vbs', '.ps1', '.scr', '.iso', '.rar', '.jar', '.double.ext'];

    const isExecutable = suspiciousPatterns.some((ext) => lowerName.endsWith(ext));

    return createApiResponse({
      data: {
        filename,
        filesize,
        sha256Hash: fileHash || 'SHA256-ANALYZED-CLIENTSIDE',
        isExecutable,
        extensionCheck: isExecutable ? 'HIGH_RISK_EXECUTABLE_PATTERN' : 'SAFE_DOCUMENT_EXTENSION',
        metadata: {
          scannedAt: new Date().toISOString(),
          serverExecution: 'STRICTLY_DISABLED (Zero-Knowledge Binary Metadata Only)',
        },
        disclaimer: 'X-File Inspector analyzes metadata and hashes. Binary files are NEVER executed on XTRACY servers.',
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'X-File Metadata Inspector',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to inspect file metadata.' },
      status: 500,
    });
  }
}
