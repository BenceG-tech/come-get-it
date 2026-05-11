import React from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { HeroBackground, PhoneGlowWrapper } from '@/components/HeroBackground';
import { ArrowRight, Compass, CreditCard, Wine, Gift, Rocket, Target, MapPin, BarChart3 } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';
import budapestNightHero from '@/assets/budapest-night-hero.jpg';

const Italmarkak = () => {
  const { t } = useI18n();
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.webp";

  const valueProps = [
    { icon: Target, title: "PRECÍZ CÉLZÁS", description: "A Come Get It közössége budapesti, vendéglátóhelyekre járó fiatal felnőtt." },
    { icon: MapPin, title: "VALÓDI HELYZET", description: "A márkád ott van, ahol a fogyasztó épp dönt — nem hirdetésen, hanem a kezében." },
    { icon: BarChart3, title: "MÉRHETŐ HATÁS", description: "Beváltások, ízlésvisszajelzések, demográfia — minden adatot megosztunk." },
    { icon: Rocket, title: "RUGALMAS KAMPÁNY", description: "Egy hetes kóstoltatástól országos launch-ig — együtt szabjuk a méretet." }
  ];

  const howItWorksSteps = [
    { number: "1", icon: Wine, title: t('brands_page.how_it_works.steps.1.title'), description: t('brands_page.how_it_works.steps.1.description') },
    { number: "2", icon: Compass, title: t('brands_page.how_it_works.steps.2.title'), description: t('brands_page.how_it_works.steps.2.description') },
    { number: "3", icon: Gift, title: t('brands_page.how_it_works.steps.3.title'), description: t('brands_page.how_it_works.steps.3.description') },
    { number: "4", icon: Rocket, title: t('brands_page.how_it_works.steps.4.title'), description: t('brands_page.how_it_works.steps.4.description') }
  ];

  const features = [
    { icon: Compass, title: t('brands_page.features.items.1.title'), description: t('brands_page.features.items.1.description') },
    { icon: CreditCard, title: t('brands_page.features.items.2.title'), description: t('brands_page.features.items.2.description') },
    { icon: Wine, title: t('brands_page.features.items.3.title'), description: t('brands_page.features.items.3.description') },
    { icon: Gift, title: t('brands_page.features.items.4.title'), description: t('brands_page.features.items.4.description') },
    { icon: Rocket, title: t('brands_page.features.items.5.title'), description: t('brands_page.features.items.5.description') }
  ];

  const targetAudience = [
    { icon: Gift, title: t('brands_page.target.items.1.title'), description: t('brands_page.target.items.1.description') },
    { icon: Compass, title: t('brands_page.target.items.2.title'), description: t('brands_page.target.items.2.description') },
    { icon: Wine, title: t('brands_page.target.items.3.title'), description: t('brands_page.target.items.3.description') }
  ];

  const cardCls = "group relative h-full flex flex-col items-center text-center p-6 rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]";
  const chipCls = "mb-4 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500";
  const sectionTitle = "text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight";

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Italmárkáknak — Digitális sampling Budapesten | Come Get It"
        description="Mérhető brand-aktiváció valódi fogyasztási helyzetben. Az italmárka-program a 2. fázisban indul."
        canonical="/italmarkak"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://come-get-it.app/' },
            { '@type': 'ListItem', position: 2, name: 'Italmárkáknak', item: 'https://come-get-it.app/italmarkak' },
          ],
        }}
      />
      <MobileNavigation />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden bg-nf-background">
        <HeroBackground />
        {/* Left dark overlay for text readability */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#03060d] via-[#03060d]/85 to-transparent z-[1] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight uppercase">
                <span className="block text-white mb-2">{t('brands_page.hero.line1')}</span>
                <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('brands_page.hero.line2')}</span>
              </h1>

              <p className="text-base md:text-lg text-white/75 font-medium leading-snug mt-6 max-w-xl mx-auto lg:mx-0">
                {t('brands_page.hero.subtitle')}
              </p>

              <div className="mt-6 mb-6 mx-auto lg:mx-0 max-w-xl border-l-2 border-nf-primary/60 bg-white/[0.03] px-4 py-3 rounded-r-md text-sm text-white/70">
                {t('brands_page.hero.phase_note')}
              </div>

              <Button
                variant="neon"
                size="lg"
                className="py-4 px-10 text-lg"
                onClick={() => {
                  analytics.ctaClick('brand_hero', 'Beszéljünk');
                  const el = document.getElementById('brand-application');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.dispatchEvent(new Event('open-support'));
                  }
                }}
              >
                {t('brands_page.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Phone + cocktail composition */}
            <div className="relative flex justify-center items-center min-h-[480px] lg:min-h-[640px]">
              {/* Dark shadow halo */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 55% 60% at 50% 55%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* Stronger cyan glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,188,212,0.55) 0%, rgba(0,188,212,0.22) 45%, transparent 75%)',
                  filter: 'blur(28px)',
                }}
              />
              {/* Phone */}
              <div className="relative z-10 origin-center [filter:drop-shadow(0_30px_70px_rgba(0,0,0,0.75))_drop-shadow(0_0_45px_rgba(0,188,212,0.35))]">
                <PhoneMockup imageUrl={brandImage} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-nf-background nf-section-glow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('brands_page.how_it_works.title')}</h2>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-fr">
            {/* Cyan connector line (desktop) */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-[10%] right-[10%] top-[88px] h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent z-0"
            />
            {howItWorksSteps.map((step, index) => (
              <div key={index} className={cardCls}>
                <div className="text-2xl font-anton text-nf-primary mb-3">{step.number}</div>
                <div className={chipCls}>
                  <step.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{step.title}</h4>
                <p className="text-xs md:text-sm text-white/60 leading-snug">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-nf-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('brands_page.features.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{feature.title}</h4>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>

          {features[4] && (
            <div className="mt-5 max-w-3xl mx-auto">
              <div className="group relative flex flex-col md:flex-row items-center md:items-start gap-5 p-6 md:p-8 rounded-2xl border border-nf-primary/40 bg-white/[0.04] backdrop-blur-md transition-all duration-500 hover:border-nf-primary/70 hover:shadow-[0_25px_70px_-10px_rgba(0,188,212,0.5)]">
                <div className="shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/50 bg-nf-primary/[0.08] group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  {(() => {
                    const Icon = features[4].icon;
                    return <Icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />;
                  })()}
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{features[4].title}</h4>
                  <p className="text-sm md:text-base text-white/65 leading-relaxed">{features[4].description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4 bg-nf-background nf-section-glow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('brands_page.target.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
            {targetAudience.map((audience, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <audience.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{audience.title}</h4>
                <p className="text-sm text-white/60">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 px-4 bg-nf-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {valueProps.map((item, index) => (
              <div
                key={index}
                className="group relative h-full flex flex-col items-center text-center p-4 rounded-xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:border-nf-primary/60 hover:shadow-[0_15px_45px_-10px_rgba(0,188,212,0.4)]"
              >
                <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <item.icon className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
                </div>
                <div className="text-xs md:text-sm font-bold text-nf-primary mb-1.5 uppercase tracking-wider">{item.title}</div>
                <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — wide cinematic glass banner */}
      <section className="py-16 px-4 bg-nf-background">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-8 md:p-12 lg:p-14 shadow-[0_30px_120px_-30px_rgba(0,188,212,0.45)]">
            {/* Cyan mesh wave decoration on left */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-40"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, black, transparent)',
                maskImage: 'linear-gradient(to right, black, transparent)',
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none" fill="none">
                <path d="M0 80 Q100 40 200 90 T400 70" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.6" />
                <path d="M0 160 Q100 110 200 170 T400 150" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.5" />
                <path d="M0 240 Q100 200 200 250 T400 230" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.4" />
                <path d="M0 320 Q100 280 200 330 T400 310" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.35" />
              </svg>
            </div>
            {/* Blurred bar atmosphere on right */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-1/2 pointer-events-none opacity-25"
              style={{
                backgroundImage: `url(${budapestNightHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(2px)',
                WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
                maskImage: 'linear-gradient(to left, black, transparent)',
              }}
            />
            {/* Cyan glow */}
            <div
              aria-hidden="true"
              className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-nf-primary/15 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-center md:text-left">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase leading-[0.95] tracking-tight">
                  <span className="block text-white">{t('brands_page.final_cta.title_line1')}</span>
                  <span className="block text-nf-primary mt-1 drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('brands_page.final_cta.title_line2')}</span>
                </h2>
                <p className="text-base md:text-lg text-white/70 mt-4 max-w-xl">
                  {t('brands_page.final_cta.subtitle')}
                </p>
              </div>

              <div className="shrink-0 flex justify-center md:justify-end">
                <Button
                  variant="neon"
                  size="lg"
                  className="py-4 px-8 text-base md:text-lg shadow-[0_0_35px_rgba(0,188,212,0.5)]"
                  onClick={() => {
                    analytics.ctaClick('brand_final_cta', 'KAPCSOLATFELVÉTEL');
                    const el = document.getElementById('brand-application');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.dispatchEvent(new Event('open-support'));
                    }
                  }}
                >
                  {t('brands_page.final_cta.cta')}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerApplicationSection id="brand-application" partnerType="brand" />

      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default Italmarkak;
