# Custom Asset Replacement Guide

This folder documents all visual assets used throughout the Dheeraj & Angle wedding invitation.
You can replace any of the artwork files below with your own custom illustrations or photographs.

## File Specifications & Target Sizes

| Filename | Purpose | Optimal Resolution | Format | Max Target Size |
|---|---|---|---|---|
| `envelope-cover.webp` | Full-bleed envelope background (Slide 1) | 900 × 1600 px (Portrait) | WebP | <= 250 KB |
| `card-frame.webp` | Opened invitation card border with calm ivory center (Slide 1) | 960 × 1500 px (Portrait) | WebP | <= 250 KB |
| `couple-arch.webp` | Stone balustrade arch backdrop (Slide 2) | 960 × 600 px | WebP | <= 250 KB |
| `church-watercolor.webp` | Ceremony venue illustration (Slide 3) | 900 × 650 px | WebP | <= 250 KB |
| `floral-wreath.webp` | Countdown botanical wreath (Slide 4) | 720 × 720 px (Square) | WebP | <= 200 KB |
| `floral-corner.webp` | Floral corner flourishes for cards | 320 × 320 px | WebP | <= 50 KB |
| `paper-ivory.webp` | Seamless ivory textured paper background | 400 × 400 px (Seamless) | WebP | <= 60 KB |
| `paper-forest.webp` | Seamless deep forest textured paper background | 400 × 400 px (Seamless) | WebP | <= 60 KB |
| `couple/dheeraj.jpg` | Groom portrait photo | 600 × 800 px (3:4 ratio) | JPG / WebP | <= 300 KB |
| `couple/angle.jpg` | Bride portrait photo | 600 × 800 px (3:4 ratio) | JPG / WebP | <= 300 KB |
| `audio/ambient.mp3` | Optional ambient background music | 128 kbps stereo MP3 | MP3 | <= 2.5 MB |
| `og-image.jpg` | Social share preview card (WhatsApp / iMessage / Twitter) | 1200 × 630 px | JPG | <= 300 KB |
| `favicon.svg` | Browser tab icon | Vector SVG | SVG | <= 10 KB |

## Adding Couple Photos
1. Place the groom's portrait in `public/assets/couple/dheeraj.jpg`.
2. Place the bride's portrait in `public/assets/couple/angle.jpg`.
3. If these photos are not present, the invitation automatically falls back to artistic watercolor silhouettes with their respective initials (`D` and `A`).

## Adding Ambient Background Music
- Place a soothing acoustic or orchestral track at `public/assets/audio/ambient.mp3`.
- When present, a circular sound toggle button automatically appears on the bottom-right.
- Audio is muted by default and will never autoplay without user interaction.

