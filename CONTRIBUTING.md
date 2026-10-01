# Contributing to XTRACY

**Maintainer**: Elliot PXT / PXT ([@PXTsec26-xc](https://github.com/PXTsec26-xc))
**Repository**: `https://github.com/PXTsec26-xc/xtracy.git`

---

## 🛠️ Contribution Guidelines

Thank you for your interest in contributing to XTRACY! We welcome pull requests focused on defensive cybersecurity, bug fixes, UI improvements, and new diagnostic tools.

---

## 📋 Pull Request Submission Workflow

1. **Fork & Clone**: Fork the repository on GitHub and clone your local branch.
   ```bash
   git clone https://github.com/PXTsec26-xc/xtracy.git
   cd xtracy
   ```
2. **Install & Branch**:
   ```bash
   npm install
   git checkout -b feature/your-feature-name
   ```
3. **Coding Standards**:
   - Ensure all new server handlers implement strict input classification gate (`src/lib/server/inputClassifier.ts`).
   - If issuing outbound HTTP requests, enforce SSRF protection via `src/lib/ssrfProtection.ts`.
   - Never fabricate scan progress or threat intelligence results. Use explicit `VERIFIED`, `LOCAL`, or `UNAVAILABLE` labels.
4. **Run Verification & Tests**:
   ```bash
   npx tsc --noEmit
   npm run test
   npm run build
   ```
5. **Submit Pull Request**: Open a pull request against the `main` branch of `PXTsec26-xc/xtracy`.
