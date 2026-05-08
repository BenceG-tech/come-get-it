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

const Italmarkak = () => {
  const { t } = useI18n();
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

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

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight uppercase">
                <span className="block text-white mb-2">{t('brands_page.hero.line1')}</span>
                <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('brands_page.hero.line2')}</span>
              </h1>

              <p className="text-base md:text-lg text-white/75 font-medium leading-snug mt-6 max-w-xl mx-auto lg:mx-0">
                {t('brands_page.hero.subtitle')}
              </p>

              <div className="mt-6 mb-6 mx-auto lg:mx-0 max-w-xl border-l-2 border-nf-primary/60 bg-white/[0.03] px-4 py-3 rounded-r-md text-sm text-white/70">
                Az italmárka-aktivációk a 2. fázisban indulnak el — első 15 vendéglátóhely-partner aláírása után.
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

            <PhoneGlowWrapper>
              <PhoneMockup imageUrl={brandImage} />
            </PhoneGlowWrapper>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-nf-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('brands_page.how_it_works.title')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
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
            {features.map((feature, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{feature.title}</h4>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 px-4 bg-nf-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('brands_page.target.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {valueProps.map((item, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-bold text-white mb-2 uppercase tracking-wider group-hover:text-nf-primary transition-colors">{item.title}</div>
                <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-nf-background text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-anton uppercase leading-[0.9] tracking-tight">
            <span className="block text-white">{t('brands_page.final_cta.title_line1')}</span>
            <span className="block text-nf-primary mt-2 drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('brands_page.final_cta.title_line2')}</span>
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 mt-6">
            {t('brands_page.final_cta.subtitle')}
          </p>

          <Button
            variant="neon"
            size="lg"
            className="py-4 px-10 text-lg"
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
      </section>

      <PartnerApplicationSection id="brand-application" partnerType="brand" />

      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default Italmarkak;
