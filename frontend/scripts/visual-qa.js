/**
 * Visual QA Automation Script via Puppeteer
 * Capture l'état rendu de l'interface Revget pour vérification visuelle.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runVisualQA() {
  const url = process.argv[2] || 'http://localhost:4200';
  const outputDir = path.resolve(__dirname, 'screenshots');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `screenshot-${timestamp}.png`;
  const outputPath = path.join(outputDir, filename);

  console.log(`[Visual-QA] Connexion à l'application : ${url}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000
    }).catch(err => {
      throw new Error(`Impossible de joindre le serveur ${url}. Vérifiez que 'ng serve' est bien en cours d'exécution. (${err.message})`);
    });

    console.log(`[Visual-QA] Page chargée avec statut : ${response ? response.status() : 'OK'}`);

    // Capture complète de la page
    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`[Visual-QA] Capture enregistrée avec succès : ${outputPath}`);
    console.log(`[Visual-QA] INSTRUCTION : Vous pouvez inspecter directement ce fichier ou le fournir en pièce jointe pour vérification visuelle.`);
  } catch (error) {
    console.error(`[Visual-QA Error] ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runVisualQA();
