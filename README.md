# Dheeraj & Angle — Luxury Wedding Invitation Web App

An immersive, mobile-first, high-performance wedding invitation web app inspired by Italian Amalfi coast gouache paintings, tactile stationery unboxing ceremonies, and editorial Haute Horlogerie typography. Built with Vite, Tailwind CSS, semantic HTML5, Lucide icons, and modern Web APIs. Fully optimized for zero-configuration deployment to Vercel.

---

## Quick Start & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repository-url>
cd Wedding-Invitation
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to experience the live invitation with instant Hot Module Replacement (HMR).

---

## Customizing the Wedding Details

All wedding content, schedules, venue details, and sample blessings live in **ONE single file**:
`src/config/wedding.js`

You never need to edit any HTML or component code to customize the wedding:
```javascript
export const weddingConfig = {
  couple: {
    groom: {
      name: 'Dheeraj',
      role: 'The Groom',
      tagline: 'An architect of warmth, quiet devotion, and lifelong joy.',
      photo: '/assets/couple/dheeraj.jpg',
    },
    bride: {
      name: 'Angle',
      role: 'The Bride',
      tagline: 'A spirit of grace, laughter, and radiant wonder.',
      photo: '/assets/couple/angle.jpg',
    },
  },
  event: {
    title: 'Wedding Ceremony of Dheeraj & Angle',
    isoDate: '2026-12-28T11:00:00+05:30', // Exact IST timestamp with timezone offset
    displayDate: 'Monday · 28 December 2026',
    displayTime: '11:00 AM',
    durationHours: 2,
    timezone: 'Asia/Kolkata',
  },
  venue: {
    name: 'All Saints Church',
    city: 'Secunderabad',
    mapsDestination: 'All Saints Church Secunderabad',
  },
  ...
};
```

---

## Adding Couple Photos

1. Export your couple photos in a standard 3:4 portrait ratio (recommended 600×800 px, JPG or WebP).
2. Save them into the `public/assets/couple/` directory:
   - Groom photo: `public/assets/couple/dheeraj.jpg`
   - Bride photo: `public/assets/couple/angle.jpg`
3. If no photo is provided or if an image file is deleted, the app automatically falls back to an elegant painted watercolor silhouette with the initial monogram (`D` and `A`).

---

## Adding Ambient Background Music

1. Obtain a high-quality ambient acoustic, harp, or classical MP3 track.
2. Place it at:
   `public/assets/audio/ambient.mp3`
3. The app automatically checks for the existence of this file. When present, a circular sound toggle button will appear on the bottom right.
4. Per web standards, music is **muted by default** and will never autoplay without a user tap.

---

## Replacing Artwork & Illustrations

All visual assets reside in `public/assets/`. You can replace any illustration with your own:

| File | Resolution | Description |
|---|---|---|
| `public/assets/envelope-cover.webp` | 900 × 1600 px | Full-bleed portrait cover of the unopened envelope |
| `public/assets/card-frame.webp` | 960 × 1500 px | Painted border with a calm ivory center for invitation text |
| `public/assets/couple-arch.webp` | 960 × 600 px | Italian stone balustrade arch backdrop on Slide 2 |
| `public/assets/church-watercolor.webp` | 900 × 650 px | Church watercolor illustration on Slide 3 |
| `public/assets/floral-wreath.webp` | 720 × 720 px | Circular botanical wreath with majolica tile border on Slide 4 |
| `public/assets/floral-corner.webp` | 320 × 320 px | Corner floral flourish on portrait cards |
| `public/og-image.jpg` | 1200 × 630 px | Social sharing preview card for WhatsApp, iMessage, and Twitter |

A complete replacement reference is also available in `public/assets/_REPLACE_ME/README.md`.

---

## Google Maps Directions Verification

The "Get Directions" button automatically links to:
```
https://www.google.com/maps/dir/?api=1&destination=All+Saints+Church+Secunderabad&travelmode=driving
```
**Important note for the couple**: Click the button once to verify that Google Maps resolves to the exact parish in Trimulgherry, Secunderabad. If you prefer to use an exact Google Maps short link (e.g. `https://maps.app.goo.gl/...`), simply update the `mapsDestination` string in `src/config/wedding.js`.

---

## Connecting Google Sheets for Shared RSVPs & Wishes

By default, guest wishes and RSVPs are saved on the user's local device (`LocalStorageAdapter`). To collect all guest wishes into a shared Google Sheet in real time, follow these steps:

### 1. Create a Google Sheet
Create a new spreadsheet with the following header row:
`Timestamp` | `Guest Name` | `RSVP Status` | `Message` | `ID`

### 2. Create the Google Apps Script
1. In your Google Sheet, click **Extensions > Apps Script**.
2. Replace all existing code with this production script:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.rsvp || '',
      data.message || '',
      data.id || Utilities.getUuid()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var wishes = [];

  for (var i = 1; i < rows.length; i++) {
    wishes.push({
      timestamp: rows[i][0],
      name: rows[i][1],
      rsvp: rows[i][2],
      message: rows[i][3],
      id: rows[i][4],
      isSample: false
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ wishes: wishes.reverse() }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy > New Deployment**.
   - Select type: **Web app**
   - Description: `Wedding Wishes API`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and copy the resulting **Web App URL**.

### 3. Activate in `wedding.js`
Open `src/config/wedding.js` and switch the storage configuration:
```javascript
storage: {
  mode: 'remote',
  remoteUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  localStorageKey: 'dheeraj-angle:wishes:v1',
  maxLocalEntries: 50,
}
```

---

## Deploying to Vercel

The repository contains `vercel.json` with long-term cache headers for assets and security policies.

### Method A: Deploy via GitHub (Recommended)
1. Initialize git and commit:
   ```bash
   git add .
   git commit -m "Initial commit of Dheeraj & Angle wedding invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Wedding-Invitation.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New... > Project"**.
3. Import your `Wedding-Invitation` repository.
4. Vercel automatically detects the Vite configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your luxury invitation is live in seconds with global CDN caching and SSL.

### Method B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
vercel --prod
```

---

## Search Engine Indexation (SEO)

Wedding invitations are typically private personal events. By default, `index.html` includes:
```html
<meta name="robots" content="noindex, nofollow">
```
If you wish for search engines to index your invitation publicly, change this tag to:
```html
<meta name="robots" content="index, follow">
```

---

## Technical Specifications & Architecture

- **Stack**: Vite 6, Tailwind CSS 3, Vanilla ES Modules, Semantic HTML5, Lucide icons.
- **Performance**: Zero external animation runtimes. Hardware-accelerated CSS 3D transforms (`perspective`, `rotateX`, `translate3d`), Web Animations API, and Canvas.
- **Calendar**: Valid RFC 5545 iCalendar (`.ics`) file generated client-side with native `Asia/Kolkata` VTIMEZONE, CRLF line endings, 75-octet line folding, and dual-stage alarm triggers (1 day and 2 hours prior).
- **Accessibility**: ARIA slide role descriptions (`aria-roledescription="slide"`), live region announcements on slide change, `:focus-visible` gold indicators, full keyboard navigation (Arrows, PageUp/Down, Home/End), touch gesture swipe with velocity detection, and full compliance with `prefers-reduced-motion`.

