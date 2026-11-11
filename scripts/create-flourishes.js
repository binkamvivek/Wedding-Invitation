import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/dheer/.gemini/antigravity/brain/914269ee-0dba-468a-a312-adc96b9575ef';
const publicAssetsDir = 'public/assets';

async function generateTransparentFlourishes() {
  console.log('Generating transparent botanical flourishes and petal sprites...');

  // Extract high-res corner florals from the wreath image
  const wreathPath = path.join(brainDir, 'mediterranean_floral_wreath_1794411246342.jpg');

  // Top-left corner flourish
  await sharp(wreathPath)
    .extract({ left: 30, top: 30, width: 420, height: 420 })
    .resize(380, 380)
    .webp({ quality: 85 })
    .toFile(path.join(publicAssetsDir, 'floral-corner-tl.webp'));

  // Bottom-right corner flourish (rotated)
  await sharp(wreathPath)
    .extract({ left: 450, top: 450, width: 420, height: 420 })
    .resize(380, 380)
    .webp({ quality: 85 })
    .toFile(path.join(publicAssetsDir, 'floral-corner-br.webp'));

  // Also create 4 distinct petal sprites in WebP for the falling particle canvas
  const blushPetalSvg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pBlush" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#FCECE8"/>
          <stop offset="60%" stop-color="#D9A9A0"/>
          <stop offset="100%" stop-color="#B87D74"/>
        </radialGradient>
      </defs>
      <path d="M 24 4 C 36 12, 44 26, 33 40 C 24 46, 15 40, 9 32 C 3 20, 12 8, 24 4 Z" fill="url(#pBlush)"/>
    </svg>
  `;
  const ivoryPetalSvg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pIvory" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="60%" stop-color="#F8F4E9"/>
          <stop offset="100%" stop-color="#E2D6C0"/>
        </radialGradient>
      </defs>
      <path d="M 24 4 C 34 10, 42 24, 32 38 C 24 44, 16 38, 10 30 C 4 18, 14 8, 24 4 Z" fill="url(#pIvory)"/>
    </svg>
  `;
  const oliveLeafSvg = `
    <svg width="36" height="54" viewBox="0 0 36 54" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8A996D"/>
          <stop offset="50%" stop-color="#68734D"/>
          <stop offset="100%" stop-color="#3D452B"/>
        </linearGradient>
      </defs>
      <path d="M 18 2 C 34 14, 34 38, 18 52 C 2 38, 2 14, 18 2 Z" fill="url(#pLeaf)"/>
      <path d="M 18 4 L 18 50" stroke="#263C2E" stroke-width="1" opacity="0.4"/>
    </svg>
  `;
  const goldFleckSvg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <radialGradient id="pFleck" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFF4D4"/>
        <stop offset="55%" stop-color="#C5A66A"/>
        <stop offset="100%" stop-color="#8F6E2E"/>
      </radialGradient>
      <polygon points="16,2 20,12 30,16 20,20 16,30 12,20 2,16 12,12" fill="url(#pFleck)"/>
    </svg>
  `;

  await sharp(Buffer.from(blushPetalSvg)).webp().toFile(path.join(publicAssetsDir, 'petal-blush.webp'));
  await sharp(Buffer.from(ivoryPetalSvg)).webp().toFile(path.join(publicAssetsDir, 'petal-ivory.webp'));
  await sharp(Buffer.from(oliveLeafSvg)).webp().toFile(path.join(publicAssetsDir, 'petal-leaf.webp'));
  await sharp(Buffer.from(goldFleckSvg)).webp().toFile(path.join(publicAssetsDir, 'petal-gold.webp'));

  console.log('Flourishes and Petal sprites created!');
}

generateTransparentFlourishes().catch(console.error);

