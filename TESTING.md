# XTRACY Verification & Quality Assurance Testing Guide

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Automated Build Verification

Execute full production build to verify TypeScript type checking and page static compilation:

```bash
npm run build
```

Expected Output:
```
▲ Next.js 14.2.35
✓ Compiled successfully
✓ Linting and checking validity of types ...
✓ Generating static pages (51/51)
```

---

## 2. QA Verification Checklist

| Test Area | Expected Behavior | Status |
| :--- | :--- | :--- |
| **India Emergency Contacts** | One-tap `tel:112`, `tel:181`, `tel:100`, `tel:1930` call links trigger dialer | **PASS** |
| **Data Trust System** | Displays `● LIVE`, `● CACHED`, `● FALLBACK`, or `● DEMO` badges | **PASS** |
| **Authentication Flow** | Sign Up, Sign In, Profile archetype update, Security settings, Logout | **PASS** |
| **Protected Route Guard** | Unauthenticated access to `/dashboard` or `/safe-vault` prompts Auth Modal | **PASS** |
| **WebCrypto Safe Vault** | Encrypts note plaintext with AES-GCM 256-bit before storing ciphertext | **PASS** |
| **Quick Scan Center** | Scans URLs for threat indicators, bad TLDs, and calculates risk score | **PASS** |
| **Community Feed** | Displays crowdsourced threat reports with verification badges | **PASS** |
| **Defensive AI Assistant** | Responds in Beginner, Student, or Professional reading modes | **PASS** |
| **Unified Command Center** | Smart Risk Engine computes transparent 0-100 risk score with triggers | **PASS** |
| **PWA Service Worker** | `sw.js` caches static assets & emergency numbers for offline access | **PASS** |
| **Privacy Control Center** | Visualizes stored vs local vs never collected data & executes data wipe | **PASS** |
