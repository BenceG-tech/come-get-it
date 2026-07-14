
import React, { useState } from 'react';

interface PhoneMockupProps {
  imageUrl: string;
  className?: string;
  fit?: 'cover' | 'contain' | 'auto';
  widthClassName?: string;
}

// iPhone 17 Pro screenshot ratio: 1206 × 2622
const FRAME_RATIO = 1206 / 2622;

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  imageUrl,
  className = "",
  fit = 'auto',
  widthClassName = "w-[176px] sm:w-[206px] md:w-[232px]",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [autoFit, setAutoFit] = useState<'cover' | 'contain'>('cover');

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    const ratio = w / h;
    // Only fall back to contain when ratio really differs, otherwise fill the frame perfectly.
    const diff = Math.abs(ratio - FRAME_RATIO) / FRAME_RATIO;
    setAutoFit(diff > 0.018 ? 'contain' : 'cover');
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
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[78%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nf-primary/25 blur-3xl opacity-80"
      />

      {/* iPhone 17 Pro screenshot frame */}
      <div
        className={`relative ${widthClassName} aspect-[1206/2622] rounded-[2.15rem] sm:rounded-[2.45rem] bg-nf-surface-alt p-[4px] shadow-[0_24px_80px_rgba(0,0,0,0.65)] ring-1 ring-nf-border`}
      >
        <div className="absolute inset-[2px] rounded-[2rem] sm:rounded-[2.32rem] border border-nf-primary/15 pointer-events-none" />
        <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] sm:rounded-[2.15rem] bg-black">
          <img
            src={imageUrl}
            alt="Come Get It app képernyőkép"
            onLoad={handleImgLoad}
            className={`h-full w-full ${resolvedFit === 'cover' ? 'object-cover object-center' : 'object-contain object-center'}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};
