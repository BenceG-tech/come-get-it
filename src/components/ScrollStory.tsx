import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import map from '@/assets/web-experience/screen-1-map.webp.asset.json';
import offer from '@/assets/web-experience/screen-2-offer.webp.asset.json';
import redeem from '@/assets/web-experience/screen-3-redeem.webp.asset.json';
import success from '@/assets/web-experience/screen-4-success.webp.asset.json';
import offerFloat from '@/assets/web-experience/screen-2b-drink.webp.asset.json';
import venue from '@/assets/web-experience/venue.webp.asset.json';
import drink from '@/assets/web-experience/drink.webp.asset.json';
import night from '@/assets/web-experience/bg-night.webp.asset.json';
import './WebExperience.css';

const screens = [map, offer, redeem, success];
const backgrounds = [night, venue, venue, drink];
const tilts = [[8, -22, 2], [4, -8, 0], [2, 10, -1], [6, 20, -2]];

export const ScrollStory: React.FC = () => {
  const { t } = useI18n();
  const storyRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = storyRef.current?.getBoundingClientRect();
      if (!rect) return;
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const f = p * 4;
      setPhase(Math.min(3, Math.floor(f)));
      setProgress(f);
      const position = Math.min(2.999, Math.max(0, f - .5));
      const start = Math.floor(position);
      const eased = (position - start) ** 2 * (3 - 2 * (position - start));
      const rotation = tilts[start].map((value, axis) => value + (tilts[start + 1][axis] - value) * eased);
      if (phoneRef.current) phoneRef.current.style.transform = `rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [reduced]);

  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`experience.step${n}_title`), highlight: t(`experience.step${n}_highlight`), description: t(`experience.step${n}_description`),
  }));

  if (reduced) return (
    <section id="how-it-works" className="bg-background text-foreground py-16 px-5" aria-label={t('experience.story_label')}>
      <div className="max-w-6xl mx-auto space-y-12">
        {steps.map((step, index) => <article key={index} className="grid md:grid-cols-2 gap-6 items-center border-b border-border pb-12">
          <div><p className="text-primary text-sm mb-3">{t('experience.kicker')} · {index + 1}/4</p><h2 className="font-anton uppercase text-4xl md:text-6xl">{step.title} <span className="text-primary">{step.highlight}</span></h2><p className="text-foreground/80 mt-4">{step.description}</p></div>
          <img className="w-44 md:w-56 mx-auto rounded-3xl" src={screens[index].url} alt={t(`experience.screen${index + 1}_alt`)} width={920} height={2000} loading="lazy" />
        </article>)}
        <p className="text-xs text-foreground/70">{t('experience.disclaimer')}</p>
      </div>
    </section>
  );

  return (
    <section id="how-it-works" ref={storyRef} className="experience-story text-foreground" aria-label={t('experience.story_label')}>
      <div className="experience-stage">
        {backgrounds.map((bg, index) => <img key={index} src={bg.url} alt="" aria-hidden="true" loading="lazy" width={index === 0 ? 941 : index === 3 ? 810 : 920} height={index === 0 ? 1672 : index === 3 ? 640 : 630} className={`experience-bg ${index === 1 ? 'experience-bg-venue' : index === 2 ? 'experience-bg-door' : index === 3 ? 'experience-bg-warm' : ''} ${phase === index ? 'is-active' : ''}`} />)}
        <div className="experience-grid" style={{ opacity: phase > 1 ? 0 : 1 }} />
        <div className="experience-vignette" />
        <div className="experience-steps">
          <p className="text-primary text-xs md:text-sm uppercase font-semibold mb-3" aria-live="polite">{t('experience.kicker')} · {phase + 1}/4</p>
          <div className="experience-step-content">
            {steps.map((step, index) => <div key={index} className={`experience-step ${phase === index ? 'is-active' : ''}`} aria-hidden={phase !== index}>
              <h2 className="font-anton uppercase font-normal">{step.title} <span className="text-primary">{step.highlight}</span></h2>
              <p className="text-foreground/85 text-sm md:text-lg leading-relaxed mt-3 md:mt-5 max-w-md">{step.description}</p>
            </div>)}
          </div>
        </div>
        <div className="experience-progress" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={Math.round(progress * 10) / 10} aria-label={t('experience.story_label')}>
          {steps.map((_, index) => <span key={index} className="experience-progress-track"><span className="experience-progress-fill" style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress - index))})` }} /></span>)}
        </div>
        <div className="experience-phone-wrap">
          <div ref={phoneRef} className="experience-phone">
            <div className="experience-screen">
              {screens.map((screen, index) => <img key={index} src={screen.url} alt={phase === index ? t(`experience.screen${index + 1}_alt`) : ''} aria-hidden={phase !== index} className={phase === index ? 'is-active' : ''} width={920} height={2000} loading="lazy" />)}
            </div>
            <div className={`experience-float experience-offer ${phase === 1 ? 'is-active' : ''}`} aria-hidden="true"><img src={offerFloat.url} alt="" width={920} height={2000} loading="lazy" /></div>
            <div className={`experience-float experience-drink ${phase === 3 ? 'is-active' : ''}`} aria-hidden="true"><img src={drink.url} alt="" width={810} height={640} loading="lazy" /></div>
          </div>
        </div>
        <p className="experience-note text-[10px] md:text-xs text-foreground/70">{t('experience.disclaimer')}</p>
      </div>
    </section>
  );
};
