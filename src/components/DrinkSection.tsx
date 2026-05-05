import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { CinematicScene } from './cinematic/CinematicScene';
import { SceneLayer } from './cinematic/SceneLayer';
import { DepthBackground } from './cinematic/DepthBackground';

interface DrinkSectionProps {
  currentImageIndex: number;
  drinkImages: string[];
}

export const DrinkSection: React.FC<DrinkSectionProps> = ({ currentImageIndex, drinkImages }) => {
  const { t } = useI18n();
  return (
    <CinematicScene id="drink" className="bg-nf-background scroll-mt-24">
      {(progress) => (
        <section className="relative py-20 px-4 z-20 overflow-hidden">
          {/* Background layer - far, blurred, slow */}
          <SceneLayer depth="background" scrollProgress={progress} className="absolute inset-0">
            <DepthBackground variant="teal" />
          </SceneLayer>

          {/* Top gradient blends from previous section */}
          <div className="scene-gradient-overlay-top z-0" />

          {/* Midground - softer floating glow */}
          <SceneLayer depth="midground" scrollProgress={progress} className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/3 left-10 w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.18), transparent 70%)', filter: 'blur(40px)' }}
            />
          </SceneLayer>

          {/* Foreground content */}
          <SceneLayer depth="foreground" scrollProgress={progress} className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
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

                <div className="flex justify-center lg:justify-start relative cinematic-shadow">
                  <PhoneMockup imageUrl={drinkImages[currentImageIndex]} />
                </div>
              </div>
            </div>
          </SceneLayer>

          {/* Bottom blend into next section */}
          <div className="scene-gradient-overlay z-0" />
        </section>
      )}
    </CinematicScene>
  );
};
