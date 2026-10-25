import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/components/MobileNavigation';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import './WebExperience.css';

const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';

export const HeroSection: React.FC = () => {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoChoice, setVideoChoice] = useState<'desktop' | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Portrait screens get a still background and a real device under the buttons instead of the video,
    // whose baked-in phone shows an older app screen and sat behind the CTAs.
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setPlaying(false);
      setVideoChoice(reduced.matches || portrait.matches ? null : 'desktop');
    };
    update();
    [portrait, reduced].forEach(q => q.addEventListener('change', update));
    return () => { [portrait, reduced].forEach(q => q.removeEventListener('change', update)); };
  }, []);

  useEffect(() => {
    if (!videoChoice) return;
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.65;
    video.load();
    video.play().catch(() => setPlaying(false));
  }, [videoChoice]);

  // Scroll-linked hand-over into the story below: 0 at the top, 1 once the hero has scrolled away.
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = el.offsetHeight || 1;
      el.style.setProperty('--hx', String(Math.min(1, Math.max(0, window.scrollY / h))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => { window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
  }, []);

  const scrollTo = (id: string, location: string, label: string) => {
    analytics.ctaClick(location, label);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <section ref={heroRef} className="experience-hero" aria-label={t('experience.hero_label')}>
      <MobileNavigation />
      <picture>
        <source media={PORTRAIT_QUERY} srcSet={v2['bg-1-mobile.webp']} />
        <img className="experience-poster" src={v2['hero-desktop-poster.webp']} alt="" aria-hidden="true" width={1920} height={1080} />
      </picture>
      {videoChoice && (
        <video ref={videoRef} key={videoChoice} className={playing ? 'is-playing' : ''} autoPlay muted loop playsInline preload="metadata" poster={v2['hero-desktop-poster.webp']} aria-hidden="true" onLoadedMetadata={event => { event.currentTarget.playbackRate = 0.65; }} onCanPlay={event => { event.currentTarget.playbackRate = 0.65; }} onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)}>
          <source src={v2['hero-desktop.webm']} type="video/webm" />
          <source src={v2['hero-desktop.mp4']} type="video/mp4" />
        </video>
      )}
      <div className="experience-hero-copy text-foreground">
        <p className="text-primary text-sm font-semibold uppercase mb-4">{t('experience.eyebrow')}</p>
        <h1 className="font-anton uppercase font-normal max-w-[850px]">{t('experience.hero_title')}<br /><span className="text-primary">{t('experience.hero_highlight')}</span></h1>
        <p className="text-foreground/85 text-base md:text-xl leading-relaxed max-w-[520px] mt-4 md:mt-6 mb-5 md:mb-8">{t('experience.hero_description')}</p>
        <div className="experience-hero-ctas flex gap-3 flex-wrap">
          <Button variant="neon" size="lg" onClick={() => scrollTo('signup', 'hero_primary', t('experience.join'))}>{t('experience.join')}</Button>
          <Button variant="outline" size="lg" className="border-foreground/50 text-foreground hover:border-primary hover:text-primary" onClick={() => scrollTo('how-it-works', 'hero_secondary', t('experience.how'))}>{t('experience.how')} ↓</Button>
        </div>
        <p className="experience-hero-note mt-4 text-sm text-white/70">{t('experience.notify')}</p>
        <div className="experience-hero-device" aria-hidden="true">
          <DevicePhone screens={[v2['venue-offer.webp']]} active={0} className="device-hero" eager />
        </div>
      </div>
      <div className="experience-scroll-hint text-xs uppercase text-foreground/70" aria-hidden="true">{t('experience.scroll')}</div>
    </section>
  );
};
