# ARCHITECTURAL & CREATIVE DECISIONS (DECISIONS.md)

This log documents key decisions made during the design, development, and deployment optimization of the "Dheeraj & Angle" wedding invitation web app.

---

### 1. Build System & Module Architecture
- **Decision**: Use **Vite 6** with standard ES Modules (`src/main.js`, modular files in `src/modules/`) and **Tailwind CSS v3** compiled via PostCSS.
- **Rationale**: Meets the explicit requirement for a clean, Vercel-ready, zero-runtime-overhead stack without heavy UI frameworks (no React, no Next.js). Provides lightning-fast HMR in development and tree-shaken, minified output in production.

### 2. Typography Strategy & Web Font Loading
- **Decision**: Preconnect to Google Fonts and load Cormorant Garamond, Playfair Display, Montserrat, and Pinyon Script with `display=swap`. Preload primary heading fonts in `<head>`.
- **Rationale**: Balances editorial luxury with zero FOIT (Flash of Invisible Text) and minimal layout shift (CLS < 0.05). Cormorant Garamond provides the classic Italian invitation elegance, Playfair Display adds editorial punch to numerals and dates, Montserrat ensures crystal-clear readability for microcopy and form fields, and Pinyon Script adds a handwritten signature flourish.

### 3. Motion & Animation Layer
- **Decision**: Standard CSS 3D transforms (`perspective`, `rotateX`, `rotateY`, `translate3d`) and Web Animations API / `requestAnimationFrame` for interactive elements; HTML5 Canvas for the ambient particle layer (petals and gold sparkles).
- **Rationale**: Bypasses heavy animation libraries like GSAP or Framer Motion to preserve extreme mobile performance (sub-20ms frame budget on 60Hz mid-range Androids). Hardware-accelerated GPU transforms guarantee 60fps flap opening without layout thrashing.
- **Accessibility**: Comprehensive `prefers-reduced-motion` override that replaces 3D flap physics, canvas particles, and parallax with clean, instant or gentle crossfades.

### 4. Image Generation & Asset Pipeline
- **Decision**: Utilize the AI Image Generation engine with a strict style lock:
  > *"Hand-painted gouache and impasto oil texture, visible brush strokes, soft cloud washes, warm Mediterranean palette of terracotta, ochre, cypress green, cream and deep sea blue, vintage European travel-poster / needlepoint-tapestry feel, matte paper grain, no text, no people, no watermark."*
  Images are processed and converted to optimized WebP formats under 250KB each with blurred preview placeholders and inline SVG fallbacks.
- **Couple Portraits**: Dynamic fallback architecture that detects `/public/assets/couple/dheeraj.jpg` and `angle.jpg`; if absent, renders an artistic gouache silhouette with initials and a dev-facing indicator.

### 5. Calendar (`.ics`) Implementation
- **Decision**: Client-side dynamic RFC 5545 `.ics` file generation with proper `VTIMEZONE` (`Asia/Kolkata`), standard CRLF line breaks, 75-octet line folding, and dual-interval alarms (1 day and 2 hours before). A secondary Google Calendar direct web-intent URL is also provided.
- **Rationale**: Ensures 100% platform-native compatibility across iOS Calendar, Google Calendar, and Microsoft Outlook without requiring an external backend calendar API.

### 6. Storage Adapter Pattern for RSVP & Wishes
- **Decision**: Export an agnostic `wishesService` implementing `listWishes()`, `addWish()`, and `subscribe()`. Default to an enterprise-grade `LocalStorageAdapter` with schema versioning, UUID generation, 50-item cap, HTML sanitization (`textContent`), and graceful in-memory degradation when storage is blocked. Include a production-ready, disabled-by-default `RemoteAdapter` with complete Google Apps Script code for Google Sheets sync.
- **Rationale**: Instant out-of-the-box functionality for client previews and private deployments with a frictionless single-config switch to shared Google Sheets data.

