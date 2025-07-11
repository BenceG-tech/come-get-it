import React, { ReactElement, cloneElement } from 'react';
import { cn } from '@/lib/utils';

interface StaggeredAnimationProps {
  children: ReactElement[];
  delay?: number;
  className?: string;
  stagger?: 'fade' | 'slide' | 'scale';
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  delay = 100,
  className = "",
  stagger = 'fade'
}) => {
  const getAnimationClass = (index: number) => {
    const baseDelay = index * delay;
    
    switch (stagger) {
      case 'slide':
        return `animate-[slide-in_0.6s_ease-out_${baseDelay}ms_both]`;
      case 'scale':
        return `animate-[scale-in_0.5s_ease-out_${baseDelay}ms_both]`;
      default:
        return `animate-[fade-in_0.6s_ease-out_${baseDelay}ms_both]`;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {children.map((child, index) =>
        cloneElement(child, {
          key: child.key || index,
          className: cn(
            child.props.className,
            getAnimationClass(index),
            "opacity-0"
          ),
          style: {
            ...child.props.style,
            animationFillMode: 'both'
          }
        })
      )}
    </div>
  );
};

// Animation styles are now included in index.css