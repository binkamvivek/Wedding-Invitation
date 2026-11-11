/**
 * Envelope Module — 3D Ceremony & Unboxing Sequence (Panel 1)
 * 
 * Handles the wax-seal cracking, satin ribbon release, 3D flap unfold,
 * particle burst, card elevation, and scroll unlock.
 */

const STORAGE_KEY = 'dheeraj-angle:envelope-opened';

export class EnvelopeController {
  constructor(options = {}) {
    this.panel = document.getElementById('panel-envelope');
    this.sealBtn = document.getElementById('wax-seal-btn');
    this.ribbon = document.getElementById('satin-ribbon');
    this.burstCanvas = document.getElementById('seal-burst-canvas');
    this.scrollCue = document.getElementById('scroll-down-cue');
    
    this.isOpened = sessionStorage.getItem(STORAGE_KEY) === 'true';
    this.onOpenComplete = options.onOpenComplete || null;

    this.init();
  }

  init() {
    if (!this.sealBtn || !this.panel) return;

    if (this.isOpened) {
      this.renderAlreadyOpened();
    } else {
      this.bindEvents();
    }
  }

  bindEvents() {
    const triggerOpen = () => this.openEnvelope();

    this.sealBtn.addEventListener('click', triggerOpen);
    this.sealBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerOpen();
      }
    });

    if (this.ribbon) {
      this.ribbon.addEventListener('click', triggerOpen);
    }
  }

  openEnvelope() {
    if (this.isOpened) return;
    this.isOpened = true;
    sessionStorage.setItem(STORAGE_KEY, 'true');

    // 1. Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    // 2. Gold particle burst around the seal
    this.triggerSealBurst();

    // 3. Trigger 3D Opening transitions
    this.panel.classList.add('is-envelope-opening');

    setTimeout(() => {
      this.panel.classList.add('is-envelope-opened');
    }, 400);

    // Sequence completion (~1800ms)
    setTimeout(() => {
      this.panel.classList.remove('is-envelope-opening');
      if (this.scrollCue) {
        this.scrollCue.classList.remove('hidden');
      }
      if (typeof this.onOpenComplete === 'function') {
        this.onOpenComplete();
      }
    }, 1800);
  }

  renderAlreadyOpened() {
    this.panel.classList.add('is-envelope-opened');
    if (this.scrollCue) {
      this.scrollCue.classList.remove('hidden');
    }
    if (typeof this.onOpenComplete === 'function') {
      this.onOpenComplete();
    }
  }

  triggerSealBurst() {
    if (!this.burstCanvas || !this.sealBtn) return;
    const rect = this.sealBtn.getBoundingClientRect();
    const ctx = this.burstCanvas.getContext('2d');
    if (!ctx) return;

    this.burstCanvas.width = window.innerWidth;
    this.burstCanvas.height = window.innerHeight;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particles = [];
    const colors = ['#F5E5C0', '#D8B778', '#C5A66A', '#E9DDC9', '#D9A9A0', '#FFFDF7'];
    const count = 42;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6.5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }

    let start = performance.now();
    const animateBurst = (time) => {
      const dt = (time - start) / 1000;
      start = time;

      ctx.clearRect(0, 0, this.burstCanvas.width, this.burstCanvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 3.0 * dt; // gravity
        p.alpha -= dt * 1.5;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animateBurst);
      } else {
        ctx.clearRect(0, 0, this.burstCanvas.width, this.burstCanvas.height);
      }
    };

    requestAnimationFrame(animateBurst);
  }
}
