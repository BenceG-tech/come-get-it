import React from 'react';
import { cn } from '@/lib/utils';

interface GlassImageCardProps {
  bgImage?: string;
  bgPosition?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Glassmorphic card with a faded image backdrop (cyan-tinted overlay + side mask).
 * Inspired by the rewards-features cards: image breathes through at ~14% opacity,
 * lifts to ~28% on hover.
 */
export const GlassImageCard: React.FC<GlassImageCardProps> = ({
  bgImage,
  bgPosition = 'center',
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_25px_70px_-10px_rgba(0,188,212,0.5)]',
        className,
      )}
    >
      {bgImage && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.55] group-hover:opacity-[0.8] transition-opacity duration-500"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: bgPosition,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(3,7,13,0.55) 0%, rgba(3,7,13,0.25) 55%, rgba(0,188,212,0.08) 100%)',
            }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassImageCard;
