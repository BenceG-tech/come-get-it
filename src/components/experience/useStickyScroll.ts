import { useEffect, useRef, useState } from 'react';

export interface StickyFrame {
  /** Damped progress through the sticky section, 0…1 (drives tilt, parallax, backgrounds). */
  p: number;
  /** Raw scroll progress, 0…1. */
  raw: number;
  /** Damped pointer offset, −1…1 per axis (0 on touch devices). */
  mx: number;
  my: number;
  mobile: boolean;
}

/**
 * Scroll progress of a tall section with a sticky stage, eased with a critically damped follower
 * so every scroll-linked value glides instead of stepping. Discrete state (`phase`) changes only
 * re-render React; continuous values go straight to the DOM through `onFrame`.
 */
export function useStickyScroll(
  ref: React.RefObject<HTMLElement>,
  phases: number,
  onFrame: (frame: StickyFrame) => void,
  { damping = 9, reduced = false }: { damping?: number; reduced?: boolean } = {},
) {
  const [phase, setPhase] = useState(0);
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mobile = matchMedia('(max-width: 760px)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    let raf = 0, last = 0, visible = false;
    let p = -1, mx = 0, my = 0, tx = 0, ty = 0, current = -1;

    const rawProgress = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    const tick = (t: number) => {
      const raw = rawProgress();
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      const k = reduced ? 1 : 1 - Math.exp(-damping * dt);
      p = p < 0 ? raw : p + (raw - p) * k;
      mx += (tx - mx) * k;
      my += (ty - my) * k;
      if (Math.abs(raw - p) < 0.0004) p = raw;
      const next = Math.min(phases - 1, Math.floor(p * phases));
      if (next !== current) { current = next; setPhase(next); }
      frameRef.current({ p, raw, mx, my, mobile: mobile.matches });
      const settled = p === raw && Math.abs(tx - mx) < 0.001 && Math.abs(ty - my) < 0.001;
      raf = visible && !settled ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onPointer = (e: PointerEvent) => {
      if (!finePointer.matches || reduced) return;
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
      wake();
    };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }, { rootMargin: '20% 0px' });
    io.observe(el);
    addEventListener('scroll', wake, { passive: true });
    addEventListener('resize', wake);
    addEventListener('pointermove', onPointer, { passive: true });
    visible = true; wake();
    // Dev-only QA hook: ?cgiScroll=<data-story name>:<0…1> jumps straight to a position (headless screenshots).
    if (import.meta.env.DEV) {
      const q = new URLSearchParams(location.search).get('cgiScroll');
      const [name, frac] = q?.split(':') ?? [];
      if (name && el.dataset.story === name) setTimeout(() => {
        const r = el.getBoundingClientRect();
        scrollTo(0, scrollY + r.top + (r.height - innerHeight) * Number(frac));
      }, 400);
    }
    return () => {
      io.disconnect();
      removeEventListener('scroll', wake);
      removeEventListener('resize', wake);
      removeEventListener('pointermove', onPointer);
      cancelAnimationFrame(raf);
    };
  }, [ref, phases, damping, reduced]);

  return phase;
}

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** Interpolates keyframe vectors at a continuous position (0…keys.length − 1) with smoothstep. */
export const keyed = (keys: number[][], f: number) => {
  const a = Math.max(0, Math.min(keys.length - 2, Math.floor(f)));
  const t = smooth(clamp01(f - a));
  return keys[a].map((v, i) => v + (keys[a + 1][i] - v) * t);
};
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
};
