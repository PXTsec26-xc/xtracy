# XTRACY API Documentation Reference

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Authentication API Endpoints (`/api/auth`)

### `POST /api/auth/signup`
- **Description**: Registers a new XTRACY user account with server-side password hashing.
- **Request Body**:
  ```json
  {
    "email": "user@domain.com",
    "password": "Password123!",
    "fullName": "Alex Morgan",
    "userRole": "Everyday User"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "user": { "id": "user-123", "email": "user@domain.com" }, "token": "session-token-abc" }
  }
  ```

### `POST /api/auth/login`
- **Description**: Authenticates user credentials against PBKDF2 password hash.
- **Request Body**: `{ "email": "user@domain.com", "password": "Password123!" }`

### `GET /api/auth/me`
- **Description**: Verifies session token header (`Authorization: Bearer <token>`).

---

## 2. Threat Intelligence APIs

### `GET /api/threat-intelligence`
- **Description**: Fetches live vulnerabilities from CISA Known Exploited Vulnerabilities JSON catalog with server caching and fallback.

### `GET /api/cves?id=CVE-2024-XXXX`
- **Description**: Looks up CVE details and technical remediation steps.

### `POST /api/scan`
- **Description**: Runs defensive heuristic risk analysis on URLs, text samples, or email headers.
- **Request Body**: `{ "content": "https://suspicious-bank-login.com", "inputType": "url" }`

---

## 3. Community Threat Submissions APIs (`/api/submissions`)

### `GET /api/submissions`
- **Description**: Returns verified public community threat reports.

### `POST /api/submissions`
- **Description**: Submits a suspicious scam link or smishing SMS to the community verification queue.

---

## 4. User Data Persistence APIs (`/api/user`)

- `GET / POST / DELETE /api/user/scans`: Manage saved scan history.
- `GET / POST / DELETE /api/user/bookmarks`: Manage bookmarked CVE advisories.
- `GET / POST / DELETE /api/user/incidents`: Manage incident recovery cases.
- `GET / POST / DELETE /api/user/vault`: Store and retrieve client-side WebCrypto encrypted vault notes ciphertext (`encryptedContent`, `iv`, `salt`).
- `GET / DELETE /api/user/privacy`: Inspect stored profile data breakdown or execute full account data wipe.

---

## 5. System Health & Diagnostics

- `GET /api/health`: System health monitor endpoint.
- `GET /api/security-audit`: System security audit and integrity check endpoint.
- `POST /api/assistant`: XTRACY Defensive AI Assistant endpoint supporting 3 reading modes.
