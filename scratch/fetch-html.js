const http = require('http');

http.get('http://127.0.0.1:3000/admin/journey', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    if (res.statusCode >= 400) {
      console.log('ERROR HTML:', data.substring(0, 500));
    }
    const matches = data.match(/<button onclick="editJourney[\s\S]*?<\/button>/g);
    if (matches) {
      matches.forEach((m, i) => console.log('BUTTON', i, ':\n', m));
    } else {
      console.log('BUTTON NOT FOUND! First 1000 chars:\n', data.substring(0, 1000));
    }
  });
}).on('error', (err) => {
  console.error('HTTP GET ERROR:', err.message);
});
