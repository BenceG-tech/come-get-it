
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
      title: "Növeld a költést fejenként",
      description: "Növeljük az átlagos tranzakció értékét azzal, hogy jutalmazzuk a vendégeket nálad történő költésért.",
      iconColor: "text-electric-300"
    },
    {
      icon: Star,
      title: "Come Get It jutalmak",
      description: "Szerezz hűséget és egyedi élményt a jutalom platformunkkal, ahol a jutalmak nem kerülnek neked semmibe.",
      iconColor: "text-electric-300"
    },
    {
      icon: CheckCircle,
      title: "Könnyű bevezetés",
      description: "Mi gondoskodunk mindenről a tartalomtól a jelentésekig.",
      iconColor: "text-electric-300"
    },
    {
      icon: Footprints,
      title: "Követhető látogatottság",
      description: "Jelentős, követhető látogatottságot generálunk a helyszínedre olyan napokon és időpontokban, amelyek neked megfelelnek.",
      iconColor: "text-electric-300"
    },
    {
      icon: MapPin,
      title: "GPS alapú marketing",
      description: "Mobilra optimalizált vagyunk és hyper-lokális marketinget használunk, hogy megmutassuk a felhasználóknak a legközelebbi helyeket.",
      iconColor: "text-electric-300"
    }
  ];

  const demographics = [
    { 
      icon: Building, 
      value: "24", 
      label: "Átlagos felhasználói életkor",
      description: "Fiatal, aktív korosztály"
    },
    { 
      icon: Heart, 
      value: "91%", 
      label: "Millennial & Gen-Z adatbázis",
      description: "Célzott demográfia"
    },
    { 
      icon: Users, 
      value: "56%", 
      label: "Női közönség",
      description: "Kiegyensúlyozott nemek arány"
    },
    { 
      icon: Star, 
      value: "85%", 
      label: "Aktív felhasználók éjszakai kimozduláskor",
      description: "Rendszeres szórakozóhely látogatók"
    }
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

        {/* Key Features Section - List Layout */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              KULCS FUNKCIÓK
            </h3>
            <p className="text-lg text-electric-100 max-w-2xl mx-auto">
              Ezért érdemes partnereink lenni
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Phone Mockup */}
            <div className="flex justify-center order-2 lg:order-1">
              <PhoneMockup imageUrl={businessImage} className="animate-glow-pulse" />
            </div>
            
            {/* Right side - Features List */}
            <div className="space-y-8 order-1 lg:order-2">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0">
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
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

        {/* Demographics Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Célközönségünk
          </h3>
          <p className="text-lg text-electric-100 max-w-2xl mx-auto mb-12">
            Ismerd meg a felhasználóinkat
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {demographics.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-electric-100 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-electric-100/70">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
