'use client';

import { clearAllVideoData } from './videoStore';

export async function resetAllApplicationData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear IndexedDB video blobs
    await clearAllVideoData();

    // 2. Clear all localStorage keys
    localStorage.clear();

    // 3. Clear sessionStorage
    sessionStorage.clear();

    // 4. Force reload page to upload route
    window.location.href = '/upload';
  } catch (err) {
    console.error('Failed to reset application data:', err);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/upload';
  }
}
