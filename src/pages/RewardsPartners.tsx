import React, { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Gift, Settings, Zap, BarChart, Users, BarChart3, Handshake } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import { HeroTitle, HeroSubtitle, SectionTitle } from '@/components/ui/typography';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';

const RewardsPartners = () => {
  const { t } = useI18n();
  const rewardsImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  // Analytics tracking
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

    // Track feature views
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
      
      // Lead engagement scoring for rewards partners
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
                <span className="block text-white mb-2">{t('rewards_page.hero.line1')}</span>
                <span className="block text-electric-300">{t('rewards_page.hero.line2')}</span>
              </HeroTitle>
              
              <HeroSubtitle>
                {t('rewards_page.hero.subtitle')}
              </HeroSubtitle>

              <div className="mt-4 mb-6 mx-auto lg:mx-0 max-w-xl border-l-2 border-electric-300 bg-white/5 px-4 py-3 rounded-r-md text-sm text-white/70">
                A rewards-partnerprogram a 2. fázisban indul, miután az első felhasználói bázis kialakul.
              </div>
              
              <Button 
                variant="neon"
                size="lg" 
                className="py-4 px-8 text-lg"
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
            
            {/* Right side - Phone Mockup */}
            <div className="flex justify-center">
              <PhoneMockup imageUrl={rewardsImage} className="animate-glow-pulse scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Egységes 2x2 grid */}
      <section className="py-12 px-4 bg-nf-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionTitle>
              {t('rewards_page.how_it_works.title')}
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

      {/* Features Section - Kompaktabb grid */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle>
              {t('rewards_page.features.title')}
            </SectionTitle>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30">
                    <feature.icon className="w-6 h-6 text-electric-300" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-electric-100 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics - Kompaktabb */}
      <section className="py-12 px-4 bg-nf-background nf-section-glow">
        <div className="max-w-7xl mx-auto text-center">
          <SectionTitle>
              A jutalom-partnerség előnyei
            </SectionTitle>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valueProps.map((item, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30">
                    <item.icon className="w-6 h-6 text-electric-300" />
                  </div>
                </div>
                <h4 className="text-sm font-black text-white mb-2">{item.title}</h4>
                <p className="text-xs text-electric-100 leading-tight">{item.description}</p>
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
