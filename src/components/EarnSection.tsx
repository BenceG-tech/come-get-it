import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

export const EarnSection: React.FC = () => {
  const { t } = useI18n();
  return <section id="earn" className="experience-feature feature-earn text-foreground">
    <div className="feature-inner">
      <div className="feature-copy"><h2 className="font-anton uppercase">EARN<span className="text-primary">.</span></h2><p className="feature-lead">{t('earn.subtitle')}</p><p className="text-foreground/80">{t('earn.body')}</p></div>
      <div className="feature-visual" role="img" aria-label={t('earn.visual_alt')}>
        <div className="feature-phone feature-phone-third"><img src={v2['rewards-experiences.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <div className="feature-phone feature-phone-back"><img src={v2['rewards-list.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <div className="feature-phone feature-phone-front"><img src={v2['reward-detail.webp']} alt="" loading="lazy" width={920} height={2000} /></div>
        <img className="feature-balance" src={v2['earn-balance.webp']} alt="" loading="lazy" />
      </div>
    </div>
  </section>;
};
