/**
 * Parallax Module — Subtle Atmospheric Depth
 * 
 * Supports desktop mouse pointer movement and mobile DeviceOrientation gyro,
 * strictly capped at <= 12px translation with reduced motion safety.
 */

export class ParallaxManager {
  constructor() {
    this.elements = Array.from(document.querySelectorAll('[data-parallax]'));
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.maxOffset = 12; // max translation in pixels

    this.init();
  }

  init() {
    if (this.reducedMotion || this.elements.length === 0) return;

    // Desktop pointer movement
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => this.handlePointerMove(e), { passive: true });
    }

    // Mobile gyro (registered upon first user gesture)
    window.addEventListener('click', () => this.requestOrientationPermission(), { once: true });
  }

  handlePointerMove(e) {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

    this.applyOffset(normX, normY);
  }

  applyOffset(normX, normY) {
    for (const el of this.elements) {
      const factor = parseFloat(el.dataset.parallax) || 0.5;
      const offsetX = normX * this.maxOffset * factor;
      const offsetY = normY * this.maxOffset * factor;

      el.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
    }
  }

  async requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), { passive: true });
        }
      } catch (err) {
        console.warn('Device orientation permission dismissed:', err);
      }
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), { passive: true });
    }
  }

  handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    // gamma is left-to-right tilt [-90, 90]
    // beta is front-to-back tilt [-180, 180]
    const normX = Math.max(-1, Math.min(1, e.gamma / 30));
    const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));

    this.applyOffset(normX, normY);
  }
}

