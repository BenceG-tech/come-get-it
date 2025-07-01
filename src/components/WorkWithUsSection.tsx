
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, TrendingUp, Users, Heart, Building, Star, CheckCircle, MapPin, Footprints, Plus } from 'lucide-react';

export const WorkWithUsSection: React.FC = () => {
  // Using one of the existing app images for the phone mockup
  const businessImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  const keyFeatures = [
    {
      icon: Plus,
      title: "Növeld a költést",
      description: "Növeljük az átlagos tranzakció értékét jutalmakkal.",
      iconColor: "text-electric-300"
    },
    {
      icon: Star,
      title: "Hűségprogram",
      description: "Egyedi élmény a jutalom platformunkkal.",
      iconColor: "text-electric-300"
    },
    {
      icon: CheckCircle,
      title: "Könnyű bevezetés",
      description: "Mi gondoskodunk mindenről a beállításig.",
      iconColor: "text-electric-300"
    },
    {
      icon: Footprints,
      title: "Mérhető eredmények",
      description: "Követhető látogatottság és részletes analytics.",
      iconColor: "text-electric-300"
    }
  ];

  const demographics = [
    { 
      icon: Building, 
      value: "24", 
      label: "Átlagos életkor",
      description: "Fiatal, aktív korosztály"
    },
    { 
      icon: Heart, 
      value: "91%", 
      label: "Millennial & Gen-Z",
      description: "Célzott demográfia"
    },
    { 
      icon: Users, 
      value: "56%", 
      label: "Női közönség",
      description: "Kiegyensúlyozott arány"
    },
    { 
      icon: Star, 
      value: "85%", 
      label: "Aktív éjszakai élet",
      description: "Rendszeres látogatók"
    }
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-black">
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
            
            <p className="text-sm md:text-base text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-8 leading-tight">
              Csatlakozz Budapest leggyorsabban növekvő szórakozóhelyi hálózatához.
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

        {/* Key Features Section - Visual Cards */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              MIÉRT VÁLASSZ MINKET?
            </h3>
            <p className="text-lg text-electric-100 max-w-2xl mx-auto">
              Amit nyújtunk partnereinknek
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className={`w-6 h-6 ${feature.iconColor} group-hover:text-white transition-colors duration-300`} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">{feature.title}</h4>
                    <p className="text-electric-100 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics Section - 2x2 Grid */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Célközönségünk
          </h3>
          <p className="text-lg text-electric-100 max-w-2xl mx-auto mb-12">
            Ismerd meg a felhasználóinkat
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {demographics.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-electric-300 group-hover:text-white transition-colors duration-300" />
                <div className="text-2xl lg:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-electric-100 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-electric-100/70">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
