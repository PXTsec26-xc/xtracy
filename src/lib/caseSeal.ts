/**
 * CaseSeal™ — Versioned Cryptographic Case Snapshot Engine
 * Local ECDSA P-256 digital signature generation and public key verification.
 */

import { canonicalizeJson } from './rfc8785';
import { calculateSHA256 } from './evidencePulse';
import type { EvidenceItem } from './evidencePulse';

export interface CaseSealManifest {
  schemaVersion: '2.1.0';
  canonicalization: 'RFC-8785-JCS';
  signatureAlgorithm: 'ECDSA-P256-SHA256';
  snapshotVersion: number;
  caseId: string;
  evidenceCount: number;
  verifiedCount: number;
  chainStatus: 'INTACT' | 'BROKEN';
  merkleRoot: string;
  manifestHash: string;
  sealedAt: string;
}

export interface CaseSealPackage {
  manifest: CaseSealManifest;
  signatureHex: string;
  publicKeyJwk?: JsonWebKey;
  disclaimer: string;
}

export const CASESEAL_DISCLAIMER =
  'A CaseSeal verifies the cryptographic consistency of a captured case state. It does not independently prove legal authenticity, real-world authorship, identity, or when the original incident occurred.';

/**
 * Generate a Merkle Tree Root Hash from evidence manifest hashes
 */
export async function calculateMerkleRoot(hashes: string[]): Promise<string> {
  if (!hashes || hashes.length === 0) {
    return calculateSHA256('EMPTY_MERKLE_TREE_ROOT');
  }

  let currentLevel = [...hashes];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = await calculateSHA256(currentLevel[i] + currentLevel[i + 1]);
        nextLevel.push(combined);
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

function getWebCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  return globalThis.crypto;
}

/**
 * Generate local WebCrypto ECDSA P-256 keypair for digital signing
 */
export async function generateSigningKeyPair(): Promise<CryptoKeyPair> {
  const webCrypto = getWebCrypto();
  return webCrypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true, // Extractable so public key can be exported to JWK for independent verifiers
    ['sign', 'verify']
  );
}

/**
 * Export public key to JWK for inclusion in independent verification package
 */
export async function exportPublicKeyJwk(publicKey: CryptoKey): Promise<JsonWebKey> {
  const webCrypto = getWebCrypto();
  return webCrypto.subtle.exportKey('jwk', publicKey);
}

/**
 * Import public key from JWK for independent signature verification
 */
export async function importPublicKeyJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  const webCrypto = getWebCrypto();
  return webCrypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );
}

/**
 * Sign a CaseSeal manifest using ECDSA P-256 + SHA-256
 */
export async function signCaseSeal(
  manifest: CaseSealManifest,
  privateKey: CryptoKey
): Promise<string> {
  const webCrypto = getWebCrypto();
  const canonicalString = canonicalizeJson(manifest);
  const dataBytes = new TextEncoder().encode(canonicalString);

  const signatureBuffer = await webCrypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    dataBytes
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify an ECDSA P-256 signature against a CaseSeal manifest and public key
 */
export async function verifyCaseSealSignature(
  manifest: CaseSealManifest,
  signatureHex: string,
  publicKey: CryptoKey
): Promise<boolean> {
  try {
    const webCrypto = getWebCrypto();
    const canonicalString = canonicalizeJson(manifest);
    const dataBytes = new TextEncoder().encode(canonicalString);

    const cleanHex = signatureHex.replace(/[^0-9a-fA-F]/g, '');
    const sigBytes = new Uint8Array(
      cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return webCrypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      publicKey,
      sigBytes,
      dataBytes
    );
  } catch (err) {
    return false;
  }
}
