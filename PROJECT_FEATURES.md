# XTRACY Master Feature Matrix & Route Directory

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Feature Directory Index

| Route | Feature Area | Access Level | Data Persistence Mode |
| :--- | :--- | :--- | :--- |
| **`/`** | Home Landing Page | Public | N/A |
| **`/dashboard`** | Unified Security Command Center | Protected | `PERSISTENT` (DB / Memory) |
| **`/scan`** | Quick Scan Center (URL & Smishing Risk Heuristics) | Public / Protected Save | `PERSISTENT` (DB / Memory) |
| **`/emergency`** | Cyber Emergency Response Center | Public | `PUBLIC` (112, 181, 100, 1930) |
| **`/womens-safety`** | Women's Safety & Confidential Emergency Center | Public | `PUBLIC` (100% Local & Quick Exit) |
| **`/threat-map`** | Global Cyber Incident Map | Public | `DEMO` |
| **`/intelligence`** | Live Threat Intelligence Feed (CISA KEV) | Public | `LIVE` / `CACHED` |
| **`/community-feed`**| Public Community Threat Feed | Public | `LIVE` |
| **`/submit-threat`**| Community Threat Report Submission | Public | `LIVE` |
| **`/privacy-footprint`**| Digital Footprint & Privacy Tracker | Protected | `PERSISTENT` (DB / Memory) |
| **`/case-vault`** | Incident Case Vault Workspace | Protected | `PERSISTENT` (DB / Memory) |
| **`/learning`** | Cybersecurity Educational Simulations | Public | `100% EDUCATIONAL` |
| **`/alerts`** | In-App Notification Center | Public | `LIVE` |
| **`/safe-vault`** | Safe Vault (WebCrypto AES-GCM Encrypted Notes) | Protected | `LOCAL AES-GCM` + `PERSISTENT` |
| **`/assistant`** | XTRACY Defensive AI Assistant | Public | `LIVE` / `DEFENSIVE ENGINE` |
| **`/privacy-control`**| User Privacy & Data Control Center | Protected | `PERSISTENT` |
| **`/login`** | Sign In Page | Public | N/A |
| **`/signup`** | Sign Up Page | Public | N/A |
| **`/profile`** | User Profile & Security Archetype | Protected | `PERSISTENT` |
| **`/settings/security`**| Account Security Settings & 2FA | Protected | `PERSISTENT` |
