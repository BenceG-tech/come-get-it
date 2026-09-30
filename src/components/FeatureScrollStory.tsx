import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

const ids = ['drink', 'link', 'earn', 'give'] as const;
const linkImages = ['redeem-arrival.webp', 'redeem-show.webp', 'redeem-confirm.webp', 'redeem-success.webp'] as const;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const timing = {
  desktop: { height: 540, hold: 75.5, transition: 46 },
  mobile: { height: 700, hold: 114, transition: 48 },
} as const;
const scenePosition = (u: number, hold: number, transition: number) => {
  let start = 0;
  for (let i = 0; i < 3; i++) {
    if (u < start + hold) return i;
    start += hold;
    if (u < start + transition) {
      const t = (u - start) / transition;
      return i + t * t * (3 - 2 * t);
    }
    start += transition;
  }
  return 3;
};

export const FeatureScrollStory: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(0);
  const [linkPosition, setLinkPosition] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const mobile = matchMedia('(max-width: 760px)');
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:100svh;width:1px;top:0';
    document.body.appendChild(probe);
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const config = mobile.matches ? timing.mobile : timing.desktop;
      const unit = (mobile.matches ? probe.getBoundingClientRect().height : innerHeight) / 100;
      const u = Math.max(0, Math.min(config.height - 100, -rect.top / unit));
      setPosition(scenePosition(u, config.hold, config.transition));
      // Reach the final redemption screen before LINK starts to fade into EARN.
      const linkStart = config.hold + config.transition;
      setLinkPosition(clamp((u - linkStart) / (config.hold * .85)) * 3);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mobile.addEventListener('change', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); mobile.removeEventListener('change', schedule); cancelAnimationFrame(frame); probe.remove(); };
  }, [reduced]);

  const sceneStyle = (index: number): React.CSSProperties => reduced ? {} : {
    opacity: clamp(1 - Math.abs(position - index)),
    transform: `translateY(${(index - position) * 16}px)`,
    pointerEvents: Math.round(position) === index ? 'auto' : 'none',
  };
  const drink = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">DRINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('drink.subtitle')}</p><p className="text-foreground/80">{t('drink.body')}</p><Button variant="neon" size="lg" className="mt-8" onClick={() => { analytics.ctaClick('drink_section', t('drink.button')); document.querySelector('#signup')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); }}>{t('drink.button')}</Button></div>
    <div className="feature-visual" role="img" aria-label={t('drink.visual_alt')}><div className="feature-phone feature-phone-third"><img src={v2['consumer-list.webp']} alt="" loading="lazy" width={920} height={2000} /></div><div className="feature-phone feature-phone-back"><img src={v2['venue-detail.webp']} alt="" loading="lazy" width={920} height={2000} /></div><div className="feature-phone feature-phone-front"><img src={v2['venue-offer.webp']} alt="" loading="lazy" width={920} height={2000} /></div><img className="feature-glass-shadow" src={v2['drink-shadow.webp']} alt="" loading="lazy" /><img className="feature-glass" src={v2['drink-isolated.webp']} alt="" loading="lazy" /></div>
  </div>;
  const link = <div className="feature-inner">
    <div className="feature-copy"><h2 className="font-anton uppercase">LINK<span className="text-primary">.</span></h2><p className="feature-lead">{t('link.subtitle')}</p><p className="text-foreground/80">{t('link.body')}</p><ol>{linkImages.map((image, i) => <li key={image} className={Math.round(linkPosition) === i && !reduced ? 'is-active text-foreground' : 'text-foreground/65'}><span>{i + 1}</span>{t(`link.steps.${i + 1}`)}</li>)}</ol></div>
    <div className="feature-visual" role="img" aria-label={t('link.visual_alt')}>{linkImages.map((image, i) => <div key={image} className={`feature-phone ${Math.round(linkPosition) === i && !reduced ? 'is-active' : ''}`} style={reduced ? {} : { opacity: clamp(1 - Math.abs(linkPosition - i)) }}><img src={v2[image]} alt="" loading="lazy" width={920} height={2000} /><span className="text-foreground/80">{t(`link.labels.${i + 1}`)}</span></div>)}</div>
  </div>;
  const earn = <div className="feature-inner"><div className="feature-copy"><h2 className="font-anton uppercase">EARN<span className="text-primary">.</span></h2><p className="feature-lead">{t('earn.subtitle')}</p><p className="text-foreground/80">{t('earn.body')}</p></div><div className="feature-visual" role="img" aria-label={t('earn.visual_alt')}><div className="feature-phone feature-phone-third"><img src={v2['rewards-experiences.webp']} alt="" loading="lazy" width={920} height={2000} /></div><div className="feature-phone feature-phone-back"><img src={v2['rewards-list.webp']} alt="" loading="lazy" width={920} height={2000} /></div><div className="feature-phone feature-phone-front"><img src={v2['reward-detail.webp']} alt="" loading="lazy" width={920} height={2000} /></div><img className="feature-balance" src={v2['earn-balance.webp']} alt="" loading="lazy" /></div></div>;
  const give = <div className="feature-inner"><div className="feature-copy"><h2 className="font-anton uppercase">GIVE<span className="text-primary">.</span></h2><p className="feature-lead">{t('give.subtitle')}</p><p className="text-foreground/80">{t('give.body')}</p><div className="feature-roadmap">{[1, 2, 3].map(n => <div key={n}><b>{t('give.planned')}</b><span>{t(`give.roadmap.${n}`)}</span></div>)}</div></div><div className="feature-visual" aria-hidden="true" /></div>;
  const content = [drink, link, earn, give];
  return <section ref={sectionRef} className={`feature-scroll-story text-foreground ${reduced ? 'feature-story-static' : ''}`} aria-label={t('experience.story_label')}>
    {!reduced && ids.map(id => <span key={id} id={id} className="feature-anchor" aria-hidden="true" />)}
    <div className="feature-scroll-stage">{ids.map((id, i) => <div key={id} id={reduced ? id : undefined} className={`experience-feature feature-${id} ${id === 'link' || id === 'give' ? 'feature-reverse' : ''} feature-scene`} style={sceneStyle(i)} aria-hidden={!reduced && Math.round(position) !== i}>
      {(id === 'drink' || id === 'give') && <picture><source media="(max-width:900px)" srcSet={v2[`feat-${id}-bg-mobile.webp`]} /><img className="feature-background" src={v2[`feat-${id}-bg-desktop.webp`]} alt="" loading="lazy" /></picture>}
      {(id === 'drink' || id === 'give') && <div className="feature-shade" />}
      {id === 'give' && <div className="feature-give-outline" aria-hidden="true">GIVE</div>}
      {content[i]}
    </div>)}</div>
  </section>;
};
