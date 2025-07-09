import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const VenueHeroSection: React.FC = () => {
  const { t } = useLanguage();
  // Use the venue detail mockup image
  const venueDetailImage = "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png";

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-black min-h-screen flex items-center">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-300/30 opacity-30 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ocean-600/20 opacity-20 blur-[80px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6">
              <span className="block text-white mb-2">{t('venues.hero.title1')}</span>
              <span className="block text-electric-300">{t('venues.hero.title2')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('venues.hero.subtitle')}
              <br />
              <span className="text-white font-semibold">
                {t('venues.hero.subtitle2')}
              </span>
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-300/20 border-0"
              onClick={() => document.querySelector('#venue-application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('venues.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Right side - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup imageUrl={venueDetailImage} className="animate-glow-pulse scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
};