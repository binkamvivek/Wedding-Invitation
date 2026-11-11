import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const coupleDir = 'public/assets/couple';
fs.mkdirSync(coupleDir, { recursive: true });

async function createCouplePlaceholders() {
  // Groom Portrait: Dheeraj (Watercolor silhouette with warm tones and gold initial D)
  const groomSvg = `
    <svg width="600" height="800" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gWash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F8F4E9"/>
          <stop offset="45%" stop-color="#EFE5D2"/>
          <stop offset="100%" stop-color="#DCCDB1"/>
        </linearGradient>
        <radialGradient id="gHalo" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#C5A66A" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#C5A66A" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/>
        </filter>
      </defs>
      
      <!-- Background Paper Wash -->
      <rect width="100%" height="100%" fill="url(#gWash)"/>
      <circle cx="150" cy="160" r="110" fill="url(#gHalo)"/>
      <rect x="15" y="15" width="270" height="370" fill="none" stroke="#C5A66A" stroke-width="0.75" stroke-dasharray="6 3" opacity="0.6"/>

      <!-- Groom Painterly Silhouette -->
      <g filter="url(#grain)">
        <!-- Shoulders / Suit Coat -->
        <path d="M 50 400 C 60 300, 100 270, 150 270 C 200 270, 240 300, 250 400 Z" fill="#263C2E" opacity="0.88"/>
        <!-- Collar & Tie -->
        <polygon points="135,270 165,270 150,310" fill="#F8F4E9"/>
        <polygon points="146,285 154,285 152,345 148,345" fill="#C5A66A"/>
        <!-- Neck -->
        <rect x="135" y="220" width="30" height="55" fill="#D8B49A" rx="4"/>
        <!-- Head -->
        <ellipse cx="150" cy="170" rx="46" ry="58" fill="#E2BFA6"/>
        <!-- Hair / Styling -->
        <path d="M 104 165 C 102 110, 198 105, 196 165 C 185 140, 115 140, 104 165 Z" fill="#3A2C25"/>
      </g>

      <!-- Monogram Initial & Badge -->
      <circle cx="150" cy="80" r="28" fill="#F8F4E9" stroke="#C5A66A" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
      <text x="150" y="89" font-family="Georgia, serif" font-size="24" font-weight="bold" font-style="italic" fill="#C5A66A" text-anchor="middle">D</text>

      <text x="150" y="375" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#68734D" text-anchor="middle" letter-spacing="3">THE GROOM</text>
    </svg>
  `;

  // Bride Portrait: Angle (Watercolor silhouette with blush tones and gold initial A)
  const brideSvg = `
    <svg width="600" height="800" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bWash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F8F4E9"/>
          <stop offset="45%" stop-color="#F5E8E4"/>
          <stop offset="100%" stop-color="#EAD7D1"/>
        </linearGradient>
        <radialGradient id="bHalo" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#D9A9A0" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#D9A9A0" stop-opacity="0"/>
        </radialGradient>
        <filter id="bgrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/>
        </filter>
      </defs>
      
      <!-- Background Paper Wash -->
      <rect width="100%" height="100%" fill="url(#bWash)"/>
      <circle cx="150" cy="160" r="110" fill="url(#bHalo)"/>
      <rect x="15" y="15" width="270" height="370" fill="none" stroke="#C5A66A" stroke-width="0.75" stroke-dasharray="6 3" opacity="0.6"/>

      <!-- Bride Painterly Silhouette -->
      <g filter="url(#bgrain)">
        <!-- Long Flowing Hair Backdrop -->
        <path d="M 100 170 C 85 270, 70 340, 50 400 L 250 400 C 230 340, 215 270, 200 170 Z" fill="#3A2C25"/>
        <!-- Shoulders / Blouse & Saree -->
        <path d="M 55 400 C 65 310, 105 275, 150 275 C 195 275, 235 310, 245 400 Z" fill="#D9A9A0" opacity="0.92"/>
        <!-- Saree Gold Border Drape -->
        <path d="M 70 400 C 110 330, 160 280, 200 275 L 210 290 C 170 295, 120 345, 85 400 Z" fill="#C5A66A"/>
        <!-- Neck -->
        <rect x="137" y="222" width="26" height="55" fill="#D8B49A" rx="4"/>
        <!-- Head -->
        <ellipse cx="150" cy="170" rx="44" ry="56" fill="#E2BFA6"/>
        <!-- Front Hair Updo with Blossom -->
        <path d="M 106 170 C 100 110, 200 110, 194 170 C 185 130, 115 130, 106 170 Z" fill="#3A2C25"/>
        <!-- Jasmine flower accent -->
        <circle cx="112" cy="155" r="7" fill="#F8F4E9"/>
        <circle cx="112" cy="155" r="3" fill="#C5A66A"/>
      </g>

      <!-- Monogram Initial & Badge -->
      <circle cx="150" cy="80" r="28" fill="#F8F4E9" stroke="#C5A66A" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
      <text x="150" y="89" font-family="Georgia, serif" font-size="24" font-weight="bold" font-style="italic" fill="#C5A66A" text-anchor="middle">A</text>

      <text x="150" y="375" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#D9A9A0" text-anchor="middle" letter-spacing="3">THE BRIDE</text>
    </svg>
  `;

  await sharp(Buffer.from(groomSvg))
    .jpeg({ quality: 88 })
    .toFile(path.join(coupleDir, 'dheeraj.jpg'));

  await sharp(Buffer.from(brideSvg))
    .jpeg({ quality: 88 })
    .toFile(path.join(coupleDir, 'angle.jpg'));

  console.log('Created high-quality painterly portraits: dheeraj.jpg & angle.jpg');
}

createCouplePlaceholders().catch(console.error);

