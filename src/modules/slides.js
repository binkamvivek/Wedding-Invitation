/**
 * Slides Controller — Paged Slide Engine
 * 
 * Manages 4 full-height slides with directional transitions,
 * touch gestures, keyboard controls, wheel debounce, and URL hash routing.
 */

const SLIDE_HASHES = ['#invitation', '#couple', '#celebration', '#rsvp'];

export class SlideController {
  constructor(options = {}) {
    this.slides = Array.from(document.querySelectorAll('.slide-panel'));
    this.prevBtn = document.getElementById('nav-prev');
    this.nextBtn = document.getElementById('nav-next');
    this.dotsContainer = document.getElementById('nav-dots');
    this.liveRegion = document.getElementById('a11y-live-region');
    
    this.currentIndex = 0;
    this.isEnvelopeOpened = options.isEnvelopeOpened || false;
    this.onSlideChange = options.onSlideChange || null;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isSwiping = false;

    this.lastWheelTime = 0;
    this.wheelDebounceMs = 600;

    this.init();
  }

  init() {
    this.renderDots();
    this.bindEvents();

    // Check initial hash or default to 0
    const initialIndex = this.getIndexFromHash(window.location.hash);
    if (initialIndex > 0 && this.isEnvelopeOpened) {
      this.goTo(initialIndex, { instant: true, skipHash: false });
    } else {
      this.goTo(0, { instant: true, skipHash: true });
    }
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    
    this.slides.forEach((slide, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 focus-visible:outline-gold ${
        idx === this.currentIndex ? 'bg-gold w-7' : 'bg-gold/40 hover:bg-gold/70'
      }`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Navigate to slide ${idx + 1} of ${this.slides.length}: ${slide.dataset.title || ''}`);
      dot.setAttribute('aria-selected', idx === this.currentIndex ? 'true' : 'false');
      
      dot.addEventListener('click', () => {
        if (idx > 0 && !this.isEnvelopeOpened) return;
        this.goTo(idx);
      });

      this.dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('button');
    dots.forEach((dot, idx) => {
      const isActive = idx === this.currentIndex;
      dot.className = `h-2 rounded-full transition-all duration-500 focus-visible:outline-gold ${
        isActive ? 'bg-gold w-8 shadow-sm' : 'bg-gold/40 hover:bg-gold/70 w-2.5'
      }`;
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  bindEvents() {
    // Buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't hijack keystrokes inside form fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          this.prev();
          break;
        case 'Home':
          e.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          if (this.isEnvelopeOpened) this.goTo(this.slides.length - 1);
          break;
      }
    });

    // Touch swipe gestures
    window.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = Date.now();
      this.isSwiping = true;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (!this.isSwiping) return;
      this.isSwiping = false;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const elapsed = Date.now() - this.touchStartTime;

      // Ensure gesture isn't vertical scrolling inside scrollable container
      const target = e.target;
      const scrollable = target.closest('.is-scrollable');
      if (scrollable && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
        return;
      }

      // Check horizontal or vertical swipe thresholds
      const minDistance = 45;
      const velocity = Math.abs(deltaX) / (elapsed || 1);

      if ((Math.abs(deltaX) > minDistance || velocity > 0.3) && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });

    // Mouse wheel with debounce
    window.addEventListener('wheel', (e) => {
      const now = Date.now();
      if (now - this.lastWheelTime < this.wheelDebounceMs) return;

      const target = e.target;
      const scrollable = target.closest('.is-scrollable');
      if (scrollable) {
        // Allow native scrolling if not at top/bottom extremes
        const atTop = scrollable.scrollTop <= 5 && e.deltaY < 0;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 5 && e.deltaY > 0;
        if (!atTop && !atBottom) return;
      }

      if (Math.abs(e.deltaY) > 30) {
        this.lastWheelTime = now;
        if (e.deltaY > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const idx = this.getIndexFromHash(window.location.hash);
      if (idx !== this.currentIndex) {
        if (idx > 0 && !this.isEnvelopeOpened) return;
        this.goTo(idx, { skipHash: true });
      }
    });
  }

  getIndexFromHash(hash) {
    const idx = SLIDE_HASHES.indexOf(hash);
    return idx >= 0 ? idx : 0;
  }

  setEnvelopeOpened(opened = true) {
    this.isEnvelopeOpened = opened;
    this.updateControls();
  }

  goTo(targetIndex, options = {}) {
    if (targetIndex < 0 || targetIndex >= this.slides.length) return;
    
    // Gate advance from slide 0 if unopened
    if (targetIndex > 0 && !this.isEnvelopeOpened) {
      return;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex = targetIndex;

    this.slides.forEach((slide, idx) => {
      const isActive = idx === this.currentIndex;
      slide.classList.toggle('is-active', isActive);
      
      // Accessibility attributes
      if (isActive) {
        slide.removeAttribute('inert');
        slide.removeAttribute('aria-hidden');
      } else {
        slide.setAttribute('inert', '');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    this.updateDots();
    this.updateControls();

    // Hash sync
    if (!options.skipHash) {
      const newHash = SLIDE_HASHES[this.currentIndex];
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash);
      }
    }

    // Announce to screen readers
    const currentSlide = this.slides[this.currentIndex];
    const slideTitle = currentSlide.dataset.title || `Slide ${this.currentIndex + 1}`;
    if (this.liveRegion) {
      this.liveRegion.textContent = `Showing slide ${this.currentIndex + 1} of ${this.slides.length}: ${slideTitle}`;
    }

    // Scroll to top if scrollable slide
    if (currentSlide.classList.contains('is-scrollable')) {
      currentSlide.scrollTop = 0;
    }

    // Focus active heading if not initial load
    if (!options.instant) {
      const heading = currentSlide.querySelector('h1, h2, h3, [tabindex="0"]');
      if (heading) {
        heading.focus({ preventScroll: true });
      }
    }

    // Theme color tag adjustment
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const isDark = currentSlide.dataset.theme === 'dark';
      metaTheme.content = isDark ? '#263C2E' : '#F8F4E9';
    }

    if (typeof this.onSlideChange === 'function') {
      this.onSlideChange(this.currentIndex, previousIndex);
    }
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  updateControls() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
    }
    if (this.nextBtn) {
      const canAdvance = this.isEnvelopeOpened && this.currentIndex < this.slides.length - 1;
      this.nextBtn.disabled = !canAdvance;
      this.nextBtn.style.opacity = canAdvance ? '1' : '0.3';
    }
  }
}

