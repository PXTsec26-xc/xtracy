# XTRACY Installation & Local Setup Guide

> **Initiative:** PXT sec26  
> **Platform:** Production Cybersecurity & Intelligence Platform

---

## 1. Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`
- **Git**

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/xtracy.git
cd xtracy
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

Key environment configuration variables:
```ini
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# Optional: Live Threat Intelligence Feeds
CISA_KEV_FEED_URL=https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
CACHE_TTL_SECONDS=3600

# Optional: AI Provider (Leave empty for Standby Rule Engine Mode)
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here

# Optional: External Reputation (Leave empty for Local Heuristic Mode)
# VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
# SAFE_BROWSING_API_KEY=your_google_safe_browsing_key_here
```

### Step 4: Run Automated Tests
```bash
npm run test
```

### Step 5: Start Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 6: Build for Production
```bash
npm run build
npm run start
```
