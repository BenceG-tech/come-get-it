import React from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const FOMOSection: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {t('fomo.title')}
        </h2>
        <p className="text-xl text-white mb-8">
          {t('fomo.p1')}
        </p>
        <p className="text-lg text-white mb-12">
          {t('fomo.p2')}
        </p>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
            onClick={() => {
              analytics.ctaClick('fomo_section', t('fomo.button'));
              document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('fomo.button')}
          </Button>
        </div>
      </div>
    </section>
  );
};
