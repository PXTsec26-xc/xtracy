# XTRACY Testing & Verification Guide

> **Initiative:** PXT sec26  
> **Platform Version:** 2.0.0

---

## 1. Automated Test Suite

XTRACY includes an automated unit and defensive security test suite (`scripts/test-suite.mjs`):

```bash
npm run test
```

### Verified Test Cases:
1. **Shannon Entropy**: Mathematical verification of low vs high entropy strings.
2. **SSRF Protections**:
   - Blocks `localhost`, `127.0.0.1`, and loopback interfaces.
   - Blocks AWS/GCP cloud metadata IP `169.254.169.254`.
   - Blocks RFC 1918 private subnets (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`).
   - Blocks non-standard administrative TCP ports.
   - Permits valid public HTTPS endpoints.
3. **Cryptographic Hashes**: SHA-256 and SHA-512 cryptographic digest consistency.
4. **Subnet Math**: CIDR calculations, usable host formulas, network/broadcast address resolution.
5. **Base64 & Hex Conversion**: Bidirectional encode/decode fidelity.
6. **Defensive Guardrails**: Rejection of offensive intrusion keywords; allowance of defensive hardening inquiries.

---

## 2. Type Checking & Production Build Validation

### TypeScript Validation
```bash
npx tsc --noEmit
```

### Next.js Production Build
```bash
npm run build
```

Both commands compile cleanly with 0 type errors across all 102 routes.
