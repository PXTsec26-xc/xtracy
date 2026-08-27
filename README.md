# XTRACY — Production Cybersecurity & Intelligence Platform

> **Tagline:** ANALYZE. UNDERSTAND. RESPOND.  
> **Initiative:** PXT sec26  
> **Mission:** Production-oriented defensive cybersecurity workspace, threat intelligence, and zero-knowledge privacy platform.

---

## FOUNDER 

Elliot |
Cybersecurity & IT Student | Creator of XTRACY (pxtsec26) 
---

## 🌟 Executive Summary

**XTRACY** is a production cybersecurity and security intelligence workspace. It bridges the gap between raw threat data and actionable defensive remediation for everyday users, IT administrators, students, and ethical cybersecurity analysts.

Every tool and feature in XTRACY is built around **100% real logic**:
- **Real Server-Side Resolvers**: Node.js DNS promises, live TLS certificate handshakes, and SSRF-protected HTTP response header auditors.
- **Client-Side WebCrypto Privacy**: Passphrase entropy, local Diceware generators, and streaming binary file SHA-256/SHA-512 hashing executed 100% in browser memory with zero server upload.
- **Honest AI State Awareness**: Operates seamlessly with live Google Gemini / OpenAI models when configured, or transparently drops back to the built-in deterministic defensive rule engine in standby mode.

---

## 🚀 Top 4 Flagship Tools

1. **XTRACY URL Guard** (`/tools/url-guard`)
   - Real URL format validation, protocol detection, Shannon entropy calculations, punycode/IDN homograph detection, high-risk TLD profiling, and transparent heuristic factor scoring.
   - Safe reputation API integration (`VIRUSTOTAL_API_KEY`, `SAFE_BROWSING_API_KEY`) with transparent configuration indicators.

2. **Domain & DNS Intelligence** (`/tools/dns-intel`)
   - Authoritative live DNS record lookups (A, AAAA, MX, TXT, NS, CNAME) via Node.js `dns.promises`.
   - Domain normalization, error handling (`NXDOMAIN`, `NODATA`), and DNS security configuration insights.

3. **Security Headers Audit** (`/tools/header-analyzer`)
   - SSRF-protected live HTTP fetch evaluating `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
   - Generates transparent security score, detects information leakage headers, and provides copyable remediation directives.

4. **Digital Footprint Checker** (`/tools/footprint-checker`)
   - Defensive public OSINT analysis for handles and domain presence across known public developer and community endpoints without private scraping.

---

## 🛠️ Complete Modular Tool Suite

| Tool Name | Route | Technology & Privacy Guarantee |
| :--- | :--- | :--- |
| **URL Guard** | `/tools/url-guard` | Heuristic engine + Entropy + Multi-engine reputation |
| **DNS Intelligence** | `/tools/dns-intel` | Server-side Node.js `dns.promises` resolver |
| **Security Headers Audit** | `/tools/header-analyzer` | Live SSRF-protected HTTP header evaluator |
| **Digital Footprint Checker** | `/tools/footprint-checker` | Defensive public OSINT engine |
| **Password Health & Entropy** | `/tools/password-lab` | 100% Browser Local bit entropy & Diceware generator |
| **Hash Generator & Verifier** | `/tools/hash-utility` | NIST SHA-256, SHA-512, SHA-384, SHA-1, MD5, HMAC |
| **Base64, Hex & URL Encoder** | `/tools/encoder-decoder` | Bidirectional client-side UTF-8 conversion |
| **JWT Token Inspector** | `/tools/jwt-inspector` | Client-side claim expiration debugger & algorithm audits |
| **IP & Subnet Calculator** | `/tools/ip-subnet` | IPv4/IPv6 classification, CIDR math, Reverse DNS PTR |
| **SSL/TLS Certificate Inspector**| `/tools/ssl-inspector` | Live Node.js TLS handshake (`tls.connect`) analyzer |
| **HTTP Method Inspector** | `/tools/http-inspector` | GET/HEAD/OPTIONS tester & Cookie security audit |
| **Security.txt Checker** | `/tools/security-txt` | RFC 9116 security.txt parser & template generator |
| **Robots.txt Inspector** | `/tools/robots-txt` | Crawler directive parser & path leak detector |
| **Email Security (SPF/DMARC)** | `/tools/email-security` | DNS TXT parser for SPF, DMARC, and DKIM policies |
| **File Hash & Integrity** | `/tools/file-inspector` | Client-side WebCrypto SHA-256/SHA-512 streaming hash |
| **Report Generator** | `/tools/report-generator` | Audit report builder with Markdown and print export |
| **Defensive Checklists** | `/tools/security-checklist` | Interactive hardening checklists (OWASP, Cloud, Endpoints) |
| **Incident Notes Workspace** | `/tools/incident-notes` | Structured incident triage logger & timeline manager |

---

## 🤖 XTRACY AI Copilot

- **Live Generative AI**: Supports Google Gemini API (`GEMINI_API_KEY`) and OpenAI (`OPENAI_API_KEY`).
- **Standby Mode**: When unconfigured, operates honestly on a deterministic defensive rule engine without pretending to hallucinate AI responses.
- **Reading Levels**: Beginner (analogy-driven), Student (cybersecurity concepts), and Professional (RFCs, CVEs, MITRE ATT&CK mappings).
- **Strict Guardrails**: Refuses offensive exploit generation, malware creation, or unauthorized intrusion assistance.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.x or 20.x installed
- npm / yarn / pnpm

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-org/xtracy.git
cd xtracy

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables in .env
cp .env.example .env

# 4. Run automated test suite
npm run test

# 5. Run development server
npm run dev

# 6. Production build
npm run build
npm run start
```

Access the platform at [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security Architecture

- **SSRF Protection**: Asynchronous DNS pre-resolution blocks loopback (`127.0.0.0/8`), private RFC 1918 subnets, cloud metadata (`169.254.169.254`), and non-standard administrative ports.
- **Rate Limiting**: In-memory token bucket rate limiters on all public API routes.
- **Production Headers**: Strict CSP, HSTS, X-Content-Type-Options: nosniff, and X-Frame-Options: DENY in `next.config.mjs`.

---

## 📄 License & Attribution

Developed under the **PXT sec26** initiative by Elliot (PXTsec26), Anshika (PXTsec26)  
