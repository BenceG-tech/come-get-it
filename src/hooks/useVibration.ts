
import { useCallback } from 'react';

export const useVibration = () => {
  const vibrate = useCallback((pattern: number | number[] = 200) => {
    if ('vibrate' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.vibrate(pattern);
    }
  }, []);

  const isVibrationSupported = 'vibrate' in navigator;

  return { vibrate, isVibrationSupported };
};
