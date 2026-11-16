const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testLogo() {
  const htmlPath = path.resolve(__dirname, 'test-logo.html');
  const tempDir = path.resolve(__dirname, 'temp-chrome-' + Date.now());

  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 850, deviceScaleFactor: 2 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  const screenshotPath = path.resolve(__dirname, '../../logo-comparison.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
  
  // Cleanup temp dir
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch(e) {}

  console.log('Comparaison générée avec succès dans logo-comparison.png');
}

testLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
