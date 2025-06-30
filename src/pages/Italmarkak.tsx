import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, BarChart3, Target, Users, TrendingUp } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const Italmarkak = () => {
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const features = [
    {
      icon: Target,
      title: "Célzott kampányok",
      description: "Érj el specifikus fogyasztói csoportokat helymeghatározás és preferenciák alapján."
    },
    {
      icon: BarChart3,
      title: "Valós idejű adatok",
      description: "Részletes elemzések a kampányok teljesítményéről és fogyasztói szokásokról."
    },
    {
      icon: Users,
      title: "Márka tudatosság",
      description: "Növeld a márka ismertségét és lojalitást interaktív promóciókkal."
    },
    {
      icon: TrendingUp,
      title: "Eladások növelése",
      description: "Dokumentálható ROI növekedés partner helyszíneken."
    }
  ];

  const stats = [
    { value: "+65%", label: "Márka tudatosság növekedés" },
    { value: "2.3x", label: "Magasabb engagement" },
    { value: "40+", label: "Partner italmárka" },
    { value: "200k+", label: "Aktív fogyasztó" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
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
                <span className="block text-white mb-2">MÁRKA</span>
                <span className="block text-electric-300">AKTIVÁCIÓ</span>
              </h1>
              
              <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Vidd a márkádat oda, ahol a fogyasztók vannak. Célzott kampányok, 
                valós eredmények, mérhető ROI.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Márka partnerség kérése
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={brandImage} className="animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - List Layout */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kulcs funkciók
            </h2>
            <p className="text-lg text-electric-100 max-w-2xl mx-auto">
              Minden amit a sikeres márka aktivációhoz szükséges
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Phone Mockup */}
            <div className="flex justify-center order-2 lg:order-1">
              <PhoneMockup imageUrl={brandImage} className="animate-glow-pulse" />
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

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Márka partnereink eredményei
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

export default Italmarkak;
