import React from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Compass, CreditCard, Wine, Gift, Rocket } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import { HeroTitle, HeroSubtitle, SectionTitle, CTATitle } from '@/components/ui/typography';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';

const Italmarkak = () => {
  const { t } = useI18n();
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const statistics = [
    { icon: Compass, number: "246+", label: t('brands_page.stats.labels.1') },
    { icon: Wine, number: "91%", label: t('brands_page.stats.labels.2') },
    { icon: Gift, number: "250+", label: t('brands_page.stats.labels.3') },
    { icon: CreditCard, number: "4.8", label: t('brands_page.stats.labels.4') }
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
    { icon: Gift, title: t('brands_page.features.items.4.title'), description: t('brands_page.features.items.4.description') }
  ];

  const targetAudience = [
    { icon: Gift, title: t('brands_page.target.items.1.title'), description: t('brands_page.target.items.1.description') },
    { icon: Compass, title: t('brands_page.target.items.2.title'), description: t('brands_page.target.items.2.description') },
    { icon: Wine, title: t('brands_page.target.items.3.title'), description: t('brands_page.target.items.3.description') }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Italmárkáknak – Come Get It Partner"
        description="Érd el közvetlenül a fogyasztókat. Italmárkaként mérhető kampányok és aktivációk a Come Get It appban."
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
              <div 
                key={index} 
                className="glass-effect rounded-xl p-6 text-center group hover:scale-105 hover:shadow-lg hover:shadow-electric-300/20 transition-all duration-300"
              >
                <div className="text-2xl font-black text-electric-300 mb-3">
                  {step.number}
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <step.icon className="w-6 h-6 text-electric-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h4 className="text-sm font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                  {step.title}
                </h4>
                
                <p className="text-xs text-electric-100 leading-tight">
                  {step.description}
                </p>
              </div>
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
              <div key={index} className="glass-effect rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <feature.icon className="w-12 h-12 mx-auto mb-3 text-electric-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <h4 className="text-lg font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">{feature.title}</h4>
                <p className="text-sm text-electric-100">{feature.description}</p>
              </div>
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
              <div key={index} className="glass-effect rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <audience.icon className="w-12 h-12 mx-auto mb-3 text-electric-300 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-lg font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">{audience.title}</h4>
                <p className="text-sm text-electric-100">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - 2x2 Grid */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {statistics.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-all duration-300">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-electric-300 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl font-black text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-electric-100 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
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
