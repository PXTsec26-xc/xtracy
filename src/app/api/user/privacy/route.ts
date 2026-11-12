import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { deleteUserAccountRecords, getUserBySessionToken } from '@/lib/server/authProvider';
import { purgeAllUserMemoryStores } from '@/lib/server/memoryStores';
import { enforceRateLimit, extractBearerToken } from '@/lib/server/securityUtils';

export async function GET(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'user-privacy-get');
  if (rateErr) return rateErr;

  const token = extractBearerToken(req);
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
        serverStoredItems: [
          'Runtime session record & salted PBKDF2 password hash (ephemeral memory store when no external DB is connected)',
          'Saved Scans & Bookmarks (runtime memory)',
          'Client-Encrypted Safe Vault Ciphertext (AES-256-GCM)',
        ],
        localDeviceOnlyItems: [
          'Master Vault Encryption Passphrase (NEVER transmitted to server)',
          'AES-GCM Random Salt & Client Vault Ciphertext',
          'Local UI Theme & Accessibility Preferences',
        ],
        notCollectedItems: [
          'Exact Physical GPS Location',
          'Phone Contacts',
          'Camera/Microphone Stream',
          'Third-Party Tracking Telemetry',
        ],
      },
      privacyGuarantees: [
        'Safe Vault encryption and decryption run strictly inside your browser via WebCrypto AES-256-GCM.',
        'No third-party advertising trackers or behavioral analytics scripts are loaded.',
        'Users can inspect and purge all server-side runtime records and local browser storage at any time.',
      ],
    },
  });
}

export async function DELETE(req: NextRequest) {
  const rateErr = enforceRateLimit(req, 'user-privacy-delete', 20);
  if (rateErr) return rateErr;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);

  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      status: 401,
    });
  }

  const removedCounts = purgeAllUserMemoryStores(user.id);
  deleteUserAccountRecords(user.id);

  return createApiResponse({
    data: {
      message: `All runtime server records and active sessions associated with user ID '${user.id}' have been purged.`,
      removedCounts,
      purgedAt: new Date().toISOString(),
    },
  });
}
