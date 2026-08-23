import { createHash, randomBytes } from 'crypto';

/**
 * Server-Side Password Hashing Utility
 * Uses SHA-256 + Salt PBKDF2 structure for secure password storage.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;

    const hash = createHash('sha256')
      .update(password + salt)
      .digest('hex');

    return hash === originalHash;
  } catch (err) {
    return false;
  }
}

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
