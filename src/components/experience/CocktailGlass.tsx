import React, { forwardRef, useId, useLayoutEffect, useRef } from 'react';
import './Cocktail.css';

/** How far each part of the drink is built, all 0…1. */
export interface CocktailState {
  fill?: number;
  ice?: number;
  ribbon?: number;
  lime?: number;
  /** Pour stream visibility. */
  pour?: number;
}

export const FULL_COCKTAIL: CocktailState = { fill: 0.86, ice: 1, ribbon: 1, lime: 1 };

// Copa bowl; the liquid surface travels between TOP (full) and BOTTOM (empty).
const BOWL = 'M66 58 C 30 104, 28 196, 120 208 C 212 196, 210 104, 174 58 Z';
const TOP = 86, BOTTOM = 204;
const RIBBON = 'M78 66 C 44 112, 50 184, 120 192 C 190 184, 196 112, 162 66';
// Ice cubes: [x, resting tilt, lowest y]
const CUBES = [[92, -14, 186], [146, 11, 184], [122, 4, 170]] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** Writes a drink state straight to the SVG, so scroll-driven callers never re-render React. */
export function applyCocktail(root: Element | null, s: CocktailState) {
  if (!root) return;
  const fill = clamp01(s.fill ?? 0);
  const level = BOTTOM - (BOTTOM - TOP) * fill;
  const liquid = root.querySelector<SVGGElement>('.cg-liquid');
  if (liquid) {
    liquid.setAttribute('transform', `translate(0 ${level.toFixed(1)})`);
    liquid.style.opacity = fill > 0.005 ? '1' : '0';
  }
  const ice = easeOut(s.ice ?? 0);
  root.querySelectorAll<SVGGElement>('.cg-cube').forEach((cube, i) => {
    const [x, tilt, floor] = CUBES[i];
    const rest = Math.min(floor, level + 10 + i * 7);
    const y = -40 + (rest + 40) * ice;
    cube.setAttribute('transform', `translate(${x} ${y.toFixed(1)}) rotate(${(tilt + (1 - ice) * 40).toFixed(1)})`);
    cube.style.opacity = ice > 0 ? '1' : '0';
  });
  const ribbon = String(1 - clamp01(s.ribbon ?? 0));
  root.querySelectorAll<SVGPathElement>('.cg-ribbon').forEach(path => { path.style.strokeDashoffset = ribbon; });
  const l = easeOut(s.lime ?? 0);
  const lime = root.querySelector<SVGGElement>('.cg-lime');
  if (lime) {
    lime.setAttribute('transform', `translate(100 ${(-40 + 190 * l).toFixed(1)}) rotate(${(-90 + 75 * l).toFixed(1)})`);
    lime.style.opacity = l > 0 ? '1' : '0';
  }
  const stream = root.querySelector<SVGRectElement>('.cg-stream');
  if (stream) {
    const pour = clamp01(s.pour ?? 0);
    stream.setAttribute('height', pour > 0 ? String(level + 400) : '0');
    stream.style.opacity = String(pour);
  }
  const pool = root.querySelector<SVGEllipseElement>('.cg-pool');
  if (pool) pool.style.opacity = String(0.1 + 0.25 * fill);
}

interface CocktailGlassProps {
  className?: string;
  /** Initial state; scroll-driven callers update it later with applyCocktail. */
  state?: CocktailState;
}

/** Gin-tonic copa glass with stem and foot, drawn in SVG so every part can be animated. */
export const CocktailGlass = forwardRef<SVGSVGElement, CocktailGlassProps>(({ className = '', state = FULL_COCKTAIL }, ref) => {
  const uid = useId().replace(/:/g, '');
  const local = useRef<SVGSVGElement | null>(null);
  const setRef = (el: SVGSVGElement | null) => {
    local.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  };
  useLayoutEffect(() => { applyCocktail(local.current, state); }, [state]);
  const id = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  return <svg ref={setRef} className={`cg-glass ${className}`} viewBox="0 44 240 318" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={id('bowl')}><path d={BOWL} transform="translate(120 140) scale(.965) translate(-120 -140)" /></clipPath>
      <linearGradient id={id('liquid')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ff4ff" stopOpacity=".78" />
        <stop offset=".45" stopColor="#00c2d6" stopOpacity=".66" />
        <stop offset="1" stopColor="#00596b" stopOpacity=".9" />
      </linearGradient>
      <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity=".16" />
        <stop offset=".25" stopColor="#fff" stopOpacity=".03" />
        <stop offset=".8" stopColor="#fff" stopOpacity=".02" />
        <stop offset="1" stopColor="#fff" stopOpacity=".14" />
      </linearGradient>
      <linearGradient id={id('stream')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#bff8ff" stopOpacity=".9" />
        <stop offset="1" stopColor="#00bcd4" stopOpacity=".75" />
      </linearGradient>
      <radialGradient id={id('foot')} cx=".5" cy=".4" r=".6">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset="1" stopColor="#fff" stopOpacity=".05" />
      </radialGradient>
    </defs>
    <rect className="cg-stream" x="117" y="-400" width="6" height="0" rx="3" fill={url('stream')} />
    <ellipse className="cg-pool" cx="120" cy="352" rx="70" ry="10" fill="#00bcd4" opacity=".22" />
    {/* stem and foot */}
    <path d="M115.5 210 L124.5 210 L123.2 334 C 124 341, 152 342, 176 346 L64 346 C 88 342, 116 341, 116.8 334 Z" fill={url('glass')} stroke="#fff" strokeOpacity=".38" strokeWidth="1.2" />
    <path d="M58 347 L58 351 C 70 360, 170 360, 182 351 L182 347 Z" fill="#fff" fillOpacity=".1" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    <ellipse cx="120" cy="347" rx="62" ry="9.5" fill={url('foot')} stroke="#fff" strokeOpacity=".6" strokeWidth="1.3" />
    <path d="M74 349 C 96 355, 144 355, 166 349" stroke="#fff" strokeOpacity=".7" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <ellipse cx="120" cy="214" rx="7" ry="3.5" fill="#fff" fillOpacity=".2" stroke="#fff" strokeOpacity=".45" strokeWidth="1" />
    <line x1="118.6" y1="219" x2="118.2" y2="334" stroke="#fff" strokeOpacity=".55" strokeWidth="1.4" />
    {/* drink */}
    <g clipPath={url('bowl')}>
      <g className="cg-liquid">
        <rect x="20" y="0" width="200" height="240" fill={url('liquid')} />
        <ellipse cx="120" cy="0" rx="92" ry="6" fill="#bff9ff" opacity=".75" />
        <g className="cg-bubbles" fill="#e8feff">
          <circle cx="92" cy="200" r="1.6" /><circle cx="104" cy="190" r="1.1" /><circle cx="131" cy="205" r="1.4" />
          <circle cx="146" cy="186" r="1" /><circle cx="118" cy="196" r="1.8" /><circle cx="160" cy="170" r="1.2" />
          <circle cx="80" cy="160" r="1" /><circle cx="138" cy="150" r="1.3" />
        </g>
      </g>
      <g fill="#fff" fillOpacity=".22" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2">
        <g className="cg-cube"><rect x="-15" y="-14" width="30" height="28" rx="6" /></g>
        <g className="cg-cube"><rect x="-17" y="-15" width="34" height="30" rx="7" /></g>
        <g className="cg-cube"><rect x="-13" y="-12" width="26" height="24" rx="5" /></g>
      </g>
      <path className="cg-ribbon" pathLength={1} d={RIBBON} fill="none" stroke="#6fae3e" strokeWidth="13" strokeLinecap="round" opacity=".9" />
      <path className="cg-ribbon" pathLength={1} d={RIBBON} fill="none" stroke="#d8f0b0" strokeWidth="7" strokeLinecap="round" opacity=".8" />
      <g className="cg-lime">
        <circle r="27" fill="#b9de6a" stroke="#6fa83a" strokeWidth="3.5" />
        <circle r="22" fill="#d7ef9a" />
        <g stroke="#a8cf55" strokeWidth="1.6">
          <line x1="0" y1="-18" x2="0" y2="18" /><line x1="-18" y1="0" x2="18" y2="0" />
          <line x1="-12.7" y1="-12.7" x2="12.7" y2="12.7" /><line x1="-12.7" y1="12.7" x2="12.7" y2="-12.7" />
        </g>
        <circle r="2.4" fill="#eef8d4" />
      </g>
    </g>
    {/* bowl */}
    <path d={BOWL} fill={url('glass')} stroke="#fff" strokeOpacity=".45" strokeWidth="1.4" />
    <path d="M58 90 C 46 130, 54 172, 84 192" stroke="#fff" strokeOpacity=".42" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M190 104 C 196 128, 192 150, 182 166" stroke="#fff" strokeOpacity=".18" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="120" cy="58" rx="54" ry="6" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" />
  </svg>;
});
CocktailGlass.displayName = 'CocktailGlass';
