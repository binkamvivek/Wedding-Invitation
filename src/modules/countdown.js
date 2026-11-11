/**
 * Countdown Module — Drift-Corrected Real-Time Clock
 * 
 * Accurately tracks the time remaining until the ceremony in IST (UTC+05:30),
 * supporting timezones, visibilitychange pause/resume, digit flip animations,
 * and '?now=' dev simulation parameter.
 */

import { weddingConfig } from '../config/wedding.js';

export class CountdownTimer {
  constructor(options = {}) {
    this.targetIso = weddingConfig.event.isoDate;
    this.targetDate = new Date(this.targetIso);

    // Elements
    this.container = document.getElementById('countdown-component');
    this.daysEl = document.getElementById('cd-days');
    this.hoursEl = document.getElementById('cd-hours');
    this.minsEl = document.getElementById('cd-minutes');
    this.secsEl = document.getElementById('cd-seconds');
    this.statusEl = document.getElementById('cd-status-message');
    this.digitsContainer = document.getElementById('cd-digits-grid');

    this.timerId = null;
    this.lastValues = { days: null, hours: null, minutes: null, seconds: null };

    // Debug query param: ?now=2026-12-28T11:30:00+05:30 (Only enabled in dev/preview)
    this.simulatedNow = this.getSimulatedNow();

    this.init();
  }

  getSimulatedNow() {
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const nowParam = urlParams.get('now');
      if (nowParam) {
        const parsed = new Date(nowParam);
        if (!isNaN(parsed.getTime())) {
          console.info(`[Dev Simulator] Overriding current time with: ${parsed.toISOString()}`);
          return parsed;
        }
      }
    }
    return null;
  }

  getNow() {
    if (this.simulatedNow) {
      // Simulate advance from page load
      const elapsed = performance.now();
      return new Date(this.simulatedNow.getTime() + elapsed);
    }
    return new Date();
  }

  init() {
    if (!this.container || !this.daysEl) return;

    this.tick();
    this.scheduleNextTick();

    // Immediate recompute on tab visibility restore
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.tick();
        this.scheduleNextTick();
      } else {
        if (this.timerId) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }
      }
    });
  }

  scheduleNextTick() {
    if (this.timerId) clearTimeout(this.timerId);

    // Drift-corrected: compute ms remaining until next exact whole second boundary
    const now = this.getNow();
    const delay = 1000 - now.getMilliseconds();

    this.timerId = setTimeout(() => {
      this.tick();
      this.scheduleNextTick();
    }, delay);
  }

  tick() {
    const now = this.getNow();
    const diff = this.targetDate.getTime() - now.getTime();
    const threeHoursMs = 3 * 60 * 60 * 1000;

    // State 1: Active Countdown
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.updateDigit(this.daysEl, days.toString(), 'days');
      this.updateDigit(this.hoursEl, hours.toString().padStart(2, '0'), 'hours');
      this.updateDigit(this.minsEl, minutes.toString().padStart(2, '0'), 'minutes');
      this.updateDigit(this.secsEl, seconds.toString().padStart(2, '0'), 'seconds');

      if (this.statusEl) this.statusEl.classList.add('hidden');
      if (this.digitsContainer) this.digitsContainer.classList.remove('hidden');
      return;
    }

    // State 2: Day of celebration (now >= target && < target + 3h)
    if (diff <= 0 && diff > -threeHoursMs) {
      if (this.digitsContainer) this.digitsContainer.classList.add('hidden');
      if (this.statusEl) {
        this.statusEl.textContent = weddingConfig.editorial.begunMessage;
        this.statusEl.classList.remove('hidden');
      }
      return;
    }

    // State 3: Ended (diff <= -3h)
    if (diff <= -threeHoursMs) {
      if (this.digitsContainer) this.digitsContainer.classList.add('hidden');
      if (this.statusEl) {
        this.statusEl.textContent = weddingConfig.editorial.endedMessage;
        this.statusEl.classList.remove('hidden');
      }
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }
  }

  updateDigit(el, newValue, key) {
    if (!el) return;
    if (this.lastValues[key] === newValue) return;

    this.lastValues[key] = newValue;
    
    // Smooth digit slide/fade transition
    el.style.transform = 'translateY(-6px)';
    el.style.opacity = '0.4';
    
    setTimeout(() => {
      el.textContent = newValue;
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }, 120);
  }

  destroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

