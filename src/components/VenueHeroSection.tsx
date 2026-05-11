import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import venueInteriorHero from '@/assets/venue-interior-hero.jpg';

export const VenueHeroSection: React.FC = () => {
  const venueDetailImage = "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png";
  const { t } = useI18n();

  return (
    <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden bg-nf-background">
      {/* Background layers — unified with main hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-x-0"
          style={{
            top: '25%',
            bottom: '18%',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          }}
        >
          <img
            src={venueInteriorHero}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-65"
            style={{ objectPosition: 'center 50%' }}
            width={1920}
            height={1080}
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-nf-background via-nf-background/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-nf-background via-nf-background/85 to-transparent" />
        {/* Left-side dark overlay for text readability */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-nf-background via-nf-background/85 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 72% 50%, rgba(0,188,212,0.26) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 20% 55%, rgba(0,151,167,0.10) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-5 flex justify-center lg:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary">
                {t('venues.hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight uppercase mb-6">
              <span className="block text-white mb-2 lg:whitespace-nowrap">{t('venues.hero.line1')}</span>
              <span className="block text-nf-primary lg:whitespace-nowrap drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('venues.hero.line2')}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
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

          {/* Right - Phone mockup with cyan glow */}
          <div className="relative flex justify-center items-center min-h-[480px] lg:min-h-[640px]">
            {/* Dark shadow halo */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 60% at 50% 55%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Stronger cyan glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,188,212,0.55) 0%, rgba(0,188,212,0.22) 45%, transparent 75%)',
                filter: 'blur(28px)',
              }}
            />
            <div className="relative z-10 origin-center [filter:drop-shadow(0_30px_70px_rgba(0,0,0,0.75))_drop-shadow(0_0_45px_rgba(0,188,212,0.35))]">
              <PhoneMockup imageUrl={venueDetailImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
