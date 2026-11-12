// scripts/make-og.mjs
// Generates public/og-image.jpg (1200x630) for the link-preview card.
// Run:  npm run og
import sharp from 'sharp';
import fs from 'node:fs';

fs.mkdirSync('public', { recursive: true });

// Optional background painting. If neither file exists, a solid forest green is used.
const bgPath = ['public/assets/envelope-cover.jpg', 'public/assets/envelope-cover.png']
  .find((p) => fs.existsSync(p));

const W = 1200;
const H = 630;

const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#263C2E" stop-opacity="${bgPath ? 0.55 : 1}"/>
      <stop offset="1" stop-color="#12201A" stop-opacity="${bgPath ? 0.85 : 1}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="#C5A66A" stroke-width="2"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#C5A66A" stroke-width="1" opacity=".6"/>

  <text x="600" y="190" text-anchor="middle" fill="#C5A66A"
        font-family="Montserrat, Arial, sans-serif" font-size="22" letter-spacing="8">
    TOGETHER WITH THEIR FAMILIES
  </text>
  <text x="600" y="330" text-anchor="middle" fill="#F8F4E9"
        font-family="Cormorant Garamond, Georgia, serif" font-size="96">
    Isaac Dheeraj &amp; Angel Priscilla
  </text>
  <line x1="480" y1="370" x2="720" y2="370" stroke="#C5A66A" stroke-width="1.5"/>
  <text x="600" y="430" text-anchor="middle" fill="#F8F4E9"
        font-family="Playfair Display, Georgia, serif" font-size="40">
    28 December 2026
  </text>
  <text x="600" y="485" text-anchor="middle" fill="#C5A66A"
        font-family="Montserrat, Arial, sans-serif" font-size="22" letter-spacing="6">
    ALL SAINTS CHURCH Â· SECUNDERABAD
  </text>
  <text x="600" y="565" text-anchor="middle" fill="#E9DDC9"
        font-family="Montserrat, Arial, sans-serif" font-size="20" letter-spacing="4">
    TAP TO OPEN YOUR INVITATION
  </text>
</svg>`;

const base = bgPath
  ? sharp(bgPath).resize(W, H, { fit: 'cover' })
  : sharp({ create: { width: W, height: H, channels: 3, background: '#263C2E' } });

await base
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

const kb = Math.round(fs.statSync('public/og-image.jpg').size / 1024);
console.log(`Created public/og-image.jpg (${kb} KB)` + (kb > 300 ? '  WARNING: over 300 KB, WhatsApp may skip it' : ''));
