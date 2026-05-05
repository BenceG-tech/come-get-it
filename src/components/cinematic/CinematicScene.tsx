import React, { useRef } from 'react';
import { useScroll, MotionValue } from 'framer-motion';

interface CinematicSceneProps {
  className?: string;
  id?: string;
  children: (progress: MotionValue<number>) => React.ReactNode;
}

/**
 * Wraps a section and exposes its scroll progress to children.
 * Children receive a MotionValue<number> 0..1 representing how much
 * of the section has been scrolled through the viewport.
 */
export const CinematicScene: React.FC<CinematicSceneProps> = ({ className = '', id, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} id={id} className={`relative ${className}`}>
      {children(scrollYProgress)}
    </div>
  );
};
