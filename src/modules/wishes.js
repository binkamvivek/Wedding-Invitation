/**
 * Wishes Module — Interactive RSVP Form & Wishes Wall Ticker
 * 
 * Handles client-side validation, live character counting, honeypot protection,
 * optimistic UI submission, and auto-scrolling ticker rendering.
 */

import { wishesService } from '../services/wishesService.js';

export class WishesManager {
  constructor() {
    this.form = document.getElementById('rsvp-form');
    this.nameInput = document.getElementById('rsvp-name');
    this.wishInput = document.getElementById('rsvp-wish');
    this.charCountEl = document.getElementById('rsvp-char-count');
    this.errorEl = document.getElementById('rsvp-error-msg');
    this.submitBtn = document.getElementById('rsvp-submit-btn');
    this.successCard = document.getElementById('rsvp-success-card');
    this.successNameEl = document.getElementById('rsvp-success-name');
    this.resetBtn = document.getElementById('rsvp-write-another-btn');
    this.honeypotInput = document.getElementById('rsvp-honeypot');

    this.tickerTrack = document.getElementById('wishes-ticker-track');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadAndRenderWishes();

    // Subscribe to service updates
    wishesService.subscribe((updatedList) => {
      this.renderTicker(updatedList);
    });
  }

  bindEvents() {
    if (this.wishInput && this.charCountEl) {
      this.wishInput.addEventListener('input', () => {
        const len = this.wishInput.value.length;
        this.charCountEl.textContent = `${len} / 280`;
        if (len > 280) {
          this.charCountEl.classList.add('text-rose-700', 'font-semibold');
        } else {
          this.charCountEl.classList.remove('text-rose-700', 'font-semibold');
        }
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.resetFormState();
      });
    }
  }

  async loadAndRenderWishes() {
    const list = await wishesService.listWishes();
    this.renderTicker(list);
  }

  renderTicker(wishes) {
    if (!this.tickerTrack) return;
    this.tickerTrack.innerHTML = '';

    // If wishes are few, duplicate the list once so the ticker flows seamlessly
    const displayList = wishes.length < 5 ? [...wishes, ...wishes] : [...wishes, ...wishes.slice(0, 3)];

    displayList.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 bg-ivory/80 rounded border border-gold/30 shadow-sm text-left backdrop-blur-sm transition-transform hover:scale-[1.01]';
      
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between text-xs mb-1.5';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'font-semibold font-sans tracking-wide text-forest';
      nameSpan.textContent = w.name; // sanitized via textContent

      const tagSpan = document.createElement('span');
      tagSpan.className = 'px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider ' +
        (w.rsvp === 'Joyfully accepting' ? 'bg-olive/15 text-olive font-medium' :
         w.rsvp === 'Regretfully declining' ? 'bg-blush/25 text-stone-700' : 'bg-beige text-stone-600');
      tagSpan.textContent = w.rsvp || 'Blessing';

      header.appendChild(nameSpan);
      header.appendChild(tagSpan);

      const msgP = document.createElement('p');
      msgP.className = 'text-sm font-serif italic text-forest/90 leading-relaxed';
      msgP.textContent = `“${w.message}”`; // sanitized via textContent

      card.appendChild(header);
      card.appendChild(msgP);
      this.tickerTrack.appendChild(card);
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.clearError();

    // 1. Honeypot check
    if (this.honeypotInput && this.honeypotInput.value) {
      console.warn('Spam submission detected by honeypot.');
      return;
    }

    const name = (this.nameInput.value || '').trim();
    const wish = (this.wishInput.value || '').trim();
    const rsvpRadio = this.form.querySelector('input[name="rsvp_status"]:checked');
    const rsvp = rsvpRadio ? rsvpRadio.value : 'Joyfully accepting';

    // 2. Client-side Validation
    if (name.length < 2 || name.length > 60) {
      this.showError('Please enter your name (between 2 and 60 characters).', this.nameInput);
      return;
    }

    if (wish.length < 5 || wish.length > 280) {
      this.showError('Please share a blessing or message (between 5 and 280 characters).', this.wishInput);
      return;
    }

    // 3. UI Loading State
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      this.submitBtn.innerHTML = '<span>Sending Your Blessing...</span>';
    }

    try {
      await wishesService.addWish({
        name,
        rsvp,
        message: wish,
      });

      // 4. Success State Animation
      setTimeout(() => {
        if (this.form) this.form.classList.add('hidden');
        if (this.successCard) {
          if (this.successNameEl) this.successNameEl.textContent = name;
          this.successCard.classList.remove('hidden');
          this.successCard.focus();
        }
      }, 400);

    } catch (err) {
      console.error('Error submitting wish:', err);
      this.showError('An unexpected issue occurred. Please try again.', this.submitBtn);
    } finally {
      if (this.submitBtn) {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        this.submitBtn.innerHTML = '<span>Send Your Wishes</span>';
      }
    }
  }

  showError(message, targetElement) {
    if (this.errorEl) {
      this.errorEl.textContent = message;
      this.errorEl.classList.remove('hidden');
    }
    if (targetElement) {
      targetElement.setAttribute('aria-invalid', 'true');
      targetElement.focus();
    }
  }

  clearError() {
    if (this.errorEl) {
      this.errorEl.textContent = '';
      this.errorEl.classList.add('hidden');
    }
    if (this.nameInput) this.nameInput.removeAttribute('aria-invalid');
    if (this.wishInput) this.wishInput.removeAttribute('aria-invalid');
  }

  resetFormState() {
    if (this.form) {
      this.form.reset();
      this.form.classList.remove('hidden');
    }
    if (this.charCountEl) {
      this.charCountEl.textContent = '0 / 280';
    }
    if (this.successCard) {
      this.successCard.classList.add('hidden');
    }
    this.clearError();
    if (this.nameInput) this.nameInput.focus();
  }
}

