const http = require('http');

async function testProjectsFilter() {
  console.log('--- Testing Public Projects Technology Filter ---');

  // Test 1: GET /projects
  await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:3005/projects', (res) => {
      console.log(`GET /projects Status: ${res.statusCode} (Expected 200)`);
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (body.includes('filter-bar') && body.includes('filter-btn')) {
          console.log('✓ Filter bar and technology buttons found in HTML response!');
        } else {
          return reject(new Error('Filter bar missing from /projects HTML response'));
        }
        resolve();
      });
    }).on('error', reject);
  });

  // Test 2: GET /projects?tech=Node.js
  await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:3005/projects?tech=Node.js', (res) => {
      console.log(`GET /projects?tech=Node.js Status: ${res.statusCode} (Expected 200)`);
      if (res.statusCode === 200) resolve();
      else reject(new Error(`Failed GET /projects?tech=Node.js with status ${res.statusCode}`));
    }).on('error', reject);
  });

  console.log('\n✅ Public Projects Technology Filter Test PASSED successfully!');
  process.exit(0);
}

testProjectsFilter().catch(err => {
  console.error('❌ Filter Test Error:', err);
  process.exit(1);
});
