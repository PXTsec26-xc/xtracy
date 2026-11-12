import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/server/apiResponse';
import { getUserBySessionToken, updateUserPassword } from '@/lib/server/authProvider';
import { enforceRateLimit, extractBearerToken, parseBoundedJsonBody } from '@/lib/server/securityUtils';

export async function POST(req: NextRequest) {
  const rateLimitErr = enforceRateLimit(req, 'auth-change-password', 10);
  if (rateLimitErr) return rateLimitErr;

  const token = extractBearerToken(req);
  const user = await getUserBySessionToken(token);
  if (!user) {
    return createApiResponse({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required to change password.' },
      status: 401,
    });
  }

  const { data: body, error: parseErr } = await parseBoundedJsonBody<{
    currentPassword?: string;
    newPassword?: string;
  }>(req, 4096);
  if (parseErr) return parseErr;

  const currentPassword = body?.currentPassword || '';
  const newPassword = body?.newPassword || '';

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 10) {
    return createApiResponse({
      error: {
        code: 'INVALID_PASSWORD',
        message: 'New password must be at least 10 characters long.',
      },
      status: 400,
    });
  }

  const result = updateUserPassword(user.id, currentPassword, newPassword);
  if (!result.success) {
    return createApiResponse({
      error: {
        code: 'PASSWORD_UPDATE_FAILED',
        message: result.error || 'Unable to verify current credentials.',
      },
      status: 400,
    });
  }

  return createApiResponse({
    data: {
      message: 'Password updated in active runtime session store.',
      updatedAt: new Date().toISOString(),
    },
  });
}
