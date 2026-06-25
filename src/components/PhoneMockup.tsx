
import React, { useState } from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
  fit?: 'cover' | 'contain';
  /** Tailwind width class for the phone frame. Defaults to a screenshot-friendly 9:16 size. */
  widthClassName?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  imageUrl,
  className = "",
  fit = 'cover',
  widthClassName = "w-[200px] sm:w-[220px] md:w-[240px]",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setTilt({
      x: (Math.random() - 0.5) * 24,
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
      {/* Glow */}
      <div 
        className="absolute -inset-6 blur-[25px] rounded-[3.5rem] transform-gpu will-change-transform"
        style={{ background: 'radial-gradient(ellipse 100% 100%, rgba(0, 212, 255, 0.45) 0%, rgba(0, 191, 230, 0.3) 40%, rgba(0, 169, 204, 0.15) 70%, transparent 100%)' }}
      />

      {/* Phone frame — 9:19.5 ratio (modern iPhone-like), screenshot fills nicely */}
      <div
        className={`relative ${widthClassName} aspect-[9/19.5] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2.75rem] p-[6px] shadow-2xl border border-gray-700/40 phone-frame-solid`}
      >
        <div className="w-full h-full bg-black rounded-[2.35rem] overflow-hidden relative">
          {/* Dynamic-island style notch — smaller, doesn't cover content */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 border border-gray-900/60" />

          <div className="relative w-full h-full bg-black">
            <img
              src={imageUrl}
              alt="App Screenshot"
              className={`w-full h-full ${fit === 'cover' ? 'object-cover object-top' : 'object-contain'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
