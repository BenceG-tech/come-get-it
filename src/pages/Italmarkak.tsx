
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Compass, CreditCard, Wine, Gift, Rocket } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const Italmarkak = () => {
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const statistics = [
    {
      icon: Compass,
      number: "246+",
      label: "FELHASZNÁLÓ"
    },
    {
      icon: Wine,
      number: "91%",
      label: "WOMEN"
    },
    {
      icon: Gift,
      number: "250+",
      label: "PARTNER"
    },
    {
      icon: CreditCard,
      number: "4.8",
      label: "APP RATING"
    }
  ];

  const howItWorksSteps = [
    {
      number: "1",
      icon: Wine,
      title: "MUTASD BE",
      description: "Töltsd fel italodat a Come Get It platformra, és mutasd meg a budapesti közönségnek!"
    },
    {
      number: "2",
      icon: Compass,
      title: "TESZTELD",
      description: "A közösség kipróbálja, értékeli, és azonnal visszajelzést ad."
    },
    {
      number: "3",
      icon: Gift,
      title: "GYŰJTS VISSZAJELZÉST",
      description: "Valódi, őszinte vélemények és adatok alapján optimalizálhatsz."
    },
    {
      number: "4",
      icon: Rocket,
      title: "SKÁLÁZD FEL",
      description: "Jusson el italod több helyre, növeld a márkaismertséget és az eladásokat!"
    }
  ];

  const features = [
    {
      icon: Compass,
      title: "FOGYASZTÓI ELÉRÉS",
      description: "Több ezer új fogyasztó havonta"
    },
    {
      icon: CreditCard,
      title: "RUGALMASSÁG",
      description: "Egy helytől országos skálázásig"
    },
    {
      icon: Wine,
      title: "MARKETING TÁMOGATÁS", 
      description: "Social media, influencer program"
    },
    {
      icon: Gift,
      title: "VALÓS IDEJŰ ADATOK",
      description: "Pontos fogyasztási statisztikák"
    }
  ];

  const targetAudience = [
    {
      icon: Gift,
      title: "ÚJ MÁRKÁK",
      description: "Boutique, craft brandek"
    },
    {
      icon: Compass,
      title: "NAGY BRANDEK",
      description: "Új célcsoportot keresők"
    },
    {
      icon: Wine,
      title: "ALKOHOLMENTES",
      description: "Innovatív healthy opciók"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section - Kompakt */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] tracking-tight">
              <span className="block text-white mb-2">ITALMÁRKA</span>
              <span className="block text-electric-300">ÉLMÉNY</span>
            </h1>
            
            <div className="max-w-xl mx-auto">
              <p className="text-sm md:text-base text-electric-100 font-medium leading-tight">
                Indítsd be a márkád –<br />
                Budapest legizgalmasabb közösségében!
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-3 px-8 text-base rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezz most!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <PhoneMockup imageUrl={brandImage} className="scale-90" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Step 2x2 Grid */}
      <section className="py-12 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
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

      {/* Features - 2x2 Grid */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              MIT KÍNÁLUNK?
            </h2>
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
      <section className="py-12 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              KINEK AJÁNLJUK?
            </h2>
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
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            INDÍTSD EL AZ
            <span className="block text-electric-300 mt-2">ÉLMÉNYKAMPÁNYT!</span>
          </h2>
          <p className="text-base text-electric-100 mb-8">
            Írj nekünk, csatlakozz az elsők között!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
          >
            KAPCSOLATFELVÉTEL
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default Italmarkak;
