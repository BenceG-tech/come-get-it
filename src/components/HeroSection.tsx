import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';
import { SocialProof } from './SocialProof';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import budapestNight from '@/assets/budapest-night-hero.jpg';
import cyanDrink from '@/assets/cyan-drink.png';

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
          className="w-full h-full object-cover opacity-75"
          width={1920}
          height={1080}
        />
        {/* Left readability shield */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03060d]/95 via-[#03060d]/70 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#03060d]" />
        {/* Right-side cyan glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 60% at 72% 50%, rgba(0,188,212,0.28) 0%, rgba(0,151,167,0.12) 45%, transparent 75%)',
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

          {/* Right - Phone mockup + unbranded cyan drink */}
          <div className="relative flex justify-center lg:justify-start lg:pl-4 min-h-[560px]">
            {/* Strong cyan glow behind phone */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 75% 75% at 45% 50%, rgba(0,188,212,0.55) 0%, rgba(0,188,212,0.20) 40%, transparent 75%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Unbranded cyan drink — secondary visual */}
            <img
              src={cyanDrink}
              alt=""
              aria-hidden="true"
              className="hidden sm:block absolute right-[-1rem] sm:right-[-1.5rem] lg:right-[-2rem] bottom-0 w-[150px] sm:w-[180px] lg:w-[240px] z-0 rotate-[6deg] drop-shadow-[0_25px_45px_rgba(0,188,212,0.35)] pointer-events-none select-none"
            />
            {/* Cyan reflection under drink */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute right-[-1rem] sm:right-[-1.5rem] lg:right-[-2rem] bottom-[-10px] w-[150px] sm:w-[180px] lg:w-[240px] h-12 z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,188,212,0.45) 0%, transparent 70%)',
                filter: 'blur(14px)',
              }}
            />

            {/* Phone — primary focal point */}
            <div className="relative z-10 scale-100 sm:scale-105 lg:scale-125 transform-gpu rotate-[-4deg] lg:rotate-[-6deg] drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)]">
              <PhoneMockup imageUrl={appImages[currentImageIndex]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
