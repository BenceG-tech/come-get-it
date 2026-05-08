import React from 'react';
import logoSrc from '@/assets/come-get-it-logo.png';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <img
    src={logoSrc}
    alt="Come Get It"
    className={cn('h-9 md:h-10 w-auto select-none', className)}
    draggable={false}
  />
);

export default Logo;
