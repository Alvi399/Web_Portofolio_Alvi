const http = require('http');
const querystring = require('querystring');
const { User, sequelize } = require('../models');

async function testCsrfAndAuth() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // Get cookie from login
    const loginData = querystring.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const loginReq = http.request({
      hostname: 'localhost',
      port: 3005,
      path: '/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, (res) => {
      console.log('Login Status:', res.statusCode);
      const cookies = res.headers['set-cookie'];
      console.log('Cookies received:', cookies);

      if (cookies) {
        // Now GET /admin/journey to get the CSRF token from page
        const getReq = http.request({
          hostname: 'localhost',
          port: 3005,
          path: '/admin/journey',
          method: 'GET',
          headers: { 'Cookie': cookies.join('; ') }
        }, (res2) => {
          let html = '';
          res2.on('data', chunk => html += chunk);
          res2.on('end', () => {
            console.log('Journey page status:', res2.statusCode);
            const tokenMatch = html.match(/name="_csrf" value="([^"]+)"/);
            const token = tokenMatch ? tokenMatch[1] : null;
            console.log('Extracted CSRF token:', token);

            if (token) {
              // Perform update POST request
              const updateData = querystring.stringify({
                _csrf: token,
                title: 'Fullstack Web Developer',
                description: 'Updated via authenticated test!',
                date: '2023-05-01',
                category: 'experience'
              });

              // First try POST without ?_csrf in URL
              const updateReq1 = http.request({
                hostname: 'localhost',
                port: 3005,
                path: '/admin/journey/8',
                method: 'POST',
                headers: {
                  'Cookie': cookies.join('; '),
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(updateData)
                }
              }, (res3) => {
                console.log('POST without ?_csrf in query status:', res3.statusCode, res3.headers.location);
              });
              updateReq1.write(updateData);
              updateReq1.end();

              // Second try multipart POST with ?_csrf in query
              const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
              const bodyParts = [
                `--${boundary}\r\nContent-Disposition: form-data; name="_csrf"\r\n\r\n${token}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nFullstack Web Developer\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nUpdated via authenticated multipart test!\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="date"\r\n\r\n2023-05-01\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nexperience\r\n`,
                `--${boundary}--\r\n`
              ];
              const multipartBody = Buffer.concat(bodyParts.map(p => Buffer.from(p)));

              const updateReq2 = http.request({
                hostname: 'localhost',
                port: 3005,
                path: `/admin/journey/8?_csrf=${token}`,
                method: 'POST',
                headers: {
                  'Cookie': cookies.join('; '),
                  'Content-Type': `multipart/form-data; boundary=${boundary}`,
                  'Content-Length': multipartBody.length
                }
              }, (res4) => {
                console.log('Multipart POST with ?_csrf in query status:', res4.statusCode, res4.headers.location);
              });
              updateReq2.write(multipartBody);
              updateReq2.end();
            }
          });
        });
        getReq.end();
      }
    });

    loginReq.write(loginData);
    loginReq.end();

  } catch (err) {
    console.error('Error:', err);
  }
}

testCsrfAndAuth();
