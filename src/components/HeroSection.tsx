import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/components/MobileNavigation';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';
import { v2 } from '@/lib/web-experience-v2';
import { DevicePhone } from '@/components/experience/DevicePhone';
import { CocktailGlass, CocktailState, FULL_COCKTAIL, applyCocktail } from '@/components/experience/CocktailGlass';
import './WebExperience.css';

export const HeroSection: React.FC = () => {
  const { t } = useI18n();
  // The hero glass builds itself once on load: ice, pour, cucumber ribbon, lime.
  const glassRef = useRef<SVGSVGElement>(null);
  const portraitGlassRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const apply = (state: CocktailState) => [glassRef.current, portraitGlassRef.current].forEach(svg => applyCocktail(svg, state));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(FULL_COCKTAIL); return; }
    const span = (x: number, a: number, b: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
    const start = performance.now() + 500, duration = 2600;
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.max(0, (now - start) / duration);
      apply({ ice: span(k, 0, 0.2), fill: 0.86 * span(k, 0.15, 0.65), pour: k > 0.15 && k < 0.66 ? 1 : 0, ribbon: span(k, 0.6, 0.82), lime: span(k, 0.78, 1) });
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

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
      {/* Still backgrounds everywhere: the old hero video had a baked-in, footless glass and an outdated app screen. */}
      <picture>
        <source media="(max-aspect-ratio: 1/1)" srcSet={v2['bg-1-mobile.webp']} />
        <img className="experience-poster" src={v2['bg-1-desktop.webp']} alt="" aria-hidden="true" width={1920} height={1080} />
      </picture>
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
          <div className="hero-glass hero-glass-portrait"><CocktailGlass ref={portraitGlassRef} state={{ fill: 0 }} /></div>
        </div>
      </div>
      <div className="experience-hero-stage" aria-hidden="true">
        <DevicePhone screens={[v2['venue-offer.webp']]} active={0} className="device-hero-stage" eager />
        <div className="hero-glass"><CocktailGlass ref={glassRef} state={{ fill: 0 }} /></div>
      </div>
      <div className="experience-scroll-hint text-xs uppercase text-foreground/70" aria-hidden="true">{t('experience.scroll')}</div>
    </section>
  );
};
