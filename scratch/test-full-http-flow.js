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

async function runTest() {
  try {
    console.log('--- Step 1: GET /admin/login ---');
    const step1 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/login', method: 'GET'
    });
    const cookie = step1.headers['set-cookie'] ? step1.headers['set-cookie'][0].split(';')[0] : '';
    const csrfMatch = step1.body.match(/name="_csrf" value="([^"]+)"/);
    const csrf1 = csrfMatch ? csrfMatch[1] : '';
    console.log('Step 1 Cookie:', cookie);
    console.log('Step 1 CSRF Token:', csrf1);

    console.log('\n--- Step 2: POST /admin/login ---');
    const loginBody = querystring.stringify({
      _csrf: csrf1,
      username: 'admin',
      password: 'admin123'
    });
    const step2 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/login', method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(loginBody)
      }
    }, loginBody);

    const authCookie = step2.headers['set-cookie'] ? step2.headers['set-cookie'][0].split(';')[0] : cookie;
    console.log('Step 2 Status:', step2.statusCode, 'Location:', step2.headers.location);
    console.log('Step 2 Auth Cookie:', authCookie);

    console.log('\n--- Step 3: GET /admin/journey ---');
    const step3 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/journey', method: 'GET',
      headers: { 'Cookie': authCookie }
    });
    console.log('Step 3 Status:', step3.statusCode);
    const csrfMatch2 = step3.body.match(/name="_csrf" value="([^"]+)"/);
    const csrf2 = csrfMatch2 ? csrfMatch2[1] : csrf1;
    console.log('Step 3 CSRF Token:', csrf2);

    console.log('\n--- Step 4: POST /admin/journey/8 (multipart/form-data WITHOUT query csrf) ---');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const bodyParts1 = [
      `--${boundary}\r\nContent-Disposition: form-data; name="_csrf"\r\n\r\n${csrf2}\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nFullstack Web Developer (HTTP Test)\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="date"\r\n\r\n2023-05-01\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nexperience\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nTesting update via multipart HTTP request\r\n`,
      `--${boundary}--\r\n`
    ];
    const multipartBody1 = Buffer.concat(bodyParts1.map(p => Buffer.from(p)));

    const step4 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/journey/8', method: 'POST',
      headers: {
        'Cookie': authCookie,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody1.length
      }
    }, multipartBody1);

    console.log('Step 4 (Without ?_csrf in action URL) Status:', step4.statusCode, 'Location:', step4.headers.location);
    if (step4.statusCode === 403) {
      console.log('>>> CONFIRMED! Step 4 returned 403 Forbidden because req.body._csrf is missing when CSRF middleware runs before Multer!');
    }

    console.log('\n--- Step 5: POST /admin/journey/8 (multipart/form-data WITH ?_csrf in query) ---');
    const step5 = await makeRequest({
      hostname: 'localhost', port: 3005, path: `/admin/journey/8?_csrf=${csrf2}`, method: 'POST',
      headers: {
        'Cookie': authCookie,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody1.length
      }
    }, multipartBody1);

    console.log('Step 5 (WITH ?_csrf in action URL) Status:', step5.statusCode, 'Location:', step5.headers.location);

  } catch (err) {
    console.error('Test error:', err);
  }
}

runTest();
