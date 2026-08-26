# XTRACY REST API Documentation

> **Base URL:** `/api`  
> **Format:** JSON  
> **Standard Response Schema:** `{ success: boolean, data?: T, error?: { code: string, message: string }, dataTrust?: { status: string, sourceName: string, lastRefreshed: string } }`

---

## 1. Flagship Tools Endpoints

### A. URL Guard
- **Endpoint:** `POST /api/tools/url-guard`
- **Body:** `{ "url": "https://example.com/login" }`
- **Output:** URL metrics (Shannon entropy, punycode, TLD), transparent scoring factor breakdown, calculated risk index (0-100), and optional multi-engine reputation stats.

### B. Domain & DNS Intelligence
- **Endpoint:** `POST /api/tools/dns-intel`
- **Body:** `{ "domain": "example.com" }`
- **Output:** Live DNS zone records resolved via Node.js `dns.promises`: `A`, `AAAA`, `MX` (with priorities), `TXT` (SPF strings), `NS`, and `CNAME`.

### C. Security Headers Audit
- **Endpoint:** `POST /api/tools/header-analyzer`
- **Body:** `{ "url": "https://example.com" }`
- **Output:** Real HTTP response headers evaluation (`CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), security score (0-100), grade (A+ to F), and copyable remediation directives.

### D. Digital Footprint Checker
- **Endpoint:** `POST /api/tools/footprint-checker`
- **Body:** `{ "target": "username_or_domain", "queryType": "USERNAME" | "DOMAIN" }`
- **Output:** Public developer/social profile presence matrix (GitHub, GitLab, Gravatar, Reddit, HackerNews, Dev.to) or domain public security posture.

---

## 2. Additional Security API Endpoints

### E. Cryptographic Hash Utility
- **Endpoint:** `POST /api/tools/hash-utility`
- **Body:** `{ "text": "sample string", "secret": "optional_hmac_key", "compareHash": "optional_expected_hash" }`
- **Output:** MD5, SHA-1, SHA-256, SHA-384, SHA-512, HMAC-SHA256, and checksum verification match boolean.

### F. IP & CIDR Subnet Calculator
- **Endpoint:** `POST /api/tools/ip-subnet`
- **Body:** `{ "input": "192.168.1.50/24" }`
- **Output:** Network address, broadcast address, subnet mask, wildcard mask, usable host pool, binary mask, and reverse DNS PTR.

### G. SSL / TLS Certificate Inspector
- **Endpoint:** `POST /api/tools/ssl-inspector`
- **Body:** `{ "host": "example.com", "port": 443 }`
- **Output:** TLS handshake details, Subject, Issuer CA, validity dates, days remaining, SANs, cipher suite, and SHA-256 fingerprints.

### H. HTTP Response & Method Inspector
- **Endpoint:** `POST /api/tools/http-inspector`
- **Body:** `{ "url": "https://example.com", "method": "GET" | "HEAD" | "OPTIONS" }`
- **Output:** Status code, response latency (ms), Content-Type, headers, and cookie security flags (`HttpOnly`, `Secure`, `SameSite`).

### I. Security.txt Checker
- **Endpoint:** `POST /api/tools/security-txt`
- **Body:** `{ "domain": "example.com" }`
- **Output:** RFC 9116 security.txt discovery status, Contact, Expires, Encryption, compliance score, and template generator.

### J. Robots.txt Inspector
- **Endpoint:** `POST /api/tools/robots-txt`
- **Body:** `{ "domain": "example.com" }`
- **Output:** User-agent directives, Disallow/Allow lists, Sitemaps, and sensitive path leak detection heuristics.

### K. Email Security (SPF & DMARC)
- **Endpoint:** `POST /api/tools/email-security`
- **Body:** `{ "domain": "example.com" }`
- **Output:** SPF record, DMARC policy (`p=reject/quarantine/none`), aggregate reporting, and anti-spoofing rating.

---

## 3. AI Copilot Endpoint

### L. XTRACY AI Copilot
- **Endpoint:** `POST /api/assistant`
- **Body:** `{ "query": "How do I configure CSP headers?", "readingMode": "Beginner" | "Student" | "Professional" }`
- **Output:** Generated defensive cybersecurity guidance, provider name, and live/standby mode indicator.
