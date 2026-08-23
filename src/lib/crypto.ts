/**
 * Client-Side Web Crypto API Helper for XTRACY Safe Vault
 * Uses AES-GCM 256-bit encryption with PBKDF2 key derivation from user passphrase.
 * 100% local in-browser encryption. Zero server transmission.
 */

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string, passphrase: string): Promise<{ ciphertextHex: string; ivHex: string; saltHex: string }> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    enc.encode(data)
  );

  const ciphertextHex = bufToHex(new Uint8Array(encryptedBuffer));
  const ivHex = bufToHex(iv);
  const saltHex = bufToHex(salt);

  return { ciphertextHex, ivHex, saltHex };
}

export async function decryptData(ciphertextHex: string, ivHex: string, saltHex: string, passphrase: string): Promise<string> {
  const dec = new TextDecoder();
  const ciphertext = hexToBuf(ciphertextHex);
  const iv = hexToBuf(ivHex);
  const salt = hexToBuf(saltHex);

  const key = await deriveKey(passphrase, salt);
  
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer
  );

  return dec.decode(decryptedBuffer);
}

function bufToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hexString: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
