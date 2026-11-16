const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist/revget-ui/browser');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

server.listen(4201, async () => {
  console.log('Serveur de test sur port 4201');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4201', { waitUntil: 'networkidle0' });

  // 1. Force light mode first to ensure clean light capture
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 600));

  const screenshotPathLight = path.resolve(__dirname, '../../landing-preview-final.png');
  await page.screenshot({ path: screenshotPathLight, fullPage: true });
  console.log('Capture mode clair terminée : landing-preview-final.png');

  // 2. Click the Hero CTA button to test that it directly opens the navbar dropdown
  await page.evaluate(() => {
    const heroBtn = document.querySelector('button[data-auth-trigger]');
    if (heroBtn) heroBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  const screenshotPathDropdownLight = path.resolve(__dirname, '../../landing-preview-dropdown.png');
  await page.screenshot({ path: screenshotPathDropdownLight });
  console.log('Capture dropdown ouvert via bouton page (mode clair) : landing-preview-dropdown.png');

  // 3. Switch to dark mode with dropdown still open to capture dark dropdown
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 600));
  const screenshotPathDropdownDark = path.resolve(__dirname, '../../landing-preview-dropdown-dark.png');
  await page.screenshot({ path: screenshotPathDropdownDark });
  console.log('Capture dropdown en mode sombre : landing-preview-dropdown-dark.png');

  // Close dropdown by clicking body
  await page.evaluate(() => {
    document.body.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 4. Capture dark mode full page
  const screenshotPathDark = path.resolve(__dirname, '../../landing-preview-dark.png');
  await page.screenshot({ path: screenshotPathDark, fullPage: true });
  console.log('Capture mode sombre terminée : landing-preview-dark.png');

  await browser.close();
  server.close();
});
