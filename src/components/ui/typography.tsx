
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroTitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn("text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6", className)}>
    {children}
  </h1>
);

export const HeroSubtitle: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn("text-lg md:text-xl text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed", className)}>
    {children}
  </p>
);

export const SectionTitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn("text-3xl md:text-4xl font-anton text-white mb-4", className)}>
    {children}
  </h2>
);

export const SectionSubtitle: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn("text-base md:text-lg text-electric-100 mb-8 leading-relaxed", className)}>
    {children}
  </p>
);

export const CTATitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn("text-4xl md:text-5xl font-anton text-white mb-6", className)}>
    {children}
  </h2>
);
