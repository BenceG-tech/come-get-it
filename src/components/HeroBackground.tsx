import React from 'react';
import budapestNight from '@/assets/budapest-night-hero.jpg';

/**
 * Shared hero background — masked Budapest middle band + dark fades + cyan radial accents.
 * Matches the homepage hero look.
 */
export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-x-0"
        style={{
          top: '30%',
          bottom: '20%',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        }}
      >
        <img
          src={budapestNight}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-55"
          style={{ objectPosition: 'center 55%' }}
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          // @ts-ignore - fetchpriority is a valid HTML attribute
          fetchpriority="high"
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-nf-background via-nf-background/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-nf-background via-nf-background/85 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 75% 50%, rgba(0,188,212,0.20) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 20% 55%, rgba(0,151,167,0.10) 0%, transparent 65%)',
        }}
      />
    </div>
  );
};

interface PhoneGlowWrapperProps {
  children: React.ReactNode;
}

export const PhoneGlowWrapper: React.FC<PhoneGlowWrapperProps> = ({ children }) => {
  return (
    <div className="relative flex justify-center items-center min-h-[520px] lg:min-h-[580px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,188,212,0.32) 0%, rgba(0,188,212,0.12) 45%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
