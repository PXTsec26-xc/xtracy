# XTRACY Privacy Policy & Design Principles

**Author**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Target Release**: `v2.1 Final Ascension`

---

## 1. Zero-Knowledge Browser Hashing

XTRACY is built around a local-first privacy model. Features requiring file integrity analysis (such as EvidencePulse™) execute SHA-256 and SHA-512 cryptographic calculations natively inside browser client RAM via WebCrypto API (`crypto.subtle.digest`).

- **No File Uploads**: Files selected for hash calculation are **never transmitted** over network sockets.
- **Client Vault Encryption**: Passwords and incident dossiers saved locally are encrypted using AES-GCM 256-bit encryption before storage.

---

## 2. Server Processing & External Requests

When inspecting public targets (URLs, domain DNS records, or HTTP headers):
1. **Target URLs**: Target strings submitted to Scam Check or URL Guard are processed ephemerally in server RAM to calculate heuristic risk scores.
2. **Third-Party Lookups**: If VirusTotal or Google Safe Browsing API keys are configured, public domain queries are transmitted securely via HTTPS. If unconfigured, queries operate 100% locally.
3. **No Private Scraping**: Public OSINT tools inspect only authorized public APIs and developer endpoints.

---

## 3. Data Retention Summary

| Data Category | Processing Location | Network Storage | User Controls |
|---|---|---|---|
| **Evidence Files** | Client Browser RAM | None (Zero upload) | Automatic RAM flush on window close |
| **Encrypted Vault Items** | Client LocalStorage / DB | AES-GCM Encrypted | Clearable via Vault Settings |
| **Session Cookies** | HTTP-Only Cookie | Server SQLite Session | Clearable on Logout |
