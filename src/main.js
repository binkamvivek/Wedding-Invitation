/**
 * Main Application Bootstrap
 * 
 * Orchestrates vertical panel scrolling, 3D envelope ceremony,
 * countdown clock, calendar downloads, guest blessings, and ambient particle layers.
 */

import './styles/main.css';
import { weddingConfig } from './config/wedding.js';
import { ScrollFlowController } from './modules/scrollFlow.js';
import { EnvelopeController } from './modules/envelope.js';
import { CountdownTimer } from './modules/countdown.js';
import { CalendarManager } from './modules/calendar.js';
import { WishesManager } from './modules/wishes.js';
import { AmbientPetals } from './modules/petals.js';

import {
  createIcons,
  Calendar,
  MapPin,
  Send,
  ChevronDown,
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
      ChevronDown,
      Volume2,
      VolumeX,
      Heart,
      Hand,
      Sparkles,
    },
  });
}

// Audio presence verification and playback control
async function setupAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioElement = document.getElementById('ambient-audio');
  if (!audioBtn || !audioElement) return;

  try {
    const res = await fetch('/assets/audio/ambient.mp3', { method: 'HEAD' });
    if (res.ok) {
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

// Main execution on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initIcons();

  // 1. Ambient Petals Canvas
  const petals = new AmbientPetals('ambient-canvas');

  // 2. State & Controllers
  const isAlreadyOpened = sessionStorage.getItem('dheeraj-angle:envelope-opened') === 'true';

  const scrollFlow = new ScrollFlowController({
    isEnvelopeOpened: isAlreadyOpened,
  });

  const envelope = new EnvelopeController({
    onOpenComplete: () => {
      scrollFlow.unlockScroll();
    },
  });

  // 3. Subsystems
  const calendar = new CalendarManager();
  const countdown = new CountdownTimer();
  const wishes = new WishesManager();

  // 4. Audio Check
  setupAudioToggle();
});
