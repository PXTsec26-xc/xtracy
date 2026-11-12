# XTRACY Verified Version Changelog

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Repository**: `https://github.com/PXTsec26-xc/xtracy.git`

---

## [v2.2 Global Platform & Security Upgrade] - 2026-11-12
- **Dependency Security**: Upgraded Next.js and `eslint-config-next` to `15.5.29` (eliminating all 25 critical framework advisories) while preserving React 18 compatibility; patched `source-map-js` vulnerability via non-breaking dependency resolution.
- **SSRF & Network Boundary Hardening**: Added DNS-pinned HTTP/HTTPS fetch (`safeHttpFetch`, `executePinnedHttpRequest`) in `src/lib/ssrfProtection.ts` and separated pure isomorphic URL/IP checks into `src/lib/ssrfValidation.ts` (including IPv6-mapped IPv4 hex, decimal IP, CGNAT, and redirect-hop validation); enforced strict port restrictions (disallowing SSH/internal ports) on `/api/tools/ssl-inspector`.
- **Cryptography & Evidence Integrity**: Upgraded SafeVault PBKDF2-HMAC-SHA256 default iterations to 310,000 (with legacy 100,000 fallback) and AES-GCM 256-bit client-side encryption; wired real `/verify/[report-id]` ECDSA P-256 CaseSeal + RFC 8785 verification; upgraded server password hashing to PBKDF2-HMAC-SHA256 (210,000 iterations, `timingSafeEqual`).
- **Authentication & Stateless Token Recovery**: Implemented HMAC-SHA256 signed session tokens with `timingSafeEqual` and stateless claim reconstruction (`sub`, `email`, `fullName`, `userRole`, `isEmailVerified`) across serverless instances, token revocation on `/api/auth/logout` and `/api/auth/change-password`, rate limiting, bounded JSON body parsing, and sanitized error handling across API routes.
- **External Threat & AI Integrations**: Audited VirusTotal v3 and Google Safe Browsing v4 providers with honest status reporting and timeouts; wired live Google Gemini REST API (`gemini-2.0-flash`) in `src/lib/server/aiProvider.ts` with transparent fallback to deterministic local defensive engine.
- **Global Safety Center & Knowledge Base**: Expanded `/global-safety` to 68 country/region profiles and 90 verified official safety resources, and `/learning` to 105 cybersecurity knowledge modules.
- **Accessibility (WCAG 2.2 AA) & UI**: Connected `AccessibilityAnnouncer` and `globals.css` to apply text sizing, high contrast, reduced motion (`prefers-reduced-motion`), and `:focus-visible` outlines globally; added `aria-pressed`, `aria-expanded`, `aria-haspopup`, `role="tab"`, and `<label htmlFor>` associations across interactive tools and forms.
- **Public Privacy & Sole Founder Attribution**: Sanitized public documentation/scripts, standardized attribution to sole founder `Elliot | PhantomXTrace (PXT) | Sole Founder`, and labeled `/organization` as an interactive UI preview.
- **Verification**: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), `npm test` (30/30 passed), `npm run verify` (160/160 passed), `npm run build` (132/132 static pages + API routes compiled).

## [v2.1 Final Ascension] - 2026-09-13
- **Graph Intelligence Engine**: Implemented `graphEngine.ts` to construct evidence-backed entity graphs (`RESOLVES_TO`, `HOSTED_ON`, `OBSERVED_IN`, `SUPPORTS`).
- **Temporal Intelligence Engine**: Implemented `temporalEngine.ts` to track chronological state changes categorized into `FACT`, `OBSERVATION`, `INFERENCE`, and `RECOMMENDATION`.
- **Security Twin Model**: Added `securityTwin.ts` to model security representation for authorized targets.
- **Case Workspace Engine**: Added `caseEngine.ts` for investigation dossier tracking (`XTR-CASE-xxx`).
- **Copilot Evidence Labels**: Upgraded AI Copilot handler in `/api/assistant` to output explicit evidence tags (`VERIFIED FACT`, `SUPPORTED INFERENCE`, `UNKNOWN`).
- **Unified Search Layer**: Added `/api/search` handler to query indexed platform tools, cases, and policies.

## [v2.0 Executive UI Release] - 2026-08-27
- **Executive Security Theme**: Refined deep navy glassmorphism color palette and backdrop blur depth.
- **Geometric Logo Emblem**: Created stylized vector X logo (`XtracyLogo.tsx`) with brand lockup for Elliot PXT / PXT.

## [v1.5 Security & Input Gate Release] - 2026-08-26
- **SSRF Protection Filter**: Added pre-resolution DNS lookup blocking private IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback, and cloud metadata (`169.254.169.254`).
- **PhishLens Calibration**: Calibrated indicator weighting, multi-vector combinations, and score floor rules.
- **Report Generator & Verifier**: Implemented WebCrypto browser-native report hash calculation and verification center (`/verifier`).
