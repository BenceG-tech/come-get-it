
import React from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-64 h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3rem] p-2 shadow-2xl border border-electric-300/20 phone-frame-solid">
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gray-900 to-black rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt={`App Screenshot`} 
              className="w-full h-full object-cover object-top"
            />
            
            {/* Soft overlay without transparency issues */}
            <div className="absolute inset-0 bg-gradient-to-t from-electric-300/5 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
