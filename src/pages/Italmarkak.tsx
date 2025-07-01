
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, MapPin, Glasses, Users, Star, BarChart3, Target, TrendingUp, Zap, Activity, Eye, Building, Globe, Sparkles } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const Italmarkak = () => {
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const statistics = [
    {
      icon: Users,
      number: "246+",
      label: "FELHASZNÁLÓ"
    },
    {
      icon: Users,
      number: "91%",
      label: "WOMEN"
    },
    {
      icon: Glasses,
      number: "250+",
      label: "PARTNER"
    },
    {
      icon: Star,
      number: "4.8",
      label: "APP RATING"
    }
  ];

  const howItWorksSteps = [
    {
      icon: MapPin,
      title: "FEDEZD FEL",
      description: "Új helyek, új élmények"
    },
    {
      icon: Glasses,
      title: "PRÓBÁLD KI", 
      description: "Az italodat ingyen"
    },
    {
      icon: Star,
      title: "GYŰJTS PONTOT",
      description: "Jutalmak, visszajelzés"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "FOGYASZTÓI ELÉRÉS",
      description: "Több ezer új fogyasztó havonta"
    },
    {
      icon: Zap,
      title: "RUGALMASSÁG",
      description: "Egy helytől országos skálázásig"
    },
    {
      icon: BarChart3,
      title: "MARKETING TÁMOGATÁS", 
      description: "Social media, influencer program"
    },
    {
      icon: Activity,
      title: "VALÓS IDEJŰ ADATOK",
      description: "Pontos fogyasztási statisztikák"
    }
  ];

  const targetAudience = [
    {
      icon: Sparkles,
      title: "ÚJ MÁRKÁK",
      description: "Boutique, craft brandek"
    },
    {
      icon: Building,
      title: "NAGY BRANDEK",
      description: "Új célcsoportot keresők"
    },
    {
      icon: Eye,
      title: "ALKOHOLMENTES",
      description: "Innovatív healthy opciók"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section - Compact */}
      <section className="relative py-16 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-4">
                <span className="block text-white">ITALMÁRKA</span>
                <span className="block text-electric-300">ÉLMÉNY</span>
              </h1>
              
              <p className="text-lg text-electric-100 max-w-xl mx-auto lg:mx-0 mb-8">
                Indítsd be a márkád – Budapest legizgalmasabb közösségében!
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-6 px-12 text-xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezz most!
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={brandImage} className="animate-glow-pulse scale-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Compact 4 boxes */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-electric-300" />
                <div className="text-2xl font-black text-white mb-1">
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

      {/* How It Works - 3 horizontal bubbles */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-electric-300 to-ocean-600 rounded-full flex items-center justify-center mb-6 unified-neon-glow">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-black text-white mb-2">{step.title}</h4>
                <p className="text-sm text-electric-100">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - 4 cards in 2x2 grid */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              MIT KÍNÁLUNK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-8 text-center">
                <feature.icon className="w-16 h-16 mx-auto mb-4 text-electric-300" />
                <h4 className="text-xl font-black text-white mb-2">{feature.title}</h4>
                <p className="text-electric-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience - 3 simple cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              KINEK AJÁNLJUK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targetAudience.map((audience, index) => (
              <div key={index} className="glass-effect rounded-xl p-8 text-center">
                <audience.icon className="w-16 h-16 mx-auto mb-4 text-electric-300" />
                <h4 className="text-xl font-black text-white mb-2">{audience.title}</h4>
                <p className="text-electric-100">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="py-20 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
            INDÍTSD EL AZ
            <span className="block text-electric-300 mt-2">ÉLMÉNYKAMPÁNYT!</span>
          </h2>
          <p className="text-xl text-electric-100 mb-12">
            Írj nekünk, csatlakozz az elsők között!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-8 px-20 text-2xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
          >
            KAPCSOLATFELVÉTEL
            <ArrowRight className="ml-4 h-8 w-8" />
          </Button>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default Italmarkak;
