
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative py-4 px-4 overflow-hidden lg:py-20">
    {/* Fixed background - black top half, then blue */}
    <div className="absolute inset-0 bg-gradient-to-b from-black from-50% via-black via-50% to-ocean-800"></div>
    
    {/* Floating particles effect */}
    <div className="absolute inset-0 floating-particles"></div>
    
    {/* Updated glow layers */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glow-electric opacity-50 blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-ocean opacity-30 blur-2xl"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center pt-4 lg:pt-16">
        {/* Left side - Large Headlines and CTA */}
        <div className="flex flex-col justify-center">
          {/* Mobile Layout */}
          <div className="lg:hidden text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              <span className="block text-white">INGYEN ITAL</span>
              <span className="block text-electric-100">MINDEN NAPRA</span>
            </h1>
            
            <p className="text-base text-electric-100 max-w-lg mx-auto">
              Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 hover:shadow-2xl text-white font-bold py-7 px-14 text-xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj most!
            </Button>

            {/* Phone mockup for mobile - positioned at bottom, cropped by section end */}
            <div className="flex justify-center mt-10 pb-0">
              <div className="relative">
                <PhoneMockup imageUrl={appImages[currentImageIndex]} />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block text-left space-y-8">
            {/* Updated headline - white main title */}
            <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-black leading-none tracking-tight">
              <span className="block mb-2 text-white">INGYEN ITAL</span>
              <span className="block text-electric-100">MINDEN NAPRA</span>
            </h1>
            
            {/* Updated subtitle */}
            <p className="text-xl xl:text-2xl text-electric-100 max-w-2xl font-medium leading-relaxed">
              Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
            </p>
            
            {/* Updated CTA Button with unified glow */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 hover:shadow-2xl text-white font-bold py-6 px-16 text-2xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Regisztrálj most!
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - Fixed Desktop Phone Mockup */}
        <div className="hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-glow-electric opacity-30 blur-3xl animate-pulse-glow"></div>
          <div className="relative liquid-ripple">
            <PhoneMockup imageUrl={appImages[currentImageIndex]} />
          </div>
        </div>
      </div>
    </div>
  </section>
);
