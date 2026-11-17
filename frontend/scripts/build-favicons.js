const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SVG_CONTENT = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond conteneur ScrewFast officiel (rounded container rx="100", fond charbon minéral #262626) -->
  <rect width="512" height="512" rx="100" fill="#262626"/>
  
  <style>
    .revget-brand-text {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-weight: 900;
      fill: #FFFFFF;
      letter-spacing: -4px;
    }
  </style>
  
  <!-- Ligne 1 : "Rev" décalé au-dessus de Get -->
  <text class="revget-brand-text" x="90" y="222" font-size="118">Rev</text>
  
  <!-- Ligne 2 : "Get" aligné à gauche -->
  <text class="revget-brand-text" x="65" y="342" font-size="118">Get</text>
  
  <!-- Ligne 2 (suite) : Barres obliques et flèche ScrewFast / Revget en ambre officiel #F59E0B -->
  <g transform="translate(270, 266) scale(0.72)">
    <rect width="78.9" height="18.5" x="0" y="55" rx="9.2" transform="rotate(-43 0 55)" fill="#F59E0B" />
    <rect width="78.9" height="18.5" x="50" y="55" rx="9.2" transform="rotate(-43 50 55)" fill="#F59E0B" />
    <rect width="78.9" height="18.5" x="100" y="55" rx="9.2" transform="rotate(-43 100 55)" fill="#F59E0B" />
    <rect width="28.5" height="18.5" x="150" y="55" rx="9.2" transform="rotate(-43 150 55)" fill="#F59E0B" />
    <path d="M230 28c7 2.6 6.9 12.6-.2 15l-19 6.5c-5.2 1.8-10.7-2.1-10.6-7.7l.2-13.5c.1-5.5 5.6-9.3 10.8-7.4l18.8 7.1Z" fill="#F59E0B" />
  </g>
</svg>
`;

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO format
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function buildFavicons() {
  const publicDir = path.resolve(__dirname, '../public');
  const templateImgDir = path.resolve(__dirname, '../../template_assets/src/images');

  // 1. Sauvegarder les fichiers SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), SVG_CONTENT, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), SVG_CONTENT, 'utf8');
  if (fs.existsSync(templateImgDir)) {
    fs.writeFileSync(path.join(templateImgDir, 'icon.svg'), SVG_CONTENT, 'utf8');
  }
  console.log('Fichiers SVG écrits avec succès.');

  // 2. Générer les rendus PNG avec Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  async function renderPng(size) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${SVG_CONTENT}
</body>
</html>`;
    await page.setContent(html, { waitUntil: 'load' });
    return await page.screenshot({ omitBackground: true });
  }

  console.log('Rendu des déclinaisons raster (PNG)...');
  const png512 = await renderPng(512);
  const png192 = await renderPng(192);
  const png180 = await renderPng(180);
  const png48  = await renderPng(48);
  const png32  = await renderPng(32);
  const png16  = await renderPng(16);

  await browser.close();

  // Écrire les PNGs utiles
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  if (fs.existsSync(templateImgDir)) {
    fs.writeFileSync(path.join(templateImgDir, 'icon.png'), png512);
    fs.writeFileSync(path.join(templateImgDir, 'icon-maskable.png'), png512);
  }
  console.log('Fichiers PNG enregistrés.');

  // 3. Encoder et écrire favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`favicon.ico généré avec succès (${icoBuffer.length} octets).`);
}

buildFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
