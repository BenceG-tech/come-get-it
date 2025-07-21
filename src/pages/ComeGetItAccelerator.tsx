
import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Check, Users, Target, TrendingUp, BarChart, Heart, Zap, Clock, MessageCircle, Eye, Globe, Award, Rocket, FlaskConical, Activity, Play, FileText, Wine, NotebookPen } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';

const ComeGetItAccelerator = () => {
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
    {
      number: "1",
      title: "JELENTKEZZ",
      description: "Töltsd ki a pilot jelentkezést",
      icon: NotebookPen
    },
    {
      number: "2", 
      title: "TESZTELD",
      description: "Közösségünk kipróbálja az italodat",
      icon: Wine
    },
    {
      number: "3",
      title: "GYŰJTS VISSZAJELZÉST",
      description: "Valódi, mérhető fogyasztói vélemények",
      icon: MessageCircle
    },
    {
      number: "4",
      title: "SKÁLÁZD FEL",
      description: "Indítsd el több helyen – növeld az eladásokat!",
      icon: Rocket
    }
  ];

  const freshFeatures = [
    "Minimum 5 helyszín",
    "Közösségi tesztkampány",
    "Fogyasztói visszajelzések, piaci adatok",
    "Social media + PR aktivitás",
    "Influencer jelenlét",
    "Heti riport, ajánlások"
  ];

  const superFreshFeatures = [
    "Már 1 helyszínnel elindítható",
    "Közvetlen tesztelés a célcsoporton",
    "Social poszt / TikTok reel",
    "Heti visszajelzés",
    "Adatalapú insightok",
    "Márkaismertség boost"
  ];

  const benefits = [
    { icon: Zap, title: "GYORS PIACRA LÉPÉS", description: "Minimális időráfordítással" },
    { icon: Target, title: "CÉLZOTT KÖZÖNSÉG", description: "18-34 éves aktív fiatalok" },
    { icon: BarChart, title: "VALÓDI FOGYASZTÓI ADATOK", description: "Mérhető visszajelzések" },
    { icon: Heart, title: "KÖNNYŰ BEVEZETÉS", description: "Egyszerű indulási folyamat" }
  ];

  const stats = [
    { number: "24", label: "ÁTLAGÉLETKOR", icon: Users },
    { number: "91%", label: "GEN Z/MILLENNIAL", icon: TrendingUp },
    { number: "56%", label: "NŐI KÖZÖNSÉG", icon: Heart },
    { number: "85%", label: "AKTÍV APPHASZNÁLÓ", icon: Activity }
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
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6">
                <span className="block text-white mb-2">COME GET IT</span>
                <span className="block text-electric-300">GYORSÍTÓ</span>
              </h1>
              
              <p className="text-lg md:text-xl text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Indítsd be márkádat –<br />
                Budapest legdinamikusabb italos közösségében!
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-300/20 border-0"
                onClick={() => {
                  analytics.ctaClick('hero_section', 'Jelentkezz most!');
                  analytics.acceleratorApplicationStart();
                }}
              >
                Jelentkezz most!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Right side - Phone Mockup with standardized positioning */}
            <div className="flex justify-center lg:justify-end">
              <div className="scale-110 lg:scale-125">
                <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 2x2 Grid */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-4">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 hover:shadow-lg hover:shadow-electric-300/20 transition-all duration-300"
              >
                <div className="text-4xl font-black text-electric-300 mb-6">
                  {step.number}
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-electric-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h4 className="text-lg font-black text-white mb-3 group-hover:text-electric-300 transition-colors duration-300">
                  {step.title}
                </h4>
                
                <p className="text-sm text-electric-100 leading-tight px-2">
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
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-4">
              PROGRAMCSOMAGOK ITALMÁRKÁKNAK
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fresh Package */}
            <div 
              className="glass-effect rounded-3xl p-8 border-2 border-electric-300/30 shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => analytics.acceleratorPackageView('fresh')}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-4xl font-black text-electric-300">FRESH</h3>
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
                <h3 className="text-4xl font-black text-green-400">SUPER-FRESH</h3>
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
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-4">
              MIÉRT VÁLASSZ MINKET?
            </h2>
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
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-4">
              FELHASZNÁLÓI DEMÓ ADATOK
            </h2>
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
          <h2 className="text-5xl md:text-6xl font-anton text-white mb-6">
            CSATLAKOZZ A PILOTHOZ!
          </h2>
          <p className="text-xl text-electric-100 mb-10 leading-relaxed">
            Lépj be az elsők közé, akik meghatározzák<br />
            Budapest italtrendjeit!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-6 px-16 text-xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
            onClick={() => {
              analytics.ctaClick('final_cta', 'JELENTKEZZ MOST');
              analytics.acceleratorApplicationStart();
            }}
          >
            JELENTKEZZ MOST
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
