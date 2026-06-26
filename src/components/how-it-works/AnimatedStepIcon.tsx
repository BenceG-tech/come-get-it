import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type StepIconKind = 'choose' | 'walk' | 'drink' | 'give';

interface Props {
  kind: StepIconKind;
  size?: number;
}

const STROKE = 'hsl(var(--nf-primary, 186 100% 41%))';
const STROKE_SOFT = 'hsl(var(--nf-primary, 186 100% 41%) / 0.45)';

/* ---------- CHOOSE: térkép + lepottyanó pin + radar ---------- */
const ChooseChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* map grid */}
    <g stroke={STROKE_SOFT} strokeWidth={1} fill="none">
      <path d="M6 46 L58 46" />
      <path d="M6 52 L58 52" />
      <path d="M20 40 L20 58" />
      <path d="M44 40 L44 58" />
    </g>
    {/* radar pulses */}
    {!reduce && [0, 1].map((i) => (
      <motion.circle
        key={i}
        cx="32"
        cy="48"
        r="6"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.2"
        initial={{ scale: 0.4, opacity: 0.8 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
        style={{ transformOrigin: '32px 48px' }}
      />
    ))}
    {/* pin drops */}
    <motion.g
      animate={reduce ? undefined : { y: [-22, 0, 0, 0, -22], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeIn', times: [0, 0.25, 0.5, 0.85, 1] }}
    >
      <path
        d="M32 18 C25 18 20 23 20 30 C20 38 32 50 32 50 C32 50 44 38 44 30 C44 23 39 18 32 18 Z"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="30" r="4" fill={STROKE} />
    </motion.g>
  </svg>
);

/* ---------- WALK: sétáló alak oldalnézetből ---------- */
const WalkChar: React.FC<{ reduce: boolean }> = ({ reduce }) => {
  const swing = reduce ? 0 : 1;
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
      {/* ground line scrolling */}
      <motion.g
        animate={reduce ? undefined : { x: [0, -12] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 12, 24, 36, 48, 60, 72].map((x) => (
          <line key={x} x1={x} y1="58" x2={x + 6} y2="58" stroke={STROKE_SOFT} strokeWidth="1.4" />
        ))}
      </motion.g>

      {/* body bob */}
      <motion.g
        animate={reduce ? undefined : { y: [0, -1.5, 0, -1.5, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* head */}
        <circle cx="32" cy="14" r="5" fill="none" stroke={STROKE} strokeWidth="2" />
        {/* torso */}
        <line x1="32" y1="19" x2="32" y2="38" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />

        {/* arms */}
        <motion.line
          x1="32" y1="23" x2="32" y2="34"
          stroke={STROKE} strokeWidth="2.2" strokeLinecap="round"
          style={{ transformOrigin: '32px 23px' }}
          animate={reduce ? undefined : { rotate: [25 * swing, -25 * swing, 25 * swing] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="32" y1="23" x2="32" y2="34"
          stroke={STROKE} strokeWidth="2.2" strokeLinecap="round"
          style={{ transformOrigin: '32px 23px' }}
          animate={reduce ? undefined : { rotate: [-25 * swing, 25 * swing, -25 * swing] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* legs */}
        <motion.line
          x1="32" y1="38" x2="32" y2="52"
          stroke={STROKE} strokeWidth="2.4" strokeLinecap="round"
          style={{ transformOrigin: '32px 38px' }}
          animate={reduce ? undefined : { rotate: [-22 * swing, 22 * swing, -22 * swing] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="32" y1="38" x2="32" y2="52"
          stroke={STROKE} strokeWidth="2.4" strokeLinecap="round"
          style={{ transformOrigin: '32px 38px' }}
          animate={reduce ? undefined : { rotate: [22 * swing, -22 * swing, 22 * swing] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
};

/* ---------- DRINK: fej + kéz pohárral szájhoz emelve ---------- */
const DrinkChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* head profile */}
    <path
      d="M22 30 C22 20 30 14 38 16 C44 17 46 22 46 27 L46 32 L43 33 L43 36 C43 38 41 39 39 39 L36 39 L36 44 L26 44 L26 36 C23 35 22 33 22 30 Z"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* mouth */}
    <line x1="40" y1="33" x2="44" y2="33" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />

    {/* arm + glass lifts to mouth */}
    <motion.g
      animate={reduce ? undefined : { y: [6, 0, 0, 6], rotate: [-8, 0, 0, -8] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.75, 1] }}
      style={{ transformOrigin: '52px 50px' }}
    >
      {/* arm */}
      <line x1="36" y1="40" x2="52" y2="44" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
      {/* glass */}
      <g>
        <path d="M48 30 L56 30 L54 42 L50 42 Z" fill="none" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        {/* liquid (animates height) */}
        <motion.rect
          x="49.2"
          y="33"
          width="5.6"
          height="8"
          fill={STROKE}
          opacity="0.55"
          animate={reduce ? undefined : { height: [8, 8, 2, 2], y: [33, 33, 39, 39] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.35, 0.7, 1] }}
        />
      </g>
    </motion.g>

    {/* bubbles */}
    {!reduce && [0, 1].map((i) => (
      <motion.circle
        key={i}
        cx={51 + i * 2}
        cy={32}
        r={1.2}
        fill={STROKE}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, -8, -14] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 + i * 0.5 }}
      />
    ))}
  </svg>
);

/* ---------- GIVE: két kéz nyúl egymás felé + szív + +1 érmék ---------- */
const GiveChar: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
    {/* left hand */}
    <motion.g
      animate={reduce ? undefined : { x: [-4, 0, 0, -4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.35, 0.75, 1] }}
    >
      <path
        d="M8 38 L18 34 L24 36 L24 44 L18 46 L10 44 Z"
        fill="none" stroke={STROKE} strokeWidth="2" strokeLinejoin="round"
      />
    </motion.g>
    {/* right hand */}
    <motion.g
      animate={reduce ? undefined : { x: [4, 0, 0, 4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.35, 0.75, 1] }}
    >
      <path
        d="M56 38 L46 34 L40 36 L40 44 L46 46 L54 44 Z"
        fill="none" stroke={STROKE} strokeWidth="2" strokeLinejoin="round"
      />
    </motion.g>

    {/* heart */}
    <motion.path
      d="M32 26 C30 22 24 22 24 27 C24 32 32 38 32 38 C32 38 40 32 40 27 C40 22 34 22 32 26 Z"
      fill={STROKE}
      animate={reduce ? undefined : { scale: [0, 1, 1.18, 1, 1.18, 1, 0], opacity: [0, 1, 1, 1, 1, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }}
      style={{ transformOrigin: '32px 30px' }}
    />

    {/* floating +1 coins */}
    {!reduce && [0, 1, 2].map((i) => (
      <motion.g
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, -14, -22] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.6 + i * 0.5 }}
        style={{ transform: `translateX(${(i - 1) * 8}px)` }}
      >
        <circle cx="32" cy="22" r="3.2" fill="none" stroke={STROKE} strokeWidth="1.4" />
        <text x="32" y="24" textAnchor="middle" fontSize="4.5" fill={STROKE} fontWeight="700">+1</text>
      </motion.g>
    ))}
  </svg>
);

export const AnimatedStepIcon: React.FC<Props> = ({ kind, size = 28 }) => {
  const reduce = !!useReducedMotion();
  // we render at a larger internal scale; the medallion is ~96px in the parent.
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
