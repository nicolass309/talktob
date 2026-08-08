import type { Contribution, UserProfile, SignWord } from '../types';

const DB_NAME = 'TalktoB_LSCH_DB';
const DB_VERSION = 1;
const STORE_CONTRIBUTIONS = 'contributions';
const STORE_OFFLINE_QUEUE = 'offline_queue';
const STORE_CUSTOM_WORDS = 'custom_words';
const KEY_USER_PROFILE = 'talktob_user_profile';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_CONTRIBUTIONS)) {
          db.createObjectStore(STORE_CONTRIBUTIONS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_OFFLINE_QUEUE)) {
          db.createObjectStore(STORE_OFFLINE_QUEUE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_CUSTOM_WORDS)) {
          db.createObjectStore(STORE_CUSTOM_WORDS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // User Profile in LocalStorage (fast access)
  getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(KEY_USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEY_USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile to localStorage', e);
    }
  }

  // Save a completed or offline contribution to IndexedDB
  async saveContribution(contribution: Contribution): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONTRIBUTIONS, 'readwrite');
      const store = tx.objectStore(STORE_CONTRIBUTIONS);
      const req = store.put(contribution);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Get all past contributions
  async getContributions(): Promise<Contribution[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CONTRIBUTIONS, 'readonly');
      const store = tx.objectStore(STORE_CONTRIBUTIONS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Offline queue methods for network disconnection recovery
  async addToOfflineQueue(contribution: Contribution): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE_QUEUE);
      const req = store.put({
        ...contribution,
        status: 'guardado_localmente',
        errorMessage: 'Sin conexión. Tu aporte está guardado. Lo enviaremos automáticamente cuando vuelva la conexión.'
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getOfflineQueue(): Promise<Contribution[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_QUEUE, 'readonly');
      const store = tx.objectStore(STORE_OFFLINE_QUEUE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async removeFromOfflineQueue(id: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE_QUEUE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Custom added words
  async saveCustomWord(word: SignWord): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_WORDS, 'readwrite');
      const store = tx.objectStore(STORE_CUSTOM_WORDS);
      const req = store.put(word);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getCustomWords(): Promise<SignWord[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_WORDS, 'readonly');
      const store = tx.objectStore(STORE_CUSTOM_WORDS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
}

export const storageService = new StorageService();
