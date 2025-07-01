
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { MobileNavigation } from './MobileNavigation';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative py-16 px-4 overflow-hidden">
    {/* Mobile Navigation */}
    <MobileNavigation />
    
    {/* Unified background gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
    
    {/* Unified glow layers */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="text-center space-y-8">
        {/* Main Title - Two lines, max 18 chars per line */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-anton leading-[0.9] tracking-tight">
          <span className="block text-white mb-2">INGYEN ITAL</span>
          <span className="block text-white">MINDEN NAPRA</span>
        </h1>
        
        {/* Subtitle - Max 2 short lines, centered */}
        <div className="max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-electric-100 font-medium leading-tight">
            Igyál minden nap ingyen Budapesten –<br />
            fedezz fel új helyeket, gyűjts pontokat!
          </p>
        </div>
        
        {/* CTA Button - Unified styling */}
        <div className="pt-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj most!
          </Button>
        </div>

        {/* Phone mockup - Centered */}
        <div className="flex justify-center pt-8">
          <PhoneMockup imageUrl={appImages[currentImageIndex]} />
        </div>
      </div>
    </div>
  </section>
);
