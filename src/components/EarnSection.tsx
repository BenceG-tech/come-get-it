import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { useI18n } from '@/hooks/useI18n';
import { CinematicScene } from './cinematic/CinematicScene';
import { SceneLayer } from './cinematic/SceneLayer';
import { DepthBackground } from './cinematic/DepthBackground';

interface EarnSectionProps {
  earnImageIndex: number;
  earnImages: string[];
}

export const EarnSection: React.FC<EarnSectionProps> = ({ earnImageIndex, earnImages }) => {
  const { t } = useI18n();
  return (
    <CinematicScene id="earn" className="bg-nf-background">
      {(progress) => (
        <section className="relative py-20 px-4 overflow-hidden">
          <SceneLayer depth="background" scrollProgress={progress} className="absolute inset-0">
            <DepthBackground variant="amber" />
          </SceneLayer>

          <div className="scene-gradient-overlay-top z-0" />

          <SceneLayer depth="midground" scrollProgress={progress} className="absolute inset-0 pointer-events-none">
            <div
              className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,170,60,0.16), transparent 70%)', filter: 'blur(60px)' }}
            />
          </SceneLayer>

          <SceneLayer depth="foreground" scrollProgress={progress} className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                  <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
                    EARN.
                  </h2>
                  <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
                    {t('earn.subtitle')}
                  </p>
                  <p className="text-lg text-nf-text-muted max-w-lg">
                    {t('earn.body')}
                  </p>
                </div>

                <div className="flex justify-center lg:justify-start relative cinematic-shadow">
                  <PhoneMockup imageUrl={earnImages[earnImageIndex]} />
                </div>
              </div>
            </div>
          </SceneLayer>

          <div className="scene-gradient-overlay z-0" />
        </section>
      )}
    </CinematicScene>
  );
};
