import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type StepIconKind = 'choose' | 'walk' | 'drink' | 'give';

interface Props {
  kind: StepIconKind;
  size?: number;
}

const STROKE = 'hsl(var(--nf-primary, 186 100% 41%))';
const STROKE_SOFT = 'hsl(var(--nf-primary, 186 100% 41%) / 0.45)';
const FILL_SOFT = 'hsl(var(--nf-primary, 186 100% 41%) / 0.18)';

/* ---------- CHOOSE: térkép + lepottyanó pin + radar ---------- */
const ChooseChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    <g stroke={STROKE_SOFT} strokeWidth={1} fill="none">
      <path d="M4 50 L60 50" />
      <path d="M4 56 L60 56" />
      <path d="M18 44 L18 62" />
      <path d="M46 44 L46 62" />
    </g>
    {!reduce && [0, 1].map((i) => (
      <motion.circle
        key={i}
        cx="32" cy="52" r="6"
        fill="none" stroke={STROKE} strokeWidth="1.2"
        initial={{ scale: 0.4, opacity: 0.8 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
        style={{ transformOrigin: '32px 52px' }}
      />
    ))}
    <motion.g
      animate={reduce ? undefined : { y: [-26, 0, 0, 0, -26], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeIn', times: [0, 0.25, 0.5, 0.85, 1] }}
    >
      <path
        d="M32 14 C23 14 17 20 17 28 C17 38 32 54 32 54 C32 54 47 38 47 28 C47 20 41 14 32 14 Z"
        fill={FILL_SOFT} stroke={STROKE} strokeWidth="2.4" strokeLinejoin="round"
      />
      <circle cx="32" cy="28" r="4.5" fill={STROKE} />
    </motion.g>
  </svg>
);

/* ---------- WALK: sétáló ember, vízszintesen halad ---------- */
const WalkChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* scrolling ground */}
    <motion.g
      animate={reduce ? undefined : { x: [0, -16] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={-8 + i * 16} y1="58" x2={-2 + i * 16} y2="58"
          stroke={STROKE_SOFT} strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </motion.g>

    {/* walker traverses left to right */}
    <motion.g
      animate={reduce ? undefined : { x: [-32, 32] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
    >
      {/* bobbing body */}
      <motion.g
        animate={reduce ? undefined : { y: [0, -1.5, 0, -1.5, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* head */}
        <circle cx="32" cy="14" r="5.5" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2.2" />
        {/* torso */}
        <path d="M32 19.5 L31 36" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* back arm */}
        <motion.path
          d="M31 24 Q33 30 30 35"
          stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '31px 24px' }}
          animate={reduce ? undefined : { rotate: [30, -30, 30] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* front arm */}
        <motion.path
          d="M31 24 Q29 30 32 35"
          stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '31px 24px' }}
          animate={reduce ? undefined : { rotate: [-30, 30, -30] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* back leg with knee bend */}
        <motion.path
          d="M31 36 Q33 44 30 52"
          stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '31px 36px' }}
          animate={reduce ? undefined : { rotate: [-28, 28, -28] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* front leg with knee bend */}
        <motion.path
          d="M31 36 Q29 44 32 52"
          stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '31px 36px' }}
          animate={reduce ? undefined : { rotate: [28, -28, 28] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* dust puffs */}
      {!reduce && [0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={28} cy={54} r={1.2}
          fill={STROKE_SOFT}
          animate={{ opacity: [0.6, 0], x: [0, -6], y: [0, -2] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.4 }}
        />
      ))}
    </motion.g>
  </svg>
);

/* ---------- DRINK: ember 2 kézzel emeli pohárt szájhoz ---------- */
const DrinkChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* head + body tilts back when drinking */}
    <motion.g
      animate={reduce ? undefined : { rotate: [0, 0, -10, -10, 0, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.45, 0.6, 0.8, 1] }}
      style={{ transformOrigin: '32px 40px' }}
    >
      {/* head */}
      <circle cx="32" cy="16" r="7" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2.2" />
      {/* mouth */}
      <line x1="29" y1="19" x2="35" y2="19" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
      {/* shoulders + torso */}
      <path d="M20 32 Q32 28 44 32 L42 50 L22 50 Z" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2.2" strokeLinejoin="round" />

      {/* glass + both arms — lifts up to mouth */}
      <motion.g
        animate={reduce ? undefined : { y: [0, 0, -12, -12, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.45, 0.6, 0.8, 1] }}
      >
        {/* left arm reaching glass */}
        <path d="M22 34 L26 40 L28 46" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* right arm reaching glass */}
        <path d="M42 34 L38 40 L36 46" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* cocktail glass (triangular) */}
        <path d="M26 40 L38 40 L32 50 Z" fill="none" stroke={STROKE} strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="32" y1="50" x2="32" y2="56" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="56" x2="36" y2="56" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />

        {/* liquid level drops while drinking */}
        <motion.path
          d="M27 42 L37 42 L32 49 Z"
          fill={STROKE} opacity="0.7"
          animate={reduce ? undefined : {
            d: [
              'M27 42 L37 42 L32 49 Z',
              'M27 42 L37 42 L32 49 Z',
              'M29.5 46 L34.5 46 L32 49 Z',
              'M29.5 46 L34.5 46 L32 49 Z',
              'M27 42 L37 42 L32 49 Z',
              'M27 42 L37 42 L32 49 Z',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.65, 0.85, 1] }}
        />

        {/* cherry/garnish */}
        <circle cx="34" cy="39" r="1.4" fill={STROKE} />
        <line x1="34" y1="39" x2="36" y2="36" stroke={STROKE} strokeWidth="1" />
      </motion.g>
    </motion.g>

    {/* sparkles above glass */}
    {!reduce && [0, 1, 2].map((i) => (
      <motion.g
        key={i}
        animate={{ opacity: [0, 1, 0], y: [0, -6, -12], scale: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.3 + i * 0.4 }}
        style={{ transform: `translateX(${(i - 1) * 6}px)` }}
      >
        <path d="M32 8 L33 10 L35 10.5 L33 11 L32 13 L31 11 L29 10.5 L31 10 Z" fill={STROKE} />
      </motion.g>
    ))}
  </svg>
);

/* ---------- GIVE: két ember, egyik átad ajándékot/szívet ---------- */
const GiveChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* GIVER (left) — breathing bob */}
    <motion.g
      animate={reduce ? undefined : { y: [0, -0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="14" cy="20" r="4.5" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2" />
      <path d="M8 36 Q14 32 20 36 L19 48 L9 48 Z" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      {/* extended arm forward */}
      <path d="M18 36 Q24 34 28 34" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </motion.g>

    {/* RECEIVER (right) — breathing bob + nod when gift arrives */}
    <motion.g
      animate={reduce ? undefined : { y: [0, -0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    >
      <motion.circle
        cx="50" cy="20" r="4.5"
        fill={FILL_SOFT} stroke={STROKE} strokeWidth="2"
        animate={reduce ? undefined : { cy: [20, 20, 21.5, 20] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.55, 0.65, 0.8] }}
      />
      <path d="M44 36 Q50 32 56 36 L55 48 L45 48 Z" fill={FILL_SOFT} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      {/* open hand reaching */}
      <path d="M46 36 Q40 34 36 34" stroke={STROKE} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="34" r="1.6" fill="none" stroke={STROKE} strokeWidth="1.6" />
    </motion.g>

    {/* heart traveling from giver hand to receiver hand */}
    <motion.g
      animate={reduce ? undefined : {
        x: [0, 8, 8, 0],
        opacity: [0, 1, 1, 0],
        scale: [0.7, 1, 1.15, 0.7],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.6, 0.9] }}
      style={{ transformOrigin: '32px 32px' }}
    >
      <path
        d="M28 30 C26 26 22 28 24 32 C25 34 28 36 28 36 C28 36 31 34 32 32 C34 28 30 26 28 30 Z"
        fill={STROKE} stroke={STROKE} strokeWidth="1"
      />
    </motion.g>

    {/* +1 coin pops above receiver when gift arrives */}
    {!reduce && (
      <motion.g
        animate={{ opacity: [0, 0, 1, 0], y: [0, 0, -10, -16] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', times: [0, 0.55, 0.75, 1] }}
      >
        <circle cx="50" cy="10" r="3.4" fill={FILL_SOFT} stroke={STROKE} strokeWidth="1.4" />
        <text x="50" y="11.6" textAnchor="middle" fontSize="4.5" fill={STROKE} fontWeight="700">+1</text>
      </motion.g>
    )}
  </svg>
);

export const AnimatedStepIcon: React.FC<Props> = ({ kind, size = 28 }) => {
  const reduce = !!useReducedMotion();
  const dim = Math.round(size * 2);
  const Char =
    kind === 'choose' ? ChooseChar :
    kind === 'walk' ? WalkChar :
    kind === 'drink' ? DrinkChar :
    GiveChar;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
      <Char reduce={reduce} />
    </div>
  );
};

export default AnimatedStepIcon;
