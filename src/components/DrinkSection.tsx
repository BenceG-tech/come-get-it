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
    <section id="drink" className="py-20 px-4 relative scroll-mt-24 bg-nf-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
              DRINK.
            </h2>
            <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
              {t('drink.subtitle')}
            </p>
            <p className="text-lg text-nf-text-muted max-w-lg mb-8">
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
          
          {/* Right - Phone Mockup */}
          <div className="flex justify-center lg:justify-start relative">
            <PhoneMockup imageUrl={drinkImages[currentImageIndex]} />
          </div>
        </div>
      </div>
    </section>
  );
};
