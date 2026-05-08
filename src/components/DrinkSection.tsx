import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

interface DrinkSectionProps {
  currentImageIndex: number;
  drinkImages: string[];
}

export const DrinkSection: React.FC<DrinkSectionProps> = ({ currentImageIndex, drinkImages }) => {
  const { t } = useI18n();
  return (
    <section
      id="drink"
      className="py-24 px-4 relative z-20 scroll-mt-24 overflow-hidden bg-gradient-to-b from-nf-background via-[#050b18] to-nf-background"
    >
      {/* ambient cyan glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(0,188,212,0.10) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-anton uppercase text-white mb-6 leading-none tracking-tight">
              DRINK.
            </h2>
            <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
              {t('drink.subtitle')}
            </p>
            <p className="text-lg text-white/65 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('drink.body')}
            </p>

            <Button
              variant="neon"
              size="lg"
              className="py-4 px-12 text-lg"
              onClick={() => {
                analytics.ctaClick('drink_section', t('drink.button'));
                document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('drink.button')}
            </Button>
          </div>

          {/* Right - Phone Mockup with soft cyan glow */}
          <div className="relative flex justify-center lg:justify-start">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 70% at center, rgba(0,188,212,0.30) 0%, rgba(0,188,212,0.12) 45%, transparent 75%)',
                filter: 'blur(30px)',
              }}
            />
            <div className="relative">
              <PhoneMockup imageUrl={drinkImages[currentImageIndex]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
