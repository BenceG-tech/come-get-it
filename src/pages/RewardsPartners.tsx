import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Gift, Settings, Zap, BarChart, Users } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';
import { analytics } from '@/lib/analytics';

const RewardsPartners = () => {
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
    {
      number: "1",
      icon: Gift,
      title: "REGISZTRÁLJ",
      description: "Lépj be a programba!"
    },
    {
      number: "2", 
      icon: Settings,
      title: "HOZZ LÉTRE AJÁNLATOT",
      description: "Adj exkluzív kedvezményt vagy jutalmat."
    },
    {
      number: "3",
      icon: Zap,
      title: "AKTIVÁLD",
      description: "Promód azonnal él!"
    },
    {
      number: "4",
      icon: BarChart,
      title: "KÖVESD EREDMÉNYEKET",
      description: "Láss élő statisztikákat."
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "Exkluzív ajánlatok",
      description: "Hozz létre egyedi kedvezményeket és ajánlatokat az applikáció felhasználóinak."
    },
    {
      icon: Users,
      title: "Célzott elérés",
      description: "Juttatd el az ajánlataidat a megfelelő célcsoporthoz és növeld a konverziót."
    },
    {
      icon: Zap,
      title: "Azonnali aktiváció",
      description: "A kupok és kedvezmények azonnal beválthatók, nincs hosszas várakozás."
    },
    {
      icon: BarChart,
      title: "Részletes statisztikák",
      description: "Kövesd nyomon a kampányaid teljesítményét valós idejű adatokkal."
    }
  ];

  const stats = [
    { value: "85%", label: "Kupon beváltási arány" },
    { value: "+120%", label: "Új vásárlók növekedése" },
    { value: "50+", label: "Aktív jutalom partner" },
    { value: "95%", label: "Partner elégedettség" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section - Standardized */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Unified background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        
        {/* Unified glow layers */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-6">
                <span className="block text-white mb-2">JUTALOM &</span>
                <span className="block text-electric-300">KEDVEZMÉNY</span>
              </h1>
              
              <p className="text-lg md:text-xl text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Érj el több ezer aktív felhasználót –<br />
                exkluzív ajánlatokkal és kedvezményekkel!
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-300/20 border-0"
                onClick={() => {
                  analytics.ctaClick('hero_section', 'Jutalom partner leszek');
                  analytics.rewardsPartnerApplicationStart();
                }}
              >
                Jutalom partner leszek
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
      <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-anton text-white mb-2">
              HOGYAN MŰKÖDIK?
            </h2>
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
            <h2 className="text-3xl md:text-4xl font-anton text-white mb-4">
              Jutalom rendszer előnyei
            </h2>
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
      <section className="py-12 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-anton text-white mb-8">
            Jutalom partnereink eredményei
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-electric-300 mb-2">{stat.value}</div>
                <div className="text-electric-100 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default RewardsPartners;
