import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { useI18n } from '@/hooks/useI18n';

interface EarnSectionProps {
  earnImageIndex: number;
  earnImages: string[];
}

export const EarnSection: React.FC<EarnSectionProps> = ({ earnImageIndex, earnImages }) => {
  const { t } = useI18n();
  return (
    <section id="earn" className="py-20 px-4 relative bg-nf-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
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
          
          {/* Right - Phone Mockup */}
          <div className="flex justify-center lg:justify-start relative">
            <PhoneMockup imageUrl={earnImages[earnImageIndex]} />
          </div>
        </div>
      </div>
    </section>
  );
};
