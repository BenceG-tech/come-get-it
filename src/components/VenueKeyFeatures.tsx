import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { GlassWater, Star, CheckCircle, MapPin, Footprints } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const VenueKeyFeatures: React.FC = () => {
  const { t } = useLanguage();
  const venueDetailImage = "/lovable-uploads/306d0815-37a6-4087-8408-3986c94eb037.png";

  const features = [
    {
      icon: GlassWater,
      title: t('venues.keyFeatures.features.traffic.title'),
      description: t('venues.keyFeatures.features.traffic.description')
    },
    {
      icon: Star,
      title: t('venues.keyFeatures.features.rewards.title'),
      description: t('venues.keyFeatures.features.rewards.description')
    },
    {
      icon: CheckCircle,
      title: t('venues.keyFeatures.features.simple.title'),
      description: t('venues.keyFeatures.features.simple.description')
    },
    {
      icon: Footprints,
      title: t('venues.keyFeatures.features.footprint.title'),
      description: t('venues.keyFeatures.features.footprint.description')
    },
    {
      icon: MapPin,
      title: t('venues.keyFeatures.features.gps.title'),
      description: t('venues.keyFeatures.features.gps.description')
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-anton text-white mb-6">
            {t('venues.keyFeatures.title')}
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
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-electric-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-electric-100 leading-relaxed">
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