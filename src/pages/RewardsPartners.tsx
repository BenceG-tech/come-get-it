import React, { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { HeroBackground } from '@/components/HeroBackground';
import { ArrowRight, Gift, Settings, Zap, BarChart, Users, BarChart3, Handshake } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';
import budapestNightHero from '@/assets/budapest-night-hero.jpg';

const RewardsPartners = () => {
  const { t } = useI18n();
  const rewardsImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  useEffect(() => {
    analytics.rewardsPageView();
    analytics.pageView('rewards_partners');

    const startTime = Date.now();
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (scrollPercent >= 25 && scrollPercent < 50) {
          analytics.scrollDepth(25, 'rewards_partners');
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          analytics.scrollDepth(50, 'rewards_partners');
        } else if (scrollPercent >= 75) {
          analytics.scrollDepth(75, 'rewards_partners');
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className;
          analytics.sectionView(sectionId, 'rewards_partners');
          analytics.rewardsFeatureView(sectionId);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();

      const duration = Math.round((Date.now() - startTime) / 1000);
      analytics.timeOnPage(duration, 'rewards_partners');

      if (duration > 75 || maxScrollDepth > 55) {
        analytics.leadEngagement('high', 'rewards_partners');
        analytics.leadQualification(80, 'rewards_prospect');
      } else if (duration > 40 || maxScrollDepth > 30) {
        analytics.leadEngagement('medium', 'rewards_partners');
        analytics.leadQualification(60, 'rewards_prospect');
      } else {
        analytics.leadEngagement('low', 'rewards_partners');
        analytics.leadQualification(30, 'rewards_prospect');
      }
    };
  }, []);

  const howItWorksSteps = [
    { number: "1", icon: Gift, title: t('rewards_page.how_it_works.steps.1.title'), description: t('rewards_page.how_it_works.steps.1.description') },
    { number: "2", icon: Settings, title: t('rewards_page.how_it_works.steps.2.title'), description: t('rewards_page.how_it_works.steps.2.description') },
    { number: "3", icon: Zap, title: t('rewards_page.how_it_works.steps.3.title'), description: t('rewards_page.how_it_works.steps.3.description') },
    { number: "4", icon: BarChart, title: t('rewards_page.how_it_works.steps.4.title'), description: t('rewards_page.how_it_works.steps.4.description') }
  ];

  const features = [
    { icon: Gift, title: t('rewards_page.features.items.1.title'), description: t('rewards_page.features.items.1.description') },
    { icon: Users, title: t('rewards_page.features.items.2.title'), description: t('rewards_page.features.items.2.description') },
    { icon: Zap, title: t('rewards_page.features.items.3.title'), description: t('rewards_page.features.items.3.description') }
  ];

  const valueProps = [
    { icon: Users, title: 'ÚJ KÖZÖNSÉG', description: 'Olyan emberekhez jutsz el, akik aktívan keresnek élményt a városban.' },
    { icon: Gift, title: 'POZITÍV BRAND-ÉLMÉNY', description: 'A jutalom egy boldog pillanatban kapcsolódik a márkádhoz — ez a legjobb fajta marketing.' },
    { icon: BarChart3, title: 'MÉRHETŐ BEVÁLTÁS', description: 'Pontosan látod, hányan aktiválták és használták az ajánlatodat.' },
    { icon: Handshake, title: 'KÖZÖS KAMPÁNYOK', description: 'Hírlevél, app highlight, social media — együtt erősítjük a kampányt.' }
  ];

  const cardCls = "group relative h-full flex flex-col items-center text-center p-6 rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]";
  const chipCls = "mb-4 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500";
  const sectionTitle = "text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight";

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Rewards Partnereknek — Legyél beváltható jutalom | Come Get It"
        description="Add a saját termékedet a Come Get It közösségnek. A rewards-program a 2. fázisban indul."
        canonical="/rewards-partners"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://come-get-it.app/' },
            { '@type': 'ListItem', position: 2, name: 'Rewards Partnerek', item: 'https://come-get-it.app/rewards-partners' },
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
                <span className="block text-white mb-2">{t('rewards_page.hero.line1')}</span>
                <span className="block text-nf-primary drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]">{t('rewards_page.hero.line2')}</span>
              </h1>

              <p className="text-base md:text-lg text-white/75 font-medium leading-snug mt-6 max-w-xl mx-auto lg:mx-0">
                {t('rewards_page.hero.subtitle')}
              </p>

              <div className="mt-6 mb-6 mx-auto lg:mx-0 max-w-xl border-l-2 border-nf-primary/60 bg-white/[0.03] px-4 py-3 rounded-r-md text-sm text-white/70">
                A rewards-partnerprogram a 2. fázisban indul, miután az első felhasználói bázis kialakul.
              </div>

              <Button
                variant="neon"
                size="lg"
                className="py-4 px-10 text-lg"
                onClick={() => {
                  analytics.ctaClick('hero_section', 'Legyünk rewards partner');
                  analytics.rewardsPartnerApplicationStart();
                  const el = document.getElementById('rewards-application');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.dispatchEvent(new Event('open-support'));
                  }
                }}
              >
                {t('rewards_page.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Phone composition */}
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
              {/* Cyan mesh wave decoration on right */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-25"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, black, transparent 90%)',
                  maskImage: 'linear-gradient(to right, black, transparent 90%)',
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none" fill="none">
                  <path d="M0 60 Q120 20 240 80 T400 60" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.55" />
                  <path d="M0 160 Q120 110 240 180 T400 160" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.45" />
                  <path d="M0 280 Q120 230 240 300 T400 280" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.4" />
                  <path d="M0 400 Q120 350 240 420 T400 400" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.35" />
                  <path d="M0 520 Q120 470 240 540 T400 520" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.3" />
                </svg>
              </div>
              <div className="relative z-10 lg:scale-[1.22] xl:scale-[1.32] origin-center [filter:drop-shadow(0_30px_70px_rgba(0,0,0,0.75))_drop-shadow(0_0_45px_rgba(0,188,212,0.35))]">
                <PhoneMockup imageUrl={rewardsImage} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-nf-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={sectionTitle}>{t('rewards_page.how_it_works.title')}</h2>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-fr">
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-[10%] right-[10%] top-[88px] h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent z-0"
            />
            {howItWorksSteps.map((step, index) => (
              <div key={index} className={`${cardCls} z-10`}>
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

      {/* Features — larger horizontal glass cards */}
      <section className="py-16 px-4 bg-nf-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={sectionTitle}>{t('rewards_page.features.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {features.map((feature, index) => {
              const isLastOdd = features.length % 2 === 1 && index === features.length - 1;
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_25px_70px_-10px_rgba(0,188,212,0.5)] ${isLastOdd ? 'md:col-span-2 md:max-w-3xl md:mx-auto md:w-full' : ''}`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-[0.08]"
                    style={{
                      backgroundImage: `url(${budapestNightHero})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
                      maskImage: 'linear-gradient(to left, black, transparent)',
                    }}
                  />
                  <div className="relative z-10 flex flex-col md:flex-row gap-5 items-center md:items-start text-center md:text-left">
                    <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl border border-nf-primary/40 bg-nf-primary/[0.08] group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.5)] transition-all duration-500">
                      <feature.icon className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">{feature.title}</h4>
                      <p className="text-sm md:text-base text-white/65 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 px-4 bg-nf-surface">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`${sectionTitle} mb-10`}>A jutalom-partnerség előnyei</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 auto-rows-fr">
            {valueProps.map((item, index) => (
              <div key={index} className={cardCls}>
                <div className={chipCls}>
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
                <h4 className="text-sm font-bold text-nf-primary mb-2 uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-white/60 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerApplicationSection id="rewards-application" partnerType="rewards" />

      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default RewardsPartners;
