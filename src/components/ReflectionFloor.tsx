import React from 'react';

/**
 * Wet/reflective floor effect for the bottom of hero sections.
 * Renders a thin cyan reflective sheen + subtle horizon line.
 */
export const ReflectionFloor: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-40 md:h-52 z-[3] pointer-events-none ${className}`}
    >
      {/* Horizon glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(0,188,212,0.55) 40%, rgba(0,212,255,0.7) 50%, rgba(0,188,212,0.55) 60%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0,188,212,0.45)',
        }}
      />
      {/* Reflective sheen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,188,212,0.10) 0%, rgba(0,188,212,0.04) 35%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default ReflectionFloor;
