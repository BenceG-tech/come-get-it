import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const VenueHeroSection: React.FC = () => {
  const venueDetailImage = "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png";
  const { t } = useI18n();

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-nf-background min-h-screen flex items-center">
      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nf-primary/10 opacity-30 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nf-secondary/10 opacity-20 blur-[80px] rounded-full"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6">
              <span className="block text-white mb-2">{t('venues.hero.line1')}</span>
              <span className="block text-nf-primary">{t('venues.hero.line2')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-nf-text-muted font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('venues.hero.p1')}
              <br />
              <span className="text-white font-semibold">
                {t('venues.hero.p2')}
              </span>
            </p>
            
            <Button 
              variant="neon"
              size="lg" 
              className="py-4 px-8 text-lg"
              onClick={() => { 
                analytics.ctaClick('venue_hero', t('venues.hero.cta'));
                document.querySelector('#venue-application')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('venues.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Right side - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup imageUrl={venueDetailImage} className="scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
};
