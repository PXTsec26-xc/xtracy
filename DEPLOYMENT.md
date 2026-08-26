# XTRACY Production Deployment & Operations Guide

> **Initiative:** PXT sec26  
> **Platform Version:** 2.0.0 (Production Release)  
> **Architecture:** Next.js 14 App Router, WebCrypto Client-Side Vault, SSRF-Hardened Node.js Resolvers

---

## 1. Supported Deployment Approaches

| Deployment Target | Best Suited For | Maintenance | Recommended |
| :--- | :--- | :--- | :--- |
| **Vercel** | Global Edge CDN, automated CI/CD, zero-ops Next.js | Low | ⭐ **(Recommended)** |
| **Linux VPS / Cloud VM** | Ubuntu / Debian with Nginx reverse proxy & Systemd | Medium | Direct Server Hosting |
| **Docker / Container** | Kubernetes, AWS ECS, GCP Cloud Run, Render | Medium | Microservices & Clusters |

---

## 2. Option A: Deploying to Vercel (Recommended)

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Ensure your repository is pushed to your remote Git provider.

### Step 2: Import Project on Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New Project"** and select your `xtracy` repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Root Directory: `./` (default).

### Step 3: Configure Production Environment Variables
In the Vercel project configuration panel, add the following variables:

```ini
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Security Secret (Generate a strong 64-character secret)
AUTH_SECRET=your_generated_production_auth_secret_string

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120

# Live CISA Threat Intelligence Feed
CISA_KEV_FEED_URL=https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
CACHE_TTL_SECONDS=3600

# (Optional) PostgreSQL Database (e.g. Vercel Postgres, Supabase, Neon, AWS RDS)
# DATABASE_URL=postgresql://user:password@host:5432/xtracy_db?sslmode=require

# (Optional) AI Copilot Live Keys (Leave unset for honest Standby Rule Engine Mode)
# GEMINI_API_KEY=your_gemini_api_key
# OPENAI_API_KEY=your_openai_api_key

# (Optional) URL Guard Reputation Keys (Leave unset for Local Heuristic Mode)
# VIRUSTOTAL_API_KEY=your_virustotal_api_key
# SAFE_BROWSING_API_KEY=your_google_safe_browsing_key
```

### Step 4: Click Deploy
Vercel will execute `npm run build` and deploy all 102 routes to its global edge network with automatic HTTPS certificates.

---

## 3. Option B: Deploying to Linux VPS (Ubuntu / Debian + Nginx + PM2)

### Step 1: Install Node.js and PM2
```bash
# Update package list and install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

### Step 2: Clone & Build XTRACY
```bash
# Clone to web root
cd /var/www
sudo git clone https://github.com/your-org/xtracy.git
cd xtracy

# Install dependencies and build
sudo npm install
sudo cp .env.production.example .env.production

# Edit production variables
sudo nano .env.production

# Build optimized production bundle
sudo npm run build
```

### Step 3: Run with PM2 Process Manager
```bash
# Start Next.js with PM2 on port 3000
pm2 start npm --name "xtracy" -- start

# Configure PM2 to auto-start on server reboot
pm2 startup
pm2 save
```

### Step 4: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/xtracy`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and obtain free Let's Encrypt SSL:
```bash
sudo ln -s /etc/nginx/sites-available/xtracy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install Certbot for HTTPS
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 4. Option C: Containerized Deployment (Docker)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run container:
```bash
docker build -t xtracy:latest .
docker run -d -p 3000:3000 --env-file .env.production --name xtracy-app xtracy:latest
```

---

## 5. Pre-Flight Verification Checklist

Before opening public traffic:
- [x] Run `npm run test` (15/15 unit and security tests passing).
- [x] Run `npm run verify` (141/141 comprehensive production checks passing).
- [x] Run `npm run lint` (0 errors, 0 warnings).
- [x] Run `npx tsc --noEmit` (0 type errors).
- [x] Verify `AUTH_SECRET` is set to a unique 64-character random string.
- [x] Confirm HTTPS certificate is active and HSTS header is present.

---

## 6. Post-Deployment Smoke Tests

1. **URL Guard Test**: Visit `/tools/url-guard`, submit `https://github.com`, verify real entropy and factor score render.
2. **DNS Intel Test**: Visit `/tools/dns-intel`, submit `cloudflare.com`, verify real A/MX/NS records resolve.
3. **Headers Audit Test**: Visit `/tools/header-analyzer`, submit your domain, verify live grading.
4. **Safe Vault Test**: Visit `/safe-vault`, set a master passphrase, create an encrypted note, reload page, unlock and verify plaintext.
5. **SSRF Guard Test**: In `/tools/header-analyzer`, submit `http://127.0.0.1`, confirm it is rejected with `Security Exception`.
