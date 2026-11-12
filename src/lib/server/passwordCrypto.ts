import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Server-Side Password Hashing Utility
 * Uses PBKDF2-HMAC-SHA256 (210,000 iterations) with 16-byte random salt and constant-time verification.
 */
export const SERVER_PBKDF2_ITERATIONS = 210000;

export function hashPassword(password: string, iterations: number = SERVER_PBKDF2_ITERATIONS): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const parts = combinedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    if (!salt || !originalHash || !/^[0-9a-f]+$/i.test(originalHash)) return false;

    const originalBuf = Buffer.from(originalHash, 'hex');
    if (originalBuf.length !== 32) return false;

    // Verify at primary 210,000 iteration count, with backward compatibility for legacy 100,000 hashes
    const derivedCurrent = pbkdf2Sync(password, salt, SERVER_PBKDF2_ITERATIONS, 32, 'sha256');
    if (derivedCurrent.length === originalBuf.length && timingSafeEqual(derivedCurrent, originalBuf)) {
      return true;
    }

    const derivedLegacy = pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    return derivedLegacy.length === originalBuf.length && timingSafeEqual(derivedLegacy, originalBuf);
  } catch {
    return false;
  }
}

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
