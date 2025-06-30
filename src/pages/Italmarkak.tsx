
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, BarChart3, Target, Users, TrendingUp, MapPin, Glasses, CreditCard, Gift, Globe, Zap, Activity, Eye, Building } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const Italmarkak = () => {
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const howItWorksSteps = [
    {
      number: "1",
      title: "FEDEZD FEL A LEGIZGALMASABB HELYEKET",
      description: "Csatlakozz partnerhálózatunkhoz, jelenj meg Budapest ikonikus bárjaiban, éttermeiben, rooftopokon, romkocsmáiban és bisztróiban!",
      icon: MapPin
    },
    {
      number: "2", 
      title: "MUTASD MEG AZ ITALODAT AZ ÚJ GENERÁCIÓNAK",
      description: "Felhasználóink minden nap új helyeket keresnek, felfedezik és kipróbálják a te italodat is – minden nap ingyenes első pohárral, regisztrált felhasználóként.",
      icon: Glasses
    },
    {
      number: "3",
      title: "KÁRTYAÖSSZEKÖTÉS ÉS PONTGYŰJTÉS",
      description: "Az appban kártyájukat összekötve pontokat gyűjtenek minden fogyasztás után, ami ösztönzi a visszatérő vásárlásokat és a márkahűséget.",
      icon: CreditCard
    },
    {
      number: "4",
      title: "EXKLUZÍV JUTALMAK, ADATALAPÚ VISSZACSATOLÁS",
      description: "Felhasználók a pontjaikat exkluzív ajándékokra, további fogyasztásra vagy élményekre válthatják be. Részletes statisztikákat, vásárlási adatokat és valós idejű visszajelzéseket kapsz.",
      icon: Gift
    }
  ];

  const whatWeOffer = [
    {
      icon: BarChart3,
      title: "FOGYASZTÓI ÚT KÖVETÉSE",
      description: "Valós idejű analitika, hogy lásd, hogyan teljesít a kampányod."
    },
    {
      icon: Zap,
      title: "RUGALMASSÁG, SKÁLÁZHATÓSÁG",
      description: "Indíts akár egyetlen helyszínen, vagy bővítsd több tucat budapesti partnerhez."
    },
    {
      icon: TrendingUp,
      title: "FORGALOM- ÉS MÁRKAISMERTSÉG NÖVELÉS",
      description: "Érj el több ezer új fogyasztót minden hónapban."
    },
    {
      icon: Activity,
      title: "VALÓDI VÁSÁRLÁSI ADATOK",
      description: "Közvetlenül mérheted, mennyit fogyasztanak tőled, mikor, hol és milyen italokat."
    },
    {
      icon: Target,
      title: "KAMPÁNYCÉLOK TELJESÍTÉSE",
      description: "Legyen szó új ízek bevezetéséről, terméktesztről vagy vásárlói visszacsatolásról – mi mindent támogatunk."
    },
    {
      icon: Globe,
      title: "360° ÉLMÉNYKAMPÁNY",
      description: "Offline + online támogatás: social media, tartalomgyártás, influencer program, célzott kommunikáció."
    }
  ];

  const idealBrands = [
    {
      icon: Building,
      title: "ÚJ ÉS FELTÖREKVŐ ITALBRANDEK",
      description: "Kis szériás főzdék, craft sörök"
    },
    {
      icon: Eye,
      title: "NAGY MÚLTÚ MÁRKÁK",
      description: "Akik új célcsoportokat keresnek"
    },
    {
      icon: Glasses,
      title: "ALKOHOLMENTES OPCIÓKAT KÍNÁLÓ",
      description: "Innovatív márkák"
    }
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
                <span className="block text-white mb-2">ITALMÁRKA</span>
                <span className="block text-electric-300">ÉLMÉNYKAMPÁNY</span>
                <span className="block text-white text-3xl md:text-4xl lg:text-5xl mt-2">BUDAPESTEN</span>
              </h1>
              
              <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Indítsd be a márkádat Budapest legmenőbb vendéglátóhelyein – lépj be közvetlenül a fiatal, trendi fogyasztók világába, és tedd emlékezetessé a márkaélményt a Come Get It közösségén keresztül!
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

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="glass-effect rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <step.icon className="w-12 h-12 text-electric-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-electric-100 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              AMIT KÍNÁLUNK ITALGYÁRTÓKNAK ÉS PARTNEREKNEK
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeOffer.map((item, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-electric-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal Brands Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              MILYEN MÁRKÁKNAK IDEÁLIS?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {idealBrands.map((brand, index) => (
              <div key={index} className="glass-effect rounded-xl p-8 text-center">
                <brand.icon className="w-16 h-16 mx-auto mb-4 text-electric-300" />
                <h4 className="text-xl font-bold text-white mb-2">{brand.title}</h4>
                <p className="text-electric-100">{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            INDÍTSD BE A SAJÁT ÉLMÉNYKAMPÁNYODAT BUDAPESTEN
          </h2>
          <p className="text-lg text-electric-100 mb-8">
            Lépj kapcsolatba velünk, és vidd italodat a következő szintre a Come Get It-tel!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-6 px-16 text-xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
          >
            KAPCSOLATFELVÉTEL
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default Italmarkak;
