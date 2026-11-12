import https from 'https';

const baseUrl = process.env.LIVE_URL || 'https://xtracy.vercel.app';

const routes = [
  '/',
  '/founder',
  '/about',
  '/governance',
  '/transparency',
  '/legal',
  '/intellectual-property',
  '/ownership',
  '/press',
  '/changelog',
  '/tools',
  '/global-safety',
  '/learning',
  '/tools/url-guard',
  '/tools/dns-intel',
  '/tools/header-analyzer',
  '/nexus',
  '/scam-check',
  '/safe-vault',
  '/evidencepulse',
  '/test-lab',
  '/brand/xtracy-logo.png',
  '/brand/xtracy-symbol.png',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
];

function checkUrl(path) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    const req = https.get(url, { headers: { 'User-Agent': 'XTRACY-Release-Verifier/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'] || '',
          location: res.headers.location || '',
          dataLength: data.length,
          hasEmailLeak: /@gmail\.com/i.test(data),
          hasPseudonym: data.includes('Elliot') || data.includes('PhantomXTrace'),
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path, statusCode: 'ERR', error: err.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ path, statusCode: 'TIMEOUT' });
    });
  });
}

async function verifyAll() {
  console.log('='.repeat(70));
  console.log('DEPLOYMENT VERIFICATION: ' + baseUrl);
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const path of routes) {
    const res = await checkUrl(path);
    if (res.statusCode === 200 && !res.hasEmailLeak) {
      passed++;
      const identityCheck = res.hasPseudonym ? ' [BRAND: Elliot / PXT]' : '';
      console.log(`[PASS] (HTTP 200) ${path.padEnd(28)} | ${res.contentType.split(';')[0]} [PRIVACY: CLEAN]${identityCheck}`);
    } else {
      failed++;
      console.log(`[FAIL] (HTTP ${res.statusCode}) ${path.padEnd(28)} -> ${res.hasEmailLeak ? 'EMAIL_LEAK' : res.location || res.error || ''}`);
    }
  }

  console.log('='.repeat(70));
  console.log(`Total Routes Verified: ${routes.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(70));

  if (failed > 0) process.exit(1);
}

verifyAll();
