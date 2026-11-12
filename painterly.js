/* ==========================================================================
   painterly.js  (ES module, no dependencies)

   Adds an oil-pastel / gouache look on top of the existing invitation:
     - brush-stroke texture tiles (drawn on <canvas>, used as CSS backgrounds)
     - dry-brush gold border strips + a painted frame image
     - hand-painted peonies, blossoms, twigs and leaves (inline SVG)

   Nothing in the existing HTML has to change. It finds every <section.slide>,
   and inserts one  <div class="pt-layer">  into it.

   Edit PLAN (below) to move, resize, add or remove flower clusters.
   ========================================================================== */

const SVGNS = 'http://www.w3.org/2000/svg';

/* ----------------------------------------------------------------------
   Seeded random: every reload paints exactly the same picture
   ---------------------------------------------------------------------- */
function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];
const rr = (R, a, b) => a + R() * (b - a);
const f1 = (n) => Math.round(n * 10) / 10;

/* ----------------------------------------------------------------------
   Canvas helpers
   ---------------------------------------------------------------------- */
function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function toURL(canvas) {
  return new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((b) => resolve(b ? URL.createObjectURL(b) : canvas.toDataURL('image/png')), 'image/png');
    } else {
      resolve(canvas.toDataURL('image/png'));
    }
  });
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* ----------------------------------------------------------------------
   1. Brush-stroke texture tile (seamless)
   ---------------------------------------------------------------------- */
const TEX = {
  light: {
    seed: 7, strokes: 560, speckles: 3200,
    colors: [
      { c: [255, 252, 243], a: [.10, .26], w: 3 },   // creamy highlights
      { c: [196, 168, 120], a: [.05, .12], w: 3 },   // warm ochre
      { c: [217, 169, 160], a: [.05, .11], w: 2 },   // blush
      { c: [150, 176, 192], a: [.05, .10], w: 2 },   // sea-sky blue
      { c: [104, 115, 77],  a: [.03, .07], w: 1 },   // olive
    ],
    tooth: [[120, 96, 60, .10], [255, 255, 250, .22]],
    dabs: [
      { c: [196, 168, 120], a: [.03, .06] }, { c: [217, 169, 160], a: [.03, .06] },
      { c: [150, 176, 192], a: [.03, .06] }, { c: [255, 252, 243], a: [.05, .10] },
    ],
  },
  dark: {
    seed: 19, strokes: 600, speckles: 3000,
    colors: [
      { c: [104, 115, 77],  a: [.12, .26], w: 4 },   // olive
      { c: [6, 16, 10],     a: [.16, .30], w: 4 },   // deep shade
      { c: [150, 160, 110], a: [.05, .12], w: 2 },   // pale leaf
      { c: [197, 166, 106], a: [.04, .10], w: 1 },   // gold flecks
      { c: [248, 244, 233], a: [.02, .05], w: 1 },   // ivory flecks
    ],
    tooth: [[255, 250, 230, .12], [0, 0, 0, .22]],
    dabs: [
      { c: [104, 115, 77], a: [.06, .13] }, { c: [6, 16, 10], a: [.08, .16] },
      { c: [150, 160, 110], a: [.03, .06] },
    ],
  },
};

function strokeTile(S, spec) {
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const R = rng(spec.seed);
  const bag = [];
  spec.colors.forEach((col) => { for (let i = 0; i < col.w; i++) bag.push(col); });

  // Pre-generate strokes so wrap-around copies are identical
  const strokes = [];
  for (let i = 0; i < spec.strokes; i++) {
    const col = pick(R, bag);
    const ang = (-0.42 + (R() - .5) * 1.0);          // mostly a lazy diagonal sweep
    const len = rr(R, 22, 80);
    const nb = 3 + Math.floor(R() * 5);
    const spread = rr(R, 2, 6);
    const bristles = [];
    for (let b = 0; b < nb; b++) {
      bristles.push({
        off: (nb === 1 ? 0 : b / (nb - 1) - .5) * spread + (R() - .5) * 1.2,
        k: rr(R, .55, 1),
        w: rr(R, .5, 1.15),
        a: rr(R, .45, 1) * rr(R, col.a[0], col.a[1]) * 1.15,
        bend: (R() - .5) * 8,
      });
    }
    strokes.push({ x: R() * S, y: R() * S, len, ang, col, bristles });
  }

  const draw = (s, dx, dy) => {
    const ca = Math.cos(s.ang), sa = Math.sin(s.ang);
    const nx = -sa, ny = ca;
    for (const b of s.bristles) {
      const x0 = s.x + dx + nx * b.off, y0 = s.y + dy + ny * b.off;
      const L = s.len * b.k;
      const x1 = x0 + ca * L, y1 = y0 + sa * L;
      g.beginPath();
      g.moveTo(x0, y0);
      g.quadraticCurveTo((x0 + x1) / 2 + nx * b.bend, (y0 + y1) / 2 + ny * b.bend, x1, y1);
      g.lineWidth = b.w;
      g.lineCap = 'round';
      g.strokeStyle = rgba(s.col.c, Math.min(.9, b.a));
      g.stroke();
    }
  };

  // Soft wide dabs: the mottled, gouache-like body of the paint
  const dabs = spec.dabs || [];
  for (let i = 0; i < 90 && dabs.length; i++) {
    const d = pick(R, dabs);
    const x = R() * S, y = R() * S, L = rr(R, 30, 90), a = -0.42 + (R() - .5) * 1.2;
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
    const lw = rr(R, 9, 24), al = rr(R, d.a[0], d.a[1]);
    for (const dx of [-S, 0, S]) {
      for (const dy of [-S, 0, S]) {
        const px = x + dx, py = y + dy;
        if (px < -110 || px > S + 110 || py < -110 || py > S + 110) continue;
        g.beginPath(); g.moveTo(px, py);
        g.quadraticCurveTo(px + ex / 2 + (R() - .5) * 0, py + ey / 2, px + ex, py + ey);
        g.lineWidth = lw; g.lineCap = 'round';
        g.strokeStyle = rgba(d.c, al);
        g.stroke();
      }
    }
  }

  for (const s of strokes) {
    for (const dx of [-S, 0, S]) {
      for (const dy of [-S, 0, S]) {
        if (s.x + dx < -170 || s.x + dx > S + 170 || s.y + dy < -170 || s.y + dy > S + 170) continue;
        draw(s, dx, dy);
      }
    }
  }

  // Impasto ridges: a bright line with a darker twin one pixel away
  for (let i = 0; i < 36; i++) {
    const x = R() * S, y = R() * S, L = rr(R, 12, 36), a = -0.42 + (R() - .5) * .8;
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
    for (const [ox, oy, col] of [[0, 0, spec.tooth[1]], [1.4, 1.4, spec.tooth[0]]]) {
      for (const dx of [-S, 0, S]) {
        for (const dy of [-S, 0, S]) {
          const px = x + dx + ox, py = y + dy + oy;
          if (px < -80 || px > S + 80 || py < -80 || py > S + 80) continue;
          g.beginPath(); g.moveTo(px, py); g.lineTo(px + ex, py + ey);
          g.lineWidth = 1.1;
          g.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3] * .4})`;
          g.stroke();
        }
      }
    }
  }

  // Pastel tooth: tiny speckles
  for (let i = 0; i < spec.speckles; i++) {
    const col = spec.tooth[i % 2];
    g.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3] * (.4 + R() * .6)})`;
    g.fillRect(R() * S, R() * S, 1 + R() * 1.2, 1 + R() * 1.2);
  }
  return c;
}

/* ----------------------------------------------------------------------
   2. Dry-brush gold strips (page border) and the painted frame image
   ---------------------------------------------------------------------- */
const GOLDS = [
  [197, 166, 106], [184, 150, 84], [214, 186, 122], [230, 208, 150], [168, 134, 70],
];

/* paint one horizontal band of dry-brush bristles across width W, seamless */
function bristleBand(g, W, y0, y1, seed, opts = {}) {
  const R = rng(seed);
  const cycles = opts.cycles || 3;
  const phase = R() * Math.PI * 2;
  const amp = opts.amp == null ? 1.0 : opts.amp;
  const wob = (x) => Math.sin((x / W) * Math.PI * 2 * cycles + phase) * amp
                   + Math.sin((x / W) * Math.PI * 2 * (cycles * 2 + 1) + phase * 1.7) * amp * .35;
  const mid = (y0 + y1) / 2;

  // soft underlay so the band reads as one stroke
  g.beginPath();
  for (let x = 0; x <= W; x += 8) { const y = mid + wob(x); x ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.lineWidth = Math.max(1, (y1 - y0) * .62);
  g.lineCap = 'round';
  g.strokeStyle = rgba(GOLDS[0], .55);
  g.stroke();

  const n = Math.max(3, Math.round((y1 - y0) * 2.6));
  for (let k = 0; k < n; k++) {
    const y = y0 + (y1 - y0) * (k + R() * .8) / n;
    const col = pick(R, GOLDS);
    let x = -R() * 60;
    while (x < W) {
      const seg = rr(R, 40, 190);
      const gap = R() < .3 ? rr(R, 3, 16) : 0;          // dry-brush skips
      const alpha = rr(R, .45, .95);
      const lw = rr(R, .8, 1.7);
      for (const sh of [0, -W, W]) {
        g.beginPath();
        for (let t = 0; t <= seg; t += 8) {
          const xx = x + t + sh;
          if (xx < -10 || xx > W + 10) continue;
          const yy = y + wob(x + t);
          g.lineTo(xx, yy);
        }
        g.lineWidth = lw;
        g.lineCap = 'round';
        g.strokeStyle = rgba(col, alpha);
        g.stroke();
      }
      x += seg + gap;
    }
  }
}

/* horizontal double-line strip: thick outer stroke + hairline inside */
function brushStrip(W, H, seed) {
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  bristleBand(g, W, 0.8, 6.8, seed, { cycles: 3, amp: .9 });
  bristleBand(g, W, 10.8, 13.6, seed + 11, { cycles: 4, amp: .6 });
  return c;
}
function rotateLeft(src) {      // top edge -> left edge, thick stroke stays outside
  const c = makeCanvas(src.height, src.width);
  const g = c.getContext('2d');
  g.translate(0, src.width);
  g.rotate(-Math.PI / 2);
  g.drawImage(src, 0, 0);
  return c;
}

/* border-image tile for .frame / .rsvp  (single painted line, 8px band) */
function frameTile() {
  const S = 120, B = 8;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const strip = makeCanvas(S, B);
  bristleBand(strip.getContext('2d'), S, 1.0, 6.6, 41, { cycles: 2, amp: .55 });
  // top
  g.drawImage(strip, 0, 0);
  // bottom (flip)
  g.save(); g.translate(0, S); g.scale(1, -1); g.drawImage(strip, 0, 0); g.restore();
  // left
  g.save(); g.translate(0, S); g.rotate(-Math.PI / 2); g.drawImage(strip, 0, 0); g.restore();
  // right
  g.save(); g.translate(S, 0); g.rotate(Math.PI / 2); g.drawImage(strip, 0, 0); g.restore();
  return c;
}

/* ----------------------------------------------------------------------
   3. Flower painting (inline SVG)
   ---------------------------------------------------------------------- */
const PAL = {
  pink: {
    petals: ['#E9B6AE', '#DEA29D', '#D2929A', '#EDC4BB'],
    inner:  ['#F4D8D1', '#F7E3DC', '#F0CBC6'],
    line: '#B8737A', glow: '#FFF3EE', core: '#C5A66A',
  },
  ivory: {
    petals: ['#F6EEDF', '#EEE1CD', '#E8D6C0', '#FAF4E8'],
    inner:  ['#FFFDF8', '#FBF3E6', '#F4E6D6'],
    line: '#D9A9A0', glow: '#FFFFFF', core: '#C5A66A',
  },
  blush: {
    petals: ['#F2D2CB', '#EBC0B8', '#E4B0AB', '#F6DDD6'],
    inner:  ['#FAEAE5', '#FDF2EE', '#F5DAD3'],
    line: '#C98E8A', glow: '#FFF7F3', core: '#C5A66A',
  },
};
const LEAF_LIGHT = ['#68734D', '#5A6B45', '#76825A', '#4C5E3F'];
const LEAF_DARK  = ['#7E9163', '#6E8355', '#90A06E', '#5F7549'];

function petalPath(L, W) {
  return `M0 0C${f1(-W * .9)} ${f1(-L * .2)} ${f1(-W * 1.25)} ${f1(-L * .78)} ${f1(-W * .3)} ${f1(-L)}`
       + `Q0 ${f1(-L * 1.07)} ${f1(W * .3)} ${f1(-L)}`
       + `C${f1(W * 1.25)} ${f1(-L * .78)} ${f1(W * .9)} ${f1(-L * .2)} 0 0Z`;
}

function peony(R, cx, cy, r, pal) {
  let s = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(R() * 360)})">`;
  // contact shadow (impasto lift)
  s += `<ellipse cx="2.5" cy="4" rx="${f1(r * 1.02)}" ry="${f1(r * .98)}" fill="#3C281C" opacity=".13"/>`;
  const rings = [
    { n: 8, L: 1.00, W: .50, off: 0,   pi: 0 },
    { n: 7, L: .80,  W: .46, off: 24,  pi: 1 },
    { n: 6, L: .60,  W: .42, off: 12,  pi: 2 },
    { n: 5, L: .40,  W: .36, off: 40,  pi: 3 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const a = ring.off + (i * 360) / ring.n + (R() - .5) * 14;
      const L = r * ring.L * rr(R, .92, 1.06);
      const W = r * ring.W * rr(R, .9, 1.1);
      const fill = pal.petals[(ring.pi + Math.floor(R() * 2)) % pal.petals.length];
      s += `<g transform="rotate(${f1(a)})">`;
      s += `<path d="${petalPath(L, W)}" fill="${fill}" stroke="${pal.line}" stroke-width=".8" stroke-opacity=".5"/>`;
      // lighter dab near the tip, like a loaded brush
      s += `<path d="${petalPath(L * .66, W * .56)}" transform="translate(0 ${f1(-L * .2)})" fill="${pick(R, pal.inner)}" opacity=".62"/>`;
      // three bristle marks
      for (let v = -1; v <= 1; v++) {
        s += `<path d="M${f1(v * W * .18)} ${f1(-L * .12)}Q${f1(v * W * .5)} ${f1(-L * .5)} ${f1(v * W * .72)} ${f1(-L * .88)}" fill="none" stroke="${pal.glow}" stroke-width=".7" stroke-linecap="round" opacity=".38"/>`;
      }
      s += `<path d="M${f1(-W * .5)} ${f1(-L * .9)}Q0 ${f1(-L * 1.0)} ${f1(W * .5)} ${f1(-L * .9)}" fill="none" stroke="${pal.line}" stroke-width=".7" stroke-linecap="round" opacity=".28"/>`;
      s += `</g>`;
    }
  });
  // heart of the flower
  s += `<circle r="${f1(r * .13)}" fill="${pal.line}" opacity=".5"/>`;
  for (let i = 0; i < 11; i++) {
    const a = R() * Math.PI * 2, d = R() * r * .11;
    s += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(rr(R, .7, 1.5))}" fill="${pal.core}"/>`;
  }
  return s + `</g>`;
}

function blossom(R, cx, cy, r, pal) {
  let s = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(R() * 72)})">`;
  s += `<ellipse cx="1.4" cy="2.2" rx="${f1(r * .95)}" ry="${f1(r * .95)}" fill="#3C281C" opacity=".1"/>`;
  for (let i = 0; i < 5; i++) {
    s += `<g transform="rotate(${i * 72 + f1((R() - .5) * 8)})">`;
    s += `<ellipse cy="${f1(-r * .56)}" rx="${f1(r * .4)}" ry="${f1(r * .58)}" fill="${pick(R, pal.petals)}" stroke="${pal.line}" stroke-width=".6" stroke-opacity=".6"/>`;
    s += `<path d="M0 ${f1(-r * .2)}Q${f1(r * .1)} ${f1(-r * .6)} 0 ${f1(-r * .95)}" fill="none" stroke="${pal.glow}" stroke-width=".6" opacity=".6" stroke-linecap="round"/>`;
    s += `</g>`;
  }
  s += `<circle r="${f1(r * .2)}" fill="${pal.core}"/>`;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    s += `<circle cx="${f1(Math.cos(a) * r * .3)}" cy="${f1(Math.sin(a) * r * .3)}" r="${f1(r * .05)}" fill="#8F6E2E"/>`;
  }
  return s + `</g>`;
}

function leaf(R, x, y, len, ang, cols) {
  const w = len * rr(R, .26, .36);
  const col = pick(R, cols);
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})">`
    + `<path d="M0 0C${f1(w)} ${f1(-len * .3)} ${f1(w)} ${f1(-len * .75)} 0 ${f1(-len)}C${f1(-w)} ${f1(-len * .75)} ${f1(-w)} ${f1(-len * .3)} 0 0Z" fill="${col}" stroke="#263C2E" stroke-width=".5" stroke-opacity=".35"/>`
    + `<path d="M0 0C${f1(w)} ${f1(-len * .3)} ${f1(w)} ${f1(-len * .75)} 0 ${f1(-len)}Z" fill="#fff" opacity=".13"/>`
    + `<path d="M0 ${f1(-len * .06)}L0 ${f1(-len * .9)}" stroke="#263C2E" stroke-width=".6" opacity=".4" stroke-linecap="round"/>`
    + `</g>`;
}

function berry(R, x, y, r, pal) {
  const c = R() < .5 ? '#D9A9A0' : '#C5A66A';
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" stroke="${pal.line}" stroke-width=".4" stroke-opacity=".5"/>`
       + `<circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .3)}" r="${f1(r * .35)}" fill="#fff" opacity=".45"/>`;
}

/* a curved twig with leaves along it; returns {svg, tip:{x,y}} */
function twig(R, x0, y0, ang, len, leaves, pal, withBlooms) {
  const a = (ang * Math.PI) / 180;
  const bend = (R() - .5) * len * .45;
  const x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len;
  const mx = (x0 + x1) / 2 + Math.cos(a) * bend, my = (y0 + y1) / 2 + Math.sin(a) * bend;
  let s = `<path d="M${f1(x0)} ${f1(y0)}Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}" fill="none" stroke="#5A6B45" stroke-width="1.7" stroke-linecap="round" opacity=".95"/>`;
  const qt = (t) => {
    const u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * mx + t * t * x1,
      y: u * u * y0 + 2 * u * t * my + t * t * y1,
      a: (Math.atan2(2 * u * (my - y0) + 2 * t * (y1 - my), 2 * u * (mx - x0) + 2 * t * (x1 - mx)) * 180) / Math.PI + 90,
    };
  };
  for (let i = 1; i <= leaves; i++) {
    const p = qt(i / (leaves + 1));
    const side = i % 2 ? 1 : -1;
    s += leaf(R, p.x, p.y, rr(R, 16, 26), p.a + side * rr(R, 38, 62), pal.leaf);
  }
  if (withBlooms) {
    const p = qt(.97);
    s += blossom(R, p.x, p.y, rr(R, 7, 10), pal);
    const q = qt(.62);
    s += blossom(R, q.x + 4, q.y - 3, rr(R, 5, 7), pal);
    s += berry(R, q.x - 6, q.y + 5, 2.4, pal);
  }
  return { svg: s, tip: { x: x1, y: y1 } };
}

/* A full cluster in a 260 x 260 box, anchored to the top-left corner. */
function cluster(kind, seed, paletteName, dark) {
  const R = rng(seed);
  const pal = Object.assign({}, PAL[paletteName] || PAL.pink, { leaf: dark ? LEAF_DARK : LEAF_LIGHT });
  const ivoryPal = Object.assign({}, PAL.ivory, { leaf: pal.leaf });
  let s = '';

  // leaves fanning inwards (back layer)
  const nLeaves = kind === 'peony' ? 11 : 9;
  for (let i = 0; i < nLeaves; i++) {
    const t = i / (nLeaves - 1);
    const ang = 100 + t * 150 + (R() - .5) * 20;         // pointing right/down from the corner
    const d = rr(R, 40, 70);
    const px = 52 + Math.cos(((ang - 90) * Math.PI) / 180) * d * .5;
    const py = 52 + Math.sin(((ang - 90) * Math.PI) / 180) * d * .5;
    s += leaf(R, px, py, rr(R, 44, 92), ang, pal.leaf);
  }

  // twigs with tiny blossoms (like the white branches in the reference)
  const tw = [
    twig(R, 40, 50, 112 + R() * 14, rr(R, 150, 200), 5, ivoryPal, true),
    twig(R, 46, 44, 168 + R() * 14, rr(R, 140, 190), 5, ivoryPal, true),
  ];
  if (kind !== 'peony') tw.push(twig(R, 34, 40, 140 + R() * 12, rr(R, 170, 220), 6, ivoryPal, true));
  tw.forEach((t) => { s += t.svg; });

  if (kind === 'peony') {
    s += peony(R, 52, 52, rr(R, 54, 60), pal);
    s += peony(R, rr(R, 134, 150), rr(R, 36, 48), rr(R, 27, 32), pal);
    s += peony(R, rr(R, 32, 44), rr(R, 138, 152), rr(R, 25, 30), pal);
    s += blossom(R, 108, 112, 12, ivoryPal);
    s += blossom(R, 186, 96, 9, ivoryPal);
    s += blossom(R, 84, 188, 9, ivoryPal);
  } else if (kind === 'blossom') {
    s += peony(R, 40, 40, rr(R, 30, 36), pal);           // one small peony as the anchor
    s += blossom(R, 98, 62, 17, ivoryPal);
    s += blossom(R, 62, 108, 15, ivoryPal);
    s += blossom(R, 132, 120, 12, ivoryPal);
    s += blossom(R, 112, 30, 10, ivoryPal);
  } else {                                               // 'twig': airy, no peony
    s += blossom(R, 50, 50, 20, ivoryPal);
    s += blossom(R, 100, 80, 14, ivoryPal);
    s += blossom(R, 72, 130, 12, ivoryPal);
  }

  // berries / buds
  for (let i = 0; i < 9; i++) s += berry(R, rr(R, 70, 200), rr(R, 60, 200), rr(R, 1.6, 3), pal);

  return `<g filter="url(#ptRough)">${s}</g>`;
}

/* ----------------------------------------------------------------------
   4. WHERE THE FLOWERS GO  (edit freely)
      at:    tl | tr | bl | br   -> corner clusters
             l  | r              -> mid-edge clusters, y = % down the section
      s:     L | M | S           -> size
      kind:  peony | blossom | twig
      pal:   pink | blush | ivory
      edge:  how far from the section edge (CSS length, can be negative)
   ---------------------------------------------------------------------- */
const SIZES = {
  L: 'clamp(130px, 40vw, 290px)',
  M: 'clamp(104px, 30vw, 225px)',
  S: 'clamp(78px, 22vw, 160px)',
};

const PLAN = {
  s1: [
    { at: 'l', y: 41, s: 'S', kind: 'blossom', pal: 'blush', seed: 111, edge: '3.2%' },
    { at: 'r', y: 70, s: 'S', kind: 'peony',   pal: 'pink',  seed: 112, edge: '3.2%' },
  ],
  s2: [
    { at: 'tl', s: 'L', kind: 'peony',   pal: 'pink',  seed: 211 },
    { at: 'tr', s: 'L', kind: 'peony',   pal: 'blush', seed: 212 },
    { at: 'bl', s: 'M', kind: 'blossom', pal: 'pink',  seed: 213 },
    { at: 'br', s: 'L', kind: 'peony',   pal: 'pink',  seed: 214 },
  ],
  s3: [
    { at: 'tl', s: 'S', kind: 'twig',    pal: 'ivory', seed: 311 },
    { at: 'tr', s: 'S', kind: 'twig',    pal: 'ivory', seed: 312 },
    { at: 'l',  y: 46, s: 'M', kind: 'peony', pal: 'blush', seed: 313, edge: '-10px' },
    { at: 'r',  y: 38, s: 'M', kind: 'peony', pal: 'ivory', seed: 314, edge: '-10px' },
    { at: 'bl', s: 'M', kind: 'blossom', pal: 'ivory', seed: 315 },
    { at: 'br', s: 'M', kind: 'blossom', pal: 'blush', seed: 316 },
  ],
  s4: [
    { at: 'tl', s: 'S', kind: 'blossom', pal: 'pink',  seed: 411 },
    { at: 'tr', s: 'S', kind: 'blossom', pal: 'blush', seed: 412 },
    { at: 'l',  y: 27, s: 'S', kind: 'peony',   pal: 'pink',  seed: 413, edge: '-8px' },
    { at: 'r',  y: 40, s: 'S', kind: 'blossom', pal: 'ivory', seed: 414, edge: '-8px' },
    { at: 'bl', s: 'M', kind: 'peony', pal: 'pink',  seed: 415 },
    { at: 'br', s: 'M', kind: 'peony', pal: 'blush', seed: 416 },
  ],
};

/* ----------------------------------------------------------------------
   5. Assemble
   ---------------------------------------------------------------------- */
function addDefs() {
  if (document.getElementById('ptDefs')) return;
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('id', 'ptDefs');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  svg.style.position = 'absolute';
  svg.innerHTML =
    '<defs><filter id="ptRough" x="-8%" y="-8%" width="116%" height="116%">'
    + '<feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="5" result="n"/>'
    + '<feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>'
    + '</filter></defs>';
  document.body.prepend(svg);
}

function placeFlower(layer, spec, dark) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 260 260');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('pt-flower');
  svg.style.width = SIZES[spec.s] || SIZES.M;
  svg.innerHTML = cluster(spec.kind, spec.seed, spec.pal, dark);

  const edge = spec.edge == null ? '-10px' : spec.edge;
  const st = svg.style;
  switch (spec.at) {
    case 'tl': st.top = edge; st.left = edge; break;
    case 'tr': st.top = edge; st.right = edge; st.transform = 'scaleX(-1)'; break;
    case 'bl': st.bottom = edge; st.left = edge; st.transform = 'scaleY(-1)'; break;
    case 'br': st.bottom = edge; st.right = edge; st.transform = 'scale(-1,-1)'; break;
    case 'l':  st.top = spec.y + '%'; st.left = edge; st.transform = 'translateY(-22%)'; break;
    case 'r':  st.top = spec.y + '%'; st.right = edge; st.transform = 'translateY(-22%) scaleX(-1)'; break;
  }
  layer.appendChild(svg);
}

function buildLayer(slide) {
  const dark = slide.dataset.theme === 'dark';
  const layer = document.createElement('div');
  layer.className = 'pt-layer';
  layer.setAttribute('aria-hidden', 'true');

  const wash = document.createElement('div');
  wash.className = 'pt-wash';
  layer.appendChild(wash);

  const border = document.createElement('div');
  border.className = 'pt-border';
  border.innerHTML = '<i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i>';
  layer.appendChild(border);

  (PLAN[slide.id] || []).forEach((f) => placeFlower(layer, f, dark));

  // Slide 1 has a .paper sheet: the layer must sit on top of it, under the text
  const paper = slide.querySelector(':scope > .paper');
  if (paper) paper.after(layer); else slide.prepend(layer);
}


/* ----------------------------------------------------------------------
   6. Wedding-attire portraits (replaces the plain placeholder figures)
      Same 100 x 130 box and the same names (#ph-g, #ph-b), so the existing
      <use> tags in index.html pick them up with no HTML change.
      Real photos still win: if you add dheeraj.jpg / angel.jpg later, nothing
      here needs to be removed.
   ---------------------------------------------------------------------- */
const GROOM = `
  <rect width="100" height="130" fill="url(#gPh)"/>
  <!-- jacket -->
  <path d="M4 130C6 100 28 91 50 91s44 9 46 39Z" fill="#263C2E"/>
  <path d="M4 130C6 100 28 91 50 91c-14 6-26 16-30 39Z" fill="#fff" opacity=".07"/>
  <!-- shirt + waistcoat -->
  <path d="M40 90L50 124L60 90Z" fill="#FBF7EE"/>
  <path d="M41 104L50 130L59 104L50 114Z" fill="#D8C9AA"/>
  <circle cx="50" cy="119" r="1.1" fill="#C5A66A"/><circle cx="50" cy="125" r="1.1" fill="#C5A66A"/>
  <!-- satin lapels -->
  <path d="M38 91L49 122L32 113L27 99Z" fill="#34503F" stroke="#C5A66A" stroke-width=".5" stroke-opacity=".6"/>
  <path d="M62 91L51 122L68 113L73 99Z" fill="#34503F" stroke="#C5A66A" stroke-width=".5" stroke-opacity=".6"/>
  <!-- neck, collar, bow tie -->
  <rect x="43" y="74" width="14" height="19" fill="#D8B49A"/>
  <path d="M41 87L50 96L44 99L37 92Z" fill="#FBF7EE"/><path d="M59 87L50 96L56 99L63 92Z" fill="#FBF7EE"/>
  <path d="M50 94L39 88L39 100Z" fill="#C5A66A"/><path d="M50 94L61 88L61 100Z" fill="#C5A66A"/>
  <path d="M50 94L39 88L39 100Z" fill="#fff" opacity=".12"/>
  <rect x="47" y="91.5" width="6" height="6" rx="1.6" fill="#A8894A"/>
  <!-- boutonniere -->
  <path d="M62 104l5 -3" stroke="#68734D" stroke-width="1.4" stroke-linecap="round"/>
  <ellipse cx="66.5" cy="106" rx="3.1" ry="2.5" fill="#68734D"/>
  <circle cx="64.5" cy="102.5" r="3.4" fill="#D9A9A0" stroke="#B8737A" stroke-width=".5"/>
  <circle cx="64.5" cy="102.5" r="1.4" fill="#F4D8D1"/>
  <!-- ears, face, hair -->
  <ellipse cx="33.2" cy="57" rx="2.6" ry="4.4" fill="#D8B49A"/><ellipse cx="66.8" cy="57" rx="2.6" ry="4.4" fill="#D8B49A"/>
  <ellipse cx="50" cy="56" rx="17" ry="21" fill="#E2BFA6"/>
  <!-- short beard + small moustache -->
  <path d="M33.1 58A17 21 0 0 0 66.9 58C65.5 63 62 67.5 57.5 69Q53.5 69.6 50 69.8Q46.5 69.6 42.5 69C38 67.5 34.5 63 33.1 58Z" fill="#3A2C25" opacity=".92"/>
  <path d="M43.5 65.2Q46.8 63 50 64.2Q53.2 63 56.5 65.2Q53.2 65 50 66.2Q46.8 65 43.5 65.2Z" fill="#3A2C25" opacity=".92"/>
  <!-- hair: swept-up quiff, short sides -->
  <path d="M33 57C31.5 45 31.5 37 37 31C39.5 26.5 45 24 52 23.8C58.5 23.6 63.5 27 65.5 32C68.5 37 68.5 46 67 57L65.2 57C64.8 50 63 45 60 42.2C54 39.6 46 39.6 40 42.2C37 45 35.2 50 34.8 57Z" fill="#3A2C25"/>
  <path d="M39 34C44 28.5 53 27 61 31" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".16"/>
  <path d="M37.5 39C43 33 54 31.5 63 36" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".10"/>`;

const BRIDE = `
  <rect width="100" height="130" fill="url(#gPh)"/>
  <!-- long veil -->
  <path d="M50 20C24 22 19 62 13 130H87C81 62 76 22 50 20Z" fill="#FFFFFF" opacity=".5"/>
  <path d="M50 20C24 22 19 62 13 130M50 20C76 22 81 62 87 130" fill="none" stroke="#C5A66A" stroke-width=".7" stroke-dasharray="1.2 2.2" opacity=".75"/>
  <!-- hair, over the veil -->
  <path d="M31 58C27 96 22 116 16 130H84C78 116 73 96 69 58Z" fill="#3A2C25"/>
  <!-- gown -->
  <path d="M10 130C12 106 26 97 35 99Q42 104 50 108Q58 104 65 99C74 97 88 106 90 130Z" fill="#FBF7EE"/>
  <path d="M10 130C12 106 26 97 35 99Q42 104 50 108Q58 104 65 99C74 97 88 106 90 130Z" fill="none" stroke="#E9DDC9" stroke-width=".8"/>
  <path d="M35 99Q42 104 50 108Q58 104 65 99" fill="none" stroke="#C5A66A" stroke-width=".9"/>
  <g fill="#C5A66A" opacity=".55">
    <circle cx="26" cy="112" r=".9"/><circle cx="32" cy="118" r=".9"/><circle cx="22" cy="120" r=".9"/>
    <circle cx="74" cy="112" r=".9"/><circle cx="68" cy="118" r=".9"/><circle cx="78" cy="120" r=".9"/>
    <circle cx="40" cy="124" r=".9"/><circle cx="60" cy="124" r=".9"/>
  </g>
  <!-- neck + chest -->
  <rect x="43.5" y="74" width="13" height="20" fill="#D8B49A"/>
  <path d="M30 98Q50 84 70 98Q66 103 65 99Q58 104 50 108Q42 104 35 99Q34 103 30 98Z" fill="#E2BFA6"/>
  <!-- pearls -->
  <g fill="#FFFDF8" stroke="#D8C9AA" stroke-width=".3">
    <circle cx="41" cy="91.5" r="1.3"/><circle cx="44.5" cy="93.6" r="1.3"/><circle cx="48" cy="94.6" r="1.3"/>
    <circle cx="52" cy="94.6" r="1.3"/><circle cx="55.5" cy="93.6" r="1.3"/><circle cx="59" cy="91.5" r="1.3"/>
  </g>
  <!-- face + hair + tiara -->
  <ellipse cx="50" cy="56" rx="16" ry="20" fill="#E2BFA6"/>
  <path d="M33 56C30 28 70 28 67 56C64 42 54 36 50 36S36 42 33 56Z" fill="#3A2C25"/>
  <path d="M37 37Q50 27 63 37" fill="none" stroke="#C5A66A" stroke-width="1.6" stroke-linecap="round"/>
  <g fill="#E4CC93"><circle cx="50" cy="29.6" r="1.7"/><circle cx="43" cy="31.5" r="1.2"/><circle cx="57" cy="31.5" r="1.2"/></g>
  <circle cx="35" cy="38" r="2.6" fill="#FBF7EE" stroke="#D9A9A0" stroke-width=".5"/><circle cx="65" cy="38" r="2.6" fill="#FBF7EE" stroke="#D9A9A0" stroke-width=".5"/>
  <!-- bouquet -->
  <g transform="translate(0 -9)">
    <path d="M38 118l-6 6M62 118l6 6" stroke="#68734D" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="38" cy="118" rx="6" ry="3" fill="#68734D" transform="rotate(-25 38 118)"/>
    <ellipse cx="62" cy="118" rx="6" ry="3" fill="#68734D" transform="rotate(25 62 118)"/>
    <circle cx="42" cy="113" r="5.4" fill="#D9A9A0" stroke="#B8737A" stroke-width=".5"/>
    <circle cx="58" cy="113" r="5.4" fill="#EBC0B8" stroke="#B8737A" stroke-width=".5"/>
    <circle cx="50" cy="110" r="6.2" fill="#FBF7EE" stroke="#D9A9A0" stroke-width=".6"/>
    <circle cx="50" cy="110" r="2.4" fill="#F0CBC6"/><circle cx="42" cy="113" r="2" fill="#F4D8D1"/><circle cx="58" cy="113" r="2" fill="#F6E1DA"/>
    <circle cx="50" cy="117" r="4.6" fill="#FBF7EE" stroke="#D9A9A0" stroke-width=".5"/>
  </g>`;

function dressPortraits() {
  [['ph-g', GROOM], ['ph-b', BRIDE]].forEach(([id, art]) => {
    const old = document.getElementById(id);
    if (!old) return;
    const sym = document.createElementNS(SVGNS, 'symbol');
    sym.setAttribute('id', id);
    sym.setAttribute('viewBox', '0 0 100 130');
    sym.innerHTML = art;
    old.replaceWith(sym);
    // re-point every <use> so Safari/Chrome redraw the new artwork
    document.querySelectorAll(`use[href="#${id}"]`).forEach((u) => {
      u.setAttribute('href', '#');
      u.setAttribute('href', `#${id}`);
    });
  });
}

/* ----------------------------------------------------------------------
   7. Full screen on the first tap (Android Chrome and most mobile browsers)
      Browsers only allow full screen from a real tap, so it starts when the
      guest taps the bow to open the invitation. iPhone Safari does not allow
      it at all: there, guests use "Add to Home Screen" (see manifest).
   ---------------------------------------------------------------------- */
function wireFullscreen() {
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!request) return;
  if (!matchMedia('(pointer: coarse)').matches) return;          // phones/tablets only
  if (matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches) return;
  const go = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const r = request.call(el, { navigationUI: 'hide' });
      if (r && r.catch) r.catch(() => {});
    } catch (e) { /* ignore */ }
  };
  document.addEventListener('click', go, { once: true, capture: true });
}

async function init() {
  wireFullscreen();
  const root = document.documentElement;
  try {
    const [light, dark, h, frame] = await Promise.all([
      toURL(strokeTile(448, TEX.light)),
      toURL(strokeTile(448, TEX.dark)),
      toURL(brushStrip(640, 16, 3)),
      toURL(frameTile()),
    ]);
    const v = toURL(rotateLeft(brushStrip(640, 16, 8)));
    root.style.setProperty('--pt-tex-light', `url("${light}")`);
    root.style.setProperty('--pt-tex-dark', `url("${dark}")`);
    root.style.setProperty('--pt-brush-h', `url("${h}")`);
    root.style.setProperty('--pt-brush-v', `url("${await v}")`);
    root.style.setProperty('--pt-frame', `url("${frame}")`);
  } catch (err) {
    root.classList.add('pt-off');          // old borders come back, nothing breaks
    console.warn('[painterly] textures unavailable', err);
    return;
  }

  addDefs();
  document.querySelectorAll('#stage > .slide').forEach(buildLayer);
  dressPortraits();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
