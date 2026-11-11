/**
 * ScrollFlow Module — Vertical Full-Screen Panel Controller
 * 
 * Manages 6 scroll-snapped 100dvh panels, scroll locking until unboxing,
 * IntersectionObserver for >=50% panel reveals, 6-dot right-edge progress indicator,
 * keyboard navigation, and subtle layered parallax motion.
 */

export class ScrollFlowController {
  constructor(options = {}) {
    this.panels = Array.from(document.querySelectorAll('.invitation-panel'));
    this.dotsContainer = document.getElementById('progress-dots');
    this.scrollDownCue = document.getElementById('scroll-down-cue');
    this.isOpened = options.isEnvelopeOpened || false;

    this.currentPanelIndex = 0;
    this.parallaxElements = Array.from(document.querySelectorAll('[data-parallax-speed]'));
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.setupScrollLock();
    this.renderDots();
    this.setupIntersectionObserver();
    this.bindEvents();

    if (!this.reducedMotion) {
      this.setupParallax();
    }
  }

  setupScrollLock() {
    if (!this.isOpened) {
      document.body.classList.add('scroll-locked');
      if (this.scrollDownCue) this.scrollDownCue.classList.add('hidden');
    } else {
      document.body.classList.remove('scroll-locked');
      if (this.scrollDownCue) this.scrollDownCue.classList.remove('hidden');
    }
  }

  unlockScroll() {
    this.isOpened = true;
    document.body.classList.remove('scroll-locked');
    if (this.scrollDownCue) {
      this.scrollDownCue.classList.remove('hidden');
    }
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.panels.forEach((panel, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `progress-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Navigate to ${panel.dataset.title || `Panel ${idx + 1}`}`);
      
      dot.addEventListener('click', () => {
        if (!this.isOpened && idx > 0) return;
        this.scrollToPanel(idx);
      });

      this.dotsContainer.appendChild(dot);
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          const panel = entry.target;
          panel.classList.add('is-in-view');

          const idx = this.panels.indexOf(panel);
          if (idx !== -1) {
            this.currentPanelIndex = idx;
            this.updateActiveDot(idx);
            this.updateThemeAndHash(panel);
          }
        }
      });
    }, {
      threshold: [0.2, 0.45, 0.7],
    });

    this.panels.forEach((p) => observer.observe(p));
  }

  updateActiveDot(index) {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  updateThemeAndHash(panel) {
    // Update theme color
    const isDark = panel.dataset.theme === 'dark';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = isDark ? '#263C2E' : '#F8F4E9';
    }

    // Update URL hash without jumping
    const panelId = panel.id;
    if (panelId && window.location.hash !== `#${panelId}`) {
      history.replaceState(null, '', `#${panelId}`);
    }
  }

  scrollToPanel(index) {
    if (index < 0 || index >= this.panels.length) return;
    const target = this.panels[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  bindEvents() {
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (this.isOpened && this.currentPanelIndex < this.panels.length - 1) {
            this.scrollToPanel(this.currentPanelIndex + 1);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          if (this.currentPanelIndex > 0) {
            this.scrollToPanel(this.currentPanelIndex - 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          this.scrollToPanel(0);
          break;
        case 'End':
          e.preventDefault();
          if (this.isOpened) {
            this.scrollToPanel(this.panels.length - 1);
          }
          break;
      }
    });

    // Chevron scroll-down click
    if (this.scrollDownCue) {
      this.scrollDownCue.addEventListener('click', () => {
        this.scrollToPanel(1);
      });
    }
  }

  setupParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          this.parallaxElements.forEach((el) => {
            const speed = parseFloat(el.dataset.parallaxSpeed) || 0.85;
            // Use panel-relative offset so parallax stays within its container
            const parentPanel = el.closest('.invitation-panel');
            const panelTop = parentPanel ? parentPanel.offsetTop : 0;
            const relativeScroll = scrollY - panelTop;
            const offset = (relativeScroll * (1 - speed)).toFixed(1);
            el.style.transform = `translate3d(0, ${offset}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

