
import React from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-64 h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl phone-mockup-glow border border-[#3ba1cb]/30">
      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
        
        <div className="relative w-full h-full">
          <img 
            src={imageUrl}
            alt={`App Screenshot`} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
);
