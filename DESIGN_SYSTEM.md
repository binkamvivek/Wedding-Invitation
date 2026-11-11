# DESIGN SYSTEM: Dheeraj & Angle Luxury Wedding Invitation

## 1. Aesthetic Philosophy & Art Direction
The visual language fuses Mediterranean gouache and impasto oil painting (Amalfi cliffs, cypress, terracotta, deep azure waters, white blossoms) with editorial Haute Horlogerie / Italian stationery typography. The design alternates between two rhythmic moods:
- **Light Mood (Ivory / Vellum)**: Sun-drenched warm ivory textured paper, faint ghosted script watermark patterns, centered serif headings, tracked uppercase micro-labels, and delicate blush botanicals.
- **Dark Mood (Deep Forest / Olive)**: Intimate nocturnal garden setting with deep forest green textured paper, gilded hairline borders, and illuminated architectural church art.

---

## 2. Color Tokens

### Primary Palette
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Ivory** | `--color-ivory` | `#F8F4E9` | Light mood paper background, card faces, primary text on dark |
| **Olive** | `--color-olive` | `#68734D` | Foliage, subheadings, subtle borders, inner envelope liner accents |
| **Forest** | `--color-forest` | `#263C2E` | Dark mood paper background, primary body text on light surfaces |
| **Gold** | `--color-gold` | `#C5A66A` | Wax seal, gilded frames, hairline borders, focus rings, keyline accents |
| **Blush** | `--color-blush` | `#D9A9A0` | Petals, floral blossoms, warm highlights |
| **Beige** | `--color-beige` | `#E9DDC9` | Vellum bands, secondary card backgrounds, muted borders |

### Illustration-Only Accents
*(Strictly restricted to painted illustrations; never used as raw UI colors)*
- **Mediterranean Sea Blue**: `#4F7FA8` (Water washes, sailboats, ceramic tile accents)
- **Terracotta**: `#C9825B` (Cliffside village tiles, earthen pots, church dome tiles)

### Darkened Variants for WCAG 2.1 AA Contrast (>= 4.5:1)
- **Gold on Ivory (Text)**: `#8F6E2E` / `#7D5F23` (used when gold styling requires body or label contrast)
- **Dusty Rose on Light (Errors/Warnings)**: `#9C3B3B`

---

## 3. Typography Scale & Hierarchy

### Font Families
- **Serif Primary (Headings & Names)**: `'Cormorant Garamond', Garamond, Georgia, serif`
  - Weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-bold), `italic`
- **Display Accent (Numerals & Dates)**: `'Playfair Display', Georgia, serif`
  - Weights: `400` (Regular), `600` (Semi-bold), `700` (Bold)
- **Sans Primary (Labels, Body, Metadata, Navigation)**: `'Montserrat', -apple-system, sans-serif`
  - Weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-bold)
- **Handwriting Script (Signatures & Romantic Sign-offs)**: `'Pinyon Script', cursive`
  - Used strictly for romantic signatures (*"With love, Dheeraj & Angle"*) and subtle sub-sign-offs.

### Fluid Type Scale (CSS `clamp()`)
| Role | Font Family | Size Specification | Line Height | Tracking |
|---|---|---|---|---|
| **Couple Names** | Cormorant Garamond | `clamp(2.75rem, 8vw, 5.5rem)` | `1.05` | `-0.01em` |
| **Slide Hero Titles** | Cormorant Garamond | `clamp(1.75rem, 4.5vw, 3rem)` | `1.15` | `0.02em` |
| **Section Subtitles** | Cormorant Garamond | `clamp(1.15rem, 2.5vw, 1.65rem)` | `1.3` | `0.04em` |
| **Date Hero Numeral** | Playfair Display | `clamp(4.5rem, 12vw, 8rem)` | `0.95` | `-0.02em` |
| **Countdown Digits** | Playfair Display | `clamp(2rem, 6vw, 3.5rem)` | `1.0` | `0` |
| **Body Copy** | Montserrat | `clamp(0.9375rem, 2vw, 1.0625rem)` | `1.7` | `0.01em` |
| **Micro Labels / Eyebrows** | Montserrat | `clamp(0.6875rem, 1.2vw, 0.75rem)` | `1.4` | `0.28em` (uppercase) |
| **Signatures** | Pinyon Script | `clamp(2.25rem, 5vw, 3.5rem)` | `1.2` | `normal` |

---

## 4. Motion Tokens & Physics

### Easing Functions
- **Luxury Out (Default)**: `cubic-bezier(0.22, 1, 0.36, 1)` (smooth, organic decrescendo)
- **Gentle In-Out**: `cubic-bezier(0.65, 0, 0.35, 1)`
- **Spring Reveal**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (wax seal crack & button pops)

### Duration Tokens
- **Micro**: `150ms` (hover states, focus rings, tactile button taps)
- **Fast**: `300ms` (dropdowns, toggle states, icon morphs)
- **Base / Panel Transition**: `700ms` (slide transitions, modal cards)
- **Deliberate Reveal**: `1200ms` (envelope flap opening, card slide-up)
- **Grand Sequence**: `1800ms - 2400ms` (complete unboxing ceremony)

### Stagger Tokens
- **Item Stagger**: `90ms` between sequential items (word-by-word reveals, list entries)
- **Character Stagger**: `30ms` for monogram / title letter reveals

### Motion Policy
- Strict adherence to `prefers-reduced-motion: reduce`: replaces 3D rotations, zoom scaling, and particle physics with instant or gentle 200ms cross-fades. Disables canvas particle loop and parallax tilt.

---

## 5. Illustration & Tactile Texture Guide

1. **Paper Textures**: Seamless ivory deckled paper grain and dark olive/forest fiber grain. Subtle tactile noise without obscuring legibility.
2. **Torn Paper & Deckled Edges**: Irregular, fibrous SVG clipping masks simulating handmade Italian cotton rag paper.
3. **Gold Wax Seal**: Rich layered metallic radial gradient, high-relief monogram "D & A", soft drop shadow with warm ambient occlusion, and an animated radial pulse ring prior to interaction.
4. **Botanical Drift**: Delicate falling blush rose petals, ivory magnolia blossoms, and olive leaves with varying z-depth, 3D tumbling rotation, and slight lateral breeze drift.
5. **Gilded Line-art Frames**: 1px crisp gold hairline borders with corner flourishes, ornamental scrollwork, and double-line geometry.

---

## 6. Component Catalog

1. **The Royal Envelope**:
   - Closed state with full-bleed Amalfi coastline painting, vellum band with couple's names, wax seal button with ripple cue and "Tap to open" indicator.
   - 3D perspective fold: Left, right, and top triangular flaps unfolding with realistic shadows.
   - Interior card sliding out, settling into the full-screen viewport.
2. **Slide Navigator**:
   - Floating bottom navigation with 4-dot / segmented progress bar, back/next arrows with tactile ripple, and active slide indicator.
   - Touch gesture zone supporting swipe with velocity calculation.
3. **Couple Portrait Frames**:
   - Arch-top cards with deckled paper edging, gold inner keyline, and floral corner ornaments.
   - Dual-mode image loader: dynamically renders `dheeraj.jpg` and `angle.jpg` if present, with painterly silhouette watercolor fallback if absent.
4. **Celebration Info & Action Tiles**:
   - Refined flat border tiles on forest paper.
   - Live RFC 5545 `.ics` download trigger and Google Maps external routing link.
   - 5-day calendar strip with heart badge on `28`.
5. **Countdown Timer**:
   - Circular floral wreath frame with blue-and-white Mediterranean majolica tile border.
   - Drift-corrected 4-unit counter (Days, Hours, Minutes, Seconds) with directional flip-slide transition.
6. **RSVP & Blessing Form**:
   - Segmented attendance selector, honeypot anti-spam field, real-time character counter (280 max), and accessible inline validation.
7. **Wishes Wall (Auto-scroll Ticker)**:
   - Infinite smooth ticker exhibiting heartfelt community wishes, pausable on pointer hover or keyboard focus.
   - Seeded with curated sample blessings plus instant appending of local user submissions.

