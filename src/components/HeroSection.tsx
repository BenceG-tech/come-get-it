
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative py-4 px-4 overflow-hidden lg:py-20">
    {/* Simple background - no complex glow effects */}
    <div className="absolute inset-0 bg-black"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center pt-4 lg:pt-16">
        {/* Left side - Large Headlines and CTA */}
        <div className="flex flex-col justify-center">
          {/* Mobile Layout */}
          <div className="lg:hidden text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
              <span className="block">INGYEN ITAL</span>
              <span className="block">MINDEN NAPRA</span>
            </h1>
            
            <p className="text-base text-white max-w-lg mx-auto">
              Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
            </p>
            
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-7 px-14 text-xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
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
            {/* Smaller headline to fit in two lines properly */}
            <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-black leading-none tracking-tight text-white">
              <span className="block mb-2">INGYEN ITAL</span>
              <span className="block">MINDEN NAPRA</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl xl:text-2xl text-white max-w-2xl font-medium leading-relaxed">
              Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-6 px-16 text-2xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Regisztrálj most!
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - Desktop Phone Mockup - Copy exact structure from other sections */}
        <div className="hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-glow-secondary opacity-30 blur-2xl"></div>
          <div className="relative">
            <PhoneMockup imageUrl={appImages[currentImageIndex]} />
          </div>
        </div>
      </div>
    </div>
  </section>
);
