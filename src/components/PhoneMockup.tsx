
import React, { useState } from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setTilt({
      x: (Math.random() - 0.5) * 24, // -12 to 12 degrees
      y: (Math.random() - 0.5) * 24
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      {/* Outer wide aura */}
      <div
        className="absolute -inset-24 blur-[60px] rounded-[5rem] transform-gpu will-change-transform pointer-events-none animate-pulse-glow"
        style={{ background: 'radial-gradient(ellipse 90% 90%, rgba(0, 212, 255, 0.75) 0%, rgba(0, 188, 212, 0.45) 35%, rgba(0, 151, 167, 0.2) 65%, transparent 100%)' }}
      />
      {/* Mid glow ring */}
      <div
        className="absolute -inset-12 blur-[35px] rounded-[4rem] transform-gpu will-change-transform pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 100%, rgba(0, 212, 255, 0.9) 0%, rgba(0, 191, 230, 0.55) 40%, rgba(0, 169, 204, 0.25) 70%, transparent 100%)' }}
      />
      {/* Tight edge halo */}
      <div
        className="absolute -inset-4 blur-[15px] rounded-[3.2rem] transform-gpu will-change-transform pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 100%, rgba(0, 229, 255, 0.95) 0%, rgba(0, 212, 255, 0.6) 50%, transparent 100%)' }}
      />
      
      {/* Phone frame with enhanced styling */}
      <div className="relative w-64 h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3rem] p-2 shadow-2xl border border-gray-700/30 phone-frame-solid">
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] overflow-hidden relative clip-rounded-2_5rem">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gray-900 to-black rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt="App Screenshot" 
              className="w-full h-full object-cover object-top"
            />
            
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
