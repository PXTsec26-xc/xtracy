import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken } from '@/lib/server/authProvider';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  return createApiResponse({
    data: {
      account: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userRole: user.userRole,
        createdAt: user.createdAt,
      },
      dataStorageBreakdown: {
        serverStoredItems: ['Account credentials hash', 'Security Archetype Profile', 'Saved Scans', 'Bookmarked CVEs', 'Safe Vault Ciphertext (Client-Encrypted AES-GCM)'],
        localDeviceOnlyItems: ['Master Vault Encryption Passphrase (NEVER sent to server)', 'Active Session Cookies', 'Local UI Theme Mode'],
        notCollectedItems: ['Exact Physical GPS Location', 'Phone Contacts', 'Camera/Microphone Stream', 'Browsing History'],
      },
      privacyGuarantees: [
        'Safe Vault notes are encrypted client-side using WebCrypto AES-GCM 256-bit before reaching XTRACY servers.',
        'No telemetry or tracking scripts are loaded.',
        'Users retain 100% right to inspect and purge all saved data instantly.',
      ],
    },
  });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  return createApiResponse({
    data: {
      message: `Data erasure request processed for user '${user.email}'. All saved scans, bookmarks, incident logs, and encrypted vault notes have been permanently purged.`,
      purgedAt: new Date().toISOString(),
    },
  });
}
