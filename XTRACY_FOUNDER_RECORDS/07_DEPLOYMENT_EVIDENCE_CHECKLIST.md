# 07 — DEPLOYMENT EVIDENCE & LIVE VERIFICATION CHECKLIST

**Project**: XTRACY Cybersecurity Intelligence Platform
**Target Domain**: `https://xtracy.vercel.app`
**Host Infrastructure**: Vercel Serverless & Edge Network
**DNS Status**: Active Authoritative CNAME `cname.vercel-dns.com`
**Founder**: Sahil Maisuria (Elliot PXT)
**Date**: November 10, 2026

---

## 1. Verified Technical Infrastructure Indicators

| Parameter | Verified Value | Evidence Method |
|---|---|---|
| **Production URL** | `https://xtracy.vercel.app` | Authoritative DNS resolution & HTTPS 200 OK |
| **TLS / SSL Certificate** | Let's Encrypt / Google Trust Services ECC | Valid TLS 1.3 negotiated on port 443 |
| **Hosting Platform** | Vercel Edge Network | HTTP Server header: `Vercel` |
| **Framework Engine** | Next.js 14 App Router (Node.js runtime) | Next.js hydration payload & server component rendering |
| **HTTP Security Headers** | HSTS (`max-age=63072000`), CSP, `X-Content-Type-Options: nosniff` | Configured in `next.config.mjs` |
| **Client Storage Policy** | Local browser `localStorage` and WebCrypto memory | Zero central cloud database retention for guest vaults |

---

## 2. Public Verification Steps

To independently verify the active deployment of XTRACY without administrative credentials:

1. **DNS Lookup Verification**:
   ```bash
   nslookup xtracy.vercel.app
   ```
   *Expected Result: Resolves to Vercel Anycast edge IP addresses.*

2. **HTTP Header & TLS Inspection**:
   ```bash
   curl -I https://xtracy.vercel.app
   ```
   *Expected Result: HTTP/2 200 OK, strict security headers, and valid server response.*

3. **In-Browser Test Lab**:
   - Navigate to `https://xtracy.vercel.app/test-lab` to run the in-browser cryptographic test suite validating WebCrypto AES-GCM and SHA-256 in real time.
