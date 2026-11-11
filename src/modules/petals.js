/**
 * Petals & Sparkles Module — Ambient Canvas Layer
 * 
 * Renders 18 botanical particles on mobile (36 on desktop) with organic sine-wave sway,
 * tumbling 3D rotation, and gentle golden flecks on a single optimized HTML5 Canvas.
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

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.reducedMotion || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

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
    const count = isMobile ? 18 : 36;
    this.particles = [];

    const types = ['blush', 'ivory', 'leaf', 'sparkle'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        type,
        size: type === 'sparkle' ? 1.5 + Math.random() * 2 : 7 + Math.random() * 9,
        baseSpeedY: type === 'sparkle' ? 0.35 + Math.random() * 0.4 : 0.65 + Math.random() * 1.1,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayAmplitude: 0.8 + Math.random() * 1.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: -0.02 + Math.random() * 0.04,
        alpha: 0.35 + Math.random() * 0.5,
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

      p.swayPhase += p.swaySpeed;
      p.y += p.baseSpeedY;
      p.x += Math.sin(p.swayPhase) * p.swayAmplitude;
      p.rotation += p.rotSpeed;

      // Wrap around screen boundaries
      if (p.y > this.height + 25) {
        p.y = -25;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width + 25) p.x = -25;
      if (p.x < -25) p.x = this.width + 25;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.type === 'sparkle') {
        p.sparkleCycle += 0.06;
        const sparkleAlpha = p.alpha * (0.35 + 0.65 * Math.sin(p.sparkleCycle));
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

        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}
