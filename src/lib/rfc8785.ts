/**
 * RFC 8785 JSON Canonicalization Scheme (JCS) Helper
 * Produces deterministic UTF-8 bytes and strings for cryptographic hashing and digital signing.
 */

export function canonicalizeJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const canonicalElements: string = obj
      .map((element) => canonicalizeJson(element))
      .join(',');
    return `[${canonicalElements}]`;
  }

  // Object key sorting in lexicographical order (UTF-16 code points)
  const sortedKeys = Object.keys(obj).sort();
  const keyValuePairStrings: string[] = [];

  for (const key of sortedKeys) {
    const value = obj[key];
    if (value !== undefined) {
      const canonicalKey = JSON.stringify(key);
      const canonicalValue = canonicalizeJson(value);
      keyValuePairStrings.push(`${canonicalKey}:${canonicalValue}`);
    }
  }

  return `{${keyValuePairStrings.join(',')}}`;
}

export function canonicalizeToBytes(obj: any): Uint8Array {
  const canonicalString = canonicalizeJson(obj);
  return new TextEncoder().encode(canonicalString);
}
