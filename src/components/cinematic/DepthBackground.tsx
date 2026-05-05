import React from 'react';

interface DepthBackgroundProps {
  variant?: 'teal' | 'violet' | 'amber';
  className?: string;
}

const palettes = {
  teal:   ['rgba(0,212,255,0.18)', 'rgba(0,120,160,0.12)'],
  violet: ['rgba(140,90,255,0.16)', 'rgba(60,30,140,0.10)'],
  amber:  ['rgba(255,170,60,0.14)', 'rgba(180,80,20,0.10)'],
};

export const DepthBackground: React.FC<DepthBackgroundProps> = ({ variant = 'teal', className = '' }) => {
  const [c1, c2] = palettes[variant];
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(60% 50% at 20% 20%, ${c1} 0%, transparent 60%),
          radial-gradient(50% 40% at 80% 70%, ${c2} 0%, transparent 65%),
          radial-gradient(80% 60% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)
        `,
      }}
    >
      {/* faint star/light particles */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.5px)',
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
    </div>
  );
};
