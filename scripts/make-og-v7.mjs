// scripts/make-og-v7.mjs
// OG card with Pinyon Script — closest free match to Brittany Signature
// (same thin-thick signature strokes, elegant flowing style)
// Run: node scripts/make-og-v7.mjs
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'node:fs';

const W = 1200;
const H = 630;
const BG_SRC = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef/.user_uploaded/media_1794510899944_b8b4897b.jpg';
const PNG_TMP = 'public/wedding-card-v7-tmp.png';
const OUT    = 'public/wedding-card-v7.jpg';

// Resize background to 1200x630 → base64 PNG for inline HTML
const bgB64 = (await sharp(BG_SRC)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .png()
  .toBuffer()).toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Pinyon Script = closest free equivalent to Brittany Signature -->
<!-- Cormorant Garamond for supporting text -->
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=block" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: transparent; }

  .card {
    width: ${W}px; height: ${H}px;
    position: relative;
    background: url('data:image/png;base64,${bgB64}') center/cover no-repeat;
    display: flex; align-items: center; justify-content: center;
  }

  /* Mask the baked-in card text */
  .panel {
    position: absolute;
    left: 82px; top: 90px;
    width: 1036px; height: 455px;
    background: rgba(253, 250, 246, 0.96);
    border-radius: 3px;
  }

  .content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0; width: 100%;
  }

  .tagline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px; letter-spacing: 7px;
    color: #7a6248; text-transform: uppercase;
    margin-bottom: 4px;
  }

  .rule { width: 480px; height: 1px; background: #c5a66a; opacity: 0.55; margin: 0 auto 2px; }

  /* Pinyon Script — the Brittany Signature equivalent */
  .name {
    font-family: 'Pinyon Script', cursive;
    font-size: 130px;
    color: #1e120a;
    line-height: 1.05;
    text-align: center;
    /* Letter-spacing slightly open for readability */
    letter-spacing: 2px;
  }

  .amp {
    font-family: 'Pinyon Script', cursive;
    font-size: 64px;
    color: #9b7a4a;
    line-height: 0.9;
    margin: -2px 0 0;
  }

  .gold-rule {
    width: 580px; height: 1.5px;
    background: linear-gradient(to right, transparent, #c5a66a 18%, #c5a66a 82%, transparent);
    margin: 10px auto 7px;
  }

  .subtitle {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 29px; font-style: italic;
    color: #3a2a18; margin-bottom: 5px;
  }

  .date {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 21px; letter-spacing: 5px;
    color: #5a4030; text-transform: uppercase;
    margin-bottom: 3px;
  }

  .venue {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 20px; font-style: italic;
    color: #5a4030;
  }
</style>
</head>
<body>
<div class="card">
  <div class="panel"></div>
  <div class="content">
    <div class="tagline">Together with their families</div>
    <div class="rule"></div>
    <div class="name">Isaac Dheeraj</div>
    <div class="amp">&amp;</div>
    <div class="name">Angel Priscilla</div>
    <div class="gold-rule"></div>
    <div class="subtitle">are getting married</div>
    <div class="date">Monday &middot; 28 December 2026</div>
    <div class="venue">All Saints Church, Secunderabad</div>
  </div>
</div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1800)); // extra font render time
await page.screenshot({ path: PNG_TMP, type: 'png', clip: { x:0, y:0, width:W, height:H } });
await browser.close();

await sharp(PNG_TMP)
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(OUT);

fs.unlinkSync(PNG_TMP);

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`✅  ${OUT}  (${kb} KB)`);

