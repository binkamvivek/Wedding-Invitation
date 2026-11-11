import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef';
const publicAssetsDir = 'public/assets';
const coupleDir = path.join(publicAssetsDir, 'couple');
const replaceMeDir = path.join(publicAssetsDir, '_REPLACE_ME');
const placeholdersDir = path.join(publicAssetsDir, 'placeholders');

fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(coupleDir, { recursive: true });
fs.mkdirSync(replaceMeDir, { recursive: true });
fs.mkdirSync(placeholdersDir, { recursive: true });

async function run() {
  console.log('Processing assets with Sharp...');

  // 1. Envelope Cover (envelope-cover.webp) - Target <= 250 KB
  await sharp(path.join(brainDir, 'amalfi_cliffside_vintage_poster_1794411172667.jpg'))
    .resize(900, null, { withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toFile(path.join(publicAssetsDir, 'envelope-cover.webp'));
  
  await sharp(path.join(brainDir, 'amalfi_cliffside_vintage_poster_1794411172667.jpg'))
    .resize(24, null)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(placeholdersDir, 'envelope-cover-placeholder.webp'));
  console.log('Created envelope-cover.webp & placeholder');

  // 2. Card Frame (card-frame.webp)
  await sharp(path.join(brainDir, 'mediterranean_invitation_border_flat_1794411349757.jpg'))
    .resize(960, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(publicAssetsDir, 'card-frame.webp'));

  await sharp(path.join(brainDir, 'mediterranean_invitation_border_flat_1794411349757.jpg'))
    .resize(24, null)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(placeholdersDir, 'card-frame-placeholder.webp'));
  console.log('Created card-frame.webp & placeholder');

  // 3. Couple Arch (couple-arch.webp)
  await sharp(path.join(brainDir, 'italian_mediterranean_balustrade_1794411240280.jpg'))
    .resize(960, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(publicAssetsDir, 'couple-arch.webp'));

  await sharp(path.join(brainDir, 'italian_mediterranean_balustrade_1794411240280.jpg'))
    .resize(24, null)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(placeholdersDir, 'couple-arch-placeholder.webp'));
  console.log('Created couple-arch.webp & placeholder');

  // 4. Church Watercolor (church-watercolor.webp)
  await sharp(path.join(brainDir, 'church_mediterranean_celebration_1794411267524.jpg'))
    .resize(900, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(publicAssetsDir, 'church-watercolor.webp'));

  await sharp(path.join(brainDir, 'church_mediterranean_celebration_1794411267524.jpg'))
    .resize(24, null)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(placeholdersDir, 'church-watercolor-placeholder.webp'));
  console.log('Created church-watercolor.webp & placeholder');

  // 5. Floral Wreath (floral-wreath.webp)
  await sharp(path.join(brainDir, 'mediterranean_floral_wreath_1794411246342.jpg'))
    .resize(720, 720, { fit: 'inside' })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(publicAssetsDir, 'floral-wreath.webp'));

  await sharp(path.join(brainDir, 'mediterranean_floral_wreath_1794411246342.jpg'))
    .resize(24, 24)
    .blur(3)
    .webp({ quality: 20 })
    .toFile(path.join(placeholdersDir, 'floral-wreath-placeholder.webp'));
  console.log('Created floral-wreath.webp & placeholder');

  // 6. Floral Corner (crop corner of wreath/blossoms)
  await sharp(path.join(brainDir, 'mediterranean_floral_wreath_1794411246342.jpg'))
    .extract({ left: 40, top: 40, width: 380, height: 380 })
    .resize(320, 320)
    .webp({ quality: 82 })
    .toFile(path.join(publicAssetsDir, 'floral-corner.webp'));
  console.log('Created floral-corner.webp');

  // 7. OG Image (1200x630) for social sharing / SEO
  await sharp(path.join(brainDir, 'amalfi_cliffside_vintage_poster_1794411172667.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88 })
    .toFile('public/og-image.jpg');
  console.log('Created public/og-image.jpg (1200x630)');

  // 8. Generate subtle seamless paper textures: paper-ivory.webp and paper-forest.webp
  const ivorySvg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.97  0 0 0 0 0.95  0 0 0 0 0.91  0 0 0 0.08 0"/>
      </filter>
      <rect width="100%" height="100%" fill="#F8F4E9" />
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  `;
  await sharp(Buffer.from(ivorySvg))
    .webp({ quality: 85 })
    .toFile(path.join(publicAssetsDir, 'paper-ivory.webp'));

  const forestSvg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <filter id="fnoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0.15 0"/>
      </filter>
      <rect width="100%" height="100%" fill="#263C2E" />
      <rect width="100%" height="100%" filter="url(#fnoise)" />
    </svg>
  `;
  await sharp(Buffer.from(forestSvg))
    .webp({ quality: 85 })
    .toFile(path.join(publicAssetsDir, 'paper-forest.webp'));

  console.log('Created paper-ivory.webp and paper-forest.webp');

  // Verify file sizes
  console.log('\n--- Asset File Sizes ---');
  const files = fs.readdirSync(publicAssetsDir);
  for (const f of files) {
    const p = path.join(publicAssetsDir, f);
    if (fs.statSync(p).isFile()) {
      const kb = (fs.statSync(p).size / 1024).toFixed(1);
      console.log(`- ${f}: ${kb} KB (Requirement: <= 250 KB for hero)`);
    }
  }
}

run().catch(console.error);
