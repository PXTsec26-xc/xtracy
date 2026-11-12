import { randomBytes } from 'crypto';

/**
 * Environment configuration validator and safe runtime default manager.
 * Generates an ephemeral per-process runtime secret when AUTH_SECRET is not provided.
 */

const EPHEMERAL_RUNTIME_SECRET = randomBytes(32).toString('hex');

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
  HAVEIBEENPWNED_API_KEY: process.env.HAVEIBEENPWNED_API_KEY || '',
  AUTH_SECRET: process.env.AUTH_SECRET || EPHEMERAL_RUNTIME_SECRET,
  HAS_CONFIGURED_AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
};
