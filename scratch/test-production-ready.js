const http = require('http');

const endpoints = [
  '/',
  '/about',
  '/projects',
  '/certificates',
  '/journey',
  '/contact',
  '/cv',
  '/sitemap.xml',
  '/robots.txt',
  '/admin/login'
];

function testEndpoint(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3005${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isOk = res.statusCode >= 200 && res.statusCode < 400;
        console.log(`[${isOk ? 'PASS' : 'FAIL'}] ${path} - Status: ${res.statusCode} (Length: ${data.length})`);
        resolve({ path, status: res.statusCode, ok: isOk });
      });
    }).on('error', (err) => {
      console.log(`[FAIL] ${path} - Error: ${err.message}`);
      resolve({ path, status: 500, ok: false, error: err.message });
    });
  });
}

async function runProductionCheck() {
  console.log('=== STARTING PRODUCTION AUDIT TEST ===\n');
  let passed = 0;
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    if (res.ok) passed++;
  }
  console.log(`\n=== SUMMARY: ${passed}/${endpoints.length} ENDPOINTS PASSED ===`);
}

runProductionCheck();
