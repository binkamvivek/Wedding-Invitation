/**
 * Accessibility Module — Focus, ARIA, and Announcement Helpers
 */

export class A11yManager {
  constructor() {
    this.liveRegion = document.getElementById('a11y-live-region');
    this.init();
  }

  init() {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'a11y-live-region';
      this.liveRegion.className = 'sr-only';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.liveRegion);
    }
  }

  announce(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
      setTimeout(() => {
        this.liveRegion.textContent = message;
      }, 50);
    }
  }
}

