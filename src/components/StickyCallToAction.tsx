import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const StickyCallToAction: React.FC = () => {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide the button while the signup form itself is on screen, so it never covers the form.
    const updateVisibility = () => {
      const form = document.getElementById('signup')?.getBoundingClientRect();
      const formOnScreen = !!form && form.top < window.innerHeight && form.bottom > 0;
      setIsVisible(window.scrollY > window.innerHeight * 0.72 && !formOnScreen);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    // Phones: a full-width bar that ends where the support bubble starts, so the two never overlap.
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-[5.5rem] md:left-0 md:right-0 z-50 flex justify-center items-center md:px-4">
      <Button
        variant="neon"
        className="w-full h-14 text-base md:w-auto md:h-10 md:text-sm"
        onClick={() => {
          analytics.ctaClick('sticky_cta', t('cta.sticky_join_round'));
          document.querySelector('#signup')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }}
      >
        {t('cta.sticky_join_round')}
      </Button>
    </div>
  );
};
