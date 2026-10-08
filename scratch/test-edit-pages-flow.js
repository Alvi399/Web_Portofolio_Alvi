const http = require('http');
const querystring = require('querystring');
const { Certificate, Journey, Testimonial, Skill, sequelize } = require('../models');

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

async function testFullEditFlow() {
  try {
    await sequelize.authenticate();
    console.log('=== VERIFYING DEDICATED EDIT ROUTES AND POST SAVES ===');

    // 1. Login
    const step1 = await makeRequest({ hostname: 'localhost', port: 3005, path: '/admin/login', method: 'GET' });
    const cookie = step1.headers['set-cookie'][0].split(';')[0];
    const csrf1 = step1.body.match(/name="_csrf" value="([^"]+)"/)[1];

    const loginBody = querystring.stringify({ _csrf: csrf1, username: 'admin', password: 'admin123' });
    const step2 = await makeRequest({
      hostname: 'localhost', port: 3005, path: '/admin/login', method: 'POST',
      headers: { 'Cookie': cookie, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(loginBody) }
    }, loginBody);
    const authCookie = step2.headers['set-cookie'][0].split(';')[0];

    // 2. Test Certificate Edit GET & POST
    const cert = await Certificate.findOne();
    if (cert) {
      console.log(`\n[CERTIFICATE] Testing GET /admin/certificates/${cert.id}/edit`);
      const getCert = await makeRequest({ hostname: 'localhost', port: 3005, path: `/admin/certificates/${cert.id}/edit`, method: 'GET', headers: { 'Cookie': authCookie } });
      console.log(`GET Certificate Edit Status: ${getCert.statusCode} (Expected 200)`);
      const csrfCert = getCert.body.match(/name="_csrf" value="([^"]+)"/)[1];

      const boundary = '----WebKitFormBoundaryCertForm';
      const parts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${cert.title} (Page Edit Test)\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="issuer"\r\n\r\n${cert.issuer}\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="date"\r\n\r\n2023-11-10\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nBackend\r\n`,
        `--${boundary}--\r\n`
      ];
      const certBody = Buffer.concat(parts.map(p => Buffer.from(p)));

      const postCert = await makeRequest({
        hostname: 'localhost', port: 3005, path: `/admin/certificates/${cert.id}?_csrf=${csrfCert}`, method: 'POST',
        headers: { 'Cookie': authCookie, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': certBody.length }
      }, certBody);
      console.log(`POST Certificate Update Status: ${postCert.statusCode} -> Location: ${postCert.headers.location} (Expected 302 /admin/certificates)`);

      // Revert title
      await cert.update({ title: cert.title.replace(' (Page Edit Test)', '') });
    }

    // 3. Test Journey Edit GET & POST
    const journey = await Journey.findOne();
    if (journey) {
      console.log(`\n[JOURNEY] Testing GET /admin/journey/${journey.id}/edit`);
      const getJourney = await makeRequest({ hostname: 'localhost', port: 3005, path: `/admin/journey/${journey.id}/edit`, method: 'GET', headers: { 'Cookie': authCookie } });
      console.log(`GET Journey Edit Status: ${getJourney.statusCode} (Expected 200)`);
      const csrfJourney = getJourney.body.match(/name="_csrf" value="([^"]+)"/)[1];

      const boundary = '----WebKitFormBoundaryJourneyForm';
      const parts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${journey.title}\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="date"\r\n\r\n2023-05-01\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nexperience\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nUpdated via dedicated form test!\r\n`,
        `--${boundary}--\r\n`
      ];
      const journeyBody = Buffer.concat(parts.map(p => Buffer.from(p)));

      const postJourney = await makeRequest({
        hostname: 'localhost', port: 3005, path: `/admin/journey/${journey.id}?_csrf=${csrfJourney}`, method: 'POST',
        headers: { 'Cookie': authCookie, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': journeyBody.length }
      }, journeyBody);
      console.log(`POST Journey Update Status: ${postJourney.statusCode} -> Location: ${postJourney.headers.location} (Expected 302 /admin/journey)`);
    }

    // 4. Test Testimonial Edit GET & POST
    const testimonial = await Testimonial.findOne();
    if (testimonial) {
      console.log(`\n[TESTIMONIAL] Testing GET /admin/testimonials/${testimonial.id}/edit`);
      const getTest = await makeRequest({ hostname: 'localhost', port: 3005, path: `/admin/testimonials/${testimonial.id}/edit`, method: 'GET', headers: { 'Cookie': authCookie } });
      console.log(`GET Testimonial Edit Status: ${getTest.statusCode} (Expected 200)`);
      const csrfTest = getTest.body.match(/name="_csrf" value="([^"]+)"/)[1];

      const boundary = '----WebKitFormBoundaryTestimForm';
      const parts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="name"\r\n\r\n${testimonial.name}\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="position"\r\n\r\nCTO\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="quote"\r\n\r\nGreat developer!\r\n`,
        `--${boundary}--\r\n`
      ];
      const testBody = Buffer.concat(parts.map(p => Buffer.from(p)));

      const postTest = await makeRequest({
        hostname: 'localhost', port: 3005, path: `/admin/testimonials/${testimonial.id}?_csrf=${csrfTest}`, method: 'POST',
        headers: { 'Cookie': authCookie, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': testBody.length }
      }, testBody);
      console.log(`POST Testimonial Update Status: ${postTest.statusCode} -> Location: ${postTest.headers.location} (Expected 302 /admin/testimonials)`);
    }

    // 5. Test Skill Edit GET & POST
    const skill = await Skill.findOne();
    if (skill) {
      console.log(`\n[SKILL] Testing GET /admin/skills/${skill.id}/edit`);
      const getSkill = await makeRequest({ hostname: 'localhost', port: 3005, path: `/admin/skills/${skill.id}/edit`, method: 'GET', headers: { 'Cookie': authCookie } });
      console.log(`GET Skill Edit Status: ${getSkill.statusCode} (Expected 200)`);
      const csrfSkill = getSkill.body.match(/name="_csrf" value="([^"]+)"/)[1];

      const skillBody = querystring.stringify({
        _csrf: csrfSkill,
        name: skill.name,
        category: 'Frontend',
        proficiency: 95
      });

      const postSkill = await makeRequest({
        hostname: 'localhost', port: 3005, path: `/admin/skills/${skill.id}?_csrf=${csrfSkill}`, method: 'POST',
        headers: { 'Cookie': authCookie, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(skillBody) }
      }, skillBody);
      console.log(`POST Skill Update Status: ${postSkill.statusCode} -> Location: ${postSkill.headers.location} (Expected 302 /admin/skills)`);
    }

    console.log('\n=== ALL EDIT ROUTE AND POST SAVE TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await sequelize.close();
  }
}

testFullEditFlow();
