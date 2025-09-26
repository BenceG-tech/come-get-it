
import React from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Optimized single glow layer with hardware acceleration */}
      <div className="absolute -inset-16 bg-optimized-phone-glow opacity-8 blur-[40px] rounded-[4rem] transform-gpu will-change-transform backface-visibility-hidden contain-layout-style-paint"></div>
      
      {/* Phone frame with enhanced styling */}
      <div className="relative w-64 h-[520px] bg-gradient-to-br from-dark-blue via-dark-blue/80 to-dark-blue rounded-[3rem] p-2 shadow-2xl border border-gray-700/30 phone-frame-solid">
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] overflow-hidden relative clip-rounded-2_5rem">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-dark-blue to-dark-blue/80 rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt={`App Screenshot`} 
              className="w-full h-full object-cover object-top"
            />
            
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/5 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
