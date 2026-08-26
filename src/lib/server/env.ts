/**
 * Environment configuration validator and default fallback manager.
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  CISA_KEV_FEED_URL:
    process.env.CISA_KEV_FEED_URL ||
    'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60', 10),
  IS_DATABASE_CONNECTED: Boolean(process.env.DATABASE_URL),

  // External Security & AI Providers (Optional with honest unconfigured fallback)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY || '',
  SAFE_BROWSING_API_KEY: process.env.SAFE_BROWSING_API_KEY || '',
  AUTH_SECRET: process.env.AUTH_SECRET || 'xtracy_dev_secret_jwt_key_2026',
};
