import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

const TIMING = {
  desktop: { storyHeight: 440, holds: [70, 70, 70, 70], transitions: [20, 20, 20] },
  mobile: { storyHeight: 640, holds: [121.5, 121.5, 121.5, 121.5], transitions: [18, 18, 18] },
} as const;
const tilts = [[8, -18, 2], [4, -6, 0], [2, 10, -1], [6, 16, -2]];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function stateAt(u: number, config: typeof TIMING.desktop | typeof TIMING.mobile): number {
  let pos = 0;
  for (let i = 0; i < 4; i++) {
    if (u < pos + config.holds[i]) return i;
    pos += config.holds[i];
    if (i < 3) {
      if (u < pos + config.transitions[i]) {
        const t = (u - pos) / config.transitions[i];
        return i + t * t * (3 - 2 * t);
      }
      pos += config.transitions[i];
    }
  }
  return 3;
}

const screens = [v2['screen-1.webp'], v2['screen-2.webp'], v2['screen-3.webp'], v2['screen-4.webp']];
const backgrounds = [1, 2, 3, 4];
export const ScrollStory: React.FC = () => {
  const { t } = useI18n();
  const storyRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const phase = Math.round(position);
  const [failedLoops, setFailedLoops] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const target = storyRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const mobile = matchMedia('(max-width: 760px)');
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:100svh;width:1px;top:0';
    document.body.appendChild(probe);
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = storyRef.current?.getBoundingClientRect();
      if (!rect) return;
      const config = mobile.matches ? TIMING.mobile : TIMING.desktop;
      const unitPx = (mobile.matches ? probe.getBoundingClientRect().height : innerHeight) / 100;
      const u = Math.max(0, Math.min(config.storyHeight - 100, -rect.top / unitPx));
      const f = stateAt(u, config);
      setPosition(f);
      if (phoneRef.current) {
        const a = Math.min(2, Math.floor(f));
        const k = f - a;
        const values = tilts[a].map((n, axis) => n + (tilts[Math.min(a + 1, 3)][axis] - n) * k);
        phoneRef.current.style.transform = reduced ? 'none' : `rotateX(${values[0]}deg) rotateY(${values[1]}deg) rotateZ(${values[2]}deg)`;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mobile.addEventListener('change', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); mobile.removeEventListener('change', schedule); cancelAnimationFrame(frame); probe.remove(); };
  }, [reduced]);

  const steps = [1, 2, 3, 4].map(n => ({
    title: t(`experience.step${n}_title`), highlight: t(`experience.step${n}_highlight`), description: t(`experience.step${n}_description`),
  }));
  return <section id="how-it-works" ref={storyRef} className="experience-story text-foreground" aria-label={t('experience.story_label')}>
    <div className={`experience-stage ${phase === 3 ? 'story-four' : ''}`}>
      {backgrounds.map((n, i) => <div key={n} className="experience-bg" style={{ opacity: clamp(1 - Math.abs(position - i)) }} aria-hidden="true">
        <picture><source media="(max-aspect-ratio: 1/1)" srcSet={v2[`bg-${n}-mobile.webp` as keyof typeof v2]} /><img src={v2[`bg-${n}-desktop.webp` as keyof typeof v2]} alt="" loading="lazy" /></picture>
      </div>)}
      <div className="experience-vignette" />
      <div className="story-content">
        <div className="story-copy">
          <p className="text-primary text-xs md:text-sm uppercase font-semibold mb-3" aria-live="polite">{t('experience.kicker')} · {phase + 1}/4</p>
          <div className="story-steps">{steps.map((step, i) => <div key={i} className={`story-step ${phase === i ? 'is-active' : ''}`} aria-hidden={phase !== i}>
            <h2 className="font-anton uppercase font-normal">{step.title} <span className="text-primary">{step.highlight}</span></h2>
            <p className="text-foreground/85 text-sm md:text-lg leading-relaxed mt-3 md:mt-5 max-w-md">{step.description}</p>
          </div>)}</div>
          <div className="story-progress" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={Math.round(position * 10) / 10} aria-label={t('experience.story_label')}>
            {steps.map((_, i) => <span key={i} className="story-progress-track"><span style={{ transform: `scaleX(${clamp(position - i + 1)})` }} /></span>)}
          </div>
        </div>
        <div className="phone-col">
          <div className="story-phone-wrap"><div className="story-phone" ref={phoneRef}><div className="story-screen">
            {screens.map((screen, i) => <React.Fragment key={screen}><img src={screen} alt={phase === i ? t(`experience.screen${i + 1}_alt`) : ''} aria-hidden={phase !== i} className={phase === i ? 'is-active' : ''} width={920} height={2000} loading="lazy" />{visible && !reduced && (i === 0 || i === 2) && phase === i && !failedLoops[i] && <video className="story-ui-loop" src={v2[i === 0 ? 'ui-phone-step-1-map-v2.mp4' : 'ui-phone-step-3-redeem-v2.mp4']} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setFailedLoops(previous => ({ ...previous, [i]: true }))} />}</React.Fragment>)}
            {phase === 0 && !reduced && <div className="story-pins" aria-hidden="true"><span /><span /><span /></div>}
          </div></div></div>
          <div className="story-float story-venue" style={{ opacity: clamp(1 - Math.abs(position - 1) * 1.8) }} aria-hidden="true"><img src={v2['fg-offer-venue.webp']} alt="" loading="lazy" /></div>
          <div className="story-float story-redeem" style={{ opacity: clamp(1 - Math.abs(position - 2) * 1.8) }} aria-hidden="true"><img src={v2['fg-redeem-steps.webp']} alt="" loading="lazy" /></div>
          <div className="story-float story-drink" style={{ opacity: clamp(1 - Math.abs(position - 3) * 1.8) }} aria-hidden="true"><img className="story-drink-glass" src={v2['drink-isolated.webp']} alt="" loading="lazy" /><img className="story-drink-shadow" src={v2['drink-shadow.webp']} alt="" loading="lazy" /></div>
        </div>
      </div>
      <p className="story-note text-[10px] md:text-xs text-foreground/70">{t('experience.disclaimer')}</p>
    </div>
  </section>;
};
