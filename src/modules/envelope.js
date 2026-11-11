/**
 * Envelope Module — 3D Ceremony & Unboxing Sequence
 * 
 * Handles the wax-seal cracking, 3D flap unfold, particle burst,
 * card elevation, and session state persistence.
 */

const STORAGE_KEY = 'dheeraj-angle:envelope-opened';

export class EnvelopeController {
  constructor(options = {}) {
    this.container = document.getElementById('slide-invitation');
    this.sealBtn = document.getElementById('wax-seal-btn');
    this.closedEnvelope = document.getElementById('envelope-closed-view');
    this.openedCard = document.getElementById('invitation-card-opened');
    this.nextCue = document.getElementById('envelope-next-cue');
    this.burstCanvas = document.getElementById('seal-burst-canvas');
    
    this.isOpened = sessionStorage.getItem(STORAGE_KEY) === 'true';
    this.onOpenComplete = options.onOpenComplete || null;

    this.init();
  }

  init() {
    if (!this.sealBtn || !this.container) return;

    if (this.isOpened) {
      this.renderAlreadyOpened();
    } else {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.sealBtn.addEventListener('click', () => this.openEnvelope());
    
    // Also allow Enter / Space on seal button
    this.sealBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openEnvelope();
      }
    });
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

    // 3. Add classes triggering CSS transitions
    this.container.classList.add('is-opening');

    // After crack and 3D flap animation (~1100ms), elevate the card
    setTimeout(() => {
      this.container.classList.add('is-opened');
      if (this.closedEnvelope) {
        this.closedEnvelope.setAttribute('aria-hidden', 'true');
      }
      if (this.openedCard) {
        this.openedCard.classList.remove('pointer-events-none', 'opacity-0');
        this.openedCard.classList.add('opacity-100');
        this.openedCard.removeAttribute('aria-hidden');
      }
    }, 900);

    // Sequence completion (~2200ms)
    setTimeout(() => {
      this.container.classList.remove('is-opening');
      if (this.nextCue) {
        this.nextCue.classList.remove('opacity-0', 'translate-y-2');
        this.nextCue.classList.add('opacity-100', 'translate-y-0');
      }
      if (typeof this.onOpenComplete === 'function') {
        this.onOpenComplete();
      }
    }, 2200);
  }

  renderAlreadyOpened() {
    this.container.classList.add('is-opened');
    if (this.closedEnvelope) {
      this.closedEnvelope.style.display = 'none';
      this.closedEnvelope.setAttribute('aria-hidden', 'true');
    }
    if (this.openedCard) {
      this.openedCard.classList.remove('pointer-events-none', 'opacity-0');
      this.openedCard.classList.add('opacity-100');
      this.openedCard.removeAttribute('aria-hidden');
    }
    if (this.nextCue) {
      this.nextCue.classList.remove('opacity-0', 'translate-y-2');
      this.nextCue.classList.add('opacity-100', 'translate-y-0');
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
    const colors = ['#F5E5C0', '#D8B778', '#C5A66A', '#E9DDC9', '#D9A9A0'];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.8 + Math.random() * 0.4,
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
        p.vy += 2.5 * dt; // slight gravity
        p.alpha -= dt * 1.4;

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

