import { pbkdf2Sync, randomBytes } from 'crypto';

/**
 * Server-Side Password Hashing Utility
 * Uses SHA-256 + Salt PBKDF2 (100,000 iterations) for secure password storage.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;

    const hash = pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
    return hash === originalHash;
  } catch (err) {
    return false;
  }
}

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
