import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import { clamp01, keyed, useStickyScroll, usePrefersReducedMotion } from '@/components/experience/useStickyScroll';
import './WebExperience.css';

// Tilt per state (rx, ry, rz in degrees). The phone glides between them continuously while scrolling;
// text, screens and depth layers switch with eased CSS transitions so no two states ever blend half-way.
const TILTS = [[8, -20, 2], [4, -7, 0], [2, 9, -1], [6, 17, -2]];
const screens = [v2['screen-1.webp'], v2['screen-2.webp'], v2['screen-3.webp'], v2['screen-4.webp']];
// Touch screens and narrow viewports get the story as a one-shot autoplay instead of scroll-driven steps.
const AUTOPLAY_QUERY = '(max-width: 819px), (hover: none) and (pointer: coarse)';
const AUTOPLAY_STEP_MS = 2800;

const useAutoplayMode = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const media = matchMedia(AUTOPLAY_QUERY);
    const update = () => setOn(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return on;
};

/**
 * Steps 0…3 once (~11 s) after the section comes into view, pausing while it is off screen or the tab
 * is hidden. Reduced motion starts on the finished state. `run` restarts it; `skip` jumps to the end.
 */
function useAutoplaySteps(ref: React.RefObject<HTMLElement>, enabled: boolean, reduced: boolean) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const schedule = useRef<() => void>(() => {});
  useEffect(() => {
    if (!enabled) return;
    if (reduced) { setStep(3); setPlaying(false); return; }
    const el = ref.current;
    if (!el) return;
    let visible = false, timer = 0;
    schedule.current = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || !started.current) return;
      timer = window.setTimeout(() => setStep(s => Math.min(3, s + 1)), AUTOPLAY_STEP_MS);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.5;
      if (visible && !started.current) { started.current = true; setPlaying(true); }
      schedule.current();
    }, { threshold: [0, 0.5] });
    io.observe(el);
    const onVisibility = () => schedule.current();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { io.disconnect(); clearTimeout(timer); document.removeEventListener('visibilitychange', onVisibility); schedule.current = () => {}; };
  }, [ref, enabled, reduced]);
  useEffect(() => {
    if (step === 3) setPlaying(false);
    else if (playing) schedule.current();
  }, [step, playing]);
  return {
    step, playing,
    skip: () => { setStep(3); setPlaying(false); },
    replay: () => { started.current = true; setStep(0); setPlaying(true); },
  };
}

export const ScrollStory: React.FC = () => {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const storyRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [failedLoops, setFailedLoops] = useState<Record<number, boolean>>({});
  const autoplay = useAutoplayMode();
  const auto = useAutoplaySteps(storyRef, autoplay, reduced);

  const scrollPhase = useStickyScroll(storyRef, 4, ({ p, mx, my }) => {
    if (autoplay) return;
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
  const phase = autoplay ? auto.step : scrollPhase;

  // Autoplay drives the same layers by step instead of scroll position.
  useEffect(() => {
    if (!autoplay) return;
    bgRefs.current.forEach((el, i) => { if (el) { el.style.opacity = i === phase ? '1' : '0'; el.style.transform = 'scale(1.06)'; } });
    barRefs.current.forEach((el, i) => { if (el) el.style.transform = `scaleX(${i <= phase ? 1 : 0})`; });
    if (phoneRef.current) {
      const [rx, ry, rz] = reduced ? [0, 0, 0] : TILTS[phase];
      phoneRef.current.style.setProperty('--rx', `${rx}deg`);
      phoneRef.current.style.setProperty('--ry', `${ry}deg`);
      phoneRef.current.style.setProperty('--rz', `${rz}deg`);
      phoneRef.current.style.setProperty('--glare', String(clamp01((ry + 24) / 48)));
    }
  }, [autoplay, phase, reduced]);

  const steps = [1, 2, 3, 4].map(n => ({
    title: t(`experience.step${n}_title`), highlight: t(`experience.step${n}_highlight`), description: t(`experience.step${n}_description`),
  }));
  const loop = (i: number) => (i === 0 || i === 2) && phase === i && !reduced && !failedLoops[i];

  return <section id="how-it-works" data-story="story" ref={storyRef} className={`experience-story text-foreground is-s${phase + 1} ${autoplay ? 'is-autoplay' : ''}`} aria-label={t('experience.story_label')}>
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
          {autoplay && !reduced && <div className="story-autoplay-controls">
            {auto.playing
              ? <button type="button" onClick={auto.skip}>{t('experience.skip')}</button>
              : <button type="button" onClick={auto.replay}>{t('experience.replay')}</button>}
          </div>}
        </div>
        <div className="phone-col" ref={colRef}>
          <div className="story-phone-wrap">
            <DevicePhone ref={phoneRef} screens={screens} active={phase} alts={[1, 2, 3, 4].map(n => t(`experience.screen${n}_alt`))} className="device-story">
              {[0, 2].map(i => loop(i) && <video key={i} className="device-loop" src={v2[i === 0 ? 'ui-phone-step-1-map-v2.mp4' : 'ui-phone-step-3-redeem-v2.mp4']} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setFailedLoops(prev => ({ ...prev, [i]: true }))} />)}
              {phase === 0 && !reduced && <div className="story-pins" aria-hidden="true"><span /><span /><span /></div>}
              {phase === 3 && !reduced && <div key="flash" className="story-flash" aria-hidden="true" />}
            </DevicePhone>
            {phase === 3 && !reduced && <div key="shock" className="story-shock" aria-hidden="true"><span /><span /><span /></div>}
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
