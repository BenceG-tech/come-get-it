import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion, MotionValue } from 'framer-motion';

type Depth = 'background' | 'midground' | 'foreground';

interface SceneLayerProps {
  depth?: Depth;
  speed?: number;       // negative = moves up faster, positive = moves down
  zoom?: number;        // additional scale at mid scroll (0 = none)
  maxBlur?: number;     // px blur applied at scene edges (depth of field)
  fade?: boolean;       // fade in/out at edges
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  scrollProgress?: MotionValue<number>;
}

const depthDefaults: Record<Depth, { speed: number; zoom: number; maxBlur: number }> = {
  background: { speed: -60,  zoom: 0.08, maxBlur: 6 },
  midground:  { speed: -120, zoom: 0.05, maxBlur: 2 },
  foreground: { speed: -200, zoom: 0.10, maxBlur: 0 },
};

export const SceneLayer: React.FC<SceneLayerProps> = ({
  depth = 'foreground',
  speed,
  zoom,
  maxBlur,
  fade = false,
  className = '',
  style,
  children,
  scrollProgress,
}) => {
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement>(null);
  const local = useScroll({ target: localRef, offset: ['start end', 'end start'] });
  const progress = scrollProgress ?? local.scrollYProgress;

  const d = depthDefaults[depth];
  const _speed = speed ?? d.speed;
  const _zoom = zoom ?? d.zoom;
  const _blur = maxBlur ?? d.maxBlur;

  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, _speed]);
  const scale = useTransform(progress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1, 1 + _zoom, 1]);
  const blurPx = useTransform(progress, [0, 0.5, 1], reduce ? [0, 0, 0] : [_blur, 0, _blur]);
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], fade ? [0, 1, 1, 0] : [1, 1, 1, 1]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      ref={localRef}
      className={`will-change-transform transform-gpu ${className}`}
      style={{ y, scale, filter, opacity, ...style }}
    >
      {children}
    </motion.div>
  );
};
