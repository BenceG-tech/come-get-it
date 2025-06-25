
import React from 'react';
import { PhoneMockup } from './PhoneMockup';

interface DrinkSectionProps {
  currentImageIndex: number;
  appImages: string[];
}

export const DrinkSection: React.FC<DrinkSectionProps> = ({ currentImageIndex, appImages }) => (
  <section id="drink" className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Phone Mockup */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative">
          <div className="absolute inset-0 bg-glow-secondary opacity-30 blur-2xl"></div>
          <div className="relative">
            <PhoneMockup imageUrl={appImages[currentImageIndex]} />
          </div>
        </div>
        
        {/* Right - Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            DRINK.
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
            Ingyen ital minden nap
          </p>
          <p className="text-lg text-white max-w-lg">
            Regisztrálj, válassz egy helyet és szerezd meg a napi ingyen italodat. 
            Egyszerű, gyors, minden nap új lehetőség.
          </p>
        </div>
      </div>
    </div>
  </section>
);
