import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/components/MobileNavigation';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import './WebExperience.css';

export const HeroSection: React.FC = () => {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoChoice, setVideoChoice] = useState<'desktop' | 'mobile' | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setPlaying(false);
      setVideoChoice(reduced.matches ? null : portrait.matches ? 'mobile' : 'desktop');
    };
    update();
    portrait.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => { portrait.removeEventListener('change', update); reduced.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    if (!videoChoice) return;
    videoRef.current?.load();
    videoRef.current?.play().catch(() => setPlaying(false));
  }, [videoChoice]);

  const scrollTo = (id: string, location: string, label: string) => {
    analytics.ctaClick(location, label);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <section className="experience-hero" aria-label={t('experience.hero_label')}>
      <MobileNavigation />
      <picture>
        <source media="(max-aspect-ratio: 1/1)" srcSet={v2['hero-mobile-poster.webp']} />
        <img className="experience-poster" src={v2['hero-desktop-poster.webp']} alt="" aria-hidden="true" width={1920} height={1080} fetchPriority="high" />
      </picture>
      {videoChoice && (
        <video ref={videoRef} key={videoChoice} className={playing ? 'is-playing' : ''} autoPlay muted loop playsInline preload="auto" poster={videoChoice === 'mobile' ? v2['hero-mobile-poster.webp'] : v2['hero-desktop-poster.webp']} aria-hidden="true" onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)}>
          <source src={videoChoice === 'mobile' ? v2['hero-mobile.webm'] : v2['hero-desktop.webm']} type="video/webm" />
          <source src={videoChoice === 'mobile' ? v2['hero-mobile.mp4'] : v2['hero-desktop.mp4']} type="video/mp4" />
        </video>
      )}
      <div className="experience-hero-copy text-foreground">
        <p className="text-primary text-sm font-semibold uppercase mb-4">{t('experience.eyebrow')}</p>
        <h1 className="font-anton uppercase font-normal max-w-[850px]">{t('experience.hero_title')}<br /><span className="text-primary">{t('experience.hero_highlight')}</span></h1>
        <p className="text-foreground/85 text-base md:text-xl leading-relaxed max-w-[520px] mt-4 md:mt-6 mb-5 md:mb-8">{t('experience.hero_description')}</p>
        <div className="flex gap-3 flex-wrap">
          <Button variant="neon" size="lg" onClick={() => scrollTo('signup', 'hero_primary', t('experience.join'))}>{t('experience.join')}</Button>
          <Button variant="outline" size="lg" className="border-foreground/50 text-foreground hover:border-primary hover:text-primary" onClick={() => scrollTo('how-it-works', 'hero_secondary', t('experience.how'))}>{t('experience.how')} ↓</Button>
        </div>
      </div>
      <div className="experience-scroll-hint text-xs uppercase text-foreground/70" aria-hidden="true">{t('experience.scroll')}</div>
    </section>
  );
};
