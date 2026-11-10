# INTELLECTUAL PROPERTY OWNERSHIP RECORD

**Project**: XTRACY Cybersecurity Intelligence Platform
**Founder**: Sahil Maisuria (Elliot PXT)
**Organization / Group**: PhantomXTrace (PXT)
**Repository**: `https://github.com/PXTsec26-xc/xtracy`
**Live Site**: `https://xtracy.vercel.app`

---

## 1. Ownership Inventory Overview

This document provides a formal inventory of intellectual property assets embodied in the XTRACY platform, categorizing proprietary authored materials, brand identity assets, and third-party software dependencies.

---

## 2. Proprietary Authored Materials

The following software artifacts were authored originally by **Sahil Maisuria (Elliot PXT)** under the **PhantomXTrace (PXT)** research identity:

### A. Algorithmic & Server-Side Security Engines
1. **XTRACY NEXUS Multi-Vector Classifier** (`src/lib/server/nexusEngine.ts`):
   - Deterministic indicator classification (IP, URL, domain, MD5/SHA-256 hash, email, raw scam lure).
   - Weighted explainable risk factor scoring algorithm (+/- point accumulation system).
2. **Entity Graph Correlation Engine** (`src/lib/server/graphEngine.ts`):
   - Threat intelligence node-and-edge relational mapping engine.
3. **Temporal Intelligence Engine** (`src/lib/server/temporalEngine.ts`):
   - Chronological risk velocity decay and event sequence tracking.
4. **Security Twin Posture Simulator** (`src/lib/server/securityTwin.ts`):
   - Passive defensive posture emulation and security control evaluation.
5. **SSRF Boundary Protection Module** (`src/lib/ssrfProtection.ts`):
   - Pre-resolution DNS A/AAAA record interceptor for loopback (`127.0.0.0/8`), RFC 1918 private subnets, cloud metadata (`169.254.169.254`), and port blacklisting.
6. **PBKDF2 Password Security Engine** (`src/lib/server/passwordCrypto.ts`):
   - 100,000-iteration PBKDF2 SHA-256 derivation with 16-byte cryptographically secure random salts.
7. **PhishLens Social Engineering Analyzer** (`src/lib/scamRules.ts`, `src/lib/server/phishLensScoring.ts`):
   - Heuristic linguistic parsing for urgency lures, payment demands, and brand impersonation tactics.

### B. Client-Side Cryptographic & Integrity Subsystems
1. **WebCrypto Local Vault Engine** (`src/lib/crypto.ts`):
   - In-memory browser AES-GCM 256-bit encryption with zero plaintext server persistence.
2. **EvidencePulse™ Hash Chaining Pipeline**:
   - Sequential SHA-256 chain construction with RFC 8785 JSON Canonicalization Scheme (JCS) encoding.
3. **Independent Verifier™ & CaseSeal System**:
   - Binary Merkle Tree Root computation, ECDSA P-256 digital signature creation, and external verification package bundling.

### C. Design, UI & Trade Dress Assets
1. **Stylized Geometric XTRACY Logo**:
   - Custom SVG vector mark featuring interlocking diagonal pillars, central diamond core node, and linear cyan accent line.
2. **Executive Cybersecurity Glassmorphism Design System**:
   - Tailored midnight black/navy background hierarchy (`bg-darkBg`, `bg-darkBg-card`, `bg-darkBg-panel`), cyan/electric blue accents, and amber alert visual patterns.
3. **Comprehensive Technical Documentation Suite**:
   - Over 400 pages of original architectural specifications, threat models, testing matrices, and implementation plans.

---

## 3. Brand & Common-Law Trademarks

The following identifiers are used by **Sahil Maisuria** to distinguish the goods and services of XTRACY:
- **XTRACY™**: Primary platform mark for cybersecurity analysis software.
- **XTRACY NEXUS™**: Brand designation for central indicator intelligence.
- **EvidencePulse™**: Brand designation for tamper-evident hash chaining.
- **CaseSeal™**: Brand designation for cryptographically signed evidence packages.
- **PhantomXTrace™ / PXT™**: Research identity and collective brand.

*Status: Unregistered common-law marks. Preparatory filings underway.*

---

## 4. Third-Party Open Source Rights

Sahil Maisuria makes no claim of ownership over third-party open-source libraries incorporated into the platform. These remain the copyrighted property of their respective creators under permissive licenses (MIT, Apache-2.0, ISC). See [docs/THIRD_PARTY_LICENSE_AUDIT.md](docs/THIRD_PARTY_LICENSE_AUDIT.md) for detailed attribution and compliance records.
