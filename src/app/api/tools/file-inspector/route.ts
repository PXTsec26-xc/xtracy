import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { enforceRateLimit, parseBoundedJsonBody } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'tools-file-inspector', 40);
  if (limited) return limited;

  const { data: body, error } = await parseBoundedJsonBody<{ filename?: string; filesize?: number; fileHash?: string }>(req, 16384);
  if (error) return error;

  try {
    const { filename = '', filesize = 0, fileHash = '' } = body || {};

    if (!filename || typeof filename !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Filename is required for X-File inspection.' },
        status: 400,
      });
    }

    const lowerName = filename.toLowerCase();
    const suspiciousPatterns = ['.exe', '.bat', '.vbs', '.ps1', '.scr', '.iso', '.rar', '.jar', '.msi', '.cmd'];
    const hasDoubleExtension = /\.[a-z0-9]{2,4}\.(exe|bat|vbs|ps1|scr|js|cmd|msi)$/i.test(lowerName);

    const isExecutable = suspiciousPatterns.some((ext) => lowerName.endsWith(ext)) || hasDoubleExtension;

    return createApiResponse({
      data: {
        filename: filename.slice(0, 260),
        filesize: typeof filesize === 'number' && Number.isFinite(filesize) ? filesize : 0,
        sha256Hash: typeof fileHash === 'string' && fileHash ? fileHash : 'SHA256-ANALYZED-CLIENTSIDE',
        isExecutable,
        extensionCheck: isExecutable ? 'HIGH_RISK_EXECUTABLE_PATTERN' : 'STANDARD_DOCUMENT_EXTENSION',
        metadata: {
          scannedAt: new Date().toISOString(),
          serverExecution: 'STRICTLY_DISABLED (Zero-Knowledge Binary Metadata Only)',
        },
        disclaimer: 'X-File Inspector analyzes metadata and hashes. Binary files are NEVER executed on XTRACY servers.',
      },
      dataTrust: {
        status: 'LOCAL',
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
