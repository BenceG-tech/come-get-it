import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cgi_exit_intent_shown_at';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const MIN_DWELL_MS = 60 * 1000; // user must be on page at least 60s before mouse-leave can trigger

const wasRecentlyShown = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return false;
    return Date.now() - ts < COOLDOWN_MS;
  } catch {
    return false;
  }
};

const markShown = () => {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* noop */
  }
};

export const useExitIntent = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  useEffect(() => {
    if (wasRecentlyShown()) {
      setHasShownExitIntent(true);
      return;
    }

    const mountedAt = Date.now();

    const trigger = () => {
      if (hasShownExitIntent) return;
      setShowExitIntent(true);
      setHasShownExitIntent(true);
      markShown();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (Date.now() - mountedAt < MIN_DWELL_MS) return;
      if (e.clientY <= 10 && !hasShownExitIntent) {
        trigger();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShownExitIntent]);

  const hideExitIntent = () => {
    setShowExitIntent(false);
  };

  return { showExitIntent, hideExitIntent };
};
