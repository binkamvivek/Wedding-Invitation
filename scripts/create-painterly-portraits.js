import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const coupleDir = 'public/assets/couple';
fs.mkdirSync(coupleDir, { recursive: true });

async function buildRichPainterlyPortraits() {
  // Groom: Dheeraj - Impressionist gouache portrait with rich layered brushwork
  const groomSvg = `
    <svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Impasto oil brush grain filter -->
        <filter id="impasto" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" result="displaced"/>
          <feSpecularLighting in="displaced" surfaceScale="2" specularConstant="0.6" specularExponent="20" lighting-color="#FFFDF7" result="spec">
            <fePointLight x="200" y="150" z="250"/>
          </feSpecularLighting>
          <feComposite in="displaced" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0"/>
        </filter>

        <!-- Canvas texture -->
        <filter id="canvas">
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" result="grain"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0 0.88  0 0 0 0.08 0"/>
        </filter>

        <!-- Gradients -->
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EBE3D3"/>
          <stop offset="50%" stop-color="#D5C5A8"/>
          <stop offset="100%" stop-color="#B8A88A"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#FDF4E1" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#E0BA7C" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#C5A66A" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background Mediterranean sky & sun glow -->
      <rect width="600" height="800" fill="url(#skyGrad)"/>
      <rect width="600" height="800" fill="url(#sunGlow)"/>
      
      <!-- Distant Mediterranean Cypress and Terracotta Hill hints -->
      <path d="M 0 520 Q 180 460 380 500 T 600 480 L 600 800 L 0 800 Z" fill="#75825E" opacity="0.45"/>
      <polygon points="80,500 95,340 110,500" fill="#2E4232" opacity="0.6" filter="url(#impasto)"/>
      <polygon points="120,510 132,380 144,510" fill="#3D4E3C" opacity="0.5" filter="url(#impasto)"/>
      <polygon points="490,510 505,360 520,510" fill="#2E4232" opacity="0.5" filter="url(#impasto)"/>

      <!-- Groom Figure in Textured Gouache -->
      <g filter="url(#impasto)">
        <!-- Linen Sherwani / Coat Shoulders -->
        <path d="M 80 800 C 100 600, 180 540, 300 540 C 420 540, 500 600, 520 800 Z" fill="#F8F4E9"/>
        <!-- Coat Shadow & Lapel Drape -->
        <path d="M 230 540 L 300 670 L 370 540 Z" fill="#E2D4BC"/>
        <path d="M 285 570 L 300 780 L 315 570 Z" fill="#C5A66A" opacity="0.7"/>
        
        <!-- Subtle gold buttons on Sherwani -->
        <circle cx="300" cy="620" r="4.5" fill="#C5A66A"/>
        <circle cx="300" cy="660" r="4.5" fill="#C5A66A"/>
        <circle cx="300" cy="700" r="4.5" fill="#C5A66A"/>
        <circle cx="300" cy="740" r="4.5" fill="#C5A66A"/>

        <!-- Neck -->
        <path d="M 268 450 L 265 550 L 335 550 L 332 450 Z" fill="#C79F7F"/>
        <path d="M 265 520 L 300 550 L 335 520 Z" fill="#AB8364" opacity="0.6"/>

        <!-- Head / Jawline / Ears -->
        <ellipse cx="238" cy="380" rx="14" ry="24" fill="#C79F7F"/>
        <ellipse cx="362" cy="380" rx="14" ry="24" fill="#C79F7F"/>
        <path d="M 240 330 C 235 430, 260 480, 300 480 C 340 480, 365 430, 360 330 Z" fill="#DDB291"/>
        
        <!-- Warm Facial Highlights & Contours -->
        <ellipse cx="300" cy="390" rx="42" ry="50" fill="#E8C3A4"/>
        <path d="M 288 360 C 295 400, 290 415, 300 422 C 308 415, 305 400, 312 360 Z" fill="#C99B77" opacity="0.65"/>
        
        <!-- Eyes & Warm Expression -->
        <ellipse cx="274" cy="365" rx="9" ry="5" fill="#3D291F"/>
        <ellipse cx="326" cy="365" rx="9" ry="5" fill="#3D291F"/>
        <path d="M 262 352 Q 275 346 288 352" stroke="#2B1A12" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M 312 352 Q 325 346 338 352" stroke="#2B1A12" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        
        <!-- Gentle Smile -->
        <path d="M 282 445 Q 300 460 318 445" stroke="#7A3F36" stroke-width="4" stroke-linecap="round" fill="none"/>
        
        <!-- Groom Hair (Stylized Mediterranean Gouache Strokes) -->
        <path d="M 235 340 C 230 220, 370 215, 365 340 C 350 280, 250 280, 235 340 Z" fill="#241B17"/>
        <path d="M 245 285 C 270 240, 330 240, 355 280 C 330 260, 270 260, 245 285 Z" fill="#3D302A"/>
        <!-- Beard / Stubble -->
        <path d="M 248 395 C 255 465, 275 486, 300 486 C 325 486, 345 465, 352 395 C 345 460, 325 478, 300 478 C 275 478, 255 460, 248 395 Z" fill="#2C211B" opacity="0.75"/>
      </g>

      <!-- Fine Canvas Wash Overlay -->
      <rect width="600" height="800" filter="url(#canvas)" opacity="0.4"/>
      
      <!-- Vintage Framing Keyline -->
      <rect x="24" y="24" width="552" height="752" fill="none" stroke="#C5A66A" stroke-width="2" opacity="0.75"/>
      <rect x="30" y="30" width="540" height="740" fill="none" stroke="#F8F4E9" stroke-width="1" opacity="0.5"/>
    </svg>
  `;

  // Bride: Angle - Impressionist gouache portrait with blush saree & jasmine blossoms
  const brideSvg = `
    <svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="bimpasto" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" result="displaced"/>
          <feSpecularLighting in="displaced" surfaceScale="2" specularConstant="0.6" specularExponent="20" lighting-color="#FFFDF7" result="spec">
            <fePointLight x="400" y="150" z="250"/>
          </feSpecularLighting>
          <feComposite in="displaced" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0"/>
        </filter>

        <linearGradient id="bSkyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F7EDE8"/>
          <stop offset="50%" stop-color="#EED8D2"/>
          <stop offset="100%" stop-color="#DEBDB5"/>
        </linearGradient>
        <radialGradient id="bSunGlow" cx="55%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#FFF2EC" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#E8B0A2" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#D9A9A0" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background Warm Blush Garden Wash -->
      <rect width="600" height="800" fill="url(#bSkyGrad)"/>
      <rect width="600" height="800" fill="url(#bSunGlow)"/>

      <!-- Distant Mediterranean Olive Trees & Terracotta Garden Walls -->
      <path d="M 0 510 Q 220 470 420 500 T 600 470 L 600 800 L 0 800 Z" fill="#889674" opacity="0.4"/>
      <circle cx="100" cy="460" r="50" fill="#4D6144" opacity="0.5" filter="url(#bimpasto)"/>
      <circle cx="150" cy="480" r="42" fill="#5A704F" opacity="0.45" filter="url(#bimpasto)"/>
      <circle cx="510" cy="465" r="52" fill="#4D6144" opacity="0.5" filter="url(#bimpasto)"/>

      <!-- Bride Figure in Gouache -->
      <g filter="url(#bimpasto)">
        <!-- Long Flowing Dark Tresses Framing Face -->
        <path d="M 210 320 C 170 460, 150 620, 110 800 L 490 800 C 450 620, 430 460, 390 320 Z" fill="#1F1714"/>
        
        <!-- Blush Pastel Saree & Gold Zari Drape -->
        <path d="M 90 800 C 110 610, 190 545, 300 545 C 410 545, 490 610, 510 800 Z" fill="#D9A9A0"/>
        <!-- Gold Embroidered Saree Pallu / Border -->
        <path d="M 160 800 C 220 680, 290 580, 360 550 L 390 575 C 320 610, 250 710, 190 800 Z" fill="#C5A66A"/>
        <path d="M 165 800 C 222 682, 292 582, 362 552" stroke="#FFF7E6" stroke-width="2" stroke-dasharray="6 3" fill="none"/>

        <!-- Neck & Gold Necklace / Mangalsutra hint -->
        <path d="M 272 450 L 270 550 L 330 550 L 328 450 Z" fill="#CA9E7F"/>
        <!-- Delicate Gold Choker / Necklace -->
        <path d="M 270 515 Q 300 535 330 515" stroke="#C5A66A" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="300" cy="528" r="4" fill="#C5A66A"/>

        <!-- Head / Jawline / Ears -->
        <ellipse cx="242" cy="380" rx="12" ry="20" fill="#CA9E7F"/>
        <ellipse cx="358" cy="380" rx="12" ry="20" fill="#CA9E7F"/>
        <path d="M 245 330 C 240 425, 265 475, 300 475 C 335 475, 360 425, 355 330 Z" fill="#E2B799"/>

        <!-- Facial Contours & Blush Glow -->
        <ellipse cx="300" cy="385" rx="38" ry="46" fill="#ECC7AC"/>
        <ellipse cx="270" cy="405" rx="16" ry="10" fill="#D9A9A0" opacity="0.45"/>
        <ellipse cx="330" cy="405" rx="16" ry="10" fill="#D9A9A0" opacity="0.45"/>

        <!-- Eyes & Eyelashes -->
        <ellipse cx="276" cy="368" rx="8" ry="5" fill="#2B1C15"/>
        <ellipse cx="324" cy="368" rx="8" ry="5" fill="#2B1C15"/>
        <path d="M 264 355 Q 276 348 288 355" stroke="#1F1511" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 312 355 Q 324 348 336 355" stroke="#1F1511" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        
        <!-- Radiant Lips & Smile -->
        <path d="M 284 440 Q 300 455 316 440" stroke="#9E4644" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M 288 438 Q 300 446 312 438" fill="#B35552"/>

        <!-- Hair Updo & Garland of Jasmine Blossoms (Mogra) -->
        <path d="M 240 335 C 235 225, 365 225, 360 335 C 348 275, 252 275, 240 335 Z" fill="#1C1411"/>
        
        <!-- White Jasmine Blossoms in Hair -->
        <circle cx="242" cy="310" r="9" fill="#FFFDF7"/>
        <circle cx="242" cy="310" r="3" fill="#E8C97B"/>
        <circle cx="254" cy="290" r="9.5" fill="#FFFDF7"/>
        <circle cx="254" cy="290" r="3" fill="#E8C97B"/>
        <circle cx="270" cy="275" r="9" fill="#FFFDF7"/>
        <circle cx="270" cy="275" r="3" fill="#E8C97B"/>
        <circle cx="290" cy="265" r="8.5" fill="#FFFDF7"/>
        <circle cx="290" cy="265" r="3" fill="#E8C97B"/>

        <!-- Traditional Bindi on Forehead -->
        <circle cx="300" cy="342" r="3" fill="#8A2E2C"/>
        <!-- Gold Jhumka Earrings -->
        <path d="M 240 395 L 240 412 M 234 412 Q 240 422 246 412 Z" stroke="#C5A66A" stroke-width="2.5" fill="#C5A66A"/>
        <path d="M 360 395 L 360 412 M 354 412 Q 360 422 366 412 Z" stroke="#C5A66A" stroke-width="2.5" fill="#C5A66A"/>
      </g>

      <!-- Vintage Framing Keyline -->
      <rect x="24" y="24" width="552" height="752" fill="none" stroke="#C5A66A" stroke-width="2" opacity="0.75"/>
      <rect x="30" y="30" width="540" height="740" fill="none" stroke="#F8F4E9" stroke-width="1" opacity="0.5"/>
    </svg>
  `;

  await sharp(Buffer.from(groomSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(coupleDir, 'dheeraj.jpg'));

  await sharp(Buffer.from(brideSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(coupleDir, 'angle.jpg'));

  console.log('Successfully generated authentic impressionist gouache portraits for Dheeraj and Angle!');
}

buildRichPainterlyPortraits().catch(console.error);

