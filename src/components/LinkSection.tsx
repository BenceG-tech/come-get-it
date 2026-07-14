import React, { useEffect, useState } from 'react';
import { PhoneMockup } from './PhoneMockup';
import { useI18n } from '@/hooks/useI18n';

interface LinkSectionProps {
  linkImage: string | string[];
}

export const LinkSection: React.FC<LinkSectionProps> = ({ linkImage }) => {
  const { t } = useI18n();
  const images = Array.isArray(linkImage) ? linkImage : [linkImage];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section id="link" className="py-20 px-4 bg-nf-background nf-section-glow relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Phone Mockup */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative">
            <PhoneMockup imageUrl={images[idx]} />
          </div>
          
          {/* Right - Content */}
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
    </section>
  );
};
