
import React, { useState } from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
  fit?: 'cover' | 'contain';
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageUrl, className = "", fit = 'contain' }) => {
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
      {/* Enhanced glow - tighter around phone edges */}
      <div 
        className="absolute -inset-6 blur-[25px] rounded-[3.5rem] transform-gpu will-change-transform"
        style={{ background: 'radial-gradient(ellipse 100% 100%, rgba(0, 212, 255, 0.45) 0%, rgba(0, 191, 230, 0.3) 40%, rgba(0, 169, 204, 0.15) 70%, transparent 100%)' }}
      />
      
      {/* Phone frame with enhanced styling */}
      <div className="relative w-64 h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3rem] p-2 shadow-2xl border border-gray-700/30 phone-frame-solid">
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative clip-rounded-2_5rem">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gray-900 to-black rounded-b-2xl z-30"></div>

          <div className="relative w-full h-full bg-black">
            <img
              src={imageUrl}
              alt="App Screenshot"
              className={`w-full h-full ${fit === 'cover' ? 'object-cover object-top' : 'object-contain'}`}
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
