import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

const images = ['redeem-arrival.webp','redeem-show.webp','redeem-confirm.webp','redeem-success.webp'] as const;
export const LinkSection: React.FC = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const mq = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => { setReduced(mq.matches); if (mq.matches) setStep(0); }; update(); mq.addEventListener('change',update); return () => mq.removeEventListener('change',update); }, []);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced && !timer) timer = setInterval(() => setStep(n => (n+1)%4), 2200);
      else if (!entry.isIntersecting && timer) { clearInterval(timer); timer = undefined; }
    }, { threshold:.4 });
    observer.observe(section);
    return () => { observer.disconnect(); if (timer) clearInterval(timer); };
  }, [reduced]);
  return <section id="link" ref={ref} className="experience-feature feature-link feature-reverse text-foreground">
    <div className="feature-inner">
      <div className="feature-copy">
        <h2 className="font-anton uppercase">LINK<span className="text-primary">.</span></h2>
        <p className="feature-lead">{t('link.subtitle')}</p>
        <p className="text-foreground/80">{t('link.body')}</p>
        <ol>{images.map((image,i) => <li key={image} className={i===step ? 'is-active text-foreground' : 'text-foreground/65'}><span>{i+1}</span>{t(`link.steps.${i+1}`)}</li>)}</ol>
      </div>
      <div className="feature-visual" aria-label={t('link.visual_alt')} role="img">
        {images.map((image,i) => <div key={image} className={`feature-phone ${i===step ? 'is-active' : ''}`}><img src={v2[image]} alt="" loading="lazy" width={920} height={2000} /><span className="text-foreground/80">{t(`link.labels.${i+1}`)}</span></div>)}
      </div>
    </div>
  </section>;
};
