# XTRACY Security Specifications & Defensive Controls

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  
> **Security Policy Version:** 2.0.0

---

## 1. Defensive Security Philosophy

XTRACY operates under strict defensive, educational, and authorized security boundaries.

### Strict Defensive Mandate
1. **No Offensive Features**: XTRACY does NOT construct, support, or distribute exploits, malware, brute-force crackers, credential harvesting tools, or unauthorized intrusion utilities.
2. **Defensive AI Guardrails**: The integrated XTRACY AI copilot strictly rejects requests relating to unauthorized access, exploit development, phishing kit creation, or doxxing.
3. **Emergency Support Access**: One-tap access to national and international emergency numbers (112, 181, 100, 1930) with quick exit.

---

## 2. Server Hardening & Outbound Request Protections

### Asynchronous SSRF Defense (`src/lib/ssrfProtection.ts`)
Outbound URL fetchers and scanning services are protected against Server-Side Request Forgery (SSRF) and DNS rebinding attacks:
- **Private Subnet Filtering**: Blocks `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `0.0.0.0/8`, `169.254.0.0/16`, and IPv6 loopbacks (`::1`, `fc00::/7`, `fe80::/10`).
- **Cloud Metadata Protection**: Restricts requests to `169.254.169.254` and `metadata.google.internal`.
- **Pre-Resolution Verification**: Resolves domain names to IP addresses prior to HTTP requests to detect DNS rebinding.
- **Port Allowlisting**: Limits outbound traffic strictly to standard web ports (80, 443, 8080, 8443).
- **Timeouts**: Outbound connections enforce a 5-6 second timeout via `AbortController`.

### Rate Limiting
- Token bucket rate limiters protect sensitive endpoints (`/api/auth/*`, `/api/tools/*`, `/api/assistant`) to mitigate automated abuse.

### Production HTTP Headers (`next.config.mjs`)
- `X-Frame-Options: DENY` (Anti-clickjacking)
- `X-Content-Type-Options: nosniff` (MIME sniffing defense)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 3. Cryptographic Security & Client Privacy

### Password Storage
- Passwords are salted and hashed using **PBKDF2 SHA-256**. Plaintext credentials are never logged or stored.

### Zero-Knowledge Safe Vault & File Hashes
- **Vault Encryption**: AES-GCM 256-bit with PBKDF2 (100,000 iterations and 16-byte random salt). Master passphrases never leave the client's browser memory.
- **File Hashing**: Streaming WebCrypto `crypto.subtle.digest` executes locally. Binary files are never uploaded to XTRACY servers.
