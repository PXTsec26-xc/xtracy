# XTRACY Verified Version Changelog

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Repository**: `https://github.com/PXTsec26-xc/xtracy.git`

---

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
