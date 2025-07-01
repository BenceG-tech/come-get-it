import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Check, Users, Target, TrendingUp, BarChart, Heart, Zap, Clock, MessageCircle, Eye, Globe, Award, Glasses, MapPin, Activity } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const ComeGetItAccelerator = () => {
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";

  const howItWorksSteps = [
    {
      number: "1",
      title: "MUTASD MEG AZ ITALOD",
      description: "Mutasd be új italod a Come Get It közösségének!",
      icon: Glasses
    },
    {
      number: "2", 
      title: "FELFEDEZNEK A FELHASZNÁLÓINK",
      description: "Minden nap új helyeket és italokat próbálnak ki.",
      icon: MapPin
    },
    {
      number: "3",
      title: "AZONNALI VISSZAJELZÉS",
      description: "Valós idejű vélemények és élménybeszámolók.",
      icon: Activity
    }
  ];

  const freshSamplingFeatures = [
    "Min. 5 budapesti partnerhelyen elérhető",
    "250–500 minta eljuttatása fiatal célközönséghez",
    "A/B teszt és ízvariánsok kipróbálása"
  ];

  const freshMarketingFeatures = [
    "Social media és influencer bevonás",
    "Exkluzív story, poszt vagy reels",
    "Kiemelt hely az app térképén"
  ];

  const freshDataFeatures = [
    "Heti riportok felhasználói insightokkal",
    "Kézzelfogható eredmények és analytics"
  ];

  const superFreshSamplingFeatures = [
    "1–2 helyszín a teszteléshez",
    "100–250 minta eljuttatása"
  ];

  const superFreshMarketingFeatures = [
    "Kiemelés az ajánlott italoknál",
    "Közösségi poszt vagy hírlevél"
  ];

  const superFreshDataFeatures = [
    "Heti feedback és iterációs javaslatok"
  ];

  const stats = [
    { number: "24", label: "ÁTLAG ÉLETKOR", icon: Users },
    { number: "91%", label: "MILLENNIALS & GEN-Z", icon: TrendingUp },
    { number: "250+", label: "AKTÍV FELHASZNÁLÓ", icon: Target },
    { number: "85%", label: "BUDAPESTI LAKOSOK", icon: Globe }
  ];

  const whatWeProvide = [
    { icon: BarChart, title: "ADATVEZÉRELT RIPORTOK", description: "Folyamatos insight a célközönségről" },
    { icon: MessageCircle, title: "CÉLZOTT MARKETING", description: "Social media és kampány támogatás" },
    { icon: Eye, title: "BRAND AWARENESS", description: "Kiemelt megjelenés már indulás előtt" },
    { icon: Heart, title: "VALÓS VISSZACSATOLÁS", description: "Részletes feedbackek és javaslatok" }
  ];

  const whyWorthIt = [
    { icon: Users, title: "VALÓDI CÉLKÖZÖNSÉG", description: "Több száz potenciális törzsvendég" },
    { icon: BarChart, title: "ADATVEZÉRELT FEJLESZTÉS", description: "Közvetlen felhasználói visszajelzések" },
    { icon: Zap, title: "NULLA MARKETINGKÖLTSÉG", description: "Kiemelkedő elérés partner listán" },
    { icon: Target, title: "GYORS PIACRALÉPÉS", description: "Leggyorsabb út a helyi közönséghez" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section - Unified styling */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Unified background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        
        {/* Unified glow layers */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Title - Two lines, max 18 chars per line */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] tracking-tight">
              <span className="block text-white mb-2">EGYÜTTMŰKÖDÉS</span>
              <span className="block text-electric-300">ÚJRAGONDOLVA</span>
            </h1>
            
            {/* Subtitle - Max 2 short lines, centered - FIXED to match other pages */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-electric-100 font-medium leading-tight">
                Indítsd be márkádat –<br />
                Budapest legdinamikusabb közösségével!
              </p>
            </div>
            
            {/* CTA Button - Unified styling */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Partner leszek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Phone mockup - Centered */}
            <div className="flex justify-center pt-8">
              <PhoneMockup imageUrl={acceleratorImage} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Icon-based compact design */}
      <section className="py-10 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center glass-effect rounded-xl p-6">
                <step.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-electric-100">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Packages - More compact with better visual hierarchy */}
      <section className="py-10 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              PROGRAMCSOMAGOK
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Fresh Package */}
            <div className="glass-effect rounded-2xl p-6 border-2 border-electric-300/30 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-3xl font-black text-electric-300">FRESH</h3>
                <Award className="w-8 h-8 text-electric-300" />
              </div>
              <p className="text-sm text-electric-100 mb-5">
                Innovatív, induló vagy újra pozícionált márkáknak
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-electric-300 mr-2" />
                    <h4 className="text-sm font-bold text-electric-300">SAMPLING / LIQUID ON LIPS</h4>
                  </div>
                  <div className="space-y-1">
                    {freshSamplingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-4 h-4 text-electric-300 mr-2" />
                    <h4 className="text-sm font-bold text-electric-300">MARKETING & EVENTS</h4>
                  </div>
                  <div className="space-y-1">
                    {freshMarketingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <BarChart className="w-4 h-4 text-electric-300 mr-2" />
                    <h4 className="text-sm font-bold text-electric-300">DATA DRIVEN</h4>
                  </div>
                  <div className="space-y-1">
                    {freshDataFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Super Fresh Package */}
            <div className="glass-effect rounded-2xl p-6 border-2 border-green-400/30 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-3xl font-black text-green-400">SUPER-FRESH</h3>
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm text-electric-100 mb-5">
                Vadonatúj márkáknak vagy első tesztkampányhoz
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-green-400 mr-2" />
                    <h4 className="text-sm font-bold text-green-400">SAMPLING / LIQUID ON LIPS</h4>
                  </div>
                  <div className="space-y-1">
                    {superFreshSamplingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-4 h-4 text-green-400 mr-2" />
                    <h4 className="text-sm font-bold text-green-400">MARKETING & EVENTS</h4>
                  </div>
                  <div className="space-y-1">
                    {superFreshMarketingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <BarChart className="w-4 h-4 text-green-400 mr-2" />
                    <h4 className="text-sm font-bold text-green-400">DATA DRIVEN</h4>
                  </div>
                  <div className="space-y-1">
                    {superFreshDataFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-electric-100">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Dark background with box layout */}
      <section className="py-10 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              ÁTLAGOS FELHASZNÁLÓINK
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center shadow-lg">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-electric-300" />
                <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-xs font-bold text-electric-100">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-electric-100 max-w-2xl mx-auto">
              18–34 év közötti, aktív, városi fiatalok. Nyitottak az újdonságokra, trendi helyekre, minőségi italokra.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide - Individual boxes with large icons */}
      <section className="py-10 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              MIT ADUNK MELLÉ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatWeProvide.map((item, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center shadow-lg">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-electric-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It's Worth It - Large icons with single line explanations */}
      <section className="py-10 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              MIÉRT ÉRI MEG?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyWorthIt.map((item, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center shadow-lg">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-electric-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Larger button with more whitespace */}
      <section className="py-16 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            CSATLAKOZZ A PILOTHOZ!
          </h2>
          <p className="text-lg text-electric-100 mb-8">
            Légy az elsők között, akik meghatározzák Budapest új italtrendjeit!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-black py-6 px-16 text-xl rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0 mb-8"
          >
            JELENTKEZZ A 2024 GYORSÍTÓBA
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <div className="glass-effect rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-base font-bold text-electric-300 mb-2">
              Garantált hely az első ajánlott márkák között!
            </p>
            <p className="text-sm text-electric-100">
              hello@comegetit.hu
            </p>
          </div>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
