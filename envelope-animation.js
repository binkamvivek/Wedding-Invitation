/* ==========================================================================
   envelope-animation.js   (ES module, no dependencies)

   Usage in app.js (top of file, outside any function):
       import EnvelopeIntro from './envelope-animation.js';
   then call  EnvelopeIntro.open()  to play the sequence,
              EnvelopeIntro.skip()  to jump to the opened state (e.g. restored session).

   It also wires up taps / Enter / Space on #seal and taps on #ribbonStreamer.
   open() is idempotent, so wiring it twice is harmless.
   Emits  document 'envelope:opened'  when the sequence has finished.
   ========================================================================== */

// Seconds after the tap, at speed 1 (keep in sync with envelope-animation.css)
const UNLOCK_AT = 6.7;  // pocket has finished sliding: allow scrolling
const DONE_AT   = 7.9;  // text revealed: remove the envelope layer from the DOM

const $ = (s, r = document) => r.querySelector(s);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let state = 'closed'; // 'closed' | 'opening' | 'open'

function speed(cover) {
  const v = parseFloat(getComputedStyle(cover).getPropertyValue('--s'));
  return v > 0 ? v : 1;
}

function unlock() {
  document.body.classList.remove('locked');
  document.body.classList.add('opened');
  const h = $('#s1 .names');
  if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
}

function finish() {
  const cover = $('#cover');
  if (cover) { cover.classList.add('is-done'); }
  state = 'open';
  document.dispatchEvent(new CustomEvent('envelope:opened'));
}

function open() {
  if (state !== 'closed') return;
  state = 'opening';

  const s1 = $('#s1');
  const cover = $('#cover');
  if (!s1 || !cover) { state = 'open'; unlock(); return; }

  cover.setAttribute('aria-hidden', 'true');
  const seal = $('#seal');
  if (seal) { seal.setAttribute('aria-disabled', 'true'); seal.tabIndex = -1; }

  if (navigator.vibrate) { try { navigator.vibrate(20); } catch (e) {} }

  s1.classList.add('open');   // <- this single class starts every CSS animation

  if (reducedMotion()) {
    setTimeout(unlock, 200);
    setTimeout(finish, 650);
    return;
  }
  const k = speed(cover) * 1000;
  setTimeout(unlock, UNLOCK_AT * k);
  setTimeout(finish, DONE_AT * k);
}

function skip() {
  const s1 = $('#s1');
  const cover = $('#cover');
  state = 'open';
  if (s1) s1.classList.add('open', 'skip');
  if (cover) { cover.setAttribute('aria-hidden', 'true'); cover.classList.add('is-done'); }
  document.body.classList.remove('locked');
  document.body.classList.add('opened');
}

function bind() {
  const seal = $('#seal');
  const ribbon = $('#ribbonStreamer');
  if (seal) {
    seal.addEventListener('click', open);
    seal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }
  if (ribbon) {
    ribbon.style.pointerEvents = 'auto';
    ribbon.style.cursor = 'pointer';
    ribbon.addEventListener('click', open);
  }
}

bind();

const EnvelopeIntro = { open, skip, get state() { return state; } };
window.EnvelopeIntro = EnvelopeIntro;
export default EnvelopeIntro;
