import https from 'https';

const baseUrl = 'https://xtracy-5x9it9dhh-elliot-0187.vercel.app';

const routes = [
  '/',
  '/founder',
  '/about',
  '/tools',
  '/legal',
  '/intellectual-property',
  '/ownership',
  '/press',
  '/governance',
  '/transparency',
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

function checkRoute(path) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          location: res.headers.location,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || data.length,
          hasFounderName: data.includes('Sahil Maisuria'),
          hasAlias: data.includes('Elliot PXT'),
        });
      });
    }).on('error', (err) => {
      resolve({ path, statusCode: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log(`Auditing Vercel Preview Deployment: ${baseUrl}`);
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const path of routes) {
    const res = await checkRoute(path);
    if (res.statusCode === 200) {
      passed++;
      const founderInfo = res.hasFounderName ? ' [Found: Sahil Maisuria (Elliot PXT)]' : '';
      console.log(`✅ [200 OK] ${path.padEnd(30)} (${res.contentType})${founderInfo}`);
    } else {
      failed++;
      console.log(`❌ [${res.statusCode}] ${path.padEnd(30)} -> ${res.location || res.error || ''}`);
    }
  }

  console.log('='.repeat(70));
  console.log(`Total Routes Verified: ${routes.length} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

run();
