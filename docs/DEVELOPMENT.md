# XTRACY Developer & Setup Guide

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Target Release**: `v2.1 Final Ascension`

---

## 1. Prerequisites & Environment Setup

- **Node.js**: v18.x or v20.x
- **Package Manager**: `npm` (v9+) or `pnpm`
- **Git**: Installed and configured

```bash
# Clone the official repository
git clone https://github.com/PXTsec26-xc/xtracy.git
cd xtracy

# Install dependencies
npm install

# Setup local environment variables
cp .env.example .env.local

# Run TypeScript compilation check
npx tsc --noEmit

# Run comprehensive security test suite
npm run test

# Launch local development server
npm run dev
```

---

## 2. Directory Structure & Key Files

```
xtracy/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/                # 44 server API endpoint handlers
│   │   ├── scam-check/         # Scam Check UI & Engine
│   │   ├── assistant/          # Copilot AI UI
│   │   ├── evidence/           # Evidence Preparation Center
│   │   └── verify/             # Cryptographic Integrity Verifier
│   ├── components/             # Glassmorphism React UI components
│   │   ├── common/             # XtracyLogo and reusable UI elements
│   │   ├── layout/             # Navbar and Footer components
│   │   └── ui/                 # GlassCard, Badge, ThemeSwitcher
│   └── lib/                    # Server security & cryptographic libs
│       ├── ssrfProtection.ts   # SSRF DNS pre-resolution filter
│       ├── crypto.ts           # WebCrypto AES-GCM 256-bit vault
│       └── server/             # Risk Engine, Graph Engine, Temporal Engine
├── docs/                       # Complete technical & security documentation
└── scripts/                    # Automated cryptography test suite runner
```

---

## 3. Adding a New Security Tool

1. Create page component under `src/app/tools/<tool-name>/page.tsx`.
2. Implement backend service handler in `src/lib/server/<tool-name>.ts`.
3. Implement API route under `src/app/api/tools/<tool-name>/route.ts`. Enforce input validation and SSRF protection where network fetches occur.
4. Add automated test case to `scripts/test-suite.mjs` and run `npm run test`.
5. Verify build with `npm run build`.
