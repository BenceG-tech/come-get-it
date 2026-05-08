import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';
import { SocialProof } from './SocialProof';
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
    <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden">
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Cinematic Budapest night background */}
      <div className="absolute inset-0 z-0">
        <img
          src={budapestNight}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        {/* Dark navy overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060d]/85 via-[#050b18]/80 to-[#03060d]" />
        {/* Cyan radial glow accents */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 75% 45%, rgba(0,188,212,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 15% 70%, rgba(0,151,167,0.10) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
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

            {/* Social Proof */}
            <div className="pt-6">
              <SocialProof />
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
              <Button
                variant="neon"
                size="lg"
                className="py-4 px-10 text-lg w-full sm:w-auto"
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
                className="py-4 px-8 text-lg w-full sm:w-auto rounded-full border-nf-primary/60 text-nf-primary hover:bg-nf-primary/10 hover:text-nf-primary"
                onClick={() => {
                  analytics.ctaClick('hero_secondary', t('hero.cta_secondary'));
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.cta_secondary')}
              </Button>
            </div>

            {/* Founding member note */}
            <p className="pt-3 text-xs md:text-sm text-white/55 max-w-xl mx-auto lg:mx-0">
              {t('hero.founding_note')}
            </p>
          </div>

          {/* Right - Phone mockup with cyan glow */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Soft cyan glow behind phone */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 70% at center, rgba(0,188,212,0.35) 0%, rgba(0,188,212,0.15) 40%, transparent 75%)',
                filter: 'blur(30px)',
              }}
            />
            <div className="relative scale-105 lg:scale-110">
              <PhoneMockup imageUrl={appImages[currentImageIndex]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
