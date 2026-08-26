# XTRACY Architecture & Technical Specifications

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  
> **Platform Version:** 2.0.0 (Production Architecture)

---

## 1. High-Level Architecture Overview

XTRACY follows a decoupled client-server architecture built on **Next.js 14 App Router**. It strictly isolates client-side zero-knowledge encryption, server-side network and intelligence processing, external reputation and AI connectors, and persistence abstractions.

```
                  ┌──────────────────────────────────────────────┐
                  │           Client Web Browser / PWA           │
                  │       (Next.js React 18 + Tailwind CSS)      │
                  └──────────────────────┬───────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │                                           │
         HTTP JSON / REST APIs                       WebCrypto API (Client)
                   │                                           │
                   ▼                                           ▼
       ┌───────────────────────────┐                 ┌────────────────────┐
       │   Next.js API Handlers    │                 │  Browser Memory    │
       │   (src/app/api/tools/*)   │                 │  - File Hashes     │
       └─────────────┬─────────────┘                 │  - Password Entropy│
                     │                               │  - Safe Vault AES  │
       ┌─────────────┼─────────────┐                 └────────────────────┘
       ▼             ▼             ▼
┌─────────────┐┌───────────┐┌──────────────┐
│ Node.js DNS ││ TLS Engine││ SSRF Safe    │
│ dns.promises││tls.connect││ HTTP Fetcher │
└─────────────┘└───────────┘└──────────────┘
       │             │             │
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ AI & External Connectors  │
       │ - Google Gemini (Live)    │
       │ - OpenAI GPT-4o (Live)    │
       │ - VirusTotal API (Live)   │
       │ - Defensive Rule Engine   │
       │   (Standby Fallback)      │
       └───────────────────────────┘
```

---

## 2. Core Architectural Subsystems

### A. The 4 Flagship Tools
1. **URL Guard Engine (`src/app/api/tools/url-guard/route.ts`)**:
   - Computes Shannon entropy on hostnames.
   - Identifies Punycode (IDN homograph attacks), high-risk TLDs, and executable extensions.
   - Calculates a transparent factor scoring breakdown with explicit point penalties.
   - Queries VirusTotal / Safe Browsing reputation feeds if configured in environment variables.

2. **Domain & DNS Intelligence (`src/app/api/tools/dns-intel/route.ts`)**:
   - Executes non-blocking parallel DNS queries using Node.js `dns.promises` for `A`, `AAAA`, `MX`, `TXT`, `NS`, and `CNAME` records.
   - Normalizes hostnames and validates DNS zone integrity with granular error reporting.

3. **Security Headers Auditor (`src/app/api/tools/header-analyzer/route.ts`)**:
   - Initiates SSRF-protected HTTP requests with timeout controllers.
   - Inspects `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
   - Generates compliance scores and copy-paste remediation directives.

4. **Digital Footprint Checker (`src/app/api/tools/footprint-checker/route.ts`)**:
   - Defensive OSINT querying public profile existence on developer and community platforms without private web scraping.

### B. Robust SSRF Protection Engine (`src/lib/ssrfProtection.ts`)
- **DNS Pre-Resolution**: Resolves domain names before fetching to prevent DNS rebinding attacks targeting private networks.
- **Restricted Destinations**: Automatically blocks `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, and cloud metadata endpoints.
- **Port Enforcement**: Restricts outbound connections exclusively to standard HTTP/HTTPS ports (80, 443, 8080, 8443).

### C. Zero-Knowledge Client Cryptography
- **Cipher Standard**: AES-GCM 256-bit with PBKDF2 (100,000 iterations).
- **Binary File Hashing**: Streaming WebCrypto `crypto.subtle.digest` runs in browser RAM. No user files are transmitted to servers.

### D. Multi-Provider AI Architecture (`src/lib/server/aiProvider.ts`)
- Dispatches to Google Gemini or OpenAI when API keys are present.
- Transparently falls back to a deterministic rule engine when keys are absent, clearly labeling output as `Standby Mode`.

---

## 3. Zustand State Stores

1. `useAuthStore.ts`: Session tokens and user profile state.
2. `useProfileStore.ts`: User safety profile and device footprint.
3. `useVaultStore.ts`: Passphrase state and local encrypted notes store.
4. `useThemeStore.ts`: Intelligent Dark Theme switcher.
