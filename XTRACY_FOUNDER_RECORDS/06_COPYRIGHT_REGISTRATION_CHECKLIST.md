# 06 — COPYRIGHT REGISTRATION PREPARATION CHECKLIST

**Project**: XTRACY Cybersecurity Intelligence Platform
**Claimant**: Sahil Maisuria (Elliot PXT)
**Organization**: PhantomXTrace (PXT)
**Target Category**: Computer Program / Literary Work
**Date**: November 10, 2026

---

> **LEGAL SCOPE CLARIFICATION**: Authorship declarations in this checklist reflect internal project records and founder statements. They are distinct from independently verified legal ownership determinations or government-issued registration certificates. Affixing copyright notices provides public notice of authorship claims but does not provide absolute immunity against legal challenges or automatically defeat all defenses.

---

## 1. Action Items for Statutory Deposit

- [ ] **Step 1: Identifying Author & Claimant Information**
  - Full Name: Sahil Maisuria
  - Professional Pseudonym / Alias: Elliot PXT
  - Organization Entity: PhantomXTrace (PXT)
  - Year of Creation: 2026
  - Date of First Publication: August 2026 (via `https://xtracy.vercel.app`)
  - Nation of First Publication: `[To be inserted by applicant]`

- [ ] **Step 2: Source Code Deposit Extraction**
  - Form TX / eCO requirements: first 25 pages and last 25 pages of source code.
  - Recommended files for deposit:
    - First 25 pages: `src/lib/server/nexusEngine.ts`, `src/lib/server/graphEngine.ts`, `src/lib/server/temporalEngine.ts`.
    - Last 25 pages: `src/lib/crypto.ts`, `src/lib/server/passwordCrypto.ts`, `src/lib/ssrfProtection.ts`.
  - Exclude all third-party files (`node_modules/`, `.next/`).

- [ ] **Step 3: Verification of Source Code Notice Headers**
  - Confirm every original source file carries the approved header:
    ```typescript
    /*
     * Copyright (c) 2026 Sahil Maisuria (Elliot PXT).
     * Original XTRACY project materials.
     * All rights reserved, subject to applicable third-party licences.
     */
    ```

- [ ] **Step 4: Compilation of Evidentiary Git Logs**
  - Export cryptographic Git commit hashes (`git log --format="%H %ad %an: %s"`) establishing chronological progression from August 2026 to present.
  - Store frozen copy of commit log in `XTRACY_FOUNDER_RECORDS/`.
