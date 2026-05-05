import { useState, useEffect } from 'react';

export const useExitIntent = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving through the top of the viewport
      // and we haven't shown it yet
      if (e.clientY <= 10 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };

    // Also show after 30 seconds if user hasn't signed up
    timer = setTimeout(() => {
      if (!hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShownExitIntent]);

  const hideExitIntent = () => {
    setShowExitIntent(false);
  };

  return { showExitIntent, hideExitIntent };
};