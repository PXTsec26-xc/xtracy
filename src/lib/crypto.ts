/**
 * Client-Side Web Crypto API Helper for XTRACY Safe Vault
 * Uses AES-GCM 256-bit encryption with PBKDF2 key derivation from user passphrase.
 * 100% local in-browser encryption. Zero server transmission.
 */

export interface WebCryptoPayload {
  ciphertextHex: string;
  ivHex: string;
  saltHex: string;
}

function getWebCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  return globalThis.crypto;
}

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
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
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(data: string, key: CryptoKey, salt?: Uint8Array): Promise<WebCryptoPayload> {
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
  const key = await deriveKey(passphrase, salt);
  return encryptText(data, key, salt);
}

export async function decryptData(ciphertextHex: string, ivHex: string, saltHex: string, passphrase: string): Promise<string> {
  const salt = hexToBuf(saltHex);
  const key = await deriveKey(passphrase, salt);
  return decryptText({ ciphertextHex, ivHex, saltHex }, key);
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

