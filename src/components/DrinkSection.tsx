
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';

interface DrinkSectionProps {
  currentImageIndex: number;
  drinkImages: string[];
}

export const DrinkSection: React.FC<DrinkSectionProps> = ({ currentImageIndex, drinkImages }) => (
  <section className="py-20 px-4 -mt-32 lg:mt-0 relative z-20">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center pt-32 lg:pt-0">
        {/* Left - Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            DRINK.
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
            Igyál ingyen minden nap
          </p>
          <p className="text-lg text-white max-w-lg mb-8">
            Válaszd ki kedvenc helyedet a térképen, menj oda és igyál ingyen! 
            Új helyek, új ízek, új élmények várnak rád.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 hover:shadow-2xl text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Kezdj el inni!
          </Button>
        </div>
        
        {/* Right - Phone Mockup */}
        <div className="flex justify-center lg:justify-start relative">
          <div className="absolute inset-0 bg-glow-primary opacity-30 blur-3xl animate-pulse-slow"></div>
          <div className="relative">
            <PhoneMockup imageUrl={drinkImages[currentImageIndex]} />
          </div>
        </div>
      </div>
    </div>
    
    {/* Blue section at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-ocean-800 to-ocean-900 -z-10"></div>
  </section>
);
