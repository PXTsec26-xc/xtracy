# XTRACY Security Specifications & Defensive Controls

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Defensive Security Philosophy

XTRACY is strictly a **defensive digital safety and cyber threat awareness network**.

### Strict Defensive Guardrails
1. **No Offensive Features**: XTRACY does NOT build, support, or provide credential harvesting, exploit payloads, brute-force tools, or unauthorized hacking utilities.
2. **Privacy Minimization**: XTRACY never collects physical GPS coordinates, phone contact books, camera feeds, or background microphone streams.
3. **India Emergency Directives**: Provides one-tap direct access to official national emergency numbers:
   - **112**: Universal Emergency Dispatch
   - **181**: Women's Helpline
   - **100**: Police Control Room
   - **1930**: Cybercrime & Financial Fraud Helpline

---

## 2. Cryptographic Security Standards

### Password Storage
- Passwords are encrypted server-side using **SHA-256 + Salt PBKDF2 structure**. Plaintext passwords are never logged, stored, or transmitted in server logs.

### Safe Vault WebCrypto Client Encryption
- **Cipher Standard**: AES-GCM 256-bit
- **Key Derivation**: PBKDF2 with 100,000 iterations and 16-byte random salt.
- **Zero-Knowledge Architecture**: The master passphrase and plaintext notes are held in browser memory only. XTRACY servers store only the encrypted ciphertext payload (`encryptedContent`, `iv`, `salt`).

---

## 3. Server Hardening & Abuse Protection

### Rate Limiting
- Token bucket rate limiters protect sensitive endpoints (`/api/auth/*`, `/api/scan`, `/api/submissions`, `/api/assistant`) to prevent abuse and brute-force attempts.

### Production Security Headers (`next.config.mjs`)
- `X-Frame-Options: DENY` (Anti-clickjacking)
- `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-XSS-Protection: 1; mode=block`
