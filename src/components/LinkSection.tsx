import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { useI18n } from '@/hooks/useI18n';
import { CinematicScene } from './cinematic/CinematicScene';
import { SceneLayer } from './cinematic/SceneLayer';
import { DepthBackground } from './cinematic/DepthBackground';

interface LinkSectionProps {
  linkImage: string;
}

export const LinkSection: React.FC<LinkSectionProps> = ({ linkImage }) => {
  const { t } = useI18n();
  return (
    <CinematicScene id="link" className="bg-nf-surface">
      {(progress) => (
        <section className="relative py-20 px-4 overflow-hidden">
          <SceneLayer depth="background" scrollProgress={progress} className="absolute inset-0">
            <DepthBackground variant="violet" />
          </SceneLayer>

          <div className="scene-gradient-overlay-top z-0" />

          <SceneLayer depth="midground" scrollProgress={progress} className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-20 right-16 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(140,90,255,0.18), transparent 70%)', filter: 'blur(50px)' }}
            />
          </SceneLayer>

          <SceneLayer depth="foreground" scrollProgress={progress} className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative cinematic-shadow">
                  <PhoneMockup imageUrl={linkImage} />
                </div>

                <div className="text-center lg:text-left order-1 lg:order-2">
                  <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
                    LINK.
                  </h2>
                  <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
                    {t('link.subtitle')}
                  </p>
                  <p className="text-lg text-nf-text-muted max-w-lg">
                    {t('link.body')}
                  </p>
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
