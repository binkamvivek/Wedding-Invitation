// scripts/make-og-v4.mjs
// Creates a full-bleed OG card: floral card fills entire 1200x630,
// with large prominent text overlay.
// Run: node scripts/make-og-v4.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const W = 1200;
const H = 630;
const SRC = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef/.user_uploaded/media_1794510899944_b8b4897b.jpg';
const OUT = 'public/wedding-card-v4.jpg';

// SVG overlay with large text centered on the card
// The floral card background already has the decorative border/flowers
// We add a strong white panel in the center to mask the card's own small text,
// then draw our names very large on top
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Strong white rectangle covering the center text area of the bg card -->
  <!-- This masks the small calligraphy text that's baked into the bg image -->
  <rect x="80" y="90" width="1040" height="460" rx="4" ry="4"
        fill="#fdfaf6" opacity="0.97"/>

  <!-- Soft radial vignette on top for a natural look -->
  <radialGradient id="vg" cx="50%" cy="48%" r="52%">
    <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.30"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#vg)"/>

  <!-- TOGETHER WITH THEIR FAMILIES -->
  <text x="${W/2}" y="168" text-anchor="middle"
        font-family="Garamond, Georgia, 'Times New Roman', serif"
        font-size="28" letter-spacing="6" fill="#5a4a3a" opacity="0.85">
    TOGETHER WITH THEIR FAMILIES
  </text>

  <!-- Names — very large, serif calligraphy-style -->
  <text x="${W/2}" y="300" text-anchor="middle"
        font-family="Palatino Linotype, Palatino, Georgia, serif"
        font-size="112" font-style="italic" fill="#2d2416" letter-spacing="2">
    Isaac Dheeraj
  </text>

  <!-- ampersand -->
  <text x="${W/2}" y="378" text-anchor="middle"
        font-family="Palatino Linotype, Palatino, Georgia, serif"
        font-size="52" font-style="italic" fill="#8B6F47">
    &amp;
  </text>

  <!-- Angel Priscilla -->
  <text x="${W/2}" y="460" text-anchor="middle"
        font-family="Palatino Linotype, Palatino, Georgia, serif"
        font-size="112" font-style="italic" fill="#2d2416" letter-spacing="2">
    Angel Priscilla
  </text>

  <!-- Thin gold divider -->
  <line x1="340" y1="490" x2="860" y2="490" stroke="#c5a66a" stroke-width="1.5"/>

  <!-- are getting married -->
  <text x="${W/2}" y="528" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="34" font-style="italic" fill="#3a3020">
    are getting married
  </text>

  <!-- Date -->
  <text x="${W/2}" y="574" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="26" letter-spacing="5" fill="#5a4a3a">
    MONDAY · 28 DECEMBER 2026
  </text>

  <!-- Venue -->
  <text x="${W/2}" y="606" text-anchor="middle"
        font-family="Garamond, Georgia, serif"
        font-size="24" font-style="italic" fill="#5a4a3a">
    All Saints Church, Secunderabad
  </text>
</svg>`;

// 1. Resize source image to fill 1200x630 (cover = crop to fill, no letterboxing)
const bg = await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .toBuffer();

// 2. Composite SVG text layer on top
await sharp(bg)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(OUT);

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`✅ Created ${OUT}  (${kb} KB)${kb > 200 ? '  ⚠ large – consider reducing quality' : ''}`);
