
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, Users, TrendingUp, Heart, Building } from 'lucide-react';

export const WorkWithUsSection: React.FC = () => {
  // Using one of the existing app images for the phone mockup
  const businessImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  const steps = [
    {
      number: "01",
      title: "Regisztráció",
      description: "Egyszerű online regisztráció és gyors jóváhagyási folyamat."
    },
    {
      number: "02", 
      title: "Integráció",
      description: "Segítünk beállítani a rendszert és betanítjuk a személyzetet."
    },
    {
      number: "03",
      title: "Promóció", 
      description: "Automatikus marketing és promóciós kampányok indítása."
    },
    {
      number: "04",
      title: "Eredmények",
      description: "Növekvő forgalom és elégedett vendégek már az első héttől."
    }
  ];

  const stats = [
    { icon: TrendingUp, value: "+45%", label: "Átlagos forgalom növekedés" },
    { icon: Users, value: "89%", label: "Visszatérő vendégek aránya" },
    { icon: Heart, value: "4.8/5", label: "Vendég elégedettség" },
    { icon: Building, value: "200+", label: "Partner hely Budapesten" }
  ];

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-black">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="block text-white mb-2">EGYÜTTMŰKÖDÉS</span>
              <span className="block text-electric-300">ÚJRAGONDOLVA</span>
            </h2>
            
            <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Csatlakozz Budapest leggyorsabban növekvő szórakozóhelyi hálózatához. 
              Növeld a forgalmat, szerezz új törzsvendégeket és építs közösséget!
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              onClick={() => document.querySelector('#venue-application')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Partner leszek
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Right side - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup imageUrl={businessImage} className="animate-glow-pulse" />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hogyan működik?
            </h3>
            <p className="text-lg text-electric-100 max-w-2xl mx-auto">
              Négy egyszerű lépésben partnereink leszünk
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-300 to-ocean-600 rounded-full flex items-center justify-center text-2xl font-bold text-white unified-neon-glow transition-all duration-300 group-hover:scale-110">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-electric-300/50 to-transparent"></div>
                  )}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-electric-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Partnereink eredményei
          </h3>
          <p className="text-lg text-electric-100 max-w-2xl mx-auto mb-12">
            Valós számok, valós eredmények
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-electric-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
