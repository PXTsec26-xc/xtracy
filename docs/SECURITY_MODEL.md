# XTRACY Security Model & Trust Boundaries

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Target Release**: `v2.1 Final Ascension`

---

## 1. Trust Boundaries & Assumptions

XTRACY distinguishes between trusted browser execution memory and untrusted external network environments.

```
+-----------------------------------------------------------------------+
|                         TRUSTED CLIENT ZONE                           |
|  - WebCrypto API runtime (AES-GCM 256-bit vault)                      |
|  - Client-side SHA-256 / SHA-512 streaming file hashing               |
+-----------------------------------------------------------------------+
                                   | (Restricted HTTPS API Calls)
                                   v
+-----------------------------------------------------------------------+
|                         SERVER EXECUTION ZONE                         |
|  - Next.js Node.js Server Handlers                                    |
|  - Input Classifier Gate (Rejects malformed targets)                  |
|  - SSRF Pre-Resolution Filter (Blocks private IPs & cloud metadata)   |
|  - PBKDF2 Password Hashing (100,000 rounds)                           |
+-----------------------------------------------------------------------+
                                   | (Controlled External Fetches)
                                   v
+-----------------------------------------------------------------------+
|                        UNTRUSTED EXTERNAL ZONE                        |
|  - Public DNS Nameservers                                             |
|  - Public Target Web Servers (Headers & TLS Handshake)                |
|  - Optional Reputation APIs (VirusTotal / Google Safe Browsing)       |
+-----------------------------------------------------------------------+
```

---

## 2. Defensive Security Controls

### 2.1 SSRF & DNS Rebind Defense (`src/lib/ssrfProtection.ts`)
- **DNS Pre-Resolution**: Translates hostnames to IP addresses prior to issuing HTTP requests.
- **Private Subnet Interception**: Blocks `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`, `100.64.0.0/10`, and IPv6 equivalents (`::1`, `fc00::/7`, `fe80::/10`).
- **Redirect Validation**: Intercepts `HTTP 301/302/307/308` redirects and validates `Location` header targets recursively up to 3 hops max.

### 2.2 Password Cryptography (`src/lib/server/passwordCrypto.ts`)
- Uses Node.js `crypto.pbkdf2Sync` with SHA-256.
- **Iterations**: 100,000 rounds.
- **Salt**: 16 bytes (32 hex characters) generated via `crypto.randomBytes(16)`.

### 2.3 Client-Side AES-GCM Vault (`src/lib/crypto.ts`)
- Uses WebCrypto `SubtleCrypto.encrypt` / `decrypt` with AES-GCM 256-bit algorithm.
- Key derived from user passphrase using WebCrypto PBKDF2 (100,000 rounds).
- Authentication tag verification ensures tampered ciphertext payloads are rejected automatically.

### 2.4 Production HTTP Security Headers (`next.config.mjs`)
- `Content-Security-Policy`: Restricts script execution sources and frames.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`

---

## 3. Security Boundary Summary

| Control | Protected Vulnerability Class | Implementation Location |
|---|---|---|
| **Pre-Resolution SSRF Filter** | SSRF / Cloud Metadata Theft / Internal Port Scan | `src/lib/ssrfProtection.ts` |
| **PBKDF2 SHA-256 (100k rounds)** | Offline Credential Cracking | `src/lib/server/passwordCrypto.ts` |
| **WebCrypto AES-GCM 256-bit** | Local Storage Dossier Theft | `src/lib/crypto.ts` |
| **Input Classifier Gate** | Malformed URL / Scheme Injection | `src/lib/server/inputClassifier.ts` |
| **In-Memory Rate Limiting** | Denial of Service / API Abuse | `src/lib/server/rateLimit.ts` |
