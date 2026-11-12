# XTRACY Database Schema Specification (Target Relational Model & Runtime Storage)

> **Founder & Brand:** Elliot | PhantomXTrace (PXT) | Sole Founder  
> **Founder Designation:** Elliot PXT sec26  

---

## 1. Relational Entity Relationship & Storage Architecture

[prisma/schema.prisma](prisma/schema.prisma) defines the target 6-model **PostgreSQL / Prisma ORM** schema (`User`, `UserProfile`, `SavedScan`, `SavedBookmark`, `IncidentRecord`, `VaultNote`).  
**Current Runtime Disclosure:** `prisma` and `@prisma/client` are not yet installed in `package.json`. When no external PostgreSQL database is wired, active server execution uses ephemeral in-memory stores (`src/lib/server/authProvider.ts` and `src/lib/server/memoryStores.ts`), while client Safe Vault ciphertexts persist locally in browser `localStorage`.

### A. User Model (`User`)
- `id` (String, Primary Key, UUID)
- `email` (String, Unique, Indexed)
- `passwordHash` (String, PBKDF2-HMAC-SHA256 at 210,000 iterations with 16-byte CSPRNG salt, verified via `timingSafeEqual`)
- `fullName` (String)
- `avatarUrl` (String, Optional)
- `isEmailVerified` (Boolean, Default: false)
- `userRole` (String, Default: "Everyday User")
- `createdAt` (DateTime, Default: now())
- `updatedAt` (DateTime, UpdatedAt)

### B. User Profile Model (`UserProfile`)
- `id` (String, Primary Key, UUID)
- `userId` (String, Unique, Foreign Key -> User.id, OnDelete: Cascade)
- `operatingSystems` (String Array)
- `devices` (String Array)
- `browsers` (String Array)
- `emailProviders` (String Array)
- `socialMedia` (String Array)
- `onlineServices` (String Array)
- `dataMinimization` (Boolean, Default: true)
- `localVaultOnly` (Boolean, Default: true)
- `anonymousScans` (Boolean, Default: true)
- `criticalAlerts` (Boolean, Default: true)
- `weeklySecurityDigest` (Boolean, Default: false)
- `womensSafetyUpdates` (Boolean, Default: true)
- `primaryEmergencyNumber` (String, Default: "112")
- `quickExitEnabled` (Boolean, Default: true)
- `updatedAt` (DateTime, UpdatedAt)

### C. Saved Scan Model (`SavedScan`)
- `id` (String, Primary Key, UUID)
- `userId` (String, Foreign Key -> User.id, OnDelete: Cascade)
- `inputType` (String: "url", "text", "email")
- `inputSample` (String)
- `riskScore` (Integer: 0 to 100)
- `riskLevel` (String: "LOW", "MEDIUM", "HIGH")
- `warningSigns` (String Array)
- `analyzedAt` (DateTime, Default: now())

### D. Saved Bookmark Model (`SavedBookmark`)
- `id` (String, Primary Key, UUID)
- `userId` (String, Foreign Key -> User.id, OnDelete: Cascade)
- `reportId` (String)
- `title` (String)
- `category` (String)
- `severity` (String)
- `savedAt` (DateTime, Default: now())

### E. Incident Case Model (`IncidentRecord`)
- `id` (String, Primary Key, UUID)
- `userId` (String, Foreign Key -> User.id, OnDelete: Cascade)
- `scenarioId` (String)
- `title` (String)
- `status` (String: "IN_PROGRESS", "RESOLVED", "RECOVERING")
- `checklistJson` (String, Default: "{}")
- `notes` (String)
- `createdAt` (DateTime, Default: now())
- `updatedAt` (DateTime, UpdatedAt)

### F. Vault Note Model (`VaultNote`)
- `id` (String, Primary Key, UUID)
- `userId` (String, Foreign Key -> User.id, OnDelete: Cascade)
- `title` (String)
- `category` (String)
- `encryptedContent` (String, WebCrypto AES-GCM Ciphertext)
- `iv` (String, Initialization Vector Base64/Hex)
- `salt` (String, PBKDF2 Salt Base64/Hex)
- `createdAt` (DateTime, Default: now())
- `updatedAt` (DateTime, UpdatedAt)
