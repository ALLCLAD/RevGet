const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  const url = process.argv[2] || 'http://localhost:4200';
  // Sauvegarde à la racine du workspace (Revget)
  const outputPath = path.resolve(__dirname, '..', 'ui-preview.png');

  console.log(`[Capture] Connexion à ${url}...`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 12000
    });

    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`[Capture] Capture enregistrée avec succès : ${outputPath}`);
  } catch (error) {
    console.error(`[Capture Error] ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

capture();
