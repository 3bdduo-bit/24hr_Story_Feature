import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'story_feed_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function loadStories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const now = Date.now();
    return parsed.filter(s => now - s.createdAt < TTL_MS);
  } catch {
    return [];
  }
}

function saveStories(stories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (e) {
    console.warn('LocalStorage full or unavailable', e);
  }
}

export function useStories() {
  const [stories, setStories] = useState(() => loadStories());

  // Purge expired stories every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setStories(prev => {
        const fresh = prev.filter(s => Date.now() - s.createdAt < TTL_MS);
        if (fresh.length !== prev.length) saveStories(fresh);
        return fresh;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const addStory = useCallback((imageBase64, caption = '') => {
    const newStory = {
      id: `story_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      image: imageBase64,
      caption,
      createdAt: Date.now(),
      seen: false,
    };
    setStories(prev => {
      const updated = [newStory, ...prev];
      saveStories(updated);
      return updated;
    });
    return newStory.id;
  }, []);

  const markSeen = useCallback((id) => {
    setStories(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, seen: true } : s);
      saveStories(updated);
      return updated;
    });
  }, []);

  const deleteStory = useCallback((id) => {
    setStories(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveStories(updated);
      return updated;
    });
  }, []);

  const getTimeLeft = useCallback((createdAt) => {
    const elapsed = Date.now() - createdAt;
    const remaining = TTL_MS - elapsed;
    if (remaining <= 0) return '0h 0m';
    const h = Math.floor(remaining / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  }, []);

  const getProgress = useCallback((createdAt) => {
    const elapsed = Date.now() - createdAt;
    return Math.min(elapsed / TTL_MS, 1);
  }, []);

  return { stories, addStory, markSeen, deleteStory, getTimeLeft, getProgress };
}
