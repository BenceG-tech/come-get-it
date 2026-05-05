import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';
import { SocialProof } from './SocialProof';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { CinematicScene } from './cinematic/CinematicScene';
import { SceneLayer } from './cinematic/SceneLayer';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => {
  const { t } = useI18n();
  return (
    <CinematicScene className="overflow-hidden">
      {(progress) => (
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Mobile Navigation */}
          <MobileNavigation />

          {/* Background layer - far, slow, light blur */}
          <SceneLayer depth="background" scrollProgress={progress} className="absolute inset-0">
            <div className="hero-abstract-bg">
              <div className="hero-shape-1"></div>
              <div className="hero-shape-2"></div>
            </div>
          </SceneLayer>

          {/* Midground - floating glow accents */}
          <SceneLayer depth="midground" scrollProgress={progress} className="absolute inset-0 pointer-events-none">
            <div className="hero-glow-accent"></div>
            <div className="hero-glow-secondary"></div>
          </SceneLayer>

          {/* Foreground content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <SceneLayer depth="foreground" scrollProgress={progress} zoom={0.02} className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight">
                  <span className="block text-white mb-2">{t('hero.title_line1')}</span>
                  <span className="block text-white">{t('hero.title_line2')}</span>
                </h1>

                <div className="max-w-2xl lg:max-w-none">
                  <p className="text-base md:text-lg text-nf-text-muted font-medium leading-tight mt-6">
                    {t('hero.subtitle')}
                  </p>
                </div>

                <div className="pt-6">
                  <SocialProof />
                </div>

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
              </SceneLayer>

              <SceneLayer depth="foreground" scrollProgress={progress} zoom={0.08} className="flex justify-center lg:justify-start cinematic-shadow">
                <PhoneMockup imageUrl={appImages[currentImageIndex]} />
              </SceneLayer>
            </div>
          </div>

          {/* Bottom blend into next section */}
          <div className="scene-gradient-overlay z-0" />
        </section>
      )}
    </CinematicScene>
  );
};
