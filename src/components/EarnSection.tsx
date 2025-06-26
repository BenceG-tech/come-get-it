
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
        {/* Left - Phone Mockup with alternating earn images */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative">
          <PhoneMockup imageUrl={earnImages[earnImageIndex]} />
        </div>
        
        {/* Right - Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            EARN.
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
            Gyűjts pontokat és segíts
          </p>
          <p className="text-lg text-white max-w-lg">
            Gyűjts pontokat minden kortyért, felfedezésért és aktivitásért! Váltsd be őket exkluzív jutalmakra, miközben minden italoddal jótékony célt is támogatsz.
          </p>
        </div>
      </div>
    </div>
  </section>
);
