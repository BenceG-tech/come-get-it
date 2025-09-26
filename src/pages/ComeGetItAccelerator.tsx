import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Check, Users, Target, TrendingUp, BarChart, Heart, Zap, Clock, MessageCircle, Eye, Globe, Award, Rocket, FlaskConical, Activity, Play, FileText, Wine, NotebookPen } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';
import { HeroTitle, HeroSubtitle, SectionTitle, CTATitle } from '@/components/ui/typography';
import PartnerApplicationSection from '@/components/PartnerApplicationSection';
import { useI18n } from '@/hooks/useI18n';

const ComeGetItAccelerator = () => {
  const { t } = useI18n();
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";

  // Analytics tracking
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
      
      // Lead engagement scoring
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
    { number: "1", title: t('accelerator_page.how_it_works.steps.1.title'), description: t('accelerator_page.how_it_works.steps.1.description'), icon: NotebookPen },
    { number: "2", title: t('accelerator_page.how_it_works.steps.2.title'), description: t('accelerator_page.how_it_works.steps.2.description'), icon: Wine },
    { number: "3", title: t('accelerator_page.how_it_works.steps.3.title'), description: t('accelerator_page.how_it_works.steps.3.description'), icon: MessageCircle },
    { number: "4", title: t('accelerator_page.how_it_works.steps.4.title'), description: t('accelerator_page.how_it_works.steps.4.description'), icon: Rocket }
  ];

  const freshFeatures = [
    t('accelerator_page.packages.fresh.features.1'),
    t('accelerator_page.packages.fresh.features.2'),
    t('accelerator_page.packages.fresh.features.3'),
    t('accelerator_page.packages.fresh.features.4'),
    t('accelerator_page.packages.fresh.features.5'),
    t('accelerator_page.packages.fresh.features.6')
  ];

  const superFreshFeatures = [
    t('accelerator_page.packages.super_fresh.features.1'),
    t('accelerator_page.packages.super_fresh.features.2'),
    t('accelerator_page.packages.super_fresh.features.3'),
    t('accelerator_page.packages.super_fresh.features.4'),
    t('accelerator_page.packages.super_fresh.features.5'),
    t('accelerator_page.packages.super_fresh.features.6')
  ];

  const benefits = [
    { icon: Zap, title: t('accelerator_page.why_us.items.1.title'), description: t('accelerator_page.why_us.items.1.description') },
    { icon: Target, title: t('accelerator_page.why_us.items.2.title'), description: t('accelerator_page.why_us.items.2.description') },
    { icon: BarChart, title: t('accelerator_page.why_us.items.3.title'), description: t('accelerator_page.why_us.items.3.description') },
    { icon: Heart, title: t('accelerator_page.why_us.items.4.title'), description: t('accelerator_page.why_us.items.4.description') }
  ];

  const stats = [
    { number: "24", label: t('accelerator_page.demo_stats.items.1.label'), icon: Users },
    { number: "91%", label: t('accelerator_page.demo_stats.items.2.label'), icon: TrendingUp },
    { number: "56%", label: t('accelerator_page.demo_stats.items.3.label'), icon: Heart },
    { number: "85%", label: t('accelerator_page.demo_stats.items.4.label'), icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section - Standardized */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <HeroTitle>
                <span className="block text-white mb-2">{t('accelerator_page.hero.line1')}</span>
                <span className="block text-electric-300">{t('accelerator_page.hero.line2')}</span>
              </HeroTitle>
              
              <HeroSubtitle>
                {t('accelerator_page.hero.subtitle')}
              </HeroSubtitle>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-300/20 border-0"
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
            
            {/* Right side - Phone Mockup */}
            <div className="flex justify-center">
              <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 2x2 Grid */}
      <section className="py-16 px-4 pb-20 bg-white/5 backdrop-blur-sm" lang="hu">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle className="text-4xl md:text-5xl">
              {t('accelerator_page.how_it_works.title')}
            </SectionTitle>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-2xl p-6 md:p-8 text-center group hover:scale-105 hover:shadow-lg hover:shadow-electric-300/20 transition-all duration-300 flex flex-col items-center justify-between h-full"
              >
                <div className="flex flex-col items-center flex-grow">
                  <div className="text-3xl md:text-4xl font-black text-electric-300 mb-4">
                    {step.number}
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <step.icon className="w-7 h-7 md:w-8 md:h-8 text-electric-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <h4 className="text-sm md:text-lg font-black text-white mb-3 group-hover:text-electric-300 transition-colors duration-300 text-center break-words [hyphens:auto] [text-wrap:balance]">
                    {step.title}
                  </h4>
                </div>
                
                <p className="text-xs md:text-base text-electric-100 leading-tight text-center break-words [hyphens:auto] [text-wrap:balance] mt-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Packages */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle className="text-4xl md:text-5xl">
              {t('accelerator_page.packages.title')}
            </SectionTitle>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fresh Package */}
            <div 
              className="glass-effect rounded-3xl p-8 border-2 border-electric-300/30 shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => analytics.acceleratorPackageView('fresh')}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-4xl font-black text-electric-300">{t('accelerator_page.packages.fresh.title')}</h3>
                <Award className="w-10 h-10 text-electric-300" />
              </div>
              
              <div className="space-y-4">
                {freshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <p className="text-base text-electric-100 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Super Fresh Package */}
            <div 
              className="glass-effect rounded-3xl p-8 border-2 border-green-400/30 shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => analytics.acceleratorPackageView('super_fresh')}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-4xl font-black text-green-400">{t('accelerator_page.packages.super_fresh.title')}</h3>
                <Zap className="w-10 h-10 text-green-400" />
              </div>
              
              <div className="space-y-4">
                {superFreshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <p className="text-base text-electric-100 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 2x2 Grid */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle className="text-4xl md:text-5xl">
              {t('accelerator_page.why_us.title')}
            </SectionTitle>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <benefit.icon className="w-16 h-16 mx-auto mb-6 text-electric-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <h4 className="text-xl font-black text-white mb-3 group-hover:text-electric-300 transition-colors duration-300">{benefit.title}</h4>
                <p className="text-base text-electric-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Demographics - 2x2 Grid */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle className="text-4xl md:text-5xl">
              {t('accelerator_page.demo_stats.title')}
            </SectionTitle>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-electric-300 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-black text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-electric-100 font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-ocean-900 text-center">
        <div className="max-w-4xl mx-auto">
          <CTATitle className="text-5xl md:text-6xl">
            {t('accelerator_page.final_cta.title')}
          </CTATitle>
          <p className="text-xl text-electric-100 mb-10 leading-relaxed">
            {t('accelerator_page.final_cta.subtitle_line1')}<br />
            {t('accelerator_page.final_cta.subtitle_line2')}
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-6 px-16 text-xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
            onClick={() => {
              analytics.ctaClick('final_cta', 'JELENTKEZZ MOST');
              analytics.acceleratorApplicationStart();
              const el = document.getElementById('accelerator-application');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.dispatchEvent(new Event('open-support'));
              }
            }}
          >
            {t('accelerator_page.final_cta.cta')}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      <PartnerApplicationSection id="accelerator-application" partnerType="accelerator" />

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
