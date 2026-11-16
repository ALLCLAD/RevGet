const puppeteer = require('puppeteer');
const path = require('path');

async function captureScrewFastLight() {
  const targetUrl = 'https://preview.themewagon.com/screwfast/';
  const outputPath = path.resolve(__dirname, '../../screwfast-preview-light.png');

  console.log('[Capture Remote Light] Lancement...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Émuler le mode clair
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector('iframe#preview-frame, iframe[name="preview-frame"], iframe');
      return iframe ? iframe.src : null;
    });

    if (iframeSrc && iframeSrc.startsWith('http') && !iframeSrc.includes('google')) {
      await page.goto(iframeSrc, { waitUntil: 'networkidle2', timeout: 30000 });
    }

    // Forcer le thème clair dans le DOM et dans localStorage
    await page.evaluate(() => {
      localStorage.setItem('hs_theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    // Scroll progressif pour charger toutes les images
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 150);
      });
    });

    await new Promise(r => setTimeout(r, 2000));

    // Ré-assurer que la classe dark n'est pas revenue
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });

    console.log(`[Capture Remote Light] Enregistrement vers ${outputPath}...`);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log('[Capture Remote Light] Terminé avec succès !');
  } catch (error) {
    console.error('[Error]', error.message);
  } finally {
    await browser.close();
  }
}

captureScrewFastLight();
