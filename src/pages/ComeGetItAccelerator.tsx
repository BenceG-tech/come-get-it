import React, { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { HeroBackground, PhoneGlowWrapper } from '@/components/HeroBackground';
import { ArrowRight, MessageCircle, Rocket, FileSignature, UserCog, Gift, Award, Wallet, Megaphone, Handshake } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';

const ComeGetItAccelerator = () => {
  const { t } = useI18n();
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";

  useEffect(() => {
    analytics.acceleratorPageView();
    analytics.pageView('come_get_it_accelerator');

    const startTime = Date.now();
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (scrollPercent >= 25 && scrollPercent < 50) {
          analytics.scrollDepth(25, 'come_get_it_accelerator');
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          analytics.scrollDepth(50, 'come_get_it_accelerator');
        } else if (scrollPercent >= 75) {
          analytics.scrollDepth(75, 'come_get_it_accelerator');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      const duration = Math.round((Date.now() - startTime) / 1000);
      analytics.timeOnPage(duration, 'come_get_it_accelerator');

      if (duration > 60 || maxScrollDepth > 50) {
        analytics.leadEngagement('high', 'come_get_it_accelerator');
        analytics.leadQualification(85, 'accelerator_prospect');
      } else if (duration > 30 || maxScrollDepth > 25) {
        analytics.leadEngagement('medium', 'come_get_it_accelerator');
        analytics.leadQualification(65, 'accelerator_prospect');
      } else {
        analytics.leadEngagement('low', 'come_get_it_accelerator');
        analytics.leadQualification(35, 'accelerator_prospect');
      }
    };
  }, []);

  const howItWorksSteps = [
    { number: "1", title: "Beszélgetünk", description: "Online vagy személyesen találkozunk. Megmutatjuk az appot és válaszolunk minden kérdésedre.", icon: MessageCircle },
    { number: "2", title: "Aláírjuk a Letter of Intent-et", description: "Egyszerű szándéknyilatkozat, hogy szeptemberben együtt indulunk.", icon: FileSignature },
    { number: "3", title: "Beállítjuk a profilodat", description: "Felvesszük az adataidat, ajánlataidat, időablakaidat. Te döntöd el, mit, mikor és kinek.", icon: UserCog },
    { number: "4", title: "Elindulunk szeptember 1-én", description: "Founding Partner badge-eddel az első naptól megjelensz az appban — közös launch-kampánnyal.", icon: Rocket },
    { number: "5", title: "Az első 6 hónap jutalékmentes", description: "Pénz csak akkor lép be a képbe, ha mindketten azt látjuk, hogy működik.", icon: Gift }
  ];

  const benefits = [
    { icon: Award, title: "EXKLUZÍV STÁTUSZ", description: "Founding Partner badge örökre az appban — örök megkülönböztetés a később csatlakozóktól." },
    { icon: Wallet, title: "NULLA RIZIKÓ", description: "6 hónap teljesen jutalékmentes. Nincs setup-fee, nincs hosszú szerződés, bármikor kiléphetsz." },
    { icon: Megaphone, title: "KÖZÖS LAUNCH-PR", description: "Sajtómegjelenés, social media kampány, dedikált tartalom — közösen erősítjük az indulást." },
    { icon: Handshake, title: "LIFETIME ELŐNYÖK", description: "Alacsonyabb jutalék-sáv örökre, korai hozzáférés a brand-kampányokhoz, prioritás minden új feature-nél." }
  ];

  const cardCls = "group relative h-full flex flex-col items-center text-center p-6 md:p-7 rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]";
  const chipCls = "mb-4 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500";
  const sectionTitle = "text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight";

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Founding Partner Program — Csatlakozz korán | Come Get It"
        description="A Come Get It Founding Partner Program vendéglátóknak, italmárkáknak és rewards-partnereknek. Korai hozzáférés, exkluzív feltételek, lifetime preferred státusz."
        canonical="/come-get-it-accelerator"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://come-get-it.app/' },
            { '@type': 'ListItem', position: 2, name: 'Accelerator', item: 'https://come-get-it.app/come-get-it-accelerator' },
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
                <span className="block text-white mb-2">{t('accelerator_page.hero.line1')}</span>
                <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('accelerator_page.hero.line2')}</span>
              </h1>

              <p className="text-base md:text-lg text-white/75 font-medium leading-snug mt-6 max-w-xl mx-auto lg:mx-0 mb-8">
                {t('accelerator_page.hero.subtitle')}
              </p>

              <Button
                variant="neon"
                size="lg"
                className="py-4 px-10 text-lg"
                onClick={() => {
                  analytics.ctaClick('hero_section', 'Jelentkezz most!');
                  analytics.acceleratorApplicationStart();
                  const el = document.getElementById('accelerator-application');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.dispatchEvent(new Event('open-support'));
                  }
                }}
              >
                {t('accelerator_page.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <PhoneGlowWrapper>
              <PhoneMockup imageUrl={acceleratorImage} />
            </PhoneGlowWrapper>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-nf-surface" lang="hu">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={sectionTitle}>Hogyan működik?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className={cardCls}>
                <div className="text-2xl md:text-3xl font-anton text-nf-primary mb-3">{step.number}</div>
                <div className={chipCls}>
                  <step.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-nf-primary transition-colors text-center break-words [hyphens:auto] [text-wrap:balance]">{step.title}</h4>
                <p className="text-xs md:text-sm text-white/60 leading-snug text-center mt-auto break-words [hyphens:auto] [text-wrap:balance]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-nf-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={sectionTitle}>Miért válassz minket?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <benefit.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-nf-primary transition-colors">{benefit.title}</h4>
                <p className="text-sm md:text-base text-white/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-nf-background text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-anton uppercase leading-[0.9] tracking-tight">
            <span className="block text-white">Csatlakozz</span>
            <span className="block text-nf-primary mt-2 drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">az elsők közé</span>
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-10 mt-6 leading-relaxed">
            Légy te az egyik első Founding Partner — vendéglátóhelyként, italmárkaként vagy rewards-partnerként.
          </p>

          <Button
            variant="neon"
            size="lg"
            className="py-4 px-12 text-lg"
            onClick={() => {
              analytics.ctaClick('final_cta', 'Jelentkezem most');
              analytics.acceleratorApplicationStart();
              const el = document.getElementById('accelerator-application');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.dispatchEvent(new Event('open-support'));
              }
            }}
          >
            Jelentkezem most
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </section>

      <PartnerApplicationSection id="accelerator-application" partnerType="accelerator" />

      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default ComeGetItAccelerator;
