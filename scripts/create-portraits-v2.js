/**
 * Creates rich impressionist-style portrait artwork for Dheeraj & Angle
 * using layered SVG rendered via Sharp (no canvas dependency needed).
 *
 * Run: node scripts/create-portraits-v2.js
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'public', 'assets', 'couple');
mkdirSync(OUTPUT_DIR, { recursive: true });

const W = 480;
const H = 640;

// ================================================================
// DHEERAJ (Groom) — Cream sherwani, Mediterranean backdrop
// ================================================================
const groomSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" result="grayNoise"/>
      <feBlend in="SourceGraphic" in2="grayNoise" mode="soft-light" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7AAFC8"/>
      <stop offset="45%" stop-color="#B8D4E8"/>
      <stop offset="100%" stop-color="#D4E8F0"/>
    </linearGradient>
    <radialGradient id="face-light" cx="45%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#FDDBB4"/>
      <stop offset="40%" stop-color="#E8A87C"/>
      <stop offset="80%" stop-color="#C87050"/>
      <stop offset="100%" stop-color="#A05830"/>
    </radialGradient>
    <linearGradient id="sherwani" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F5EDD8"/>
      <stop offset="50%" stop-color="#EDE0C4"/>
      <stop offset="100%" stop-color="#D8CBAC"/>
    </linearGradient>
    <linearGradient id="gold-emb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#C5A66A" stop-opacity="0"/>
      <stop offset="30%" stop-color="#E8C87A"/>
      <stop offset="60%" stop-color="#C5A66A"/>
      <stop offset="100%" stop-color="#C5A66A" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="55%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(20,10,5,0.45)"/>
    </radialGradient>
    <radialGradient id="hair-g" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#2A1A0A"/>
      <stop offset="60%" stop-color="#1A0E05"/>
      <stop offset="100%" stop-color="#100806"/>
    </radialGradient>
  </defs>

  <!-- SKY background -->
  <rect width="${W}" height="${H * 0.52}" fill="url(#sky)"/>
  
  <!-- Terracotta cliff -->
  <path d="M0,${H * 0.4} Q80,${H * 0.3} 180,${H * 0.34} Q260,${H * 0.26} 340,${H * 0.32} Q400,${H * 0.22} ${W},${H * 0.3} L${W},${H * 0.52} L0,${H * 0.52}Z" fill="#C9825B" opacity="0.65"/>

  <!-- Village buildings left -->
  <rect x="25" y="${H * 0.25}" width="24" height="34" fill="#D4845A" opacity="0.8"/>
  <polygon points="25,${H * 0.25} 49,${H * 0.25} 37,${H * 0.218}" fill="#B05A30" opacity="0.9"/>
  <rect x="58" y="${H * 0.22}" width="20" height="40" fill="#C87848" opacity="0.8"/>
  <polygon points="58,${H * 0.22} 78,${H * 0.22} 68,${H * 0.19}" fill="#A05030" opacity="0.9"/>
  <rect x="90" y="${H * 0.27}" width="18" height="30" fill="#D88C5A" opacity="0.75"/>
  <rect x="31" y="${H * 0.27}" width="6" height="6" fill="#8B5020" opacity="0.55"/>
  <rect x="40" y="${H * 0.27}" width="6" height="6" fill="#8B5020" opacity="0.55"/>
  <rect x="63" y="${H * 0.25}" width="5" height="6" fill="#7A4018" opacity="0.55"/>
  <rect x="70" y="${H * 0.25}" width="5" height="6" fill="#7A4018" opacity="0.55"/>

  <!-- Village buildings right -->
  <rect x="${W - 88}" y="${H * 0.21}" width="22" height="38" fill="#CC7850" opacity="0.72"/>
  <polygon points="${W - 88},${H * 0.21} ${W - 66},${H * 0.21} ${W - 77},${H * 0.178}" fill="#A05030" opacity="0.85"/>
  <rect x="${W - 58}" y="${H * 0.25}" width="18" height="32" fill="#D48858" opacity="0.72"/>

  <!-- Cypress trees -->
  <ellipse cx="20" cy="${H * 0.37}" rx="6" ry="22" fill="#2D4A1E" opacity="0.9"/>
  <ellipse cx="20" cy="${H * 0.33}" rx="4.5" ry="17" fill="#3A5A28" opacity="0.8"/>
  <ellipse cx="108" cy="${H * 0.36}" rx="5" ry="20" fill="#2D4A1E" opacity="0.85"/>
  <ellipse cx="${W - 38}" cy="${H * 0.35}" rx="6" ry="24" fill="#2D4A1E" opacity="0.8"/>
  <ellipse cx="${W - 38}" cy="${H * 0.31}" rx="4.5" ry="19" fill="#3A5A28" opacity="0.75"/>

  <!-- Sea strip -->
  <rect x="0" y="${H * 0.5}" width="${W}" height="${H * 0.06}" fill="#3D7FA8" opacity="0.7"/>
  <path d="M0,${H * 0.51} Q120,${H * 0.5} 240,${H * 0.515} Q360,${H * 0.52} ${W},${H * 0.51}" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>

  <!-- Stone terrace -->
  <rect x="0" y="${H * 0.56}" width="${W}" height="${H * 0.44}" fill="#C4A882"/>
  <line x1="0" y1="${H * 0.65}" x2="${W}" y2="${H * 0.65}" stroke="#A88C60" stroke-width="0.8" opacity="0.4"/>
  <line x1="0" y1="${H * 0.75}" x2="${W}" y2="${H * 0.75}" stroke="#A88C60" stroke-width="0.8" opacity="0.4"/>
  <line x1="${W * 0.25}" y1="${H * 0.56}" x2="${W * 0.25}" y2="${H}" stroke="#A88C60" stroke-width="0.6" opacity="0.3"/>
  <line x1="${W * 0.5}" y1="${H * 0.56}" x2="${W * 0.5}" y2="${H}" stroke="#A88C60" stroke-width="0.6" opacity="0.3"/>
  <line x1="${W * 0.75}" y1="${H * 0.56}" x2="${W * 0.75}" y2="${H}" stroke="#A88C60" stroke-width="0.6" opacity="0.3"/>

  <!-- SHERWANI body -->
  <path d="M${W * 0.25},${H * 0.6} Q${W * 0.15},${H * 0.72} ${W * 0.12},${H} L${W * 0.88},${H} Q${W * 0.85},${H * 0.72} ${W * 0.75},${H * 0.6} Q${W * 0.62},${H * 0.56} ${W * 0.5},${H * 0.55} Q${W * 0.38},${H * 0.56} ${W * 0.25},${H * 0.6}Z" fill="url(#sherwani)"/>
  <!-- Achkan upper -->
  <path d="M${W * 0.28},${H * 0.52} Q${W * 0.2},${H * 0.58} ${W * 0.18},${H * 0.72} L${W * 0.3},${H * 0.72} Q${W * 0.36},${H * 0.67} ${W * 0.42},${H * 0.64} L${W * 0.58},${H * 0.64} Q${W * 0.64},${H * 0.67} ${W * 0.7},${H * 0.72} L${W * 0.82},${H * 0.72} Q${W * 0.8},${H * 0.58} ${W * 0.72},${H * 0.52} Q${W * 0.62},${H * 0.49} ${W * 0.5},${H * 0.48} Q${W * 0.38},${H * 0.49} ${W * 0.28},${H * 0.52}Z" fill="url(#sherwani)"/>
  <!-- Collar -->
  <path d="M${W * 0.4},${H * 0.5} Q${W * 0.5},${H * 0.48} ${W * 0.6},${H * 0.5} Q${W * 0.58},${H * 0.54} ${W * 0.5},${H * 0.55} Q${W * 0.42},${H * 0.54} ${W * 0.4},${H * 0.5}Z" fill="url(#gold-emb)" opacity="0.9"/>
  <path d="M${W * 0.4},${H * 0.5} Q${W * 0.5},${H * 0.48} ${W * 0.6},${H * 0.5}" stroke="#C5A66A" stroke-width="1.5" fill="none" opacity="0.8"/>
  <!-- Button placket -->
  <line x1="${W * 0.5}" y1="${H * 0.5}" x2="${W * 0.5}" y2="${H * 0.72}" stroke="#C5A66A" stroke-width="1.2" opacity="0.5"/>
  <circle cx="${W * 0.5}" cy="${H * 0.54}" r="3" fill="#C5A66A" opacity="0.7"/>
  <circle cx="${W * 0.5}" cy="${H * 0.59}" r="3" fill="#C5A66A" opacity="0.7"/>
  <circle cx="${W * 0.5}" cy="${H * 0.64}" r="3" fill="#C5A66A" opacity="0.7"/>
  <!-- Sleeves -->
  <path d="M${W * 0.28},${H * 0.52} Q${W * 0.14},${H * 0.57} ${W * 0.1},${H * 0.68} Q${W * 0.15},${H * 0.7} ${W * 0.21},${H * 0.68} Q${W * 0.25},${H * 0.59} ${W * 0.32},${H * 0.56}Z" fill="#EDE0C4"/>
  <path d="M${W * 0.72},${H * 0.52} Q${W * 0.86},${H * 0.57} ${W * 0.9},${H * 0.68} Q${W * 0.85},${H * 0.7} ${W * 0.79},${H * 0.68} Q${W * 0.75},${H * 0.59} ${W * 0.68},${H * 0.56}Z" fill="#EDE0C4"/>
  <!-- Cuffs -->
  <path d="M${W * 0.1},${H * 0.666} Q${W * 0.16},${H * 0.7} ${W * 0.21},${H * 0.68}" stroke="#C5A66A" stroke-width="2.5" fill="none" opacity="0.8"/>
  <path d="M${W * 0.9},${H * 0.666} Q${W * 0.84},${H * 0.7} ${W * 0.79},${H * 0.68}" stroke="#C5A66A" stroke-width="2.5" fill="none" opacity="0.8"/>

  <!-- JASMINE GARLAND -->
  <path d="M${W * 0.3},${H * 0.54} Q${W * 0.4},${H * 0.6} ${W * 0.5},${H * 0.61} Q${W * 0.6},${H * 0.6} ${W * 0.7},${H * 0.54}" stroke="#D4C870" stroke-width="3" fill="none" opacity="0.7"/>
  <circle cx="${W * 0.3}" cy="${H * 0.54}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.35}" cy="${H * 0.564}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.4}" cy="${H * 0.584}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.45}" cy="${H * 0.596}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5}" cy="${H * 0.6}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.55}" cy="${H * 0.596}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.6}" cy="${H * 0.584}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.65}" cy="${H * 0.564}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.7}" cy="${H * 0.54}" r="5" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.3}" cy="${H * 0.54}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.4}" cy="${H * 0.584}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.5}" cy="${H * 0.6}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.6}" cy="${H * 0.584}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.7}" cy="${H * 0.54}" r="2.5" fill="#E8D860" opacity="0.9"/>

  <!-- NECK -->
  <ellipse cx="${W * 0.5}" cy="${H * 0.47}" rx="22" ry="14" fill="#D4906A"/>
  <ellipse cx="${W * 0.5}" cy="${H * 0.484}" rx="20" ry="6" fill="rgba(100,50,20,0.22)"/>

  <!-- HEAD -->
  <ellipse cx="${W * 0.5}" cy="${H * 0.355}" rx="82" ry="94" fill="url(#face-light)"/>

  <!-- HAIR top -->
  <path d="M${W * 0.5 - 82},${H * 0.355} Q${W * 0.5 - 85},${H * 0.28} ${W * 0.5 - 70},${H * 0.24} Q${W * 0.5 - 30},${H * 0.19} ${W * 0.5},${H * 0.19} Q${W * 0.5 + 30},${H * 0.19} ${W * 0.5 + 70},${H * 0.24} Q${W * 0.5 + 85},${H * 0.28} ${W * 0.5 + 82},${H * 0.355} Q${W * 0.5 + 78},${H * 0.275} ${W * 0.5 + 60},${H * 0.235} Q${W * 0.5 + 20},${H * 0.205} ${W * 0.5},${H * 0.205} Q${W * 0.5 - 20},${H * 0.205} ${W * 0.5 - 60},${H * 0.235} Q${W * 0.5 - 78},${H * 0.275} ${W * 0.5 - 82},${H * 0.355}Z" fill="url(#hair-g)"/>
  <!-- Sideburns -->
  <path d="M${W * 0.5 - 82},${H * 0.355} Q${W * 0.5 - 86},${H * 0.4} ${W * 0.5 - 80},${H * 0.44} Q${W * 0.5 - 72},${H * 0.42} ${W * 0.5 - 72},${H * 0.38}Z" fill="url(#hair-g)" opacity="0.9"/>
  <path d="M${W * 0.5 + 82},${H * 0.355} Q${W * 0.5 + 86},${H * 0.4} ${W * 0.5 + 80},${H * 0.44} Q${W * 0.5 + 72},${H * 0.42} ${W * 0.5 + 72},${H * 0.38}Z" fill="url(#hair-g)" opacity="0.9"/>

  <!-- BEARD shadow -->
  <ellipse cx="${W * 0.5}" cy="${H * 0.44}" rx="55" ry="20" fill="rgba(50,25,10,0.16)"/>

  <!-- EYEBROWS -->
  <path d="M${W * 0.5 - 46},${H * 0.312} Q${W * 0.5 - 30},${H * 0.298} ${W * 0.5 - 14},${H * 0.303}" stroke="#2A1200" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M${W * 0.5 + 14},${H * 0.303} Q${W * 0.5 + 30},${H * 0.298} ${W * 0.5 + 46},${H * 0.312}" stroke="#2A1200" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.85"/>

  <!-- EYES -->
  <ellipse cx="${W * 0.5 - 28}" cy="${H * 0.346}" rx="20" ry="12" fill="white" opacity="0.95"/>
  <ellipse cx="${W * 0.5 + 28}" cy="${H * 0.346}" rx="20" ry="12" fill="white" opacity="0.95"/>
  <circle cx="${W * 0.5 - 28}" cy="${H * 0.346}" r="10" fill="#2A1400"/>
  <circle cx="${W * 0.5 + 28}" cy="${H * 0.346}" r="10" fill="#2A1400"/>
  <circle cx="${W * 0.5 - 28}" cy="${H * 0.346}" r="6" fill="#3D2010"/>
  <circle cx="${W * 0.5 + 28}" cy="${H * 0.346}" r="6" fill="#3D2010"/>
  <circle cx="${W * 0.5 - 27}" cy="${H * 0.345}" r="4" fill="#0A0500"/>
  <circle cx="${W * 0.5 + 29}" cy="${H * 0.345}" r="4" fill="#0A0500"/>
  <circle cx="${W * 0.5 - 24}" cy="${H * 0.341}" r="2.5" fill="rgba(255,255,255,0.75)"/>
  <circle cx="${W * 0.5 + 32}" cy="${H * 0.341}" r="2.5" fill="rgba(255,255,255,0.75)"/>
  <path d="M${W * 0.5 - 48},${H * 0.342} Q${W * 0.5 - 28},${H * 0.33} ${W * 0.5 - 8},${H * 0.345}" stroke="#1A0A00" stroke-width="2" fill="none"/>
  <path d="M${W * 0.5 + 8},${H * 0.345} Q${W * 0.5 + 28},${H * 0.33} ${W * 0.5 + 48},${H * 0.342}" stroke="#1A0A00" stroke-width="2" fill="none"/>

  <!-- NOSE -->
  <ellipse cx="${W * 0.5 - 10}" cy="${H * 0.422}" rx="6" ry="4" fill="rgba(100,40,10,0.28)"/>
  <ellipse cx="${W * 0.5 + 10}" cy="${H * 0.422}" rx="6" ry="4" fill="rgba(100,40,10,0.28)"/>
  <path d="M${W * 0.5 - 1},${H * 0.33} L${W * 0.5 + 1},${H * 0.33} L${W * 0.5 + 1},${H * 0.4} L${W * 0.5 - 1},${H * 0.4}Z" fill="rgba(255,200,160,0.28)"/>

  <!-- MOUTH -->
  <path d="M${W * 0.5 - 24},${H * 0.455} Q${W * 0.5 - 10},${H * 0.448} ${W * 0.5},${H * 0.45} Q${W * 0.5 + 10},${H * 0.448} ${W * 0.5 + 24},${H * 0.455} Q${W * 0.5 + 16},${H * 0.465} ${W * 0.5},${H * 0.467} Q${W * 0.5 - 16},${H * 0.465} ${W * 0.5 - 24},${H * 0.455}Z" fill="#B87050"/>
  <path d="M${W * 0.5 - 24},${H * 0.455} Q${W * 0.5},${H * 0.455} ${W * 0.5 + 24},${H * 0.455} Q${W * 0.5 + 20},${H * 0.478} ${W * 0.5 + 10},${H * 0.482} Q${W * 0.5},${H * 0.484} ${W * 0.5 - 10},${H * 0.482} Q${W * 0.5 - 20},${H * 0.478} ${W * 0.5 - 24},${H * 0.455}Z" fill="#C8806A"/>
  <path d="M${W * 0.5 - 24},${H * 0.455} Q${W * 0.5},${H * 0.46} ${W * 0.5 + 24},${H * 0.455}" stroke="#8A4030" stroke-width="0.8" fill="none" opacity="0.5"/>
  <path d="M${W * 0.5 - 10},${H * 0.47} Q${W * 0.5},${H * 0.468} ${W * 0.5 + 10},${H * 0.47}" stroke="rgba(255,200,160,0.35)" stroke-width="2" fill="none"/>

  <!-- EARS -->
  <ellipse cx="${W * 0.5 - 82}" cy="${H * 0.375}" rx="10" ry="15" fill="#C88060"/>
  <ellipse cx="${W * 0.5 + 82}" cy="${H * 0.375}" rx="10" ry="15" fill="#C88060"/>

  <!-- CHEEK warmth -->
  <ellipse cx="${W * 0.5 - 50}" cy="${H * 0.385}" rx="28" ry="16" fill="rgba(200,100,60,0.1)"/>
  <ellipse cx="${W * 0.5 + 50}" cy="${H * 0.385}" rx="28" ry="16" fill="rgba(200,100,60,0.1)"/>

  <!-- GRAIN OVERLAY -->
  <rect width="${W}" height="${H}" fill="transparent" filter="url(#grain)" opacity="0.4"/>

  <!-- VIGNETTE -->
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Warm tint -->
  <rect width="${W}" height="${H}" fill="rgba(200,130,60,0.055)"/>
</svg>`;

// ================================================================
// ANGLE (Bride) — Blush saree, roses, jasmine
// ================================================================
const brideSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="grain-b">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" result="grayNoise"/>
      <feBlend in="SourceGraphic" in2="grayNoise" mode="soft-light" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>
    <linearGradient id="bg-b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F0E0D8"/>
      <stop offset="40%" stop-color="#EDD5C8"/>
      <stop offset="100%" stop-color="#E8C8B8"/>
    </linearGradient>
    <radialGradient id="skin-b" cx="45%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#F0C0A0"/>
      <stop offset="45%" stop-color="#E0A880"/>
      <stop offset="85%" stop-color="#C88060"/>
      <stop offset="100%" stop-color="#B06840"/>
    </radialGradient>
    <linearGradient id="saree" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0C8C0"/>
      <stop offset="50%" stop-color="#E8B8B0"/>
      <stop offset="100%" stop-color="#D8A8A0"/>
    </linearGradient>
    <linearGradient id="zari" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#C5A66A" stop-opacity="0.3"/>
      <stop offset="30%" stop-color="#E8D080"/>
      <stop offset="60%" stop-color="#C5A66A"/>
      <stop offset="100%" stop-color="#C5A66A" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="hair-b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#120A04"/>
      <stop offset="60%" stop-color="#0A0502"/>
      <stop offset="100%" stop-color="#200E06"/>
    </linearGradient>
    <radialGradient id="vig-b" cx="50%" cy="50%" r="70%">
      <stop offset="55%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(60,20,20,0.35)"/>
    </radialGradient>
  </defs>

  <!-- BACKGROUND -->
  <rect width="${W}" height="${H}" fill="url(#bg-b)"/>

  <!-- Large soft painted rose clusters -->
  <circle cx="65" cy="120" r="58" fill="#E8A0A0" opacity="0.28"/>
  <circle cx="65" cy="120" r="38" fill="#F0B0B0" opacity="0.38"/>
  <circle cx="65" cy="120" r="20" fill="#E89898" opacity="0.5"/>
  <circle cx="92" cy="85" r="40" fill="#F0B8B8" opacity="0.25"/>
  <circle cx="40" cy="155" r="45" fill="#D88888" opacity="0.22"/>
  <circle cx="${W - 52}" cy="100" r="52" fill="#E8A8A8" opacity="0.26"/>
  <circle cx="${W - 52}" cy="100" r="32" fill="#F0B8B8" opacity="0.36"/>
  <circle cx="${W - 52}" cy="100" r="16" fill="#D898A0" opacity="0.5"/>
  <circle cx="${W - 80}" cy="130" r="40" fill="#F0B8B8" opacity="0.22"/>

  <!-- White blossom branches -->
  <path d="M0,80 Q40,52 80,22" stroke="#D0B8A8" stroke-width="4" fill="none" opacity="0.45"/>
  <circle cx="30" cy="62" r="10" fill="#FFF5F0" opacity="0.72"/>
  <circle cx="30" cy="62" r="6" fill="#FFE8E0" opacity="0.9"/>
  <circle cx="30" cy="62" r="3" fill="#F0C0A0" opacity="0.8"/>
  <circle cx="55" cy="42" r="10" fill="#FFF5F0" opacity="0.72"/>
  <circle cx="55" cy="42" r="6" fill="#FFE8E0" opacity="0.9"/>
  <circle cx="55" cy="42" r="3" fill="#F0C0A0" opacity="0.8"/>
  <circle cx="80" cy="24" r="9" fill="#FFF5F0" opacity="0.7"/>
  <circle cx="80" cy="24" r="5.5" fill="#FFE8E0" opacity="0.88"/>
  <path d="M${W},62 Q${W - 42},40 ${W - 72},16" stroke="#D0B8A8" stroke-width="3.5" fill="none" opacity="0.4"/>
  <circle cx="${W - 30}" cy="52" r="9" fill="#FFF5F0" opacity="0.68"/>
  <circle cx="${W - 55}" cy="34" r="9" fill="#FFF5F0" opacity="0.68"/>
  <circle cx="${W - 72}" cy="18" r="8" fill="#FFF5F0" opacity="0.65"/>

  <!-- Foreground ivory floor -->
  <rect x="0" y="${H * 0.65}" width="${W}" height="${H * 0.35}" fill="#E8DDD0" opacity="0.5"/>

  <!-- SAREE body -->
  <path d="M${W * 0.25},${H * 0.6} Q${W * 0.15},${H * 0.72} ${W * 0.12},${H} L${W * 0.88},${H} Q${W * 0.85},${H * 0.72} ${W * 0.75},${H * 0.6} Q${W * 0.62},${H * 0.56} ${W * 0.5},${H * 0.55} Q${W * 0.38},${H * 0.56} ${W * 0.25},${H * 0.6}Z" fill="url(#saree)"/>
  <!-- Blouse upper -->
  <path d="M${W * 0.3},${H * 0.5} Q${W * 0.22},${H * 0.55} ${W * 0.2},${H * 0.64} L${W * 0.28},${H * 0.65} Q${W * 0.35},${H * 0.6} ${W * 0.42},${H * 0.57} L${W * 0.58},${H * 0.57} Q${W * 0.65},${H * 0.6} ${W * 0.72},${H * 0.65} L${W * 0.8},${H * 0.64} Q${W * 0.78},${H * 0.55} ${W * 0.7},${H * 0.5} Q${W * 0.6},${H * 0.47} ${W * 0.5},${H * 0.46} Q${W * 0.4},${H * 0.47} ${W * 0.3},${H * 0.5}Z" fill="#E8B8B0"/>
  <!-- Gold zari border -->
  <path d="M${W * 0.25},${H * 0.6} Q${W * 0.38},${H * 0.564} ${W * 0.5},${H * 0.555} Q${W * 0.62},${H * 0.564} ${W * 0.75},${H * 0.6}" stroke="url(#zari)" stroke-width="4.5" fill="none" opacity="0.85"/>
  <path d="M${W * 0.25},${H * 0.6} Q${W * 0.38},${H * 0.575} ${W * 0.5},${H * 0.566} Q${W * 0.62},${H * 0.575} ${W * 0.75},${H * 0.6}" stroke="#C5A66A" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Pallu drape (over left shoulder) -->
  <path d="M${W * 0.25},${H * 0.5} Q${W * 0.18},${H * 0.46} ${W * 0.14},${H * 0.42} Q${W * 0.1},${H * 0.52} ${W * 0.14},${H * 0.6} Q${W * 0.2},${H * 0.64} ${W * 0.26},${H * 0.6}Z" fill="#E0B0A8" opacity="0.9"/>
  <path d="M${W * 0.14},${H * 0.42} Q${W * 0.1},${H * 0.52} ${W * 0.14},${H * 0.6}" stroke="#C5A66A" stroke-width="2.5" fill="none" opacity="0.65"/>

  <!-- Arms -->
  <path d="M${W * 0.25},${H * 0.5} Q${W * 0.12},${H * 0.56} ${W * 0.08},${H * 0.68} Q${W * 0.12},${H * 0.7} ${W * 0.18},${H * 0.68} Q${W * 0.22},${H * 0.6} ${W * 0.3},${H * 0.55}Z" fill="#D09878"/>
  <path d="M${W * 0.75},${H * 0.5} Q${W * 0.88},${H * 0.56} ${W * 0.92},${H * 0.68} Q${W * 0.88},${H * 0.7} ${W * 0.82},${H * 0.68} Q${W * 0.78},${H * 0.6} ${W * 0.7},${H * 0.55}Z" fill="#D09878"/>
  <!-- Bangles left wrist -->
  <ellipse cx="${W * 0.09}" cy="${H * 0.675}" rx="9" ry="5" fill="none" stroke="#C5A66A" stroke-width="2.5" opacity="0.9"/>
  <ellipse cx="${W * 0.09}" cy="${H * 0.683}" rx="9" ry="5" fill="none" stroke="#E8D070" stroke-width="1.5" opacity="0.8"/>
  <ellipse cx="${W * 0.09}" cy="${H * 0.667}" rx="9" ry="5" fill="none" stroke="#C5A66A" stroke-width="1.5" opacity="0.75"/>

  <!-- NECK -->
  <ellipse cx="${W * 0.5}" cy="${H * 0.455}" rx="22" ry="14" fill="#D09878"/>
  <ellipse cx="${W * 0.5}" cy="${H * 0.47}" rx="20" ry="6" fill="rgba(130,50,20,0.18)"/>

  <!-- JHUMKA EARRINGS -->
  <circle cx="${W * 0.5 - 82}" cy="${H * 0.378}" r="6" fill="#C5A66A" opacity="0.9"/>
  <circle cx="${W * 0.5 - 82}" cy="${H * 0.378}" r="4" fill="#E8D070" opacity="0.9"/>
  <line x1="${W * 0.5 - 82}" y1="${H * 0.384}" x2="${W * 0.5 - 82}" y2="${H * 0.42}" stroke="#C5A66A" stroke-width="2" opacity="0.85"/>
  <ellipse cx="${W * 0.5 - 82}" cy="${H * 0.428}" rx="8" ry="11" fill="#C5A66A" opacity="0.8"/>
  <ellipse cx="${W * 0.5 - 82}" cy="${H * 0.428}" rx="5" ry="7" fill="#E8D070" opacity="0.8"/>
  <circle cx="${W * 0.5 + 82}" cy="${H * 0.378}" r="6" fill="#C5A66A" opacity="0.9"/>
  <circle cx="${W * 0.5 + 82}" cy="${H * 0.378}" r="4" fill="#E8D070" opacity="0.9"/>
  <line x1="${W * 0.5 + 82}" y1="${H * 0.384}" x2="${W * 0.5 + 82}" y2="${H * 0.42}" stroke="#C5A66A" stroke-width="2" opacity="0.85"/>
  <ellipse cx="${W * 0.5 + 82}" cy="${H * 0.428}" rx="8" ry="11" fill="#C5A66A" opacity="0.8"/>
  <ellipse cx="${W * 0.5 + 82}" cy="${H * 0.428}" rx="5" ry="7" fill="#E8D070" opacity="0.8"/>

  <!-- HEAD -->
  <ellipse cx="${W * 0.5}" cy="${H * 0.345}" rx="80" ry="92" fill="url(#skin-b)"/>

  <!-- HAIR top -->
  <path d="M${W * 0.5 - 80},${H * 0.345} Q${W * 0.5 - 83},${H * 0.27} ${W * 0.5 - 65},${H * 0.23} Q${W * 0.5 - 30},${H * 0.19} ${W * 0.5},${H * 0.19} Q${W * 0.5 + 30},${H * 0.19} ${W * 0.5 + 65},${H * 0.23} Q${W * 0.5 + 83},${H * 0.27} ${W * 0.5 + 80},${H * 0.345} Q${W * 0.5 + 72},${H * 0.265} ${W * 0.5 + 55},${H * 0.23} Q${W * 0.5 + 20},${H * 0.205} ${W * 0.5},${H * 0.205} Q${W * 0.5 - 20},${H * 0.205} ${W * 0.5 - 55},${H * 0.23} Q${W * 0.5 - 72},${H * 0.265} ${W * 0.5 - 80},${H * 0.345}Z" fill="url(#hair-b)"/>
  <!-- Hair falling sides -->
  <path d="M${W * 0.5 - 80},${H * 0.345} Q${W * 0.5 - 88},${H * 0.4} ${W * 0.5 - 85},${H * 0.5} Q${W * 0.5 - 80},${H * 0.6} ${W * 0.5 - 75},${H * 0.65} Q${W * 0.5 - 65},${H * 0.56} ${W * 0.5 - 72},${H * 0.42}Z" fill="url(#hair-b)" opacity="0.95"/>
  <path d="M${W * 0.5 + 80},${H * 0.345} Q${W * 0.5 + 88},${H * 0.4} ${W * 0.5 + 85},${H * 0.5} Q${W * 0.5 + 80},${H * 0.6} ${W * 0.5 + 75},${H * 0.65} Q${W * 0.5 + 65},${H * 0.56} ${W * 0.5 + 72},${H * 0.42}Z" fill="url(#hair-b)" opacity="0.95"/>

  <!-- JASMINE HAIR GARLAND -->
  <path d="M${W * 0.5 - 55},${H * 0.21} Q${W * 0.5},${H * 0.19} ${W * 0.5 + 55},${H * 0.21}" stroke="#D4C870" stroke-width="2" fill="none" opacity="0.6"/>
  <circle cx="${W * 0.5 - 55}" cy="${H * 0.21}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5 - 37}" cy="${H * 0.202}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5 - 18}" cy="${H * 0.198}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5}" cy="${H * 0.197}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5 + 18}" cy="${H * 0.198}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5 + 37}" cy="${H * 0.202}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5 + 55}" cy="${H * 0.21}" r="6" fill="#FFFDE8" opacity="0.9"/>
  <circle cx="${W * 0.5}" cy="${H * 0.197}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.5 - 37}" cy="${H * 0.202}" r="2.5" fill="#E8D860" opacity="0.9"/>
  <circle cx="${W * 0.5 + 37}" cy="${H * 0.202}" r="2.5" fill="#E8D860" opacity="0.9"/>

  <!-- EYEBROWS (defined arched) -->
  <path d="M${W * 0.5 - 46},${H * 0.302} Q${W * 0.5 - 30},${H * 0.289} ${W * 0.5 - 14},${H * 0.294}" stroke="#1A0A00" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
  <path d="M${W * 0.5 + 14},${H * 0.294} Q${W * 0.5 + 30},${H * 0.289} ${W * 0.5 + 46},${H * 0.302}" stroke="#1A0A00" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>

  <!-- KOHL EYES -->
  <ellipse cx="${W * 0.5 - 28}" cy="${H * 0.336}" rx="21" ry="11" fill="white" opacity="0.95"/>
  <ellipse cx="${W * 0.5 + 28}" cy="${H * 0.336}" rx="21" ry="11" fill="white" opacity="0.95"/>
  <circle cx="${W * 0.5 - 28}" cy="${H * 0.336}" r="10" fill="#180C02"/>
  <circle cx="${W * 0.5 + 28}" cy="${H * 0.336}" r="10" fill="#180C02"/>
  <circle cx="${W * 0.5 - 28}" cy="${H * 0.336}" r="6" fill="#2A1408"/>
  <circle cx="${W * 0.5 + 28}" cy="${H * 0.336}" r="6" fill="#2A1408"/>
  <circle cx="${W * 0.5 - 27}" cy="${H * 0.335}" r="4" fill="#050200"/>
  <circle cx="${W * 0.5 + 29}" cy="${H * 0.335}" r="4" fill="#050200"/>
  <circle cx="${W * 0.5 - 24}" cy="${H * 0.331}" r="2.5" fill="rgba(255,255,255,0.8)"/>
  <circle cx="${W * 0.5 + 32}" cy="${H * 0.331}" r="2.5" fill="rgba(255,255,255,0.8)"/>
  <!-- Kohl eyelid lines -->
  <path d="M${W * 0.5 - 50},${H * 0.333} Q${W * 0.5 - 28},${H * 0.321} ${W * 0.5 - 6},${H * 0.333}" stroke="#100800" stroke-width="2" fill="none"/>
  <path d="M${W * 0.5 + 6},${H * 0.333} Q${W * 0.5 + 28},${H * 0.321} ${W * 0.5 + 50},${H * 0.333}" stroke="#100800" stroke-width="2" fill="none"/>
  <!-- Lash flicks -->
  <path d="M${W * 0.5 - 50},${H * 0.333} Q${W * 0.5 - 55},${H * 0.33} ${W * 0.5 - 54},${H * 0.325}" stroke="#100800" stroke-width="1.5" fill="none"/>
  <path d="M${W * 0.5 + 50},${H * 0.333} Q${W * 0.5 + 55},${H * 0.33} ${W * 0.5 + 54},${H * 0.325}" stroke="#100800" stroke-width="1.5" fill="none"/>

  <!-- NOSE (delicate) -->
  <ellipse cx="${W * 0.5 - 9}" cy="${H * 0.415}" rx="6" ry="4" fill="rgba(150,70,30,0.18)"/>
  <ellipse cx="${W * 0.5 + 9}" cy="${H * 0.415}" rx="6" ry="4" fill="rgba(150,70,30,0.18)"/>
  <path d="M${W * 0.5 - 1},${H * 0.33} L${W * 0.5 + 1},${H * 0.33} L${W * 0.5 + 1},${H * 0.4} L${W * 0.5 - 1},${H * 0.4}Z" fill="rgba(255,210,170,0.22)"/>

  <!-- LIPS (fuller, rose-tinted) -->
  <path d="M${W * 0.5 - 22},${H * 0.447} Q${W * 0.5 - 10},${H * 0.44} ${W * 0.5},${H * 0.442} Q${W * 0.5 + 10},${H * 0.44} ${W * 0.5 + 22},${H * 0.447} Q${W * 0.5 + 15},${H * 0.458} ${W * 0.5},${H * 0.46} Q${W * 0.5 - 15},${H * 0.458} ${W * 0.5 - 22},${H * 0.447}Z" fill="#C87878"/>
  <path d="M${W * 0.5 - 22},${H * 0.447} Q${W * 0.5},${H * 0.448} ${W * 0.5 + 22},${H * 0.447} Q${W * 0.5 + 18},${H * 0.472} ${W * 0.5 + 8},${H * 0.476} Q${W * 0.5},${H * 0.478} ${W * 0.5 - 8},${H * 0.476} Q${W * 0.5 - 18},${H * 0.472} ${W * 0.5 - 22},${H * 0.447}Z" fill="#D88888"/>
  <path d="M${W * 0.5 - 8},${H * 0.462} Q${W * 0.5},${H * 0.46} ${W * 0.5 + 8},${H * 0.462}" stroke="rgba(255,220,200,0.45)" stroke-width="2.5" fill="none"/>

  <!-- EARS -->
  <ellipse cx="${W * 0.5 - 80}" cy="${H * 0.36}" rx="10" ry="14" fill="#C88868"/>
  <ellipse cx="${W * 0.5 + 80}" cy="${H * 0.36}" rx="10" ry="14" fill="#C88868"/>

  <!-- BINDI -->
  <circle cx="${W * 0.5}" cy="${H * 0.285}" r="5" fill="#C83030" opacity="0.9"/>
  <circle cx="${W * 0.5}" cy="${H * 0.285}" r="3.5" fill="#E04040" opacity="0.95"/>

  <!-- CHEEK blush -->
  <ellipse cx="${W * 0.5 - 48}" cy="${H * 0.375}" rx="30" ry="16" fill="rgba(220,100,80,0.09)"/>
  <ellipse cx="${W * 0.5 + 48}" cy="${H * 0.375}" rx="30" ry="16" fill="rgba(220,100,80,0.09)"/>

  <!-- GRAIN OVERLAY -->
  <rect width="${W}" height="${H}" fill="transparent" filter="url(#grain-b)" opacity="0.33"/>

  <!-- VIGNETTE -->
  <rect width="${W}" height="${H}" fill="url(#vig-b)"/>

  <!-- Pink tint -->
  <rect width="${W}" height="${H}" fill="rgba(220,120,100,0.045)"/>
</svg>`;

// Save both portraits
try {
  await sharp(Buffer.from(groomSvg))
    .resize(W, H)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(join(OUTPUT_DIR, 'dheeraj.jpg'));
  console.log('✓ dheeraj.jpg saved (' + W + 'x' + H + ')');
} catch (err) {
  console.error('Error saving dheeraj.jpg:', err.message);
}

try {
  await sharp(Buffer.from(brideSvg))
    .resize(W, H)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(join(OUTPUT_DIR, 'angle.jpg'));
  console.log('✓ angle.jpg saved (' + W + 'x' + H + ')');
} catch (err) {
  console.error('Error saving angle.jpg:', err.message);
}
