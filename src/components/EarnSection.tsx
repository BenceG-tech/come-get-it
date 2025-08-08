
import React from 'react';
import { PhoneMockup } from './PhoneMockup';

interface EarnSectionProps {
  earnImageIndex: number;
  earnImages: string[];
}

export const EarnSection: React.FC<EarnSectionProps> = ({ earnImageIndex, earnImages }) => (
  <section id="earn" className="py-20 px-4 relative">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            EARN.
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
            Pontokból élmények
          </p>
          <p className="text-lg text-white max-w-lg">
            Minden korty, felfedezés és aktivitás pont. Váltsd be exkluzív jutalmakra, és közben jó ügyeket is támogatsz. Igyál okosan, élj intenzíven.
          </p>
        </div>
        
        {/* Right - Phone Mockup with alternating earn images */}
        <div className="flex justify-center lg:justify-start relative">
          <PhoneMockup imageUrl={earnImages[earnImageIndex]} />
        </div>
      </div>
    </div>
  </section>
);
