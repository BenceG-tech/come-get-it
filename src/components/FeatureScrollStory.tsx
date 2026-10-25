import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import { CocktailGlass } from '@/components/experience/CocktailGlass';
import { clamp01, useStickyScroll, usePrefersReducedMotion } from '@/components/experience/useStickyScroll';
import './WebExperience.css';

// EARN (points) and GIVE (a plan, not a feature) were dropped: the beta promise is one free drink a day, redeemed by QR.
const ids = ['drink', 'link'] as const;
const SCENES = ids.length;
const linkImages = ['redeem-arrival.webp', 'redeem-show.webp', 'redeem-confirm.webp', 'redeem-success.webp'] as const;
// LINK spends its first 82% of the scene walking the four redemption screens.
const LINK_SPAN = 0.82;

/** Follows `target` one step at a time, holding each value for at least `hold` ms, so a fast scroll still plays every beat. */
function useStepped(target: number, hold: number, enabled: boolean) {
  const [shown, setShown] = useState(target);
  const since = useRef(0);
  useEffect(() => {
    if (!enabled) { setShown(target); return; }
    if (shown === target) return;
    const wait = Math.max(0, since.current + hold - performance.now());
    const id = window.setTimeout(() => { since.current = performance.now(); setShown(v => v + Math.sign(target - v)); }, wait);
    return () => window.clearTimeout(id);
  }, [target, shown, hold, enabled]);
  return enabled ? shown : target;
}

/**
 * DRINK / LINK as one sticky scene sequence. Scenes switch with eased CSS transitions
 * (same rhythm as the first story); inside a scene the devices drift with damped scroll + pointer parallax.
 * LINK walks one device through the real redemption screens while its step list follows.
 */
export const FeatureScrollStory: React.FC = () => {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const deviceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const linkStepRef = useRef(0);
  const [linkStep, setLinkStep] = useState(0);

  const phase = useStickyScroll(sectionRef, SCENES, ({ p, mx, my }) => {
    const f = p * SCENES; // scene i spans [i, i+1)
    // LINK reaches the last redemption screen before the scene hands over to EARN.
    const local = clamp01((f - 1) / LINK_SPAN);
    const step = Math.min(3, Math.floor(local * 4));
    if (step !== linkStepRef.current) { linkStepRef.current = step; setLinkStep(step); }
    Object.entries(deviceRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const [scene, base] = DEVICE_POSE[key];
      const d = reduced ? 0 : f - scene - 0.5; // −0.5…0.5 inside its scene
      const ry = base[1] + d * 10 + mx * 5, rx = base[0] - d * 4 - my * 3;
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
      el.style.setProperty('--rz', `${base[2]}deg`);
      el.style.setProperty('--lift', `${reduced ? 0 : -d * base[3]}px`);
      el.style.setProperty('--glare', String(clamp01((ry + 24) / 48)));
    });
  }, { reduced });
  // One beat per scene and per LINK screen (DRINK, LINK 1–4), played strictly in order.
  const beat = useStepped(phase === 0 ? 0 : 1 + linkStep, 600, !reduced);
  const scenePhase = beat === 0 ? 0 : 1;
  const linkShown = scenePhase === 1 ? beat - 1 : 0;

  const device = (key: string, screens: string[], active = 0, extra = '') => <DevicePhone
    ref={el => (deviceRefs.current[key] = el)} screens={screens} active={active} className={`device-feature ${key} ${extra}`} />;
  const scene = (i: number) => reduced ? '' : scenePhase === i ? 'is-active' : i < scenePhase ? 'is-past' : '';

  const drink = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">DRINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('drink.subtitle')}</p><p className="text-foreground/80">{t('drink.body')}</p><Button variant="neon" size="lg" className="mt-8" onClick={() => { analytics.ctaClick('drink_section', t('drink.button')); document.querySelector('#signup')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); }}>{t('drink.button')}</Button></div>
    <div className="feature-visual" role="img" aria-label={t('drink.visual_alt')}>
      {device('fx-drink-back', [v2['venue-detail.webp']])}
      {device('fx-drink-front', [v2['venue-offer.webp']])}
      <div className="feature-glass-wrap" aria-hidden="true"><CocktailGlass className="feature-glass" /></div>
    </div>
  </div>;
  const link = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">LINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('link.subtitle')}</p><p className="text-foreground/80">{t('link.body')}</p><p className="text-xs text-foreground/55 mt-4">{t('experience.disclaimer')}</p>
      <ol className="feature-steps">{linkImages.map((image, i) => <li key={image} className={reduced ? '' : linkShown === i ? 'is-active' : i < linkShown ? 'is-done' : ''}><span>{i + 1}</span>{t(`link.steps.${i + 1}`)}</li>)}</ol></div>
    <div className="feature-visual" role="img" aria-label={t('link.visual_alt')}>
      {device('fx-link', linkImages.map(image => v2[image]), reduced ? 0 : linkShown)}
      <span className="feature-label text-foreground/80" aria-live="polite">{t(`link.labels.${(reduced ? 0 : linkShown) + 1}`)}</span>
    </div>
  </div>;
  const content = [drink, link];

  return <section ref={sectionRef} data-story="features" className={`feature-scroll-story text-foreground ${reduced ? 'feature-story-static' : ''}`} aria-label={t('experience.story_label')}>
    {!reduced && ids.map((id, i) => <span key={id} id={id} className="feature-anchor" style={{ top: `calc(${i / SCENES} * (100% - 100svh) + 1px)` }} aria-hidden="true" />)}
    <div className="feature-scroll-stage">
      <div className="experience-grain" aria-hidden="true" />
      {ids.map((id, i) => <div key={id} id={reduced ? id : undefined} className={`experience-feature feature-${id} ${id === 'link' ? 'feature-reverse' : ''} feature-scene ${scene(i)}`} aria-hidden={!reduced && scenePhase !== i}>
        {id === 'drink' && <picture><source media="(max-width:900px)" srcSet={v2['feat-drink-bg-mobile.webp']} /><img className="feature-background" src={v2['feat-drink-bg-desktop.webp']} alt="" loading="lazy" /></picture>}
        {id === 'link' && <div className="feature-aura feature-aura-link" aria-hidden="true" />}
        {id === 'drink' && <div className="feature-shade" />}
        {content[i]}
      </div>)}
      {!reduced && <div className="feature-rail" aria-hidden="true">{ids.map((id, i) => <span key={id} className={scenePhase === i ? 'is-active' : ''}>{id}</span>)}</div>}
    </div>
  </section>;
};

// Per device: [scene index, [rx, ry, rz, parallax lift px]]
const DEVICE_POSE: Record<string, [number, number[]]> = {
  'fx-drink-back': [0, [4, 24, -4, 30]],
  'fx-drink-front': [0, [2, -14, 1, 60]],
  'fx-link': [1, [3, -12, 1, 40]],
};
