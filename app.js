/* Dheeraj & Angel — Luxury Wedding Invitation Logic. Vanilla JS. */
import EnvelopeIntro from './envelope-animation.js';
import './painterly.js';

(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- CONFIG: Wedding Details ---------- */
const CONFIG = {
  eventStart: '2026-12-28T11:00:00+05:30',   // IST
  eventEnd:   '20261228T130000',             // Calendar end
  title: 'Wedding of Dheeraj & Angel',
  venue: 'All Saints Church, Secunderabad',
  endpoint: ''
};

/* ---------- ART (Amalfi coast & floral symbols) ---------- */
const NS = 'http://www.w3.org/2000/svg';
const el = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const BOX = { bl: [-12, -12, 24, 24], lf: [-6, -14, 12, 28] };
const put = (g, id, x, y, s = 1, r = 0) => { const b = BOX[id]; el('use', { href: '#' + id, x: b[0] * s, y: b[1] * s, width: b[2] * s, height: b[3] * s, transform: `translate(${x} ${y}) rotate(${r})` }, g); };

function buildArt() {
  const vg = $('#vg'), cols = ['#E7C9A5', '#D99A7B', '#F1E4CB', '#D9A9A0', '#E9B98E', '#EFD9B4'];
  if (vg) {
    for (let y = 455; y < 830; y += 22) {
      const edge = 110 + (y - 430) * 0.46;
      for (let x = 4; x < edge - 18; x += 20 + rnd() * 9) {
        const w = 15 + rnd() * 9, h = 13 + rnd() * 6, yy = y + rnd() * 5;
        el('rect', { x, y: yy, width: w, height: h, fill: cols[(rnd() * cols.length) | 0] }, vg);
        el('path', { d: `M${x - 1.5} ${yy}h${w + 3}l-2 -4h${-(w - 1)}z`, fill: '#B5654A', opacity: .85 }, vg);
        if (rnd() > .5) el('rect', { x: x + w / 2 - 1.5, y: yy + 4, width: 3, height: 5, fill: '#5d7d93' }, vg);
      }
    }
    [[96, 575, 7, 34], [128, 628, 8, 40], [60, 540, 6, 28], [190, 705, 9, 44], [30, 690, 8, 38]].forEach(([x, y, rx, ry]) => el('ellipse', { cx: x, cy: y, rx, ry, fill: '#263C2E', opacity: .9 }, vg));
    for (let i = 0; i < 46; i++) { const x = 130 + rnd() * 260, y = 420 + rnd() * 410; el('path', { d: `M${x} ${y}q7 -3 14 0`, stroke: '#fff', 'stroke-width': 1.1, fill: 'none', opacity: .25 + rnd() * .25 }, vg); }
    [[300, 520, 1], [250, 610, .8], [340, 700, 1.1]].forEach(([x, y, s]) => { el('path', { d: `M${x} ${y}v-26l${13 * s} 22z`, fill: '#FBF7EE' }, vg); el('path', { d: `M${x - 3} ${y + 1}h${22 * s}l-4 5h-14z`, fill: '#A9795B' }, vg); });
  }

  const sym = $('#br');
  if (sym) {
    const g = el('g', {}, sym);
    const Q = t => [(1 - t) ** 2 * 4 + 2 * (1 - t) * t * 70 + t * t * 196, (1 - t) ** 2 * 126 + 2 * (1 - t) * t * 100 + t * t * 14];
    el('path', { d: 'M4 126Q70 100 196 14', stroke: '#5b6a45', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, g);
    for (let t = .06; t < 1; t += .075) {
      const [x, y] = Q(t), [x2, y2] = Q(t + .01), a = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI, s = .85 + (1 - t) * .6;
      put(g, 'lf', x, y, s, a + 90 + 55); put(g, 'lf', x, y, s * .9, a + 90 - 55);
    }
    [[.3, 1.2, 0], [.55, 1.45, 40], [.8, 1.15, 90], [.15, .95, 20]].forEach(([t, s, r]) => { const [x, y] = Q(t); put(g, 'bl', x, y - 4, s, r); });
  }

  const cf = $('#cf');
  if (cf) {
    const br = el('use', { href: '#br', x: -26, y: -8, width: 300, height: 195, transform: 'translate(0 0)' }, cf);
    br.setAttribute('transform', 'translate(0 195) scale(1 -1)');
    [[28, 770, 1.9], [78, 808, 1.7], [26, 818, 1.5], [128, 826, 1.3], [60, 730, 1.2]].forEach(([x, y, s], i) => { put(cf, 'lf', x + 12, y - 8, 2, 40 + i * 50); put(cf, 'lf', x - 14, y + 4, 2, -50 + i * 30); put(cf, 'bl', x, y, s, i * 25); });
  }
}

function wreath() {
  const svg = $('#wreathSvg');
  if (!svg) return;
  const W = 320, H = 330, x0 = 24, y0 = 24, w = W - 48, h = H - 48, r = 46;
  const p = el('path', { d: `M${x0 + r} ${y0}H${x0 + w - r}A${r} ${r} 0 0 1 ${x0 + w} ${y0 + r}V${y0 + h - r}A${r} ${r} 0 0 1 ${x0 + w - r} ${y0 + h}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y0 + h - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`, fill: 'none', stroke: '#C5A66A', 'stroke-width': .8, opacity: .8 }, svg);
  const L = p.getTotalLength(), N = 46, g = el('g', {}, svg);
  for (let i = 0; i < N; i++) {
    const l = L * i / N, a = p.getPointAtLength(l), b = p.getPointAtLength(l + 1), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    put(g, 'lf', a.x, a.y, 1.15, ang + 90 + 48); put(g, 'lf', a.x, a.y, 1.05, ang + 90 - 48);
    if (i % 3 === 0) put(g, 'bl', a.x, a.y, 1.05 + (i % 2) * .35, i * 31);
    else if (i % 3 === 1) el('circle', { cx: a.x, cy: a.y, r: 2.6, fill: '#D9A9A0' }, g);
  }
}

/* ---------- Text Split for Staggered Line Reveals ---------- */
$$('[data-split]').forEach(n => {
  const t = n.textContent;
  n.textContent = '';
  n.setAttribute('aria-label', t);
  [...t].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'sp-l';
    s.style.setProperty('--i', i);
    s.textContent = c;
    s.setAttribute('aria-hidden', 'true');
    n.appendChild(s);
  });
});

/* ---------- Sections, Downward Scroll & Envelope Unboxing ---------- */
const slides = $$('.slide');
const vDots = $$('.v-dot');
const s1 = $('#s1');
const seal = $('#seal');
let opened = false;
let currentIdx = 0;
let dayAnim;

function openInvite() {
  if (opened) return;
  opened = true;
  sessionStorage.setItem('da-opened', 'true');
  EnvelopeIntro.open();
}

// Restore state if opened in same session
if (sessionStorage.getItem('da-opened') === 'true') {
  opened = true;
  EnvelopeIntro.skip();
}

// Tap on tied ribbon bow, button, or ribbon to untie and open
if (seal) {
  seal.addEventListener('click', openInvite);
  seal.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openInvite();
    }
  });
}
const ribbonEl = $('#ribbonStreamer');
if (ribbonEl) {
  ribbonEl.style.pointerEvents = 'auto';
  ribbonEl.style.cursor = 'pointer';
  ribbonEl.addEventListener('click', openInvite);
}

// Downward scroll cue buttons
$('#cue1')?.addEventListener('click', () => scrollToSection(1));
$('#cue2')?.addEventListener('click', () => scrollToSection(2));
$('#cue3')?.addEventListener('click', () => scrollToSection(3));

function scrollToSection(idx) {
  if (!opened) openInvite();
  const target = slides[idx];
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Slim vertical navigation dots (Right Edge)
vDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.idx, 10);
    scrollToSection(idx);
  });
});

/* ---------- IntersectionObserver for Vertical Scrolling ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
      const slide = entry.target;
      slide.classList.add('on');
      const idx = slides.indexOf(slide);
      if (idx !== -1) {
        currentIdx = idx;
        vDots.forEach((d, i) => d.setAttribute('aria-selected', i === idx));
        document.body.dataset.theme = slide.dataset.theme || 'light';
        const meta = $('meta[name=theme-color]');
        if (meta) meta.content = slide.dataset.theme === 'dark' ? '#263C2E' : '#F8F4E9';
        if (idx === 2) dateReveal();
      }
    }
  });
}, { threshold: [0.2, 0.45, 0.7] });

slides.forEach(s => observer.observe(s));

/* ---------- Date Counter Animation (Slide 3) ---------- */
let dateDone = false;   // play the 28 count-up only ONCE per page load
function dateReveal() {
  const n = $('#dayNum');
  if (!n || dateDone) return;
  dateDone = true;
  cancelAnimationFrame(dayAnim);
  if (reduce) { n.textContent = 28; return; }
  const t0 = performance.now() + 400;
  n.textContent = 1;
  const f = t => {
    const k = Math.min(1, Math.max(0, (t - t0) / 1200));
    n.textContent = Math.max(1, Math.round(28 * (1 - (1 - k) ** 3)));
    if (k < 1) dayAnim = requestAnimationFrame(f);
  };
  dayAnim = requestAnimationFrame(f);
}

/* ---------- Keyboard Downward Navigation ---------- */
document.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    if (!opened) { openInvite(); return; }
    if (currentIdx < slides.length - 1) scrollToSection(currentIdx + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    if (currentIdx > 0) scrollToSection(currentIdx - 1);
  } else if ((e.key === 'Enter' || e.key === ' ') && !opened && e.target === document.body) {
    e.preventDefault();
    openInvite();
  }
});

/* ---------- Floating Petals Canvas ---------- */
function petals() {
  if (reduce) return;
  const c = $('#petals');
  if (!c) return;
  const x = c.getContext('2d');
  const cols = ['#FBF7EE', '#D9A9A0', '#E9DDC9', '#EFCFC7'];
  let w, h, dpr, ps = [], run = true;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
  };
  const mk = (top) => ({
    x: Math.random() * w,
    y: top ? -20 : Math.random() * h,
    s: (5 + Math.random() * 7) * dpr,
    vy: (.22 + Math.random() * .45) * dpr,
    ph: Math.random() * 6.28,
    sw: .4 + Math.random() * .8,
    r: Math.random() * 6.28,
    vr: (Math.random() - .5) * .02,
    c: cols[(Math.random() * 4) | 0],
    a: .5 + Math.random() * .4
  });
  let lastW = 0, lastH = 0;
  size();
  lastW = innerWidth; lastH = innerHeight;
  const N = innerWidth < 640 ? 14 : 26;
  for (let i = 0; i < N; i++) ps.push(mk(false));
  // Mobile browsers fire many 'resize' events while the address bar hides/shows.
  // Re-allocating the canvas each time makes scrolling stutter, so only react to
  // real changes (width change = rotate/resize, or a big height change).
  const onResize = () => {
    if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 160) size();
  };
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', () => { run = !document.hidden; run && requestAnimationFrame(loop); });
  function loop(t) {
    if (!run) return;
    x.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.y += p.vy;
      p.r += p.vr;
      const dx = Math.sin(t / 1800 * p.sw + p.ph) * .6 * dpr;
      p.x += dx;
      if (p.y > h + 20) Object.assign(p, mk(true));
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.r);
      x.globalAlpha = p.a;
      x.fillStyle = p.c;
      x.beginPath();
      x.ellipse(0, 0, p.s * .55, p.s, 0, 0, 6.283);
      x.fill();
      x.restore();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ---------- Calendar (.ics download) ---------- */
$('#calBtn')?.addEventListener('click', () => {
  const esc = s => s.replace(/[,;]/g, m => '\\' + m), z = n => String(n).padStart(2, '0'), d = new Date();
  const stamp = `${d.getUTCFullYear()}${z(d.getUTCMonth() + 1)}${z(d.getUTCDate())}T${z(d.getUTCHours())}${z(d.getUTCMinutes())}${z(d.getUTCSeconds())}Z`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dheeraj & Angel//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', 'UID:dheeraj-angel-wedding-20261228@invitation', 'DTSTAMP:' + stamp,
    'DTSTART;TZID=Asia/Kolkata:20261228T110000', `DTEND;TZID=Asia/Kolkata:${CONFIG.eventEnd}`,
    'SUMMARY:' + esc(CONFIG.title), 'LOCATION:' + esc(CONFIG.venue),
    'DESCRIPTION:' + esc('Wedding Ceremony & Nuptials of Dheeraj & Angel. We can\'t wait to celebrate with you!'),
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Wedding tomorrow', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'Dheeraj-and-Angel-Wedding.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

/* ---------- Real-Time Countdown ---------- */
const T = new Date(CONFIG.eventStart).getTime();
const cells = { D: $('#cD'), H: $('#cH'), M: $('#cM'), S: $('#cS') };
function setCell(k, v) {
  const e = cells[k];
  if (e && e.textContent !== v) {
    e.textContent = v;
    if (!reduce) {
      e.classList.remove('flip');
      void e.offsetWidth;
      e.classList.add('flip');
    }
  }
}
function tick() {
  const d = T - Date.now();
  if (d <= 0) {
    if ($('#cd')) $('#cd').hidden = true;
    if ($('#cdDone')) $('#cdDone').hidden = false;
    return;
  }
  const s = Math.floor(d / 1000), z = n => String(n).padStart(2, '0');
  setCell('D', String(Math.floor(s / 86400)));
  setCell('H', z(Math.floor(s % 86400 / 3600)));
  setCell('M', z(Math.floor(s % 3600 / 60)));
  setCell('S', z(s % 60));
  setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
}

/* ---------- RSVP Form & Wishes Storage ---------- */
const Store = {
  key: 'da-wishes-v1',
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  async save(entry) {
    const list = this.load();
    list.unshift(entry);
    try { localStorage.setItem(this.key, JSON.stringify(list.slice(0, 100))); } catch {}
    if (CONFIG.endpoint) {
      try { await fetch(CONFIG.endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(entry) }); } catch {}
    }
  }
};

const SAMPLES = [
  { name: 'Aunt Meera', wish: 'May every day of your life together feel as bright and blessed as this one.' },
  { name: 'Rohan & Priya', wish: 'Wishing you love that grows quietly, and laughter that never ends.' },
  { name: 'Grandma Lucy', wish: 'God bless you both. Be gentle, be kind, and hold hands always.' },
  { name: 'Sam', wish: 'To a beautiful beginning — we will be dancing for you in Secunderabad!' }
];

function renderWall() {
  const track = $('#track');
  if (!track) return;
  const items = [...Store.load().map(e => ({ ...e, mine: true })), ...SAMPLES];
  track.textContent = '';
  const add = () => items.forEach(it => {
    const w = document.createElement('div');
    w.className = 'w' + (it.mine ? ' new' : '');
    const q = document.createElement('span');
    q.textContent = '“' + it.wish + '”';
    const b = document.createElement('b');
    b.textContent = '— ' + it.name + (it.rsvp ? ' · ' + it.rsvp : '');
    w.append(q, b);
    track.appendChild(w);
  });
  add();
  add();
  track.style.setProperty('--t', Math.max(38, items.length * 8) + 's');
}

const form = $('#rsvp'), err = $('#err'), gw = $('#gw'), gn = $('#gn');
if (gw) {
  gw.addEventListener('input', () => {
    const cnt = $('#cnt');
    if (cnt) cnt.textContent = `${gw.value.length} / 200`;
  });
}

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = gn.value.trim().replace(/\s+/g, ' '), wish = gw.value.trim();
    gn.removeAttribute('aria-invalid');
    gw.removeAttribute('aria-invalid');
    if (name.length < 2) {
      err.textContent = 'Please tell us your name.';
      gn.setAttribute('aria-invalid', 'true');
      gn.focus();
      return;
    }
    if (wish.length < 3) {
      err.textContent = 'Please write a short blessing or wish.';
      gw.setAttribute('aria-invalid', 'true');
      gw.focus();
      return;
    }
    err.textContent = '';
    const rsvp = (form.querySelector('input[name=rsvp]:checked') || {}).value || '';
    await Store.save({ name, wish, rsvp, at: new Date().toISOString() });
    renderWall();
    const tn = $('#tn');
    if (tn) tn.textContent = name;
    form.hidden = true;
    const thanks = $('#thanks');
    if (thanks) {
      thanks.hidden = false;
      thanks.focus();
    }
    form.reset();
    const cnt = $('#cnt');
    if (cnt) cnt.textContent = '0 / 200';
  });
}

$('#again')?.addEventListener('click', () => {
  const thanks = $('#thanks');
  if (thanks) thanks.hidden = true;
  if (form) {
    form.hidden = false;
    gn.focus();
  }
});

/* ---------- Initialization ---------- */
buildArt();
wreath();
renderWall();
tick();
petals();

// Sparkles on slide 1
if (!reduce) {
  const s1 = $('#s1');
  if (s1) {
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.cssText = `left:${8 + Math.random() * 84}%;top:${6 + Math.random() * 88}%;animation-delay:${Math.random() * 3.4}s;animation-duration:${2.6 + Math.random() * 2}s`;
      s1.appendChild(s);
    }
  }
}
})();