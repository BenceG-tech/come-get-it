import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

export const GiveSection: React.FC = () => {
  const { t } = useI18n();
  return <section id="give" className="experience-feature feature-give feature-reverse text-foreground">
    <picture><source media="(max-width:900px)" srcSet={v2['feat-give-bg-mobile.webp']} /><img className="feature-background" src={v2['feat-give-bg-desktop.webp']} alt="" loading="lazy" /></picture>
    <div className="feature-shade" /><div className="feature-give-outline" aria-hidden="true">GIVE</div>
    <div className="feature-inner"><div className="feature-copy">
      <h2 className="font-anton uppercase">GIVE<span className="text-primary">.</span></h2><p className="feature-lead">{t('give.subtitle')}</p><p className="text-foreground/80">{t('give.body')}</p>
      <div className="feature-roadmap">{[1,2,3].map(n => <div key={n}><b>{t('give.planned')}</b><span>{t(`give.roadmap.${n}`)}</span></div>)}</div>
    </div><div className="feature-visual" aria-hidden="true" /></div>
  </section>;
};
