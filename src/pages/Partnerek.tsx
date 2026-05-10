import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { HeroBackground } from '@/components/HeroBackground';
import { ArrowRight, Check, Store, Wine, Gift, Rocket, type LucideIcon } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

type PartnerSection = {
  key: 'venues' | 'brands' | 'rewards';
  phase: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
};

const Partnerek = () => {
  const { t } = useI18n();

  useEffect(() => {
    analytics.pageView('partnerek');
  }, []);

  const sections: PartnerSection[] = [
    {
      key: 'venues',
      phase: t('partners_page.sections.venues.phase'),
      title: t('partners_page.sections.venues.title'),
      description: t('partners_page.sections.venues.description'),
      bullets: [
        t('partners_page.sections.venues.bullets.1'),
        t('partners_page.sections.venues.bullets.2'),
        t('partners_page.sections.venues.bullets.3'),
      ],
      ctaLabel: t('partners_page.sections.venues.cta'),
      href: '/vendeglatohelyek',
      icon: Store,
    },
    {
      key: 'brands',
      phase: t('partners_page.sections.brands.phase'),
      title: t('partners_page.sections.brands.title'),
      description: t('partners_page.sections.brands.description'),
      bullets: [
        t('partners_page.sections.brands.bullets.1'),
        t('partners_page.sections.brands.bullets.2'),
        t('partners_page.sections.brands.bullets.3'),
      ],
      ctaLabel: t('partners_page.sections.brands.cta'),
      href: '/italmarkak',
      icon: Wine,
    },
    {
      key: 'rewards',
      phase: t('partners_page.sections.rewards.phase'),
      title: t('partners_page.sections.rewards.title'),
      description: t('partners_page.sections.rewards.description'),
      bullets: [
        t('partners_page.sections.rewards.bullets.1'),
        t('partners_page.sections.rewards.bullets.2'),
        t('partners_page.sections.rewards.bullets.3'),
      ],
      ctaLabel: t('partners_page.sections.rewards.cta'),
      href: '/rewards-partners',
      icon: Gift,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Partnerek — Vendéglátóhely, italmárka, rewards | Come Get It"
        description="Három mód, ahogyan csatlakozhatsz a Come Get It-hez: vendéglátóhelyként, italmárkaként vagy rewards-partnerként."
        canonical="/partnerek"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://come-get-it.app/' },
            { '@type': 'ListItem', position: 2, name: 'Partnerek', item: 'https://come-get-it.app/partnerek' },
          ],
        }}
      />
      <MobileNavigation />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden bg-nf-background">
          <HeroBackground />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary">
                {t('partners_page.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-anton leading-[0.9] tracking-tight uppercase">
              <span className="block text-white mb-2">{t('partners_page.hero.line1')}</span>
              <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">
                {t('partners_page.hero.line2')}
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/75 font-medium max-w-2xl mx-auto leading-relaxed">
              {t('partners_page.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* 3 partner sections */}
        {sections.map((s, idx) => {
          const Icon = s.icon;
          return (
            <section
              key={s.key}
              className={`py-12 px-4 ${idx % 2 === 0 ? 'bg-nf-background' : 'bg-nf-surface'}`}
            >
              <div className="max-w-5xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-6 md:p-10 transition-all duration-500 hover:border-nf-primary/60 hover:shadow-[0_25px_70px_-10px_rgba(0,188,212,0.4)]">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.08] mx-auto md:mx-0">
                      <Icon className="w-7 h-7 text-nf-primary" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold tracking-wider uppercase border border-nf-primary/40 bg-nf-primary/10 text-nf-primary mb-4">
                        {s.phase}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-anton uppercase text-white tracking-tight mb-3">
                        {s.title}
                      </h2>
                      <p className="text-base md:text-lg text-white/75 leading-relaxed mb-5">
                        {s.description}
                      </p>

                      <ul className="space-y-2 mb-6 inline-block text-left">
                        {s.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm md:text-base text-white/80">
                            <Check className="w-5 h-5 text-nf-primary shrink-0 mt-0.5" strokeWidth={2} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div>
                        <Button
                          variant="neon"
                          size="lg"
                          className="py-4 px-8 text-base"
                          asChild
                          onClick={() => analytics.ctaClick('partners_page', s.key)}
                        >
                          <Link to={s.href}>
                            {s.ctaLabel}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Founding Partner closing banner */}
        <section className="py-16 px-4 bg-nf-background">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-nf-primary/40 bg-white/[0.04] backdrop-blur-md p-8 md:p-12 shadow-[0_30px_120px_-30px_rgba(0,188,212,0.45)] text-center">
              <div
                aria-hidden="true"
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-nf-primary/20 blur-3xl pointer-events-none"
              />
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border border-nf-primary/50 bg-nf-primary/[0.08]">
                    <Rocket className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase leading-[0.95] tracking-tight">
                  <span className="block text-white">{t('partners_page.founding.title_line1')}</span>
                  <span className="block text-nf-primary mt-1 drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">
                    {t('partners_page.founding.title_line2')}
                  </span>
                </h2>
                <p className="text-base md:text-lg text-white/75 mt-5 max-w-2xl mx-auto leading-relaxed">
                  {t('partners_page.founding.body')}
                </p>
                <div className="mt-8">
                  <Button
                    variant="neon"
                    size="lg"
                    className="py-4 px-8 text-base md:text-lg"
                    asChild
                    onClick={() => analytics.ctaClick('partners_page', 'founding_partner_program')}
                  >
                    <Link to="/come-get-it-accelerator">
                      {t('partners_page.founding.cta')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default Partnerek;
