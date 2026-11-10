# SECURITY OWNERSHIP & DEFENSIVE USAGE POLICY

**Project**: XTRACY Cybersecurity Intelligence Platform
**Owner / Maintainer**: Sahil Maisuria (Elliot PXT)
**Organization**: PhantomXTrace (PXT)
**Policy Version**: 2.1
**Effective Date**: November 10, 2026

---

## 1. Defensive Security Mandate

XTRACY is developed with an uncompromising commitment to authorized defensive cybersecurity, privacy protection, and public threat awareness.

### Absolute Prohibitions
The following activities, implementations, and utilities are strictly prohibited within the XTRACY codebase:
1. **Offensive Exploitation Tools**: No arbitrary command execution modules, buffer overflow payloads, or remote code execution (RCE) harnesses.
2. **Credential Harvesting**: No credential phishing simulators, fake login interceptors, or keystroke loggers.
3. **Denial of Service (DoS)**: No rate-limit flooding scripts, SYN flooders, or distributed amplification routines.
4. **Active Unauthorized Probing**: No mass port scanning or active vulnerability exploitation against targets without explicit, documented authorization.

---

## 2. Cryptographic Zero-Knowledge Vault Ownership

XTRACY operates on a **client-first zero-knowledge architecture**:
- **Client Encryption Key Ownership**: When a user locks their safe vault or incident dossier, the encryption key is derived directly in their browser using PBKDF2 SHA-256 (100,000 iterations) with WebCrypto.
- **Zero Server Plaintext Storage**: The server, API routes, database, and infrastructure maintain **zero access** to user vault contents or plain passwords.
- **User Sole Possession**: All cryptographic ownership of private investigation records remains exclusively with the user.

---

## 3. Network Boundary & SSRF Defense Rules

Outbound network inspections issued by XTRACY server routes are restricted by the `ssrfProtection.ts` engine:
- DNS resolution is performed prior to connection initiation.
- The destination IP address is compared against a strict blacklist:
  - Loopback: `127.0.0.0/8`, `::1`
  - Private IPv4 Subnets: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
  - Link-Local & Cloud Metadata: `169.254.169.254`
  - Carrier-Grade NAT: `100.64.0.0/10`
- Non-standard administrative ports (e.g. 22, 23, 25, 3306, 5432, 6379, 27017) are blocked by default.

---

## 4. Responsible Disclosure & Vulnerability Governance

Security researchers discovering potential flaws in XTRACY are invited to submit confidential reports:
- **Primary Contact**: GitHub Security Advisories at `https://github.com/PXTsec26-xc/xtracy/security/advisories`
- **Safe Harbor Guarantee**: Activities conducted in good faith, in adherence with defensive guidelines and without service disruption or user privacy violation, will be treated as authorized research without legal pursuit.
- **Coordination**: We ask for a standard 90-day coordinated disclosure period prior to public publication to ensure adequate remediation.
