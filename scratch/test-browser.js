const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('HTTP ERROR:', response.url(), response.status());
    }
  });

  await page.goto('http://localhost:3000/admin/journey', { waitUntil: 'networkidle2' });
  
  const editButtons = await page.$$('button[title="Edit"]');
  if (editButtons.length > 0) {
    console.log('Found edit button, clicking...');
    await editButtons[0].click();
    await page.waitForTimeout(500); // wait for any errors
  } else {
    console.log('No edit button found!');
    const content = await page.content();
    console.log(content.substring(0, 500));
  }

  await browser.close();
})();
