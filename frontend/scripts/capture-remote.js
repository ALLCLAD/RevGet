const puppeteer = require('puppeteer');
const path = require('path');

async function captureScrewFast() {
  const targetUrl = 'https://preview.themewagon.com/screwfast/';
  const outputPath = path.resolve(__dirname, '../../screwfast-preview-full.png');

  console.log(`[Capture Remote] Lancement du navigateur vers ${targetUrl}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('[Capture Remote] Page chargée. Vérification d\'une éventuelle iframe de démo ThemeWagon...');

    // Vérifier si ThemeWagon utilise une iframe pour encapsuler la démo
    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector('iframe#preview-frame, iframe[name="preview-frame"], iframe');
      return iframe ? iframe.src : null;
    });

    if (iframeSrc && iframeSrc.startsWith('http') && !iframeSrc.includes('google')) {
      console.log(`[Capture Remote] Iframe de démo détectée : ${iframeSrc}. Navigation directe...`);
      await page.goto(iframeSrc, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
    }

    // Scroll progressif vers le bas pour déclencher le lazy-loading des images / animations Lenis
    console.log('[Capture Remote] Défilement progressif pour charger toutes les images...');
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

    // Pause d'attente pour stabilisation
    await new Promise(r => setTimeout(r, 2000));

    // Lister les titres h1, h2 pour orienter l'utilisateur sur les sections existantes
    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(h => `${h.tagName}: ${h.innerText.trim()}`)
        .filter(t => t.length > 5);
    });

    console.log('[Capture Remote] Sections détectées :');
    headings.slice(0, 20).forEach(h => console.log('  -', h));

    console.log(`[Capture Remote] Prise du screenshot pleine page vers ${outputPath}...`);
    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log('[Capture Remote] Capture terminée avec succès !');
  } catch (error) {
    console.error('[Capture Remote Error]', error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

captureScrewFast();
