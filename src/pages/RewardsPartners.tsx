
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Gift, Users, Zap, BarChart } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const RewardsPartners = () => {
  const rewardsImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

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
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="block text-white mb-2">JUTALOM &</span>
                <span className="block text-electric-300">KEDVEZMÉNY</span>
                <span className="block text-white">PARTNEREK</span>
              </h1>
              
              <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Csatlakozz a jutalom programunkhoz és érj el több ezer aktív felhasználót 
                exkluzív ajánlatokkal és kedvezményekkel.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jutalom partner leszek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={rewardsImage} className="animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hogyan működik?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Feliratkozás", description: "Regisztrálj és állítsd be az ajánlataidat egyszerűen." },
              { number: "02", title: "Kampány létrehozás", description: "Hozz létre vonzó kupokat és kedvezményeket." },
              { number: "03", title: "Célzott megjelenítés", description: "Az ajánlataid a megfelelő felhasználókhoz jutnak el." },
              { number: "04", title: "Eredmények követése", description: "Használd a pontokat és növeld az üzleted forgalmát." }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-300 to-ocean-600 rounded-full flex items-center justify-center text-2xl font-bold text-white unified-neon-glow transition-all duration-300 group-hover:scale-110 mb-6">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-electric-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - List Layout */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Jutalom rendszer előnyei
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Phone Mockup */}
            <div className="flex justify-center order-2 lg:order-1">
              <PhoneMockup imageUrl={rewardsImage} className="animate-glow-pulse" />
            </div>
            
            {/* Right side - Features List */}
            <div className="space-y-8 order-1 lg:order-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-electric-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-electric-100 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Jutalom partnereink eredményei
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center">
                <div className="text-4xl font-black text-electric-300 mb-2">{stat.value}</div>
                <div className="text-electric-100 font-medium">{stat.label}</div>
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
