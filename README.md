# XTRACY — Personal Safety & Cyber Intelligence Platform

> **Tagline:** Trace. Analyze. Protect.  
> **Initiative:** PXT sec26  
> **Project Concept:** Free, Privacy-First Public Digital Safety & Cybersecurity Intelligence Platform  

---

## 👥 Project Team & Credits

| Role | Team Member |
| :--- | :--- |
| **Lead Cybersecurity & Platform Architecture** | **Anshika Goswami** |
| **Full-Stack Development & UX Engineering** | **Harvi Patel** |
| **Security Intelligence & Data Engineering** | **Dhruvi Solanki** |

---

## 🌟 Executive Summary

**XTRACY** is a free public digital safety, cybersecurity intelligence, privacy awareness, emergency guidance, and women's safety platform built for ordinary people, students, professionals, and cybersecurity learners.

The central mission of XTRACY is:
> *"A global threat should become a clear, personalized action for the individual."*

Instead of merely reporting that a vulnerability, scam, or data breach occurred, XTRACY answers:
- **Does this affect me?** (Personal Relevance Engine matching user device footprint)
- **How serious is it?** (Risk Meter & Data Trust System)
- **What should I do right now?** (3-Tier Explanations: Beginner, Student, Professional)
- **Where can I get official help if I am in danger?** (India Emergency Contact Center: 112, 181, 100, 1930)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 App Router (`TypeScript`, `React 18`)
- **Styling & Theme**: Vanilla CSS + Tailwind CSS (XTRACY Dark Intelligent Glass Grid Architecture)
- **State Management**: Zustand (Persistent Local Storage Middleware)
- **Client Encryption**: Web Crypto API (AES-GCM 256-bit with PBKDF2 passphrase key derivation)
- **Database & Persistence Layer**: Prisma ORM with PostgreSQL schema (Server-side abstraction with local dev memory fallback)
- **Live Intelligence Feeds**: CISA Known Exploited Vulnerabilities (KEV) public JSON dataset fetcher with server-side caching & fallback store
- **PWA & Offline Capability**: Service Worker (`public/sw.js`) caching emergency numbers (112, 181, 100, 1930) and incident decision flows
- **AI Integration**: XTRACY Defensive AI Assistant (`src/lib/server/aiProvider.ts` with API key abstraction & built-in Defensive Cyber Safety Rule Engine)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.x or 20.x installed
- npm / yarn / pnpm

### Installation

```bash
# Clone or navigate to project directory
cd xtracy

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3005`) in your web browser.

---

## 📄 License & Attribution

Developed under the **PXT sec26** initiative by Anshika Goswami, Harvi Patel, and Dhruvi Solanki for educational, academic demonstration, and public safety awareness purposes.
