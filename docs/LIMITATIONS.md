# XTRACY Technical & Operational Limitations

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Target Release**: `v2.1 Final Ascension`

---

## 1. Passive Inspection Boundaries

1. **Passive External Scope**: XTRACY performs passive public network diagnostic lookups only (DNS records, HTTP headers, TLS certificate parameters). It does not execute unauthorized port scans, penetration tests, or active vulnerability exploits against third-party systems.
2. **Local Fallback Transparency**: When external API keys (`VIRUSTOTAL_API_KEY`, `SAFE_BROWSING_API_KEY`) are not provided, XTRACY relies entirely on local deterministic heuristic algorithms. Findings derived locally are explicitly labeled `"Data Source: Local Rule Engine"`.

---

## 2. Cryptographic Scope & Legal Limitations

1. **Integrity vs. Chain-of-Custody**: SHA-256 evidence hashing and ECDSA case signatures establish cryptographic data continuity (proving data has not been altered since hashing). It does not replace formal law-enforcement chain-of-custody, forensic subpoena processes, or court-certified evidentiary standards.
2. **AI Copilot Inference**: AI responses from the XTRACY Copilot are labeled into `VERIFIED FACT`, `SUPPORTED INFERENCE`, or `UNKNOWN`. AI output should always be reviewed by a human security analyst prior to taking production actions.

---

## 3. Network Boundary Limitations

1. **SSRF Blocking Policy**: XTRACY strictly refuses requests targeting private RFC 1918 IP ranges, loopback addresses (`127.0.0.1`), or cloud metadata endpoints (`169.254.169.254`). Scanning internal infrastructure requires authorized credentialed local testing.
