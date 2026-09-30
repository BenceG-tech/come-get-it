import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import { clamp01, useStickyScroll, usePrefersReducedMotion } from '@/components/experience/useStickyScroll';
import './WebExperience.css';

const ids = ['drink', 'link', 'earn', 'give'] as const;
const linkImages = ['redeem-arrival.webp', 'redeem-show.webp', 'redeem-confirm.webp', 'redeem-success.webp'] as const;

/**
 * DRINK / LINK / EARN / GIVE as one sticky scene sequence. Scenes switch with eased CSS transitions
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

  const phase = useStickyScroll(sectionRef, 4, ({ p, mx, my }) => {
    const f = p * 4; // 0…4, scene i spans [i, i+1)
    // LINK reaches the last redemption screen before the scene hands over to EARN.
    const local = clamp01((f - 1) / 0.82);
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

  const device = (key: string, screens: string[], active = 0, extra = '') => <DevicePhone
    ref={el => (deviceRefs.current[key] = el)} screens={screens} active={active} className={`device-feature ${key} ${extra}`} />;
  const scene = (i: number) => reduced ? '' : phase === i ? 'is-active' : i < phase ? 'is-past' : '';

  const drink = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">DRINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('drink.subtitle')}</p><p className="text-foreground/80">{t('drink.body')}</p><Button variant="neon" size="lg" className="mt-8" onClick={() => { analytics.ctaClick('drink_section', t('drink.button')); document.querySelector('#signup')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); }}>{t('drink.button')}</Button></div>
    <div className="feature-visual" role="img" aria-label={t('drink.visual_alt')}>
      {device('fx-drink-back', [v2['venue-detail.webp']])}
      {device('fx-drink-front', [v2['venue-offer.webp']])}
      <div className="feature-glass-wrap" aria-hidden="true"><img className="feature-glass-shadow" src={v2['drink-shadow.webp']} alt="" loading="lazy" /><img className="feature-glass" src={v2['drink-isolated.webp']} alt="" loading="lazy" /></div>
    </div>
  </div>;
  const link = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">LINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('link.subtitle')}</p><p className="text-foreground/80">{t('link.body')}</p>
      <ol className="feature-steps">{linkImages.map((image, i) => <li key={image} className={reduced ? '' : linkStep === i ? 'is-active' : i < linkStep ? 'is-done' : ''}><span>{i + 1}</span>{t(`link.steps.${i + 1}`)}</li>)}</ol></div>
    <div className="feature-visual" role="img" aria-label={t('link.visual_alt')}>
      {device('fx-link', linkImages.map(image => v2[image]), reduced ? 0 : linkStep)}
      <span className="feature-label text-foreground/80" aria-live="polite">{t(`link.labels.${(reduced ? 0 : linkStep) + 1}`)}</span>
    </div>
  </div>;
  const earn = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">EARN<span className="text-primary">.</span></h2><p className="feature-lead">{t('earn.subtitle')}</p><p className="text-foreground/80">{t('earn.body')}</p></div>
    <div className="feature-visual" role="img" aria-label={t('earn.visual_alt')}>
      {device('fx-earn-back', [v2['rewards-list.webp']])}
      {device('fx-earn-front', [v2['reward-detail.webp']])}
      <img className="feature-balance" src={v2['earn-balance.webp']} alt="" loading="lazy" />
    </div>
  </div>;
  const give = <div className="feature-inner"><div className="feature-copy"><h2 className="font-anton uppercase">GIVE<span className="text-primary">.</span></h2><p className="feature-lead">{t('give.subtitle')}</p><p className="text-foreground/80">{t('give.body')}</p><div className="feature-roadmap">{[1, 2, 3].map(n => <div key={n}><b>{t('give.planned')}</b><span>{t(`give.roadmap.${n}`)}</span></div>)}</div></div><div className="feature-visual" aria-hidden="true" /></div>;
  const content = [drink, link, earn, give];

  return <section ref={sectionRef} data-story="features" className={`feature-scroll-story text-foreground ${reduced ? 'feature-story-static' : ''}`} aria-label={t('experience.story_label')}>
    {!reduced && ids.map(id => <span key={id} id={id} className="feature-anchor" aria-hidden="true" />)}
    <div className="feature-scroll-stage">
      <div className="experience-grain" aria-hidden="true" />
      {ids.map((id, i) => <div key={id} id={reduced ? id : undefined} className={`experience-feature feature-${id} ${id === 'link' || id === 'give' ? 'feature-reverse' : ''} feature-scene ${scene(i)}`} aria-hidden={!reduced && phase !== i}>
        {(id === 'drink' || id === 'give') && <picture><source media="(max-width:900px)" srcSet={v2[`feat-${id}-bg-mobile.webp`]} /><img className="feature-background" src={v2[`feat-${id}-bg-desktop.webp`]} alt="" loading="lazy" /></picture>}
        {(id === 'link' || id === 'earn') && <div className={`feature-aura feature-aura-${id}`} aria-hidden="true" />}
        {(id === 'drink' || id === 'give') && <div className="feature-shade" />}
        {id === 'give' && <div className="feature-give-outline" aria-hidden="true">GIVE</div>}
        {content[i]}
      </div>)}
      {!reduced && <div className="feature-rail" aria-hidden="true">{ids.map((id, i) => <span key={id} className={phase === i ? 'is-active' : ''}>{id}</span>)}</div>}
    </div>
  </section>;
};

// Per device: [scene index, [rx, ry, rz, parallax lift px]]
const DEVICE_POSE: Record<string, [number, number[]]> = {
  'fx-drink-back': [0, [4, 24, -4, 30]],
  'fx-drink-front': [0, [2, -14, 1, 60]],
  'fx-link': [1, [3, -12, 1, 40]],
  'fx-earn-back': [2, [4, 22, -4, 30]],
  'fx-earn-front': [2, [2, -14, 1, 60]],
};
