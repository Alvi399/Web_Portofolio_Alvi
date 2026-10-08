const http = require('http');
const querystring = require('querystring');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  try {
    // Step 1: Login
    const step1 = await makeRequest({ hostname: 'localhost', port: 3005, path: '/admin/login', method: 'GET' });
    const cookie = step1.headers['set-cookie'][0].split(';')[0];
    const csrf1 = step1.body.match(/name="_csrf" value="([^"]+)"/)[1];

    const loginBody = querystring.stringify({ _csrf: csrf1, username: 'admin', password: 'admin123' });
    const step2 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/login', method: 'POST',
      headers: { 'Cookie': cookie, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(loginBody) }
    }, loginBody);
    const authCookie = step2.headers['set-cookie'][0].split(';')[0];

    // Step 2: Test Certificate Update
    const certPage = await makeRequest({ hostname: 'localhost', port: 3005, path: '/admin/certificates', method: 'GET', headers: { 'Cookie': authCookie } });
    const csrfCert = certPage.body.match(/name="_csrf" value="([^"]+)"/)[1];

    const certBoundary = '----WebKitFormBoundaryCertTest';
    const certParts = [
      `--${certBoundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nAWS Certified Developer - Associate\r\n`,
      `--${certBoundary}\r\nContent-Disposition: form-data; name="issuer"\r\n\r\nAmazon Web Services\r\n`,
      `--${certBoundary}\r\nContent-Disposition: form-data; name="date"\r\n\r\n2023-11-10\r\n`,
      `--${certBoundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nBackend\r\n`,
      `--${certBoundary}--\r\n`
    ];
    const certBody = Buffer.concat(certParts.map(p => Buffer.from(p)));

    const certRes = await makeRequest({
      hostname: 'localhost', port: 3005, path: `/admin/certificates/6?_csrf=${csrfCert}`, method: 'POST',
      headers: { 'Cookie': authCookie, 'Content-Type': `multipart/form-data; boundary=${certBoundary}`, 'Content-Length': certBody.length }
    }, certBody);
    console.log('Certificate Update HTTP Status:', certRes.statusCode, '(Expected 302)');

    // Step 3: Test Testimonial Update
    const testPage = await makeRequest({ hostname: 'localhost', port: 3005, path: '/admin/testimonials', method: 'GET', headers: { 'Cookie': authCookie } });
    const csrfTest = testPage.body.match(/name="_csrf" value="([^"]+)"/)[1];

    const testBoundary = '----WebKitFormBoundaryTestimTest';
    const testParts = [
      `--${testBoundary}\r\nContent-Disposition: form-data; name="name"\r\n\r\nBudi Santoso\r\n`,
      `--${testBoundary}\r\nContent-Disposition: form-data; name="position"\r\n\r\nCTO\r\n`,
      `--${testBoundary}\r\nContent-Disposition: form-data; name="quote"\r\n\r\nAlvi is an exceptional developer.\r\n`,
      `--${testBoundary}--\r\n`
    ];
    const testBody = Buffer.concat(testParts.map(p => Buffer.from(p)));

    const testRes = await makeRequest({
      hostname: 'localhost', port: 3005, path: `/admin/testimonials/6?_csrf=${csrfTest}`, method: 'POST',
      headers: { 'Cookie': authCookie, 'Content-Type': `multipart/form-data; boundary=${testBoundary}`, 'Content-Length': testBody.length }
    }, testBody);
    console.log('Testimonial Update HTTP Status:', testRes.statusCode, '(Expected 302)');

    // Step 4: Test Skill Update
    const skillPage = await makeRequest({ hostname: 'localhost', port: 3005, path: '/admin/skills', method: 'GET', headers: { 'Cookie': authCookie } });
    const csrfSkill = skillPage.body.match(/name="_csrf" value="([^"]+)"/)[1];

    const skillBody = querystring.stringify({
      _csrf: csrfSkill,
      name: 'JavaScript',
      category: 'Frontend',
      proficiency: 90
    });

    const skillRes = await makeRequest({
      hostname: 'localhost', port: 3005, path: `/admin/skills/31?_csrf=${csrfSkill}`, method: 'POST',
      headers: { 'Cookie': authCookie, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(skillBody) }
    }, skillBody);
    console.log('Skill Update HTTP Status:', skillRes.statusCode, '(Expected 302)');

  } catch (err) {
    console.error('All Tests Error:', err);
  }
}

runAllTests();
