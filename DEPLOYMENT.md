# XTRACY Production Deployment Guidelines

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Production Deployment Platforms

XTRACY is standard Next.js 14 App Router application and can be deployed on:
- **Vercel** (Recommended for Next.js)
- **Docker Container**
- **Node.js Production Server** (PM2 / Systemd)

---

## 2. Vercel Deployment

1. Push code repository to GitHub / GitLab / Bitbucket.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_APP_URL`: `https://your-domain.com`
   - `AUTH_SECRET`: Generate a strong random key (`openssl rand -hex 32`)
   - `DATABASE_URL`: PostgreSQL connection string (Optional)
   - `OPENAI_API_KEY`: (Optional for external AI responses)
4. Click **Deploy**.

---

## 3. Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

Build & Run Docker image:
```bash
docker build -t xtracy-app .
docker run -p 3000:3000 xtracy-app
```
