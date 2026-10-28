
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Deep links such as /vendeglatohelyek#venue-application: wait until the section renders.
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el || ++tries > 40) {
        window.clearInterval(timer);
        el?.scrollIntoView({ block: 'start' });
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
};
