const http = require('http');

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3005${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function testI18n() {
  try {
    console.log('=== TESTING MULTILINGUAL (ID vs EN) SWITCHING ===');

    // 1. Home Page ID vs EN
    const homeId = await fetchPage('/?lang=id');
    const homeEn = await fetchPage('/?lang=en');

    console.log('[ID] Home contains "Beranda":', homeId.body.includes('Beranda'));
    console.log('[EN] Home contains "Home":', homeEn.body.includes('Home'));
    console.log('[EN] Home contains "Open to work" / "Featured Projects":', homeEn.body.includes('Featured Projects') || homeEn.body.includes('Open to work'));

    // 2. About Page ID vs EN
    const aboutId = await fetchPage('/about?lang=id');
    const aboutEn = await fetchPage('/about?lang=en');
    console.log('[ID] About contains "Tentang":', aboutId.body.includes('Tentang'));
    console.log('[EN] About contains "About":', aboutEn.body.includes('About'));

    // 3. Journey Page ID vs EN
    const journeyId = await fetchPage('/journey?lang=id');
    const journeyEn = await fetchPage('/journey?lang=en');
    console.log('[ID] Journey status ok:', journeyId.statusCode === 200);
    console.log('[EN] Journey status ok:', journeyEn.statusCode === 200);

    // 4. CV Page ID vs EN
    const cvId = await fetchPage('/cv?lang=id');
    const cvEn = await fetchPage('/cv?lang=en');
    console.log('[ID] CV contains "Ringkasan Profesional" or "Pengalaman":', cvId.body.includes('Ringkasan') || cvId.body.includes('Pengalaman'));
    console.log('[EN] CV contains "Professional Summary" or "Experience":', cvEn.body.includes('Professional Summary') || cvEn.body.includes('Experience'));

    console.log('\n=== MULTILINGUAL TEST COMPLETED! ===');
  } catch (err) {
    console.error('i18n test error:', err);
  }
}

testI18n();
