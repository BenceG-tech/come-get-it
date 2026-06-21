import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';

import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import budapestNight from '@/assets/budapest-night-hero.jpg';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => {
  const { t } = useI18n();
  return (
    <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden bg-nf-background">
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Parliament image — confined to middle band, faded top & bottom */}
        <div
          className="absolute inset-x-0"
          style={{
            top: '30%',
            bottom: '20%',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          }}
        >
          <img
            src={budapestNight}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-55"
            style={{ objectPosition: 'center 55%' }}
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Top dark fade — clean background behind headline */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-nf-background via-nf-background/85 to-transparent" />
        {/* Bottom dark fade — clean background under CTA */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-nf-background via-nf-background/85 to-transparent" />

        {/* Cyan radial glow accents focused on the middle band */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 75% 50%, rgba(0,188,212,0.20) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 20% 55%, rgba(0,151,167,0.10) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 lg:items-center">
          {/* 1. Headline block (badge + H1 + subtitle) */}
          <div className="text-center lg:text-left order-1 lg:order-1 lg:col-start-1 lg:row-start-1">
            {/* Launch badge */}
            <div className="mb-5 flex justify-center lg:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary">
                {t('hero.badge')}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight uppercase">
              <span className="block text-white mb-2">{t('hero.title_line1')}</span>
              <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">
                {t('hero.title_line2')}
              </span>
            </h1>

            {/* Subtitle */}
            <div className="max-w-2xl lg:max-w-none">
              <p className="text-base md:text-lg text-white/75 font-medium leading-snug mt-6">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>

          {/* 2. CTA Buttons */}
          <div className="order-2 lg:order-3 lg:col-start-1 lg:row-start-2 pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
            <Button
              variant="neon"
              size="lg"
              className=""
              onClick={() => {
                analytics.ctaClick('hero_primary', t('hero.cta'));
                document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-nf-primary/60 text-nf-primary hover:bg-nf-primary/10 hover:text-nf-primary"
              onClick={() => {
                analytics.ctaClick('hero_secondary', t('hero.cta_secondary'));
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>

          {/* 3. Phone mockup — between CTAs and founding note on mobile, right column on desktop */}
          <div className="order-3 lg:order-2 lg:col-start-2 lg:row-start-1 lg:row-span-3 relative flex justify-center items-center min-h-[380px] lg:min-h-[580px]">
            {/* Soft cyan glow behind phone */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 42% 42% at 50% 50%, rgba(0,188,212,0.65) 0%, rgba(0,188,212,0.28) 40%, transparent 65%)',
                filter: 'blur(18px)',
              }}
            />
            <div className="relative z-20">
              <PhoneMockup imageUrl={appImages[currentImageIndex]} />
            </div>
          </div>

          {/* 4. Founding member note */}
          <p className="order-4 lg:order-4 lg:col-start-1 lg:row-start-3 pt-1 text-xs md:text-sm text-white/55 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            {t('hero.founding_note')}
          </p>
        </div>
      </div>
    </section>
  );
};
