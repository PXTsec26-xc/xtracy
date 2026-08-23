# XTRACY Installation & Local Setup Guide

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. System Requirements

- **Node.js**: v18.17.0 or v20.x
- **Package Manager**: npm (v9+), yarn, or pnpm
- **Operating System**: Windows, macOS, or Linux

---

## 2. Step-by-Step Installation

### Step 1: Clone or Open Project
```bash
cd c:\Users\maisu\OneDrive\Desktop\xtracy
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Example `.env.local`:
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
CISA_KEV_FEED_URL=https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
CACHE_TTL_SECONDS=3600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3005`) in your web browser.

---

## 3. Optional PostgreSQL Database Setup

If connecting a real PostgreSQL database:
1. Update `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/xtracy_db?schema=public"
   ```
2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
