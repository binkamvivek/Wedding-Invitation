/**
 * Wishes Service — Storage Adapter Pattern
 * 
 * Provides an agnostic interface for listing, adding, and subscribing to guest wishes.
 * Implements LocalStorageAdapter with schema versioning and in-memory fallback,
 * along with a ready-to-activate RemoteAdapter for Google Sheets / Google Apps Script.
 */

import { weddingConfig } from '../config/wedding.js';

class InMemoryAdapter {
  constructor(initialWishes = []) {
    this.wishes = [...initialWishes];
    this.subscribers = new Set();
  }

  async listWishes() {
    return [...this.wishes];
  }

  async addWish(wishData) {
    const newWish = {
      id: wishData.id || this.generateId(),
      name: (wishData.name || '').trim(),
      rsvp: wishData.rsvp || 'Joyfully accepting',
      message: (wishData.message || '').trim(),
      timestamp: new Date().toISOString(),
      isSample: false,
    };
    this.wishes.unshift(newWish);
    this.notify();
    return newWish;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      try {
        cb([...this.wishes]);
      } catch (err) {
        console.error('Subscriber notification error:', err);
      }
    }
  }

  generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}

class LocalStorageAdapter {
  constructor(storageKey, maxEntries, sampleWishes = []) {
    this.storageKey = storageKey;
    this.maxEntries = maxEntries;
    this.sampleWishes = sampleWishes;
    this.subscribers = new Set();
    this.isStorageAvailable = this.checkAvailability();
    this.fallback = new InMemoryAdapter(sampleWishes);
  }

  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn('LocalStorage unavailable or blocked (private browsing mode). Degrading to in-memory store.');
      return false;
    }
  }

  async listWishes() {
    if (!this.isStorageAvailable) {
      return this.fallback.listWishes();
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return [...this.sampleWishes];
      }

      const parsed = JSON.parse(raw);
      const userWishes = Array.isArray(parsed.wishes) ? parsed.wishes : [];

      // Combine user wishes (newest first) followed by sample wishes
      const seenIds = new Set();
      const combined = [];

      for (const item of [...userWishes, ...this.sampleWishes]) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          combined.push(item);
        }
      }

      return combined;
    } catch (err) {
      console.error('Failed to parse wishes from LocalStorage:', err);
      return [...this.sampleWishes];
    }
  }

  async addWish(wishData) {
    if (!this.isStorageAvailable) {
      return this.fallback.addWish(wishData);
    }

    try {
      const currentList = await this.listWishes();
      const userOnly = currentList.filter(w => !w.isSample);

      const newWish = {
        id: wishData.id || this.generateId(),
        name: (wishData.name || '').trim(),
        rsvp: wishData.rsvp || 'Joyfully accepting',
        message: (wishData.message || '').trim(),
        timestamp: new Date().toISOString(),
        isSample: false,
      };

      userOnly.unshift(newWish);
      const capped = userOnly.slice(0, this.maxEntries);

      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        wishes: capped,
      };

      window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
      this.notify([...capped, ...this.sampleWishes]);
      return newWish;
    } catch (err) {
      console.error('Failed to persist wish to LocalStorage:', err);
      return this.fallback.addWish(wishData);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(wishes) {
    for (const cb of this.subscribers) {
      try {
        cb(wishes);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    }
  }

  generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * RemoteAdapter (Google Apps Script / Webhook Endpoint)
 * 
 * Activated by setting `weddingConfig.storage.mode = 'remote'` and supplying `remoteUrl`.
 * Handles asynchronous POST requests with CORS mode and optimistic updates.
 */
class RemoteAdapter {
  constructor(remoteUrl, sampleWishes = []) {
    this.remoteUrl = remoteUrl;
    this.sampleWishes = sampleWishes;
    this.subscribers = new Set();
    this.localCache = [...sampleWishes];
  }

  async listWishes() {
    if (!this.remoteUrl) {
      console.warn('RemoteAdapter active but remoteUrl is empty. Returning sample wishes.');
      return [...this.sampleWishes];
    }

    try {
      const response = await fetch(this.remoteUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error(`Remote GET failed with status ${response.status}`);
      const data = await response.json();
      
      const remoteList = Array.isArray(data.wishes) ? data.wishes : (Array.isArray(data) ? data : []);
      this.localCache = [...remoteList, ...this.sampleWishes];
      return this.localCache;
    } catch (err) {
      console.warn('Error fetching remote wishes, falling back to cached state:', err);
      return this.localCache;
    }
  }

  async addWish(wishData) {
    const newWish = {
      id: wishData.id || this.generateId(),
      name: (wishData.name || '').trim(),
      rsvp: wishData.rsvp || 'Joyfully accepting',
      message: (wishData.message || '').trim(),
      timestamp: new Date().toISOString(),
      isSample: false,
    };

    // Optimistic cache update
    this.localCache.unshift(newWish);
    this.notify(this.localCache);

    if (this.remoteUrl) {
      try {
        await fetch(this.remoteUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script redirects
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWish),
        });
      } catch (err) {
        console.error('Remote wish delivery failed:', err);
      }
    }

    return newWish;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(wishes) {
    for (const cb of this.subscribers) {
      try {
        cb(wishes);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    }
  }

  generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}

// Factory instantiation based on config
const { storage, sampleWishes } = weddingConfig;

export const wishesService = storage.mode === 'remote'
  ? new RemoteAdapter(storage.remoteUrl, sampleWishes)
  : new LocalStorageAdapter(storage.localStorageKey, storage.maxLocalEntries, sampleWishes);

