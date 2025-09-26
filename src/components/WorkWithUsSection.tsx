
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, Plus, Star, CheckCircle, TrendingUp, Building, Heart, Users } from 'lucide-react';

export const WorkWithUsSection: React.FC = () => {
  // Using one of the existing app images for the phone mockup
  const businessImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  const keyFeatures = [
    {
      icon: Plus,
      title: "Magasabb átlagfogyasztás",
      description: "A jutalmak növelik a kosárértéket és visszahozzák a vendéget.",
      iconColor: "text-electric-300"
    },
    {
      icon: Star,
      title: "Digitális törzsvendég-program",
      description: "Nincs szükség plasztik- vagy papírkártyára.",
      iconColor: "text-electric-300"
    },
    {
      icon: CheckCircle,
      title: "Gyors bevezetés",
      description: "Könnyen integrálható, nincs szükség extra oktatásra.",
      iconColor: "text-electric-300"
    },
    {
      icon: TrendingUp,
      title: "Valósidejű eredmények",
      description: "Minden adat azonnal, átlátható riportokban.",
      iconColor: "text-electric-300"
    }
  ];

  const demographics = [
    { 
      icon: Building, 
      value: "24", 
      label: "év átlagéletkor",
      description: "Fiatal, social aktív"
    },
    { 
      icon: Heart, 
      value: "91%", 
      label: "millenniál & Gen Z",
      description: "Célzott demográfia"
    },
    { 
      icon: Users, 
      value: "56%", 
      label: "női felhasználó",
      description: "Kiegyensúlyozott arány"
    },
    { 
      icon: Star, 
      value: "85%", 
      label: "aktív este/hétvégén",
      description: "Rendszeres látogatók"
    }
  ];

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-b from-dark-blue to-dark-blue/80">{/* Unified gradient background */}
      {/* Unified background gradient effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight mb-4">
              <span className="block text-white mb-2">LOJALITÁS,</span>
              <span className="block text-electric-300">AHOGY KELLENE</span>
            </h2>
            
            <p className="text-sm md:text-base text-electric-100 font-medium max-w-2xl mx-auto lg:mx-0 mb-6 leading-tight">
              Növeld vendégforgalmad, szerezz új törzsvendégeket, és élvezd a digitális lojalitás előnyeit – mindent egy helyen, egyszerűen, papír és plasztikkártyák nélkül.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-electric-300/20 border-0"
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

        {/* Key Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-anton text-white mb-4">
              KULCS FUNKCIÓK
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className={`w-6 h-6 ${feature.iconColor} group-hover:text-white transition-colors duration-300`} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">{feature.title}</h4>
                    <p className="text-electric-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-anton text-white mb-4">
            Célcsoportunk
          </h3>
          
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {demographics.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-4 text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-electric-300/20">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-electric-300 group-hover:text-white transition-colors duration-300" />
                <div className="text-xl font-black text-white mb-1">{stat.value}</div>
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
