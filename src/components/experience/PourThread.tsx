import React, { useEffect, useRef } from 'react';
import { CocktailGlass, applyCocktail } from '@/components/experience/CocktailGlass';
import { usePrefersReducedMotion } from '@/components/experience/useStickyScroll';
import './Cocktail.css';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const span = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
// The glass art is 240×318 viewBox units; the rim sits 14 units below its top edge.
const GLASS_RATIO = 318 / 240, RIM = 14 / 318;

/**
 * The homepage "pour": a bottle at the top edge pours while the visitor scrolls, the glass in the
 * corner below it fills with the page, and at the signup form it glides into [data-cocktail-target],
 * where the ice, cucumber ribbon and lime go in. Everything is written to the DOM per frame; React never re-renders.
 */
export const PourThread: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current, glass = glassRef.current, stream = streamRef.current, bottle = bottleRef.current;
    if (!root || !glass || !stream || !bottle) return;
    let frame = 0, idle = 0, moving = false;
    let target = document.querySelector<HTMLElement>('[data-cocktail-target]');
    target?.classList.add('is-poured');

    const draw = () => {
      frame = 0;
      if (!target?.isConnected) { target = document.querySelector<HTMLElement>('[data-cocktail-target]'); target?.classList.add('is-poured'); }
      const vh = innerHeight, vw = innerWidth, small = vw < 768;
      // Phones: left edge, above the full-width sticky CTA bar. Desktop: right edge, above the support button.
      const cornerW = small ? 44 : 64, cornerX = small ? 2 : vw - cornerW - 22;
      const cornerY = vh - cornerW * GLASS_RATIO - (small ? 100 : 96);
      const rect = target?.getBoundingClientRect();
      // Page progress until the signup slot enters the viewport, then the docking progress.
      const dockStart = rect ? rect.top + scrollY - vh : document.documentElement.scrollHeight - vh;
      const p = clamp01(scrollY / Math.max(1, dockStart));
      const t = rect ? clamp01((vh - rect.top) / (vh * 0.5)) : 0;
      const w = rect ? cornerW + (rect.width - cornerW) * t : cornerW;
      const x = rect ? cornerX + (rect.left - cornerX) * t : cornerX;
      const y = rect ? cornerY + (rect.top + (rect.height - rect.width * GLASS_RATIO) - cornerY) * t : cornerY;
      glass.style.width = `${w}px`;
      glass.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      applyCocktail(svgRef.current, { fill: 0.78 * p + 0.08 * t, ice: span(t, 0.05, 0.45), ribbon: span(t, 0.35, 0.8), lime: span(t, 0.7, 1) });

      const pouring = moving && scrollY > 4 && t < 0.35;
      const mouthY = small ? 82 : 158;
      const rimY = y + w * GLASS_RATIO * RIM;
      stream.style.left = `${(x + w / 2 - 1.5).toFixed(1)}px`;
      stream.style.top = `${mouthY}px`;
      stream.style.height = `${Math.max(0, rimY - mouthY + 6).toFixed(1)}px`;
      stream.style.opacity = pouring ? '1' : '0';
      bottle.style.left = `${(x + w / 2 - (small ? 22 : 27)).toFixed(1)}px`;
      bottle.style.opacity = String(1 - span(t, 0.4, 0.9));
      bottle.classList.toggle('is-pouring', pouring);
      // Fades in as the hero leaves, so it never doubles the hero's own glass.
      root.style.opacity = String(span(scrollY, 0, vh * 0.4));
      root.classList.toggle('is-docked', t >= 1);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const onScroll = () => {
      moving = true; schedule();
      clearTimeout(idle); idle = window.setTimeout(() => { moving = false; schedule(); }, 260);
    };
    draw();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      removeEventListener('scroll', onScroll); removeEventListener('resize', schedule);
      cancelAnimationFrame(frame); clearTimeout(idle); target?.classList.remove('is-poured');
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={rootRef} className="pour-thread" aria-hidden="true">
    <div ref={bottleRef} className="pour-bottle"><Bottle /></div>
    <div ref={streamRef} className="pour-stream" />
    <div ref={glassRef} className="pour-glass"><CocktailGlass ref={svgRef} state={{ fill: 0 }} /></div>
  </div>;
};

const Bottle: React.FC = () => <svg viewBox="0 0 60 170" focusable="false">
  <defs><linearGradient id="pour-bottle-g" x1="0" x2="1"><stop offset="0" stopColor="#0d3a40" /><stop offset=".5" stopColor="#15585f" /><stop offset="1" stopColor="#082528" /></linearGradient></defs>
  <path d="M22 2h16v8h-2v34c0 10 20 18 20 40v76c0 5-4 8-9 8H13c-5 0-9-3-9-8V84c0-22 20-30 20-40V10h-2z" fill="url(#pour-bottle-g)" stroke="#5fe3f0" strokeOpacity=".55" />
  <rect x="9" y="100" width="42" height="40" rx="3" fill="#050505" stroke="#00bcd4" />
  <text x="30" y="125" fontFamily="Anton, Impact, sans-serif" fontSize="11" fill="#00bcd4" textAnchor="middle">CGI</text>
  <path d="M12 90c0 30 0 60 2 80" stroke="#fff" strokeOpacity=".25" strokeWidth="3" fill="none" />
</svg>;
