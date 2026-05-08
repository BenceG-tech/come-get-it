import React from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Compass, CreditCard, Wine, Gift, Rocket, Target, MapPin, BarChart3 } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { analytics } from '@/lib/analytics';
import { HeroTitle, HeroSubtitle, SectionTitle, CTATitle } from '@/components/ui/typography';
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
      
      {/* Hero Section - Standardized */}
      <section className="relative pt-28 md:pt-32 pb-16 px-4 overflow-hidden">
        {/* Background - unified with main hero */}
        <div className="hero-abstract-bg">
          <div className="hero-shape-1"></div>
          <div className="hero-shape-2"></div>
          <div className="hero-glow-accent"></div>
          <div className="hero-glow-secondary"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <HeroTitle>
                <span className="block text-white">{t('brands_page.hero.line1')}</span>
                <span className="block text-electric-300">{t('brands_page.hero.line2')}</span>
              </HeroTitle>
              
              <HeroSubtitle>
                {t('brands_page.hero.subtitle')}
              </HeroSubtitle>

              <div className="mt-4 mb-6 mx-auto lg:mx-0 max-w-xl border-l-2 border-electric-300 bg-white/5 px-4 py-3 rounded-r-md text-sm text-white/70">
                Az italmárka-aktivációk a 2. fázisban indulnak el — első 15 vendéglátóhely-partner aláírása után.
              </div>
              
              <Button 
                variant="neon"
                size="lg" 
                className="py-4 px-8 text-lg"
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
            
            {/* Right side - Phone Mockup */}
            <div className="flex justify-center">
              <PhoneMockup imageUrl={brandImage} className="animate-glow-pulse scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Step 2x2 Grid */}
      <section className="py-12 px-4 bg-nf-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionTitle>
              {t('brands_page.how_it_works.title')}
            </SectionTitle>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {howItWorksSteps.map((step, index) => (
              <ServiceCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                badge={step.number}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features - 2x2 Grid */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionTitle>
              {t('brands_page.features.title')}
            </SectionTitle>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <ServiceCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - Kompakt 3 kártya */}
      <section className="py-12 px-4 bg-nf-background nf-section-glow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionTitle>
              {t('brands_page.target.title')}
            </SectionTitle>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {targetAudience.map((audience, index) => (
              <ServiceCard
                key={index}
                icon={audience.icon}
                title={audience.title}
                description={audience.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props Section - 2x2 / 4-col Grid */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {valueProps.map((item, index) => (
              <ServiceCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Kompaktabb */}
      <section className="py-12 px-4 bg-black text-center">
        <div className="max-w-3xl mx-auto">
          <CTATitle>
            {t('brands_page.final_cta.title_line1')}
            <span className="block text-electric-300 mt-2">{t('brands_page.final_cta.title_line2')}</span>
          </CTATitle>
          <p className="text-base text-electric-100 mb-8">
            {t('brands_page.final_cta.subtitle')}
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
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
