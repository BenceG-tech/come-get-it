
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative py-20 px-4 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-glow-primary rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-glow-secondary rounded-full blur-2xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center pt-16 lg:pt-8">
        {/* Left side - Large Headlines and CTA */}
        <div className="flex flex-col justify-center">
          {/* Mobile Layout */}
          <div className="lg:hidden text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
              <span className="block">INGYEN ITAL</span>
              <span className="block">MINDEN NAPRA</span>
            </h1>
            
            <p className="text-lg text-white max-w-lg mx-auto">
              Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
            </p>
            
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-6 px-12 text-xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj most!
            </Button>

            {/* Phone mockup for mobile - simple like other sections */}
            <div className="flex justify-center mt-12">
              <div className="relative">
                <div className="absolute inset-0 bg-glow-secondary opacity-30 blur-2xl"></div>
                <div className="relative">
                  <PhoneMockup imageUrl={appImages[currentImageIndex]} />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block text-left space-y-8">
            {/* Massive Headline */}
            <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-black leading-none tracking-tight text-white">
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
        
        {/* Right side - Desktop Phone Mockup - Simple consistent approach */}
        <div className="hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-glow-secondary opacity-30 blur-2xl"></div>
          <div className="relative">
            <PhoneMockup imageUrl={appImages[currentImageIndex]} className="phone-mockup-glow" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
