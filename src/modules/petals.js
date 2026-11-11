/**
 * Petals & Sparkles Module — Ambient Canvas Layer
 * 
 * Manages botanical drift (blush petals, ivory blossoms, olive leaf slivers)
 * and gentle golden sparkles on a single optimized HTML5 Canvas.
 * Throttles frame rate to 35-40fps, pauses when hidden, and respects reduced motion.
 */

export class AmbientPetals {
  constructor(canvasId = 'ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 38; // ~38 fps target

    // Detect reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.reducedMotion || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Handle visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.start();
      } else {
        this.stop();
      }
    });

    this.spawnParticles();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  spawnParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 18 : 38;
    this.particles = [];

    const types = ['blush', 'ivory', 'leaf', 'sparkle'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        type,
        size: type === 'sparkle' ? 1.5 + Math.random() * 2 : 7 + Math.random() * 8,
        speedY: type === 'sparkle' ? 0.3 + Math.random() * 0.4 : 0.6 + Math.random() * 1.1,
        speedX: -0.4 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (-0.02 + Math.random() * 0.04),
        alpha: 0.3 + Math.random() * 0.55,
        sparkleCycle: Math.random() * Math.PI * 2,
      });
    }
  }

  start() {
    if (this.isRunning || this.reducedMotion) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.render(t));
  }

  stop() {
    this.isRunning = false;
  }

  render(timestamp) {
    if (!this.isRunning) return;

    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed > this.frameInterval) {
      this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
      this.draw();
    }

    requestAnimationFrame((t) => this.render(t));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      // Wrap around edges
      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 20) p.x = -20;
      if (p.x < -20) p.x = this.width + 20;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.type === 'sparkle') {
        p.sparkleCycle += 0.05;
        const sparkleAlpha = p.alpha * (0.4 + 0.6 * Math.sin(p.sparkleCycle));
        this.ctx.globalAlpha = Math.max(0, sparkleAlpha);
        this.ctx.fillStyle = '#C5A66A';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.globalAlpha = p.alpha;
        if (p.type === 'blush') {
          this.ctx.fillStyle = '#D9A9A0';
        } else if (p.type === 'ivory') {
          this.ctx.fillStyle = '#F8F4E9';
        } else {
          this.ctx.fillStyle = '#68734D'; // olive leaf
        }

        // Draw elegant oval petal
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}

