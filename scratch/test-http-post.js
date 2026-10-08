const http = require('http');
const querystring = require('querystring');
const { Journey, Certificate, Testimonial, Skill, User, sequelize } = require('../models');

async function testHttpPost() {
  try {
    // 1. Get an item to update
    const journey = await Journey.findOne();
    if (!journey) {
      console.log('No journey found to test HTTP POST');
      return;
    }

    console.log('Testing HTTP POST update for Journey ID:', journey.id);

    const postData = querystring.stringify({
      title: journey.title,
      description: journey.description || 'Updated via HTTP POST test',
      date: journey.date ? journey.date.substring(0, 10) : '2023-01-01',
      category: journey.category || 'experience'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3005,
      path: `/admin/journey/${journey.id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      console.log('HTTP Response Status:', res.statusCode);
      console.log('HTTP Response Headers:', res.headers.location || 'No redirect location');
      if (res.statusCode === 302) {
        console.log('[PASS] Redirected after POST (Auth check or success redirect)');
      }
    });

    req.on('error', (e) => {
      console.error('HTTP Request Error:', e.message);
    });

    req.write(postData);
    req.end();

  } catch (err) {
    console.error('Test error:', err);
  }
}

testHttpPost();
