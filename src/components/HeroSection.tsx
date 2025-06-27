import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentImageIndex, appImages }) => (
  <section className="relative py-8 px-4 overflow-hidden lg:py-24">
    {/* Unified background gradient for both mobile and desktop */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
    
    {/* Unified glow layers with consistent colors and smooth blending */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center pt-16 lg:pt-20">
        {/* Left side - Large Headlines and CTA */}
        <div className="flex flex-col justify-center">
          {/* Mobile Layout */}
          <div className="lg:hidden text-center space-y-10">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              <span className="block text-white mb-3">
                INGYEN <span className="ml-6">ITAL</span>
              </span>
              <span className="block text-white">
                MINDEN <span className="ml-6">NAPRA</span>
              </span>
            </h1>
            
            <p className="text-lg text-electric-100 max-w-lg mx-auto leading-relaxed">
              Igyál minden nap ingyen Budapesten – fedezz fel új helyeket, gyűjts pontokat, és élvezd a legjobb bulikat a barátaiddal!
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-3 px-8 text-base rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj most!
            </Button>

            {/* Phone mockup for mobile - using PhoneMockup component without extra glow */}
            <div className="flex justify-center mt-12 pb-0">
              <PhoneMockup imageUrl={appImages[currentImageIndex]} />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block text-left space-y-10">
            <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-black leading-none tracking-tight">
              <span className="block mb-4 text-white">
                INGYEN <span className="ml-8">ITAL</span>
              </span>
              <span className="block text-white">
                MINDEN <span className="ml-8">NAPRA</span>
              </span>
            </h1>
            
            <p className="text-xl xl:text-2xl text-electric-100 max-w-2xl font-medium leading-relaxed">
              Igyál minden nap ingyen Budapesten – fedezz fel új helyeket, gyűjts pontokat, és élvezd a legjobb bulikat a barátaiddal!
            </p>
            
            <div className="pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-3 px-8 text-base rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
                onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Regisztrálj most!
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - Desktop Phone Mockup - using PhoneMockup component without extra glow effects */}
        <div className="hidden lg:flex justify-center relative">
          <PhoneMockup imageUrl={appImages[currentImageIndex]} />
        </div>
      </div>
    </div>
  </section>
);
