/**
 * Main Application Bootstrap
 * 
 * Orchestrates all modules, handles Lucide icon rendering,
 * checks optional ambient audio, and initializes the wedding experience.
 */

import './styles/main.css';
import { weddingConfig } from './config/wedding.js';
import { SlideController } from './modules/slides.js';
import { EnvelopeController } from './modules/envelope.js';
import { CountdownTimer } from './modules/countdown.js';
import { CalendarManager } from './modules/calendar.js';
import { WishesManager } from './modules/wishes.js';
import { AmbientPetals } from './modules/petals.js';
import { ParallaxManager } from './modules/parallax.js';
import { A11yManager } from './modules/a11y.js';

import {
  createIcons,
  Calendar,
  MapPin,
  Send,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Heart,
  Hand,
  Sparkles,
} from 'lucide';

// Initialize Lucide icons
function initIcons() {
  createIcons({
    icons: {
      Calendar,
      MapPin,
      Send,
      ChevronLeft,
      ChevronRight,
      Volume2,
      VolumeX,
      Heart,
      Hand,
      Sparkles,
    },
  });
}

// Audio presence verification and control
async function setupAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioElement = document.getElementById('ambient-audio');
  if (!audioBtn || !audioElement) return;

  try {
    const res = await fetch('/assets/audio/ambient.mp3', { method: 'HEAD' });
    if (res.ok) {
      // Audio file exists -> reveal toggle
      audioBtn.classList.remove('hidden');

      let isPlaying = false;
      audioBtn.addEventListener('click', async () => {
        if (!isPlaying) {
          try {
            await audioElement.play();
            isPlaying = true;
            audioBtn.setAttribute('aria-label', 'Mute ambient music');
            audioBtn.querySelector('.icon-muted')?.classList.add('hidden');
            audioBtn.querySelector('.icon-playing')?.classList.remove('hidden');
          } catch (e) {
            console.warn('Audio playback error:', e);
          }
        } else {
          audioElement.pause();
          isPlaying = false;
          audioBtn.setAttribute('aria-label', 'Play ambient music');
          audioBtn.querySelector('.icon-playing')?.classList.add('hidden');
          audioBtn.querySelector('.icon-muted')?.classList.remove('hidden');
        }
      });
    } else {
      audioBtn.remove();
    }
  } catch {
    audioBtn.remove();
  }
}

// Populate dynamic config text into DOM
function populateConfigData() {
  const { couple, event, venue, editorial } = weddingConfig;

  // Title tags
  document.title = `${couple.combined} | Wedding Invitation`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = `${couple.combined} are getting married on ${event.displayDate} at ${venue.name}, ${venue.city}.`;
  }
}

// Main execution on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  populateConfigData();
  initIcons();

  // Instantiate Subsystems
  const a11y = new A11yManager();
  const petals = new AmbientPetals('ambient-canvas');
  const parallax = new ParallaxManager();
  const calendar = new CalendarManager();
  const countdown = new CountdownTimer();
  const wishes = new WishesManager();

  const isAlreadyOpened = sessionStorage.getItem('dheeraj-angle:envelope-opened') === 'true';

  const slides = new SlideController({
    isEnvelopeOpened: isAlreadyOpened,
    onSlideChange: (current, prev) => {
      // Re-trigger icon creation if dynamic content refreshed
      initIcons();
    },
  });

  const envelope = new EnvelopeController({
    onOpenComplete: () => {
      slides.setEnvelopeOpened(true);
      a11y.announce('The wedding invitation has opened. Swipe or tap Next to continue.');
    },
  });

  setupAudioToggle();
});

