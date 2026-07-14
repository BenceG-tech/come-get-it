
import React, { useState } from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
  fit?: 'cover' | 'contain' | 'auto';
  widthClassName?: string;
}

const FRAME_RATIO = 9 / 19.5;

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  imageUrl,
  className = "",
  fit = 'auto',
  widthClassName = "w-[200px] sm:w-[220px] md:w-[240px]",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [autoFit, setAutoFit] = useState<'cover' | 'contain'>('cover');

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const ratio = w / h;
    // if image ratio differs from frame by >15%, fall back to contain so nothing is cropped
    const diff = Math.abs(ratio - FRAME_RATIO) / FRAME_RATIO;
    setAutoFit(diff > 0.15 ? 'contain' : 'cover');
  };

  const resolvedFit: 'cover' | 'contain' = fit === 'auto' ? autoFit : fit;

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
          <div className="relative w-full h-full bg-black">
            <img
              src={imageUrl}
              alt="App Screenshot"
              onLoad={handleImgLoad}
              className={`w-full h-full ${resolvedFit === 'cover' ? 'object-cover object-center' : 'object-contain'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
