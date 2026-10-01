# XTRACY STRIDE Threat Model

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Target Release**: `v2.1 Final Ascension`

---

## 1. Asset & Attacker Modeling

### Assets
1. User Credentials (Passphrase & PBKDF2 Password Hashes)
2. Evidence Dossiers & Incident Notes
3. Client-Side Vault Passphrases
4. Server Availability & Rate Limiting Credits
5. System Integrity & Report Hashes

### Attacker Profiles
- **External Web Attacker**: Unauthenticated actor attempting SSRF, XSS, or API abuse.
- **Malicious Target Host**: Compromised external web server returning malicious HTTP headers or redirecting to loopback IPs.
- **Local Device Attacker**: Unauthorized physical actor accessing browser LocalStorage.

---

## 2. STRIDE Threat Analysis & Mitigation Matrix

| Threat Category | Specific Attack Vector | Risk Level | Implemented Mitigation Control | Residual Risk |
|---|---|---|---|---|
| **Spoofing** | Attacker impersonates trusted domain via Punycode / Homograph | `HIGH` | `urlAnalyzer.ts` detects Punycode (`xn--`), compound hyphens, and flags homograph structures. | Domain registration status requires independent WHOIS lookup. |
| **Tampering** | Attacker alters local incident dossier or report payload | `HIGH` | EvidencePulse SHA-256 hash chains & WebCrypto AES-GCM authentication tags reject tampered payloads. | Local device compromised at OS level. |
| **Repudiation** | User denies submitted evidence record authenticity | `MEDIUM` | RFC 8785 JSON Canonicalization Scheme (JCS) signs evidence manifests deterministically. | Not a substitute for law-enforcement legal chain of custody. |
| **Information Disclosure** | SSRF request targets AWS metadata (`169.254.169.254`) or loopback | `CRITICAL` | `ssrfProtection.ts` pre-resolves DNS and blocks private subnets and metadata IPs. | DNS rebinding during multi-fetch scenarios mitigated by strict single-hop checks. |
| **Denial of Service** | Attacker floods API endpoints with automated scan requests | `HIGH` | In-memory token bucket rate limiters throttle API requests per IP. | High-volume distributed DDoS requires cloud WAF edge protection. |
| **Elevation of Privilege** | Attacker bypasses session cookies to read other user vault items | `HIGH` | Session tokens verified against database user ID; vault items encrypted client-side with user key. | Session theft if user device is compromised by malware. |

---

## 3. Threat Mitigation Summary

- **SSRF Attacks**: Fully mitigated for all public scanner routes by pre-resolution DNS check and private IP blocklist.
- **Credential Storage**: Fully mitigated against offline rainbow-table attacks via PBKDF2 (100,000 rounds) + 16-byte random salts.
- **Client Dossier Exposure**: Protected at rest by AES-GCM 256-bit encryption.
