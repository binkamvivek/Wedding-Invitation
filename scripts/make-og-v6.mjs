// scripts/make-og-v6.mjs
// Uses Puppeteer + Chrome to render an HTML card with real Google Fonts calligraphy
// then screenshots it at 1200x630 for the OG share card.
// Run: node scripts/make-og-v6.mjs
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = 1200;
const H = 630;
const BG_SRC = path.resolve(__dirname, '../C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef/.user_uploaded/media_1794510899944_b8b4897b.jpg');
const BG_ACTUAL = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef/.user_uploaded/media_1794510899944_b8b4897b.jpg';
const PNG_TMP = 'public/wedding-card-v6-tmp.png';
const OUT = 'public/wedding-card-v6.jpg';

// 1. Resize background to exact 1200x630 and save as PNG for the HTML
const bgBuf = await sharp(BG_ACTUAL)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .png()
  .toBuffer();
const bgB64 = bgBuf.toString('base64');

// 2. HTML with Google Fonts embedded
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=block" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  .card {
    width: ${W}px;
    height: ${H}px;
    position: relative;
    background: url('data:image/png;base64,${bgB64}') center/cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  /* White panel to mask the baked-in bg card text */
  .panel {
    position: absolute;
    left: 80px; top: 88px;
    width: 1040px; height: 456px;
    background: rgba(253, 250, 246, 0.96);
    border-radius: 4px;
  }
  .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding-top: 0;
  }
  .tagline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px;
    letter-spacing: 7px;
    color: #6b5340;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .divider-thin {
    width: 500px; height: 1px;
    background: #c5a66a;
    opacity: 0.6;
    margin: 6px auto;
  }
  .name {
    font-family: 'Great Vibes', cursive;
    font-size: 118px;
    color: #2d1a0a;
    line-height: 1.0;
    text-align: center;
  }
  .amp {
    font-family: 'Great Vibes', cursive;
    font-size: 60px;
    color: #8B6F47;
    line-height: 1.0;
    margin: -4px 0;
  }
  .divider-gold {
    width: 560px; height: 1.5px;
    background: linear-gradient(to right, transparent, #c5a66a 20%, #c5a66a 80%, transparent);
    margin: 10px auto 8px;
  }
  .subtitle {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 30px;
    font-style: italic;
    color: #3a2a18;
    margin-bottom: 6px;
  }
  .date {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px;
    letter-spacing: 5px;
    color: #5a4030;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .venue {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 21px;
    font-style: italic;
    color: #5a4030;
  }
</style>
</head>
<body>
<div class="card">
  <div class="panel"></div>
  <div class="content">
    <div class="tagline">Together with their families</div>
    <div class="divider-thin"></div>
    <div class="name">Isaac Dheeraj</div>
    <div class="amp">&amp;</div>
    <div class="name">Angel Priscilla</div>
    <div class="divider-gold"></div>
    <div class="subtitle">are getting married</div>
    <div class="date">Monday &middot; 28 December 2026</div>
    <div class="venue">All Saints Church, Secunderabad</div>
  </div>
</div>
</body>
</html>`;

// 3. Launch puppeteer, render, screenshot
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
// Extra wait for fonts
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: PNG_TMP, type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

// 4. Convert PNG → JPEG with Sharp (quality optimised for WhatsApp mobile)
await sharp(PNG_TMP)
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(OUT);

fs.unlinkSync(PNG_TMP);

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`✅ Created ${OUT}  (${kb} KB)`);
