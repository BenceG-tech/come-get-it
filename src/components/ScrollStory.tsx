import React, { useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import { clamp01, keyed, useStickyScroll, usePrefersReducedMotion } from '@/components/experience/useStickyScroll';
import './WebExperience.css';

// Tilt per state (rx, ry, rz in degrees). The phone glides between them continuously while scrolling;
// text, screens and depth layers switch with eased CSS transitions so no two states ever blend half-way.
const TILTS = [[8, -20, 2], [4, -7, 0], [2, 9, -1], [6, 17, -2]];
const screens = [v2['screen-1.webp'], v2['screen-2.webp'], v2['screen-3.webp'], v2['screen-4.webp']];

export const ScrollStory: React.FC = () => {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const storyRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [failedLoops, setFailedLoops] = useState<Record<number, boolean>>({});

  const phase = useStickyScroll(storyRef, 4, ({ p, mx, my }) => {
    const f = Math.max(0, Math.min(3, p * 4 - 0.5));
    bgRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = String(clamp01(1 - Math.abs(f - i)));
      el.style.transform = `translate3d(${-mx * 10}px, ${(p - 0.5) * -40}px, 0) scale(1.06)`;
    });
    barRefs.current.forEach((el, i) => { if (el) el.style.transform = `scaleX(${clamp01(p * 4 - i)})`; });
    if (phoneRef.current) {
      const [rx, ry, rz] = reduced ? [0, 0, 0] : keyed(TILTS, f);
      const x = rx - my * 3, y = ry + mx * 4;
      phoneRef.current.style.setProperty('--rx', `${x}deg`);
      phoneRef.current.style.setProperty('--ry', `${y}deg`);
      phoneRef.current.style.setProperty('--rz', `${rz}deg`);
      phoneRef.current.style.setProperty('--glare', String(clamp01((y + 24) / 48)));
    }
    if (colRef.current && !reduced) colRef.current.style.transform = `translate3d(${mx * 6}px, ${(0.5 - p) * 24 + my * 4}px, 0)`;
  }, { reduced });

  const steps = [1, 2, 3, 4].map(n => ({
    title: t(`experience.step${n}_title`), highlight: t(`experience.step${n}_highlight`), description: t(`experience.step${n}_description`),
  }));
  const loop = (i: number) => (i === 0 || i === 2) && phase === i && !reduced && !failedLoops[i];

  return <section id="how-it-works" data-story="story" ref={storyRef} className={`experience-story text-foreground is-s${phase + 1}`} aria-label={t('experience.story_label')}>
    <div className="experience-stage">
      {[1, 2, 3, 4].map((n, i) => <div key={n} ref={el => (bgRefs.current[i] = el)} className="experience-bg" style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden="true">
        <picture><source media="(max-aspect-ratio: 1/1)" srcSet={v2[`bg-${n}-mobile.webp` as keyof typeof v2]} /><img src={v2[`bg-${n}-desktop.webp` as keyof typeof v2]} alt="" loading={i === 0 ? 'eager' : 'lazy'} /></picture>
      </div>)}
      <div className="experience-vignette" />
      <div className="experience-grain" aria-hidden="true" />
      <div className="story-content">
        <div className="story-copy">
          <p className="story-kicker text-primary" aria-live="polite">{t('experience.kicker')} · {phase + 1}/4</p>
          <div className="story-steps">{steps.map((step, i) => <div key={i} className={`story-step ${phase === i ? 'is-active' : i < phase ? 'is-past' : ''}`} aria-hidden={phase !== i}>
            <h2 className="font-anton uppercase font-normal">{step.title} <span className="text-primary">{step.highlight}</span></h2>
            <p className="text-foreground/85 text-sm md:text-lg leading-relaxed mt-3 md:mt-5 max-w-md">{step.description}</p>
          </div>)}</div>
          <div className="story-progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={phase + 1} aria-label={t('experience.story_label')}>
            {steps.map((_, i) => <span key={i} className="story-progress-track"><span ref={el => (barRefs.current[i] = el)} /></span>)}
          </div>
        </div>
        <div className="phone-col" ref={colRef}>
          <div className="story-phone-wrap">
            <DevicePhone ref={phoneRef} screens={screens} active={phase} alts={[1, 2, 3, 4].map(n => t(`experience.screen${n}_alt`))} className="device-story">
              {[0, 2].map(i => loop(i) && <video key={i} className="device-loop" src={v2[i === 0 ? 'ui-phone-step-1-map-v2.mp4' : 'ui-phone-step-3-redeem-v2.mp4']} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setFailedLoops(prev => ({ ...prev, [i]: true }))} />)}
              {phase === 0 && !reduced && <div className="story-pins" aria-hidden="true"><span /><span /><span /></div>}
            </DevicePhone>
          </div>
          <div className={`story-float story-venue ${phase === 1 ? 'is-on' : ''}`} aria-hidden="true"><img src={v2['fg-offer-venue.webp']} alt="" loading="lazy" /></div>
          <div className={`story-float story-redeem ${phase === 2 ? 'is-on' : ''}`} aria-hidden="true"><img src={v2['fg-redeem-steps.webp']} alt="" loading="lazy" /></div>
          <div className={`story-float story-drink ${phase === 3 ? 'is-on' : ''}`} aria-hidden="true"><img className="story-drink-glass" src={v2['drink-isolated.webp']} alt="" loading="lazy" /><img className="story-drink-shadow" src={v2['drink-shadow.webp']} alt="" loading="lazy" /></div>
        </div>
      </div>
      <p className="story-note text-[10px] md:text-xs text-foreground/70">{t('experience.disclaimer')}</p>
    </div>
  </section>;
};
