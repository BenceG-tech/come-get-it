
import React from 'react';
import { PhoneMockup } from './PhoneMockup';

interface LinkSectionProps {
  linkImage: string;
}

export const LinkSection: React.FC<LinkSectionProps> = ({ linkImage }) => (
  <section id="link" className="py-20 px-4 bg-[#0f384e]/20 relative">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            LINK.
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
            Csatlakozz a közösséghez
          </p>
          <p className="text-lg text-white max-w-lg">
            Csatold a kártyád, költs a partnerhelyeken, és minden alkalommal pontokkal gazdagodsz, amiket exkluzív jutalmakra válthatsz!
          </p>
        </div>
        
        {/* Right - Phone Mockup with specific image */}
        <div className="flex justify-center lg:justify-start relative">
          <div className="absolute inset-0 bg-glow-primary opacity-40 blur-2xl"></div>
          <div className="relative">
            <PhoneMockup imageUrl={linkImage} />
          </div>
        </div>
      </div>
    </div>
    
    {/* Blue section at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-ocean-800 to-ocean-900 -z-10"></div>
  </section>
);
