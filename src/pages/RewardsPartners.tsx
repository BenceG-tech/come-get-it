import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Gift, Settings, Zap, BarChart, Users } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const RewardsPartners = () => {
  const rewardsImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

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
      
      {/* Hero Section - Kompaktabb */}
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Unified background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        
        {/* Unified glow layers */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            {/* Main Title - Anton font */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight">
              <span className="block text-white mb-2">JUTALOM &</span>
              <span className="block text-electric-300">KEDVEZMÉNY</span>
            </h1>
            
            {/* Subtitle - Rövidebb */}
            <div className="max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-electric-100 font-medium leading-tight">
                Érj el több ezer aktív felhasználót –<br />
                exkluzív ajánlatokkal és kedvezményekkel!
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jutalom partner leszek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center pt-6">
              <PhoneMockup imageUrl={rewardsImage} />
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
