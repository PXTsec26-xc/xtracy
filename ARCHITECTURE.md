# XTRACY Architecture & Technical Specifications

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. High-Level Architecture Overview

XTRACY follows a modern, decoupled client-server architecture built on top of **Next.js 14 App Router**. It cleanly separates public safety resources, client-side zero-knowledge encryption, server-side intelligence processing, and database repository abstractions.

```
                  ┌─────────────────────────────────────────┐
                  │       Client Web Browser / PWA          │
                  │   (Next.js React 18 + Tailwind CSS)     │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
         HTTP JSON / REST APIs                  WebCrypto API (AES-GCM)
                    │                                     │
                    ▼                                     ▼
      ┌───────────────────────────┐           ┌──────────────────────┐
      │   Next.js API Handlers    │           │  Browser Local Vault │
      │   (src/app/api/*)         │           │  (Plaintext Passphrase│
      └─────────────┬─────────────┘           │  NEVER leaves device)│
                    │                         └──────────────────────┘
      ┌─────────────┴─────────────┐
      │                           │
      ▼                           ▼
┌─────────────┐           ┌──────────────┐
│ CISA KEV    │           │  Prisma ORM  │
│ Live JSON   │           │ (PostgreSQL /│
│ Dataset     │           │ Dev Fallback)│
└─────────────┘           └──────────────┘
```

---

## 2. Core Architectural Layers

### A. Data Trust System
Every piece of threat intelligence renders a `DataTrustBadge` (`● LIVE`, `● CACHED`, `● FALLBACK`, `● DEMO`):
- `● LIVE`: Freshly fetched from CISA KEV or server APIs.
- `● CACHED`: Served from server in-memory cache to reduce external latency.
- `● FALLBACK`: Served from XTRACY verified offline advisory dataset.
- `● DEMO`: Used for interactive map visualizations.

### B. Safe Vault WebCrypto Client Encryption
- **Encryption Standard**: AES-GCM 256-bit
- **Key Derivation**: PBKDF2 with 100,000 iterations and 16-byte random salt.
- **Data Isolation**: Plaintext notes and passphrases are processed 100% inside client memory. Only the ciphertext payload (`encryptedContent`, `iv`, `salt`) is stored server-side.

### C. Server-Side Data Abstraction (`src/lib/server/db.ts`)
The server repository abstracts database access:
- When `DATABASE_URL` is configured, it interacts with PostgreSQL via **Prisma ORM**.
- When `DATABASE_URL` is omitted, it seamlessly routes requests to a thread-safe local development memory repository, allowing zero-dependency local execution.

---

## 3. Zustand State Management Store Index

1. `useAuthStore.ts`: Authenticated user session token, user profile archetype, and guest mode.
2. `useThemeStore.ts`: Theme modes (`Dark Glass`, `Light Glass`, `Emergency Focus`).
3. `useProfileStore.ts`: User safety profile footprint (OS, devices, browsers, email providers).
4. `useVaultStore.ts`: Passphrase state and local encrypted notes store.
5. `usePreparednessStore.ts`: Preparedness score calculation state.
