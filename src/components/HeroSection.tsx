
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative min-h-screen pt-20 pb-20 px-4 bg-black overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 bg-unified-glow-primary opacity-30"></div>
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-unified-glow-secondary blur-3xl opacity-20"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        {/* Left side - Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
            <span className="block text-white mb-4 tracking-[0.3em] whitespace-nowrap">
              INGYEN ITAL
            </span>
            <span className="block text-white text-4xl md:text-5xl lg:text-6xl tracking-wider">
              MINDEN NAPRA
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-lg mx-auto lg:mx-0">
            Töltsd le az appot, és igyál ingyen minden nap egy másik helyen!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 hover:shadow-2xl text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Letöltés
          </Button>
        </div>
        
        {/* Right side - Phone mockup */}
        <div className="flex justify-center lg:justify-start">
          <PhoneMockup imageUrl={appImages[currentImageIndex]} />
        </div>
      </div>
    </div>
  </section>
);
