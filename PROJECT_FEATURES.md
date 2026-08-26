# XTRACY Master Feature Matrix & Route Directory

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  
> **Version:** 2.0.0

---

## 1. Feature Directory Index

| Route | Feature Area | Access Level | Data Mode |
| :--- | :--- | :--- | :--- |
| **`/`** | Production Landing Page & Flagships Showcase | Public | `LIVE` |
| **`/dashboard`** | Unified Security Command Center | Protected | `PERSISTENT` |
| **`/tools`** | Cybersecurity Tools Directory (18 Working Tools) | Public | `LIVE` / `LOCAL` |
| **`/tools/url-guard`** | **Flagship 1: URL Guard (Entropy & Heuristics)** | Public | `LIVE` |
| **`/tools/dns-intel`** | **Flagship 2: Domain & DNS Intelligence (A/AAAA/MX/TXT/NS/CNAME)** | Public | `LIVE` |
| **`/tools/header-analyzer`**| **Flagship 3: Security Headers Audit (CSP, HSTS, XFO, Score)** | Public | `LIVE` |
| **`/tools/footprint-checker`**| **Flagship 4: Digital Footprint Checker (Defensive OSINT)** | Public | `LIVE` |
| **`/tools/password-lab`** | Password Strength, Bit Entropy & Diceware Generator | Public | `100% CLIENT` |
| **`/tools/hash-utility`** | Cryptographic Hash Generator (SHA-256, SHA-512, MD5, HMAC) | Public | `LIVE` |
| **`/tools/encoder-decoder`**| Base64, Hexadecimal, Binary & URL Encoder/Decoder | Public | `100% CLIENT` |
| **`/tools/jwt-inspector`** | JWT Claim Debugger & Algorithm Flaw Detector | Public | `100% CLIENT` |
| **`/tools/ip-subnet`** | IP Intelligence & CIDR Subnet Calculator with Reverse DNS | Public | `LIVE` |
| **`/tools/ssl-inspector`** | SSL/TLS Certificate Handshake Inspector | Public | `LIVE` |
| **`/tools/http-inspector`**| HTTP Method Tester & Cookie Security Audit | Public | `LIVE` |
| **`/tools/security-txt`** | Security.txt (RFC 9116) Validator & Template Generator | Public | `LIVE` |
| **`/tools/robots-txt`** | Robots.txt Parser & Sensitive Path Leak Detector | Public | `LIVE` |
| **`/tools/email-security`**| Email Security SPF, DMARC & DKIM DNS Analyzer | Public | `LIVE` |
| **`/tools/file-inspector`**| WebCrypto Streaming File Hash (SHA-256/SHA-512) & Integrity Match | Public | `100% CLIENT` |
| **`/tools/report-generator`**| Cybersecurity Audit Report Builder (Markdown & Print) | Public | `100% CLIENT` |
| **`/tools/security-checklist`**| Defensive Security Hardening Checklists (OWASP, Cloud, Endpoint) | Public | `100% CLIENT` |
| **`/tools/incident-notes`**| Structured Incident Response Notes & Timeline Workspace | Public | `PERSISTENT` |
| **`/assistant`** | XTRACY AI Defensive Copilot (Gemini / OpenAI / Standby) | Public | `LIVE` / `STANDBY` |
| **`/safe-vault`** | Safe Vault (WebCrypto AES-GCM 256-bit Encrypted Notes) | Protected | `ZERO-KNOWLEDGE` |
| **`/intelligence`** | Live Threat Intelligence Feed (CISA KEV) | Public | `LIVE` / `CACHED` |
| **`/emergency`** | India Cyber Emergency Response Center (112, 181, 100, 1930) | Public | `PUBLIC` |
| **`/global-safety`** | Global Cyber Emergency Help Portals | Public | `PUBLIC` |
| **`/trust`** | Trust Center & Transparency Commitments | Public | `PUBLIC` |
| **`/login`** / **`/signup`** | User Authentication | Public | `PERSISTENT` |
