# 04 — THIRD-PARTY DEPENDENCY REGISTER & SPDX LICENSES

**Project**: XTRACY Cybersecurity Intelligence Platform
**Auditor**: Sahil Maisuria (Elliot PXT) / PhantomXTrace (PXT)
**Date**: November 10, 2026

---

## 1. Runtime Production Dependencies

| Package | Version | SPDX License | Upstream Author / Entity | Permissive | Copyleft (GPL) |
|---|---|---|---|---|---|
| `next` | `14.2.5` | MIT | Vercel, Inc. | Yes | No |
| `react` | `18.3.1` | MIT | Meta Platforms, Inc. | Yes | No |
| `react-dom` | `18.3.1` | MIT | Meta Platforms, Inc. | Yes | No |
| `clsx` | `2.1.1` | MIT | Luke Edwards | Yes | No |
| `tailwind-merge` | `2.5.2` | MIT | Dany Castillo | Yes | No |
| `lucide-react` | `0.428.0` | ISC | Lucide Contributors | Yes | No |
| `zustand` | `4.5.5` | MIT | Paul Henschel | Yes | No |
| `framer-motion` | `11.3.28` | MIT | Framer B.V. | Yes | No |

---

## 2. Development & Build Tooling Dependencies

| Package | Version | SPDX License | Upstream Author / Entity | Permissive | Copyleft (GPL) |
|---|---|---|---|---|---|
| `typescript` | `5.5.4` | Apache-2.0 | Microsoft Corporation | Yes | No |
| `tailwindcss` | `3.4.10` | MIT | Tailwind Labs, Inc. | Yes | No |
| `postcss` | `8.4.41` | MIT | Andrey Sitnik | Yes | No |
| `autoprefixer` | `10.4.20` | MIT | Andrey Sitnik | Yes | No |
| `eslint` | `8.57.0` | MIT | OpenJS Foundation | Yes | No |
| `eslint-config-next` | `14.2.5` | MIT | Vercel, Inc. | Yes | No |
| `@types/node` | `20.14.12` | MIT | DefinitelyTyped Contributors | Yes | No |
| `@types/react` | `18.3.3` | MIT | DefinitelyTyped Contributors | Yes | No |
| `@types/react-dom` | `18.3.0` | MIT | DefinitelyTyped Contributors | Yes | No |

---

## 3. Compliance Summary

- **Total Direct Runtime Dependencies**: 8
- **Total Development Dependencies**: 9
- **Permissive License Ratio**: 100% (MIT, ISC, Apache-2.0)
- **Reciprocal / Viral Licenses**: 0% (Zero GPL, AGPL, or SSPL dependencies)
- **Attribution Policy**: All licenses are honored in [NOTICE.md](../NOTICE.md) and [docs/THIRD_PARTY_LICENSE_AUDIT.md](../docs/THIRD_PARTY_LICENSE_AUDIT.md).
