
import React from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-64 h-[520px] bg-gradient-to-br from-ocean-800 via-black to-ocean-900 rounded-[3rem] p-2 shadow-2xl phone-mockup-glow border border-electric-300/30 crystal-border reflection-overlay">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative glass-effect">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-ocean-900 to-black rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt={`App Screenshot`} 
              className="w-full h-full object-cover object-top"
            />
            
            {/* Enhanced overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-electric-300/10 via-transparent to-neon-300/5 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
