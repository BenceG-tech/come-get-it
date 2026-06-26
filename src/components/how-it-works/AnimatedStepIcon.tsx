import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Footprints, Wine, HeartHandshake } from 'lucide-react';

export type StepIconKind = 'choose' | 'walk' | 'drink' | 'give';

interface Props {
  kind: StepIconKind;
  size?: number;
}

export const AnimatedStepIcon: React.FC<Props> = ({ kind, size = 28 }) => {
  const reduce = useReducedMotion();
  const cls = 'text-nf-primary';
  const stroke = 1.5;

  if (kind === 'choose') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* radar pulses */}
        {!reduce && [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-nf-primary/60"
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
          />
        ))}
        <motion.div
          animate={reduce ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MapPin className={cls} size={size} strokeWidth={stroke} />
        </motion.div>
      </div>
    );
  }

  if (kind === 'walk') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <motion.div
          animate={reduce ? undefined : { x: [0, 2, 0, -2, 0], opacity: [0.55, 1, 0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Footprints className={cls} size={size} strokeWidth={stroke} />
        </motion.div>
      </div>
    );
  }

  if (kind === 'drink') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* bubble */}
        {!reduce && (
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-nf-primary"
            style={{ width: 4, height: 4, bottom: '55%' }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -10, opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.div
          animate={reduce ? undefined : { rotate: [-4, 4, -4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 90%' }}
        >
          <Wine className={cls} size={size} strokeWidth={stroke} />
        </motion.div>
      </div>
    );
  }

  // give
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full bg-nf-primary/30 blur-md"
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <HeartHandshake className={cls} size={size} strokeWidth={stroke} />
      </motion.div>
    </div>
  );
};

export default AnimatedStepIcon;
