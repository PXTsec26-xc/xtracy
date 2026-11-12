/**
 * Client-Side Web Crypto API Helper for XTRACY Safe Vault
 * Uses AES-GCM 256-bit authenticated encryption with PBKDF2-HMAC-SHA256 key derivation.
 * Note: AES-GCM protects stored confidentiality and detects tampering against external
 * modification of ciphertext, but local browser storage can still be cleared or inspected
 * if the user's device or browser session itself is compromised.
 */

export const DEFAULT_PBKDF2_ITERATIONS = 310000;
export const LEGACY_PBKDF2_ITERATIONS = 100000;

export interface WebCryptoPayload {
  ciphertextHex: string;
  ivHex: string;
  saltHex: string;
  iterations?: number;
  version?: number;
}

function getWebCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  return globalThis.crypto;
}

export async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number = DEFAULT_PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  const webCrypto = getWebCrypto();
  const enc = new TextEncoder();
  const passphraseKey = await webCrypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;

  return webCrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(
  data: string,
  key: CryptoKey,
  salt?: Uint8Array,
  iterations: number = DEFAULT_PBKDF2_ITERATIONS
): Promise<WebCryptoPayload> {
  const webCrypto = getWebCrypto();
  const enc = new TextEncoder();
  const saltBytes = salt || webCrypto.getRandomValues(new Uint8Array(16));
  const iv = webCrypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await webCrypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer },
    key,
    enc.encode(data)
  );

  return {
    ciphertextHex: bufToHex(new Uint8Array(encryptedBuffer)),
    ivHex: bufToHex(iv),
    saltHex: bufToHex(saltBytes),
    iterations,
    version: 2,
  };
}

export async function decryptText(payload: WebCryptoPayload, key: CryptoKey): Promise<string> {
  const webCrypto = getWebCrypto();
  const dec = new TextDecoder();
  const ciphertext = hexToBuf(payload.ciphertextHex);
  const iv = hexToBuf(payload.ivHex);

  const decryptedBuffer = await webCrypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer },
    key,
    ciphertext.buffer.slice(ciphertext.byteOffset, ciphertext.byteOffset + ciphertext.byteLength) as ArrayBuffer
  );

  return dec.decode(decryptedBuffer);
}

export async function encryptData(data: string, passphrase: string): Promise<WebCryptoPayload> {
  const webCrypto = getWebCrypto();
  const salt = webCrypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt, DEFAULT_PBKDF2_ITERATIONS);
  return encryptText(data, key, salt, DEFAULT_PBKDF2_ITERATIONS);
}

export async function decryptData(
  ciphertextHex: string,
  ivHex: string,
  saltHex: string,
  passphrase: string,
  iterations?: number
): Promise<string> {
  const salt = hexToBuf(saltHex);
  const primaryIters = iterations || DEFAULT_PBKDF2_ITERATIONS;
  const key = await deriveKey(passphrase, salt, primaryIters);
  try {
    return await decryptText({ ciphertextHex, ivHex, saltHex }, key);
  } catch (err) {
    if (!iterations && primaryIters !== LEGACY_PBKDF2_ITERATIONS) {
      const legacyKey = await deriveKey(passphrase, salt, LEGACY_PBKDF2_ITERATIONS);
      return decryptText({ ciphertextHex, ivHex, saltHex }, legacyKey);
    }
    throw err;
  }
}

function bufToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hexString: string): Uint8Array {
  if (!hexString) return new Uint8Array(0);
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(Math.ceil(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

