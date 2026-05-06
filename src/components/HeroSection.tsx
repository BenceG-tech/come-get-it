import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';
import { SocialProof } from './SocialProof';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

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
      
      {/* Abstract teal background container */}
      <div className="hero-abstract-bg">
        {/* Curved shape - top right */}
        <div className="hero-shape-1"></div>
        
        {/* Curved shape - bottom left */}
        <div className="hero-shape-2"></div>
        
        {/* Floating cyan glow accents */}
        <div className="hero-glow-accent"></div>
        <div className="hero-glow-secondary"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight">
              <span className="block text-white mb-2">{t('hero.title_line1')}</span>
              <span className="block text-white">{t('hero.title_line2')}</span>
            </h1>
            
            {/* Subtitle */}
            <div className="max-w-2xl lg:max-w-none">
              <p className="text-base md:text-lg text-nf-text-muted font-medium leading-tight mt-6">
                {t('hero.subtitle')}
              </p>
            </div>
            
            {/* Social Proof */}
            <div className="pt-6">
              <SocialProof />
            </div>
            
            {/* CTA Button - Neon Fidelity style */}
            <div className="pt-4">
              <Button 
                variant="neon"
                size="lg" 
                className="py-4 px-12 text-lg"
                onClick={() => {
                  analytics.ctaClick('hero', t('hero.cta'));
                  document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.cta')}
              </Button>
            </div>
          </div>

          {/* Right - Phone mockup */}
          <div className="flex justify-center lg:justify-start">
            <PhoneMockup imageUrl={appImages[currentImageIndex]} />
          </div>
        </div>
      </div>
    </section>
  );
};
