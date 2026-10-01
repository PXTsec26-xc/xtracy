# XTRACY MASTER API REFERENCE SPECIFICATION

**Specification**: OpenAPI 3.0 Aligned Specification
**Target Host**: `https://xtracy.vercel.app`
**Date of Compilation**: September 13, 2026

---

## 📡 API ROUTE CATALOG (44 VERIFIED ENDPOINTS)

### Core Scanner & Diagnostic Endpoints
1. `POST /api/tools/scam-check`: Accepts `{ target: string }`. Returns multi-factor risk score & indicator breakdown.
2. `POST /api/tools/phishlens`: Accepts `{ content: string }`. Returns social engineering risk score & tactics breakdown.
3. `POST /api/tools/url-guard`: Accepts `{ url: string }`. Returns redirect chain hops & SSRF validation.
4. `POST /api/tools/dns-intel`: Accepts `{ domain: string }`. Returns A, MX, TXT, and NS DNS records.
5. `POST /api/tools/header-analyzer`: Accepts `{ target: string }`. Returns HTTP security header audit (CSP, HSTS).
6. `POST /api/tools/footprint-checker`: Accepts `{ query: string }`. Returns OSINT exposure breakdown.
7. `POST /api/tools/file-inspector`: Accepts `{ fileName: string, fileHash: string }`. Returns file integrity metadata.
8. `POST /api/tools/hash-utility`: Accepts `{ data: string }`. Returns MD5, SHA-1, and SHA-256 hash strings.
9. `POST /api/tools/ip-subnet`: Accepts `{ ip: string }`. Returns CIDR block allocation and WHOIS data.
10. `POST /api/tools/robots-txt`: Accepts `{ domain: string }`. Returns parsed `/robots.txt` disallow rules.
11. `POST /api/tools/security-posture`: Accepts `{ domain: string }`. Returns defensive control posture summary.
12. `POST /api/tools/security-txt`: Accepts `{ domain: string }`. Returns RFC 9116 `/security.txt` security contact info.
13. `POST /api/tools/ssl-inspector`: Accepts `{ domain: string }`. Returns TLS certificate issuer & expiration date.
14. `POST /api/tools/email-forensics`: Accepts `{ emailHeader: string }`. Returns SPF/DKIM/DMARC routing verification.
15. `POST /api/tools/email-security`: Accepts `{ domain: string }`. Returns domain MX & SPF record assessment.

### Intelligence & Case Management Endpoints
16. `POST /api/nexus/cases`: Accepts `{ input: string }`. Returns NEXUS central intelligence graph & temporal timeline.
17. `GET /api/cases`: Returns saved user investigation case dossiers.
18. `POST /api/cases`: Creates a new investigation case dossier (`XTR-CASE-xxx`).
19. `GET /api/cves`: Returns recent CISA KEV vulnerability data.
20. `GET /api/threat-intelligence`: Returns threat intelligence feeds.
21. `POST /api/search`: Accepts `?q=string`. Returns indexed platform resources, cases, and tools.
22. `POST /api/assistant`: Accepts `{ prompt: string, mode: string }`. Returns Copilot evidence-grounded response.
23. `POST /api/reports/export`: Accepts `{ reportData: object }`. Returns SHA-256 signed report manifest.
24. `POST /api/reports/verification`: Accepts `{ reportId: string, hash: string }`. Returns checksum verification status.

### Authentication & User Account Endpoints
25. `POST /api/auth/signup`: Accepts `{ email, password, name }`. Hashes via PBKDF2 SHA-256.
26. `POST /api/auth/login`: Accepts `{ email, password }`. Verifies PBKDF2 hash & sets HTTP session cookie.
27. `POST /api/auth/logout`: Clears session cookie.
28. `GET /api/auth/me`: Returns currently authenticated session user profile.
29. `POST /api/auth/forgot-password`: Processes password recovery request.
30. `GET /api/user/scans`: Returns authenticated user scan history.
31. `GET /api/user/incidents`: Returns user logged incidents.
32. `GET /api/user/bookmarks`: Returns saved tool bookmarks.
33. `GET /api/user/privacy`: Returns user privacy configuration settings.
34. `GET /api/user/vault`: Returns AES-GCM encrypted vault payloads.

### System, Safety & Health Endpoints
35. `GET /api/health`: Returns system status matrix (HTTP 200 OK).
36. `GET /api/emergency`: Returns global cyber emergency contact portals.
37. `GET /api/global-safety`: Returns public digital safety guidelines.
38. `GET /api/organization`: Returns organizational governance policy.
39. `GET /api/resources`: Returns security learning resources.
40. `GET /api/safety`: Returns public safety tools index.
41. `POST /api/scan`: General multi-target scan handler.
42. `GET /api/security-audit`: Platform security audit status.
43. `GET /api/security-news`: Aggregated cybersecurity news feed.
44. `POST /api/submissions`: Public vulnerability submission portal handler.
