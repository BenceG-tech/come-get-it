import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { GlassWater, Star, CheckCircle, Footprints, Compass } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import venueMapAsset from '@/assets/app-venue-map.png.asset.json';

export const VenueKeyFeatures: React.FC = () => {
  const venueDetailImage = venueMapAsset.url;
  const { t } = useI18n();

  const features = [
    { icon: Footprints,  title: t('venues.key_features.items.1.title'), description: t('venues.key_features.items.1.description') },
    { icon: CheckCircle, title: t('venues.key_features.items.2.title'), description: t('venues.key_features.items.2.description') },
    { icon: Star,        title: t('venues.key_features.items.3.title'), description: t('venues.key_features.items.3.description') },
    { icon: GlassWater,  title: t('venues.key_features.items.4.title'), description: t('venues.key_features.items.4.description') },
    { icon: Compass,     title: t('venues.key_features.items.5.title'), description: t('venues.key_features.items.5.description') },
  ];

  return (
    <section className="relative py-20 px-4 bg-nf-background nf-section-glow">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nf-primary/10 opacity-30 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nf-secondary/10 opacity-20 blur-[80px] rounded-full"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-anton text-white mb-6 tracking-tight">
            {t('venues.key_features.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup imageUrl={venueDetailImage} className="scale-110" />
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-neon">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-nf-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
