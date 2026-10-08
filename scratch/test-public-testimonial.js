const http = require('http');
const { Testimonial, sequelize } = require('../models');

async function testTestimonialForm() {
  console.log('--- Testing Public Testimonial Form Flow ---');
  await sequelize.authenticate();

  let cookies = [];
  let csrfToken = '';

  // 1. Test GET /testimonial & Extract CSRF Token + Cookies
  await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:3005/testimonial', (res) => {
      console.log(`GET /testimonial Status: ${res.statusCode} (Expected 200)`);
      if (res.headers['set-cookie']) {
        cookies = res.headers['set-cookie'];
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const match = body.match(/name="_csrf" value="([^"]+)"/);
        if (match) {
          csrfToken = match[1];
          console.log(`✓ Extracted CSRF Token: ${csrfToken}`);
        }
        resolve();
      });
    }).on('error', reject);
  });

  // 2. Test GET /give-testimonial (Alias)
  await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:3005/give-testimonial', (res) => {
      console.log(`GET /give-testimonial Redirect Status: ${res.statusCode} (Expected 302) -> Location: ${res.headers.location}`);
      if (res.statusCode === 302 && res.headers.location === '/testimonial') resolve();
      else reject(new Error(`Failed alias redirect`));
    }).on('error', reject);
  });

  // 3. Test POST /testimonial with CSRF Token
  const initialCount = await Testimonial.count();
  const postData = new URLSearchParams({
    _csrf: csrfToken,
    name: 'Dr. Hendra Wijaya',
    position: 'VP of Engineering',
    company: 'PT Tech Innovation',
    relationship: 'Mentor Magang',
    quote: 'Alvi adalah peserta magang backend yang luar biasa. Etos kerjanya sangat tinggi, menguasai microservices Node.js dan MySQL dengan sangat baik.'
  }).toString();

  await new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:3005/testimonial?_csrf=${csrfToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': cookies.join('; ')
      }
    }, (res) => {
      console.log(`POST /testimonial Status: ${res.statusCode} (Expected 302 redirect back)`);
      if (res.headers['location']) {
        console.log(`Redirect Location: ${res.headers['location']}`);
      }
      resolve();
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  const finalCount = await Testimonial.count();
  console.log(`Testimonials count before: ${initialCount}, after POST: ${finalCount}`);

  const newlyAdded = await Testimonial.findOne({ where: { name: 'Dr. Hendra Wijaya' } });
  if (newlyAdded) {
    console.log(`✓ Testimonial created in DB! ID: ${newlyAdded.id}`);
    console.log(`  Name: ${newlyAdded.name}`);
    console.log(`  Position: ${newlyAdded.position}`);
    console.log(`  Company: ${newlyAdded.company}`);
    console.log(`  Quote: ${newlyAdded.quote}`);
    console.log(`  Visible: ${newlyAdded.is_visible}`);

    // Cleanup test record
    await newlyAdded.destroy();
    console.log('✓ Cleaned up test record');
  } else {
    throw new Error('Testimonial record not found in database!');
  }

  console.log('\n✅ Public Testimonial Form integration test PASSED successfully!');
  process.exit(0);
}

testTestimonialForm().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
