import React from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const StickyCallToAction: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
      <Button 
        variant="neon"
        className=""
        onClick={() => {
          analytics.ctaClick('sticky_cta', t('cta.sticky_join_round'));
          document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        {t('cta.sticky_join_round')}
      </Button>
    </div>
  );
};
