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
    <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden">
      <div className="hero-abstract-bg">
        <div className="hero-shape-1"></div>
        <div className="hero-shape-2"></div>
        <div className="hero-glow-accent"></div>
        <div className="hero-glow-secondary"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-5 flex justify-center lg:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary">
                {t('venues.hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6">
              <span className="block text-white mb-2 lg:whitespace-nowrap">{t('venues.hero.line1')}</span>
              <span className="block text-nf-primary lg:whitespace-nowrap">{t('venues.hero.line2')}</span>
            </h1>

            <p className="text-lg md:text-xl text-nf-text-muted font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('venues.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
              <Button
                variant="neon"
                size="lg"
                className="py-4 px-8 text-lg w-full sm:w-auto"
                onClick={() => {
                  analytics.ctaClick('venue_hero_primary', t('venues.hero.cta'));
                  document.querySelector('#venue-application')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('venues.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="py-4 px-8 text-lg w-full sm:w-auto rounded-full border-nf-primary/60 text-nf-primary hover:bg-nf-primary/10 hover:text-nf-primary"
                onClick={() => {
                  analytics.ctaClick('venue_hero_secondary', t('venues.hero.cta_secondary'));
                  document.querySelector('#how-it-works-venues')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('venues.hero.cta_secondary')}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <PhoneMockup imageUrl={venueDetailImage} className="scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
};
