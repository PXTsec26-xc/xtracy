# THIRD-PARTY LICENSE AUDIT & LICENSING INCONSISTENCY REPORT

**Project**: XTRACY Cybersecurity Intelligence Platform
**Auditor**: Sahil Maisuria (Elliot PXT) / PhantomXTrace (PXT)
**Audit Standard**: Open Source Initiative (OSI) & SPDX Compliance
**Date**: November 10, 2026

---

## 1. Executive Summary

This audit examines the licensing configuration of the XTRACY project, verifies the licenses of all direct and indirect dependencies, investigates historical licensing inconsistencies within repository documentation, and outlines strict compliance requirements.

---

## 2. Direct Dependencies License Matrix

Every third-party package utilized in the production build has been inspected via `package.json` and `node_modules`:

| Dependency Name | Installed Version | SPDX License | Copyright Owner | License Requirements & Obligations |
|---|---|---|---|---|
| `next` | `14.2.5` | MIT | Vercel, Inc. | Retain copyright notice & permission notice in distributions. |
| `react` | `18.3.1` | MIT | Meta Platforms, Inc. | Retain copyright notice & permission notice in distributions. |
| `react-dom` | `18.3.1` | MIT | Meta Platforms, Inc. | Retain copyright notice & permission notice in distributions. |
| `clsx` | `2.1.1` | MIT | Luke Edwards | Retain copyright notice & permission notice in distributions. |
| `tailwind-merge` | `2.5.2` | MIT | Dany Castillo | Retain copyright notice & permission notice in distributions. |
| `lucide-react` | `0.428.0` | ISC | Lucide Contributors | Retain copyright notice & permission notice in distributions. |
| `zustand` | `4.5.5` | MIT | Paul Henschel | Retain copyright notice & permission notice in distributions. |
| `framer-motion` | `11.3.28` | MIT | Framer B.V. | Retain copyright notice & permission notice in distributions. |
| `typescript` (dev) | `5.5.4` | Apache-2.0 | Microsoft Corporation | Retain copyright, patent grants, and Apache 2.0 notice. |
| `tailwindcss` (dev) | `3.4.10` | MIT | Tailwind Labs, Inc. | Retain copyright notice & permission notice in distributions. |
| `postcss` (dev) | `8.4.41` | MIT | Andrey Sitnik | Retain copyright notice & permission notice in distributions. |
| `autoprefixer` (dev) | `10.4.20` | MIT | Andrey Sitnik | Retain copyright notice & permission notice in distributions. |
| `eslint` (dev) | `8.57.0` | MIT | OpenJS Foundation | Retain copyright notice & permission notice in distributions. |

**Audit Result**: All runtime and build dependencies operate under permissive licenses (MIT, ISC, Apache-2.0). Zero "copyleft" (GPL/AGPL) viral dependencies exist in the repository that would compel forced disclosure or relicensing of proprietary modules.

---

## 3. Investigation of Licensing Inconsistencies

During the audit, the following licensing discrepancies were identified in historical repository files:

1. **Root `package.json`**:
   - Contains `"private": true` without a top-level `"license"` key, indicating a private or proprietary project structure.
2. **Historical `README.md`**:
   - Exhibited a badge claiming `[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE_INDEX.md)`.
   - In the text footer, stated `License: MIT License — See LICENSE_INDEX.md`.
3. **`docs/xtracy-master-dossier/LICENSE_INDEX.md`**:
   - Clarified that the original XTRACY codebase (including `nexusEngine.ts`, `graphEngine.ts`, `temporalEngine.ts`, `securityTwin.ts`, `scamCheck.ts`, `ssrfProtection.ts`, `passwordCrypto.ts`) is *Proprietary source code copyright (c) 2026 Elliot / XTRACY Founder*, while third-party node modules are open-source.

### Root Cause Analysis
The discrepancy arose because the project was scaffolded using open-source template conventions (which frequently default to an MIT badge in README templates), while the core intent of the founder has consistently been to protect original algorithmic innovations and proprietary brand assets under reserved copyright, subject to the open-source licenses of underlying libraries.

### Remediation & Policy
- **No License Relicensing without Explicit Approval**: In accordance with user directives, the repository license will not be altered without explicit founder approval.
- **Clear Demarcation in `NOTICE.md`**: A formal `NOTICE.md` has been instituted to define the boundary between original authored code (All Rights Reserved, subject to applicable third-party licenses) and external permissive dependencies.
- **Harmonized Attribution**: Documentation and README badges are harmonized to reflect accurate status without misleading claims.
