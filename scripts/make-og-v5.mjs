// scripts/make-og-v5.mjs
// Creates OG card with REAL calligraphy font (Great Vibes) embedded as base64 in SVG
// Run: node scripts/make-og-v5.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const W = 1200;
const H = 630;
const SRC = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef/.user_uploaded/media_1794510899944_b8b4897b.jpg';
const OUT = 'public/wedding-card-v5.jpg';
const FONT_PATH = 'scripts/GreatVibes-Regular.ttf';

// --- 1. Download the font TTF if not cached ---
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(); return; }
    const file = fs.createWriteStream(dest);
    function fetch(u) {
      https.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetch(res.headers.location);
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => file.close(resolve));
        } else {
          reject(new Error('HTTP ' + res.statusCode));
        }
      }).on('error', reject);
    }
    fetch(url);
  });
}

console.log('Downloading Great Vibes font…');
await downloadFile(
  'https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf',
  FONT_PATH
);
console.log('Font ready.');

// --- 2. Base64-encode the TTF for SVG embedding ---
const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');

// --- 3. Build SVG overlay with embedded calligraphy font ---
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'GreatVibes';
        src: url('data:font/truetype;base64,${fontB64}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    </style>
  </defs>

  <!-- White panel over the center to hide baked-in bg card text -->
  <rect x="80" y="90" width="1040" height="455" rx="4" ry="4"
        fill="#fdfaf6" opacity="0.97"/>

  <!-- TOGETHER WITH THEIR FAMILIES -->
  <text x="${W/2}" y="162" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="26" letter-spacing="6" fill="#6b5340" opacity="0.90">
    TOGETHER WITH THEIR FAMILIES
  </text>

  <!-- Thin gold rule -->
  <line x1="300" y1="178" x2="900" y2="178" stroke="#c5a66a" stroke-width="1" opacity="0.6"/>

  <!-- Names in calligraphy — Great Vibes font -->
  <text x="${W/2}" y="300" text-anchor="middle"
        font-family="GreatVibes, cursive"
        font-size="128" fill="#2d1f0e">
    Isaac Dheeraj
  </text>

  <!-- Decorative ampersand -->
  <text x="${W/2}" y="372" text-anchor="middle"
        font-family="GreatVibes, cursive"
        font-size="58" fill="#8B6F47">
    &amp;
  </text>

  <!-- Angel Priscilla -->
  <text x="${W/2}" y="478" text-anchor="middle"
        font-family="GreatVibes, cursive"
        font-size="128" fill="#2d1f0e">
    Angel Priscilla
  </text>

  <!-- Gold divider -->
  <line x1="320" y1="498" x2="880" y2="498" stroke="#c5a66a" stroke-width="1.5"/>

  <!-- are getting married -->
  <text x="${W/2}" y="533" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="30" font-style="italic" fill="#3a2a18">
    are getting married
  </text>

  <!-- Date -->
  <text x="${W/2}" y="570" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="24" letter-spacing="5" fill="#5a4030">
    MONDAY · 28 DECEMBER 2026
  </text>

  <!-- Venue -->
  <text x="${W/2}" y="600" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="22" font-style="italic" fill="#5a4030">
    All Saints Church, Secunderabad
  </text>
</svg>`;

// --- 4. Compose: floral bg (cover-fill) + SVG overlay ---
const bg = await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .toBuffer();

await sharp(bg)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(OUT);

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`✅ Created ${OUT}  (${kb} KB)${kb > 200 ? '  ⚠ large' : ''}`);

