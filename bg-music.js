// src/bg-music.js
// Background music: loops forever, no play/pause/stop controls.
//
// Browsers (especially iPhone) do not allow sound until the visitor touches the page,
// so the music starts on the very first tap. That first tap is the envelope / seal tap.
//
// Usage: add this line at the TOP of src/main.js
//   import './bg-music.js';

const SRC = '/assets/audio/bg-music.mp3';
const VOLUME = 0.7; // 0.0 - 1.0

// Hide the old music toggle button so nobody can pause the music.
const style = document.createElement('style');
style.textContent = '#audio-toggle-btn{display:none !important;}';
document.head.appendChild(style);

const audio = new Audio(SRC);
audio.loop = true;
audio.preload = 'auto';
audio.volume = VOLUME;
audio.setAttribute('playsinline', '');

let started = false;

function tryPlay() {
  const p = audio.play();
  if (p && typeof p.then === 'function') {
    p.then(() => {
      started = true;
      removeGestureListeners();
    }).catch(() => {
      // Blocked: wait for the next tap and try again.
    });
  } else {
    started = true;
    removeGestureListeners();
  }
}

const EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];
function onGesture() { if (!started) tryPlay(); }
function removeGestureListeners() {
  EVENTS.forEach((e) => document.removeEventListener(e, onGesture, true));
}
EVENTS.forEach((e) => document.addEventListener(e, onGesture, { capture: true, passive: true }));

// Desktop browsers that allow autoplay will start straight away; others wait for the first tap.
tryPlay();

// If the phone pauses the music (call, switching apps, screen lock), resume it when the page is back.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && started && audio.paused) {
    audio.play().catch(() => {});
  }
});

// If anything pauses it (lock-screen or headphone buttons), start it again.
audio.addEventListener('pause', () => {
  if (started && document.visibilityState === 'visible' && !audio.ended) {
    setTimeout(() => audio.play().catch(() => {}), 150);
  }
});

// Safety net in case loop is ignored on some browsers.
audio.addEventListener('ended', () => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
});
