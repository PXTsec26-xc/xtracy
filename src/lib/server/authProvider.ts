import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import type { DbUser } from './models';
import { hashPassword, verifyPassword, generateToken } from './passwordCrypto';
import { env } from './env';

const devUsersStore = new Map<string, DbUser>();
const devSessionsStore = new Map<string, { userId: string; expiresAt: number }>();
const revokedTokens = new Set<string>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

if (devUsersStore.size === 0) {
  const demoUser: DbUser = {
    id: 'user-demo-1',
    email: 'user@xtracy.org',
    passwordHash: hashPassword('XtracyPass123!'),
    fullName: 'Alex Morgan',
    userRole: 'Everyday User',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  devUsersStore.set(demoUser.email, demoUser);
}

interface VerifiedTokenClaims {
  userId: string;
  email?: string;
  fullName?: string;
  userRole?: DbUser['userRole'];
  isEmailVerified?: boolean;
  expiresAt: number;
}

function signSessionToken(user: DbUser): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = generateToken(12);
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      userRole: user.userRole,
      isEmailVerified: user.isEmailVerified,
      exp: expiresAt,
      jti: nonce,
    })
  ).toString('base64url');
  const signature = createHmac('sha256', env.AUTH_SECRET).update(payload).digest('base64url');
  return { token: `${payload}.${signature}`, expiresAt };
}

function verifySignedSessionToken(token: string): VerifiedTokenClaims | null {
  if (!token || revokedTokens.has(token)) return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;

  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!payload || !sig) return null;

  const expectedSig = createHmac('sha256', env.AUTH_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed?.sub || typeof parsed.exp !== 'number') return null;
    if (Date.now() > parsed.exp) return null;
    return {
      userId: String(parsed.sub),
      email: typeof parsed.email === 'string' ? parsed.email : undefined,
      fullName: typeof parsed.fullName === 'string' ? parsed.fullName : undefined,
      userRole: parsed.userRole,
      isEmailVerified: Boolean(parsed.isEmailVerified),
      expiresAt: parsed.exp,
    };
  } catch {
    return null;
  }
}

export interface AuthProviderResult {
  user?: Omit<DbUser, 'passwordHash'>;
  token?: string;
  isDevFallback: boolean;
  providerName: string;
  error?: string;
}

export async function registerUser({
  email,
  password,
  fullName,
  userRole = 'Everyday User',
}: {
  email: string;
  password: string;
  fullName: string;
  userRole?: DbUser['userRole'];
}): Promise<AuthProviderResult> {
  const normalizedEmail = email.toLowerCase().trim();

  if (devUsersStore.has(normalizedEmail)) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Session Service',
      error: 'An account with this email address already exists.',
    };
  }

  const newUser: DbUser = {
    id: `user-${randomUUID()}`,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    fullName: fullName.trim(),
    userRole,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  devUsersStore.set(normalizedEmail, newUser);
  const { token, expiresAt } = signSessionToken(newUser);
  devSessionsStore.set(token, { userId: newUser.id, expiresAt });

  const { passwordHash: _, ...safeUser } = newUser;

  return {
    user: safeUser,
    token,
    isDevFallback: true,
    providerName: 'XTRACY Local Session Service',
  };
}

export async function authenticateUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthProviderResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const foundUser = devUsersStore.get(normalizedEmail);

  if (!foundUser) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Session Service',
      error: 'Invalid email or password combination.',
    };
  }

  const isValid = verifyPassword(password, foundUser.passwordHash);
  if (!isValid) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Session Service',
      error: 'Invalid email or password combination.',
    };
  }

  const { token, expiresAt } = signSessionToken(foundUser);
  devSessionsStore.set(token, { userId: foundUser.id, expiresAt });

  const { passwordHash: _, ...safeUser } = foundUser;

  return {
    user: safeUser,
    token,
    isDevFallback: true,
    providerName: 'XTRACY Local Session Service',
  };
}

export async function getUserBySessionToken(token: string): Promise<Omit<DbUser, 'passwordHash'> | null> {
  if (!token || revokedTokens.has(token)) return null;

  const verified = verifySignedSessionToken(token);
  const sessionRecord = devSessionsStore.get(token);

  const userId = verified?.userId || sessionRecord?.userId;
  const expiresAt = verified?.expiresAt || sessionRecord?.expiresAt || 0;

  if (!userId || (expiresAt && Date.now() > expiresAt)) {
    devSessionsStore.delete(token);
    return null;
  }

  for (const user of Array.from(devUsersStore.values())) {
    if (user.id === userId) {
      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    }
  }

  // Stateless HMAC fallback when a valid signed token is presented across serverless instances
  if (verified?.email) {
    return {
      id: verified.userId,
      email: verified.email,
      fullName: verified.fullName || 'XTRACY Member',
      userRole: verified.userRole || 'Everyday User',
      isEmailVerified: Boolean(verified.isEmailVerified),
      createdAt: new Date(expiresAt - SESSION_TTL_MS).toISOString(),
      updatedAt: new Date(expiresAt - SESSION_TTL_MS).toISOString(),
    };
  }

  return null;
}

export function revokeSessionToken(token: string): boolean {
  if (!token) return false;
  revokedTokens.add(token);
  if (revokedTokens.size > 10000) {
    const oldest = revokedTokens.values().next().value;
    if (oldest) revokedTokens.delete(oldest);
  }
  return devSessionsStore.delete(token);
}

export function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  for (const user of Array.from(devUsersStore.values())) {
    if (user.id === userId) {
      if (!verifyPassword(currentPassword, user.passwordHash)) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      user.passwordHash = hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();
      return { success: true };
    }
  }
  return { success: false, error: 'Account record not found in active runtime store.' };
}

export function deleteUserAccountRecords(userId: string): void {
  for (const [email, user] of Array.from(devUsersStore.entries())) {
    if (user.id === userId) {
      devUsersStore.delete(email);
    }
  }
  for (const [tok, sess] of Array.from(devSessionsStore.entries())) {
    if (sess.userId === userId) {
      devSessionsStore.delete(tok);
      revokedTokens.add(tok);
    }
  }
}
