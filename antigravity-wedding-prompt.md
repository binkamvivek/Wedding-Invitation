# MISSION: "Dheeraj & Angle" — Immersive Luxury Wedding Invitation (mobile-first, Vercel-ready)

You are a senior creative director + frontend engineer + motion designer working as an autonomous agent in this workspace. Build a complete, runnable, deployable wedding-invitation web app. Work in **Planning mode first**: produce an Implementation Plan and a Task List, then execute. Do not stop for confirmation; make sensible creative decisions and document them in `DECISIONS.md`.

The end goal: someone opens this link on their phone and says **"Wow, this is absolutely beautiful."**

---

## 0. REFERENCE ANALYSIS (do this BEFORE any code)

A reference screen-recording of a mobile wedding invitation is attached (`reference.mp4`, portrait phone, ~86s). If you cannot view the video, use the extracted frames in `/reference/` and the written analysis below, which is authoritative.

**What the reference does (study, then reinterpret, never copy):**

1. **Opening envelope.** Full-bleed painted Amalfi coastline (terracotta villages, cypress, deep-blue sea, sailboats) with white blossom branches framing the top-left. A cream ribbon/bow is tied across the envelope; a hand-cursor hint sits on the bow. Tap → the ribbon releases, the envelope flaps fold open as triangular panels, and the card inside is revealed: ivory textured paper with torn/deckled edges and the painted coastline peeking around the border and a hilltop tower at the bottom.
2. **Painting style.** NOT clean vector art. It is a tactile, impasto / gouache / needle-tapestry look: visible brush texture, layered cut-paper edges, soft cloud washes. Subjects: Mediterranean villages, cypress and stone-pine trees, blossoming magnolia/citrus branches, pink rose and peony garlands, stone balustrade arches, a garden fountain, a villa on a cliff.
3. **Two alternating page moods.** (a) **Light**: warm ivory paper with ghosted script watermark words faintly tiled in the background, centered serif titles, tiny letter-spaced caps subtitles. (b) **Dark**: deep olive/forest green textured paper with fine gold-white line-art (cupids, laurel, envelopes, ornate corner flourishes) and a thin ornate double border frame around the key info.
4. **Panel transitions.** Sections are vertical panels. An illustrated image band and a text band **split the screen** (e.g. painting top / content bottom, or vice versa), and the boundary between them is a **torn-paper or wavy painted edge**, not a straight line. Floating rose/peony petals fall across the boundary.
5. **Countdown.** A large number inside a hand-painted floral frame with a blue-and-white checkered (gingham/tile) border and red berries; "Days / Hours / Minutes / Seconds" listed small beneath.
6. **Details.** Tiny pill-shaped language toggle (EN / ES) top-right, round sound toggle bottom-right, handwritten signature font for sign-offs ("Diana and Richard"), a heart-shaped marker on a date strip, a vertical timeline with a thin line and small illustrated icons on alternating sides, wreath/window-box illustrations for RSVP, and a final closing screen: a stone-arch + olive-tree + blossom frame around the couple's names and date.
7. **Typography.** High-contrast refined serif for names (light weight, generous letter-spacing on small caps), handwriting script for signatures, tiny uppercase tracked sans for labels. Lots of white space. Nothing feels crowded.

**Our reinterpretation:** keep the *feeling* (tactile painted Italian coast, envelope ritual, torn-paper seams, light/dark rhythm, ornamental frames) but deliver a **different composition**, our own illustrations, and **exactly four slides** (the reference is a long scroll; we are a paged invitation). Fuse the reference's mood with a more modern, editorial polish and richer motion.

Deliver `DESIGN_SYSTEM.md` (tokens, type scale, motion tokens, illustration style guide, component list) before building.

---

## 1. TECH STACK (Vercel-optimized, minimal)

- **Vite + vanilla JavaScript (ES modules)** + **Tailwind CSS** (installed locally, NOT the CDN build) + semantic HTML5.
- No React, no heavy animation library. Use CSS transforms/opacity, Web Animations API, `IntersectionObserver`, and `requestAnimationFrame`. (Tiny optional additions allowed only if clearly justified in `DECISIONS.md`.)
- Lucide icons via the `lucide` package, importing only the icons actually used (tree-shaken, inline SVG).
- Google Fonts with `display=swap` and preconnect: **Cormorant Garamond** (names/headings), **Playfair Display** (numerals/accents), **Montserrat** (labels/nav/body), plus one handwriting script for signatures only (**Pinyon Script** or **Mrs Saint Delafield**).
- Project layout:

```
/index.html
/src/main.js              (bootstrap, state, slide engine)
/src/styles/main.css      (Tailwind layers + tokens + custom CSS)
/src/modules/
   slides.js  envelope.js  petals.js  countdown.js
   calendar.js  wishes.js  parallax.js  a11y.js
/src/config/wedding.js    (ALL editable content in ONE file)
/src/services/wishesService.js   (storage adapter, see §7)
/public/assets/           (optimized WebP/AVIF + SVG; hero images <= 250 KB each)
/public/favicon.svg  /public/og-image.jpg
/vercel.json  /README.md  /DECISIONS.md  /DESIGN_SYSTEM.md
```

- `wedding.js` holds: names, event title, date/time/timezone ISO string, venue, city, maps query, captions, sample wishes, couple photo paths. Changing the wedding must never require touching component code.
- Mobile-first CSS. Use `100dvh` (not `100vh`) and `env(safe-area-inset-*)` so it feels native on iPhone/Android browsers.

---

## 2. COLOR, TYPE, MOTION TOKENS

**Palette (CSS variables + Tailwind theme):**
`--ivory #F8F4E9` · `--olive #68734D` · `--forest #263C2E` · `--gold #C5A66A` · `--blush #D9A9A0` · `--beige #E9DDC9`

**Allowed accent from the reference:** a muted Mediterranean sea-blue (`#4F7FA8`-ish) and terracotta (`#C9825B`-ish) **only inside illustrations**, never as UI colors.

Avoid: neon, purple, heavy gradients, glassmorphism, harsh contrast, emoji, big rounded cards (max radius 2-4px; prefer sharp or deckled paper edges).

**Type scale (fluid via `clamp()`):** names 44-96px Cormorant Garamond light/italic; section titles 28-48px; labels 10-12px Montserrat uppercase, `letter-spacing: .28em`; body 15-17px at 1.7 line-height. Minimum 4.5:1 text contrast (gold text on ivory must be darkened, use forest for body copy).

**Motion tokens:** ease `cubic-bezier(.22,1,.36,1)` (out-expo-ish); durations 300 / 700 / 1200 / 1800 ms; stagger 80-120 ms. Only animate `transform` and `opacity` (plus `clip-path` for reveals). No layout-thrashing animations.

---

## 3. ILLUSTRATION & ASSET PIPELINE (critical for quality)

Do **not** use stock photos, emoji, or generic clipart. Generate a cohesive art set in ONE consistent style.

**Step A, generate raster art with your image-generation tool** (Nano Banana / Gemini image). Use this style lock on every prompt:

> *"Hand-painted gouache and impasto oil texture, visible brush strokes, soft cloud washes, warm Mediterranean palette of terracotta, ochre, cypress green, cream and deep sea blue, vintage European travel-poster / needlepoint-tapestry feel, matte paper grain, no text, no people, no watermark."*

Assets to generate (save as WebP, 2x for mobile 1080px wide max, plus a tiny blurred placeholder for each):

| File | Description |
|---|---|
| `envelope-cover.webp` | Full-bleed portrait: Amalfi cliffside village, cypress trees, blue sea with sailboats, white blossom branch top-left. Leaves the centre-bottom calm for the wax seal. |
| `card-frame.webp` | Painted border (sea, tower, foliage) with a clean ivory center for text. |
| `couple-arch.webp` | Stone balustrade arch with olive tree, blossoms and sea view (used on slide 2 backdrop). |
| `church-watercolor.webp` | Elegant whitewashed stone church with bell tower, cypress, garden path, golden morning light. Generic Gothic/colonial-style church, **not** a claim of the real All Saints Church facade. |
| `floral-wreath.webp` | Circular wreath of roses, peonies, olive leaves, white blossom, transparent PNG/WebP. |
| `floral-corner.webp` ×2 | Corner flourishes (blush + ivory blossoms with olive leaves), transparent. |
| `olive-branch.svg` | Delicate line olive branch, reusable divider. |
| `paper-ivory.webp`, `paper-forest.webp` | Seamless subtle paper textures (<= 60 KB). |
| `petal-*.svg` ×4 | Tiny blush / ivory petals + olive leaf for particles. |

**Step B, vector + CSS pieces you build in code:** torn-paper edge masks (SVG `clip-path`/`mask`), wax-seal (layered SVG with gold monogram "D & A" and inner emboss shadow), ornamental dividers (animated stroke-dashoffset), thin double-line gold frames, monograms.

**Step C, fallback:** if image generation is unavailable, create the art as layered inline SVG with `feTurbulence` paper grain and painterly gradients, and leave a clearly named `assets/_REPLACE_ME/` folder with a `README` listing the filenames and sizes to swap in. Never ship broken `<img>` tags.

All images: `width`/`height` attributes set, `loading="lazy"` (except slide 1), `decoding="async"`, descriptive `alt` (or `alt=""` + `aria-hidden` for decoration), `srcset` where useful.

---

## 4. EXPERIENCE ARCHITECTURE

Exactly **FOUR** slides in a paged, full-screen (`100dvh`) experience with a horizontal/vertical page-turn feel.

**Global requirements**
- Smooth slide transitions (cross-fade + gentle translate + parallax layers). Direction-aware (forward vs back).
- Navigation: animated **Prev / Next** buttons, **ArrowLeft/ArrowRight/ArrowUp/ArrowDown/PageUp/PageDown/Home/End** keys, **touch swipe** (with threshold + velocity, doesn't hijack vertical scroll inside the RSVP form), mouse wheel with debounce on desktop, and **bottom progress indicator** (4 elegant segments/dots with the active one animated, clickable).
- Slide 1: Prev is hidden/disabled, and Next is disabled until the envelope is opened. Prev on slide 2 returns to the opened-card view of slide 1 (never the closed envelope).
- **Deep link state:** update `location.hash` (`#invitation`, `#couple`, `#celebration`, `#rsvp`) so refresh restores the position; remember "envelope already opened" in `sessionStorage`.
- Optional **mute-by-default ambient music toggle** (round button bottom-right like the reference). If no audio file is provided, still render the toggle ONLY if `public/assets/audio/ambient.mp3` exists, otherwise hide it (no dead buttons). Never autoplay.
- Optional EN/हिन्दी/తెలుగు language switch is OUT OF SCOPE unless trivial; do not add a non-functional toggle.
- **Ambient layer (all slides):** gently floating petals + a few gold sparkles on a single `<canvas>` (max ~18 particles on mobile, ~40 desktop, throttled to 30-45 fps, paused when tab hidden, off when `prefers-reduced-motion`).
- **Parallax:** pointer-based on desktop, `DeviceOrientation` gyro on mobile ONLY after a user gesture and feature detection (iOS permission), subtle (<= 12px).
- Add `prefers-reduced-motion` mode: crossfades only, no particles, no parallax, countdown without flip animation.
- Screen-reader support: each slide is a `<section aria-roledescription="slide" aria-label="n of 4 ...">`; inactive slides get `inert` / `aria-hidden`; focus moves to the slide heading on change; live region announces slide changes; visible `:focus-visible` rings in gold.

### SLIDE 01: THE GRAND INVITATION (envelope ritual)
Inspired by the reference's ribbon-tied painted envelope, but make our own:
- Closed state: portrait envelope filling the screen with `envelope-cover.webp`, cream paper edge and blossom branch overlay, a **gold-and-blush wax seal** (monogram D & A) centered low, softly pulsing with a ring ripple, and a small italic hint **"Tap to open"** with a delicate hand/finger line icon.
- Text on the envelope front (before opening), stacked and elegant: *"Together with their families"* (italic) → **Dheeraj & Angle** (large Cormorant) → *"are getting married"*. Keep it legible over the painting using a soft ivory paper label / vellum strip, not a dark overlay.
- **On tap (or Enter/Space on the seal; it's a real `<button>`):** sequence ≈ 2.4 s:
  1. Seal cracks (two halves rotate/fall with a small particle burst of gold flecks), haptic `navigator.vibrate(15)` where supported.
  2. Envelope flap(s) fold open in 3D (`perspective`, `rotateX`), reveal the inner liner (olive/forest patterned paper).
  3. The card slides up out of the envelope and scales to fill the screen, becoming the "opened invitation" face: ivory deckled-edge card inside the painted frame (`card-frame.webp`) with names, the date line (*"Monday · 28 December 2026"*), venue line (*"All Saints Church, Secunderabad"*) fading in with staggered reveals, plus a tiny animated olive divider.
  4. A subtle **"Swipe or tap Next"** cue appears; Next button animates in.
- Keep the envelope open state if the guest navigates back.
- Ambient sparkles + botanical drift continue throughout.

### SLIDE 02: THE COUPLE (light mood)
- Title **"Two Hearts, One Beautiful Story"** with staggered word-by-word reveal.
- Editorial layout: two portrait frames, slightly offset vertically (staggered "magazine" composition), each with a deckled paper-edge mask and a thin gold inner keyline; small floral corner on each. Between them, a tiny floating-petal cluster and a monogram "&" in script.
- **Groom: Dheeraj** · **Bride: Angle** with small uppercase role labels ("The Groom" / "The Bride") and a one-line editable placeholder tagline each in `wedding.js`.
- Photos: look for `/public/assets/couple/dheeraj.jpg` and `angle.jpg`; if present, use them (auto-cropped with `object-fit: cover`, `object-position` configurable). If missing, render an **illustrated placeholder** (painted silhouette + monogram letter on a watercolor wash) with a visible-in-dev-only "Replace me" note and README instructions.
- Animation: portraits fade + scale (0.94→1) + clip-path reveal from the bottom, staggered; names slide in letter by letter; hover on desktop: gentle lift, slow image zoom, frame keyline brightening.
- Caption (italic): *"Two souls, one journey, and a lifetime of beautiful memories."*
- Backdrop: soft watercolor wash + faint ghosted script watermark words tiled at 4% opacity (like the reference), `couple-arch.webp` very subtle at top.

### SLIDE 03: THE CELEBRATION (dark forest mood, matches the reference's green panels)
- Background `paper-forest.webp` with fine gold line-art (laurel, scrolls) and the **ornate double border frame** around the core info card (SVG, animated draw-on stroke).
- Top half: `church-watercolor.webp` seen through a **torn-paper arch/edge**, slow parallax; floating petals cross the seam.
- Title **"The Celebration"**, subtitle **"Wedding Ceremony & Nuptials"**.
- **Date reveal:** huge numerals **28** in Playfair, with *December 2026* and *Monday* beside it. Digits roll/mask-reveal on entry, then a gold underline draws across. Add a small heart marker, echoing the reference's date strip: show 26 27 **[28]** 29 30 with 28 highlighted inside a heart/oval.
- Info cards (flat, hairline-bordered, NOT bulky rounded boxes), three rows with Lucide icons: **Time**: 11:00 AM (Morning) · **Venue**: All Saints Church · **Location**: Secunderabad.
- Two real buttons:
  1. **Add to Calendar** → generates and downloads `Dheeraj-and-Angle-Wedding.ics`.
  2. **Get Directions** → opens Google Maps in a new tab (`rel="noopener noreferrer"`).
- Contrast: all text on forest must be >= 4.5:1 (use ivory/beige, gold only for large accents).

### SLIDE 04: COUNTDOWN, RSVP & BLESSINGS (light mood, scrollable inside the slide on small screens)
- Title **"Counting Down to Forever"**.
- Countdown inside a hand-painted **floral wreath/arch frame** with a blue-and-white tile border (as in the reference, but our own illustration). Large Days number; Hours / Minutes / Seconds below with small tracked labels.
- Closing line (italic): *"We can't wait to celebrate our special day with you!"*
- **RSVP & Blessings form** (below the countdown, within a delicate gold-hairline panel):
  - Guest Name (required, 2-60 chars, trimmed)
  - RSVP response: segmented radio group "Joyfully accepting" / "Regretfully declining" / "Not sure yet" (optional)
  - Blessing / personal wish (required, 5-280 chars, live character counter)
  - Submit button: **"Send Your Wishes"** (with loading state)
  - Honeypot field for spam, inline accessible validation (`aria-invalid`, `aria-describedby`, error text in dusty-rose-darkened, focus the first invalid field).
- After submit: elegant animated success state ("Thank you, {name}. Your wishes have reached our hearts."), form resets, and the new wish **appears at the top of the guest wall with a gentle entrance**.
- **Wishes wall:** an auto-scrolling, pausable (hover/focus/reduced-motion) vertical or horizontal **ticker** of wish cards (name + RSVP tag + message + relative time). Seed with 4-5 tasteful sample wishes labeled in code as `isSample: true`.
- Honest labelling: a small footnote under the wall: *"Wishes you add are saved on this device only."* (Don't imply other guests can see them.)
- Final sign-off in handwriting script: **With love, Dheeraj & Angle**, over a small olive-branch divider and floral corners.

---

## 5. FUNCTIONAL SPECIFICATIONS (must all really work)

**Countdown**
- Target: `2026-12-28T11:00:00+05:30` (hard-coded in `wedding.js` as ISO with offset, parsed with `new Date(iso)` so it is correct for guests in ANY timezone).
- Update every second using a drift-corrected `setTimeout` loop (align to the next whole second), not a naive `setInterval`. Pause when the tab is hidden and **recompute immediately** on `visibilitychange`.
- Compute from the absolute time difference: days, hours, minutes, seconds (zero-padded to 2 digits for h/m/s).
- Number transitions: a short vertical flip/slide only on the digit that changed.
- When `now >= target` and `< target + 3h`: show the message *"Today is the day. Join us in celebration."* (no emoji); after that window: *"Thank you for celebrating with us."* Stop the interval when finished.
- Expose a `?now=` debug query param (ISO) ONLY in development builds to test the end states.

**Add to Calendar (.ics)**
- Build a valid RFC 5545 file client-side and download via `Blob` + `URL.createObjectURL` + anchor `download` (revoke URL afterwards). Provide Android/iOS compatible MIME `text/calendar;charset=utf-8`.
- Contents: `BEGIN:VCALENDAR`, `VERSION:2.0`, `PRODID`, `CALSCALE:GREGORIAN`, a `VTIMEZONE` for `Asia/Kolkata` (UTC+05:30, no DST), `VEVENT` with a unique `UID`, `DTSTAMP` (UTC), `DTSTART;TZID=Asia/Kolkata:20261228T110000`, `DTEND;TZID=Asia/Kolkata:20261228T130000` (assume 2h; make configurable), `SUMMARY:Wedding Ceremony of Dheeraj & Angle`, `LOCATION:All Saints Church, Secunderabad`, a short `DESCRIPTION`, and a `VALARM` (reminder 1 day and 2 hours before).
- Escape commas, semicolons, backslashes and newlines per spec; fold lines at 75 octets; use CRLF line endings.
- Add an unobtrusive secondary link **"Google Calendar"** using the `calendar.google.com/calendar/render?action=TEMPLATE` URL with `dates=20261228T110000/20261228T130000&ctz=Asia/Kolkata`.

**Get Directions**
- Use the official Maps URLs API, no invented coordinates:
  `https://www.google.com/maps/dir/?api=1&destination=All+Saints+Church+Secunderabad&travelmode=driving`
- The query string is built from `wedding.js` (`venue` + `city`) using `encodeURIComponent`.
- Note in `README.md` that the owner should open it once and, if Google resolves to the wrong "All Saints Church", replace `mapsQuery` with the exact Google Maps place name or a Maps short link (**do not guess coordinates**).

**RSVP / Wishes storage (adapter pattern)**
- `wishesService.js` exports an interface: `listWishes()`, `addWish(wish)`, `subscribe(cb)`.
- Default implementation: **`LocalStorageAdapter`** with key `dheeraj-angle:wishes:v1`, JSON-safe parse with try/catch, schema versioning, de-duplicates by `id` (`crypto.randomUUID()` with fallback), caps at 50 stored wishes, sanitises output (render with `textContent`, never `innerHTML`), and merges with the sample wishes.
- A second, **disabled-by-default `RemoteAdapter` stub** with detailed comments + a working example for a **Google Apps Script + Google Sheets** endpoint (`POST` JSON, `fetch` with `mode:'cors'`, optional `GET` to list) and an alternative note for Vercel serverless / Vercel KV or Supabase. Switch via a single `storage: 'local' | 'remote'` + `remoteUrl` field in `wedding.js`. Include the Apps Script code in `README.md`.
- Never claim localStorage is shared. If localStorage is blocked (private mode), degrade gracefully to in-memory state and show a subtle notice.

---

## 6. PERFORMANCE, ACCESSIBILITY, SEO

- Target Lighthouse mobile: **Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95**.
- Preload the first-slide hero image + critical fonts; lazy-load the rest; use `content-visibility:auto` for off-screen slides' heavy layers; `will-change` only during active animations.
- Single `<canvas>` for particles; cap DPR at 2; stop when idle.
- Test mentally against a mid-range Android (4 GB RAM, 60 Hz): no jank on the envelope sequence, no layout shift (CLS < 0.05).
- Meta: `<title>Dheeraj & Angle | Wedding Invitation</title>`, description, `theme-color` (#F8F4E9), Open Graph + Twitter card (`og-image.jpg` 1200×630 generated from the envelope art), `lang="en"`, favicon (SVG monogram), `viewport-fit=cover`. `robots` noindex is optional (private invitation), so default to `noindex` and mention how to change it.
- Keyboard-reachable everything; buttons are `<button>`, links are `<a>`; touch targets >= 44px.

---

## 7. DEPLOYMENT (Vercel)

- `npm run build` must succeed with zero warnings and output to `dist/`.
- Add `vercel.json`: `{ "cleanUrls": true, "headers": [ { "source": "/assets/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] } ] }` and a security headers block (`X-Content-Type-Options`, `Referrer-Policy`).
- `README.md` must contain exact steps: install → `npm run dev` → edit `src/config/wedding.js` → add couple photos → `npm run build` → push to GitHub → import to Vercel (Framework Preset: Vite, Build `npm run build`, Output `dist`) → custom domain (optional) → how to enable the Google Sheets storage → how to replace generated images.

---

## 8. QUALITY GATES (verify before declaring done)

Use the browser tool to actually run the site at **390×844 (phone)**, **360×740 (small Android)**, **768×1024**, and **1440×900**, and capture screenshots of all 4 slides + the opened envelope. Then fix anything that fails. Provide a `TEST_REPORT.md` with PASS/FAIL for each:

1. Envelope opens via tap, Enter and Space; sequence completes; re-open state persists.
2. Next/Prev buttons, arrow keys, swipe, progress dots, hash deep-links all work; no off-by-one at the ends.
3. Countdown matches `date -d "2026-12-28 11:00 IST"` math; test with the `?now=` override for "begun" and "ended" states; test with browser timezone changed to `America/New_York` and `Asia/Tokyo`.
4. `.ics` downloads, opens in Apple Calendar / Google Calendar / Outlook with the correct IST time (validate the file text and, if possible, parse it with a library or an online-style validator).
5. Directions link opens a Maps directions page for All Saints Church, Secunderabad.
6. Form validation messages, success state, wish appears on the wall, persists after reload, sample wishes still present, `localStorage` blocked fallback works.
7. `prefers-reduced-motion` honoured (emulate it).
8. No horizontal scroll, no text clipping or overlap at any tested size, text legible over art, 4.5:1 contrast.
9. Console clean (no errors/warnings), no 404s, Lighthouse scores recorded.
10. No emoji anywhere in the UI, no lorem ipsum, no dead buttons.

---

## 9. DESIGN GUARDRAILS (non-negotiable)

- Every slide must feel like one art-directed suite: same paper textures, same gold keyline weight (1px), same corner-flourish family, same illustration style.
- Generous negative space; one hero idea per slide; max 2 typefaces visible per screen (+ script for signature).
- No generic "AI template" look: no centered-hero-with-three-cards, no pill-heavy UI, no drop-shadow soup, no gradient blobs.
- Text over imagery must always sit on paper, vellum or a calm part of the painting, never on busy areas.

## 10. FINAL DELIVERABLE

A complete project I can run with `npm install && npm run dev` and deploy to Vercel with no changes. At the end, reply with: what you built, how to replace the couple photos and the generated images, how to switch on the Google Sheets backend, the Vercel steps, and any assumptions you made (list them).
