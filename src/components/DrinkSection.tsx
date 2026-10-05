import React from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

export const DrinkSection: React.FC = () => {
  const { t } = useI18n();
  return <section id="drink" className="experience-feature feature-drink scroll-mt-24 text-foreground">
    <picture><source media="(max-width:900px)" srcSet={v2['feat-drink-bg-mobile.webp']} /><img className="feature-background" src={v2['feat-drink-bg-desktop.webp']} alt="" loading="lazy" /></picture>
    <div className="feature-shade" />
    <div className="feature-inner">
      <div className="feature-copy">
        <h2 className="font-anton uppercase">DRINK<span className="text-primary">.</span></h2>
        <p className="feature-lead">{t('drink.subtitle')}</p>
        <p className="text-foreground/80">{t('drink.body')}</p>
        <Button variant="neon" size="lg" className="mt-8" onClick={() => { analytics.ctaClick('drink_section', t('drink.button')); document.querySelector('#helyek')?.scrollIntoView({ behavior:'smooth' }); }}>{t('drink.button')}</Button>
      </div>
      <div className="feature-visual" aria-label={t('drink.visual_alt')} role="img">
        <div className="feature-phone feature-phone-third"><img src={v2['consumer-list.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <div className="feature-phone feature-phone-back"><img src={v2['venue-detail.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <div className="feature-phone feature-phone-front"><img src={v2['venue-offer.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <img className="feature-glass-shadow" src={v2['drink-shadow.webp']} alt="" loading="lazy" />
        <img className="feature-glass" src={v2['drink-isolated.webp']} alt="" loading="lazy" />
      </div>
    </div>
  </section>;
};
