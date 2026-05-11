import React from 'react';

/**
 * Diagonal cyan light-leak overlay across hero sections.
 * Pure CSS — no asset cost. Place inside a relative+overflow-hidden parent.
 */
export const HeroLightBeam: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-[2] pointer-events-none mix-blend-screen ${className}`}
      style={{
        background:
          'linear-gradient(115deg, transparent 38%, rgba(0,188,212,0.10) 48%, rgba(0,212,255,0.18) 52%, rgba(0,188,212,0.10) 56%, transparent 66%)',
        filter: 'blur(6px)',
      }}
    />
  );
};

export default HeroLightBeam;
