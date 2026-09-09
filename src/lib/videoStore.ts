'use client';

const DB_NAME = 'AthletisisVideoDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoBlob(matchId: number, file: Blob | File): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(file, matchId);
      store.put(file, 'latest');

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to save video to IndexedDB:', err);
  }
}

export async function getVideoBlob(matchId: number | string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(matchId);

      request.onsuccess = () => resolve((request.result as Blob) || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to retrieve video from IndexedDB:', err);
    return null;
  }
}

export async function getVideoObjectUrl(matchId: number | string): Promise<string | null> {
  const blob = await getVideoBlob(matchId);
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
}

export async function getLatestVideoObjectUrl(): Promise<string | null> {
  const blob = await getVideoBlob('latest');
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
}

export async function clearAllVideoData(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to clear IndexedDB video store:', err);
  }
}
