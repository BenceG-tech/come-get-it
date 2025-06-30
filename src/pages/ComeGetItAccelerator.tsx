
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Filter, Clock, Star, Target, TrendingUp, Users, Lightbulb, Award, MapPin, Footprints, BarChart, Zap } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const ComeGetItAccelerator = () => {
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";
  const freshImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  const howItWorksSteps = [
    {
      icon: Filter,
      title: "TÖKÉLETES ÜZLETI AUDIT",
      description: "Átfogó felmérés készítése a vendéglátóhelyed jelenlegi állapotáról és potenciáljáról."
    },
    {
      icon: Clock,
      title: "SZEMÉLYRE SZABOTT STRATÉGIA",
      description: "12 hónapos részletes fejlesztési terv kidolgozása a maximum eredmény elérése érdekében."
    },
    {
      icon: Star,
      title: "PRÉMIUM TÁMOGATÁS",
      description: "Folyamatos mentorálás és támogatás tapasztalt szakértőktől a teljes program során."
    }
  ];

  const freshFeatures = [
    {
      icon: Target,
      title: "MINTAVÉTELEZÉS / FOLYÉKONY AJKAK",
      description: "Új italok népszerűsítése ingyenes kóstolókkal",
      color: "text-green-400"
    },
    {
      icon: Users,
      title: "KÖZÖSSÉGI ESEMÉNYEK",
      description: "Exkluzív események szervezése a törzsvásárlók számára",
      color: "text-green-400"
    },
    {
      icon: Star,
      title: "MARKETING & ESEMÉNYEK",
      description: "Professzionális marketing kampányok és esemény szervezés",
      color: "text-green-400"
    },
    {
      icon: BarChart,
      title: "ADATOKKAL VEZÉRELT",
      description: "Részletes elemzések és jelentések az üzleti teljesítményről",
      color: "text-green-400"
    }
  ];

  const superFreshFeatures = [
    {
      icon: Target,
      title: "MINTAVÉTELEZÉS / FOLYÉKONY AJKAK",
      description: "Új italok és specialitások bevezetése célzott kampányokkal",
      color: "text-green-400"
    },
    {
      icon: Star,
      title: "MARKETING & ESEMÉNYEK",
      description: "Átfogó marketing stratégia és esemény menedzsment",
      color: "text-green-400"
    },
    {
      icon: BarChart,
      title: "ADATOKKAL VEZÉRELT",
      description: "Valós idejű analytics és teljesítmény optimalizálás",
      color: "text-green-400"
    }
  ];

  const stats = [
    { 
      icon: Users,
      value: "250", 
      label: "ÁTLAGOS KOROSZTÁLY",
      description: "Fiatal, aktív célközönség"
    },
    { 
      icon: Heart,
      value: "85%", 
      label: "MILLENNIAL & GEN-Z ADATBÁZIS",
      description: "Magas vásárlóerő"
    },
    { 
      icon: MapPin,
      value: "90%", 
      label: "NŐI KÖZÖNSÉG",
      description: "Prémium szegmens"
    },
    { 
      icon: TrendingUp,
      value: "350%", 
      label: "ÉJSZAKAI KIJÁRÁS NÖVEKEDÉS",
      description: "Magasabb költési hajlandóság"
    }
  ];

  const testimonials = [
    {
      name: "Kovács Péter",
      position: "Tulajdonos, Central Café",
      text: "A SZIKRA Accelerator program teljesen átformálta az üzletemet. Egy év alatt 350%-kal nőtt a forgalmam és új törzsvásárlói bázist építettem ki.",
      logo: "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png"
    }
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
                <span className="block text-white mb-2">SZIKRA</span>
                <span className="block text-electric-300">ACCELERATOR</span>
              </h1>
              
              <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Mi vagyunk a szakértők a jövő vendéglátóiparában. Kis költségvetéssel, 
                intelligens megoldásokkal és kemény munkával.
              </p>
              
              <p className="text-lg text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                A SZIKRA platform segítségével és a személyre szabott hálózat 
                támogatásával növekedést, felfedezést és helyreállítást biztosítunk 
                a vendéglátóhelyeknek, elősegítve a növekedést, felfedezést és helyreállítást.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezz most
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              HOGYAN MŰKÖDIK
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <step.icon className="w-10 h-10 text-black" />
                </div>
                <h4 className="text-xl font-bold text-black mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <PhoneMockup imageUrl={freshImage} className="animate-glow-pulse" />
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">FRISS</h2>
              <p className="text-lg text-electric-100 mb-6 leading-relaxed">
                Új vendégek a büszkén kifejlesztett. Beszállva és legalább 5 
                helyben, és biztosítva a hűséget növelni.
              </p>
              <p className="text-lg text-electric-100 mb-8 leading-relaxed">
                Új italok márkák (DJBíró) bekerültek a programba lesz 
                támogatott által a 1 millió SZIKRA kampány eszköztárában.
              </p>
              
              <div className="space-y-6">
                {freshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <feature.icon className={`w-6 h-6 ${feature.color} flex-shrink-0 mt-1`} />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-electric-100">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Super Fresh Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">SZUPER-FRISS</h2>
              <p className="text-lg text-electric-100 mb-8 leading-relaxed">
                Érvényes kezdve, akik bekerültek a. Beszállva legalább 1 héten, 
                mi fogunk bevezetni a márkád az új, szuper vásárlók.
              </p>
              
              <div className="space-y-6">
                {superFreshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <feature.icon className={`w-6 h-6 ${feature.color} flex-shrink-0 mt-1`} />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-electric-100">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-4 max-w-sm">
                <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse transform scale-75" />
                <PhoneMockup imageUrl={freshImage} className="animate-glow-pulse transform scale-75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-16 h-16 mx-auto mb-4 text-black" />
                <div className="text-3xl font-black text-black mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-black mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section className="py-16 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            JELENTKEZZ A 2025 SZIKRA ACCELERATOR-RA
          </h2>
          <p className="text-lg text-electric-100 mb-8">
            Jelentkezz fel a további részletekért és az bevezetési költségekért.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
          >
            Jelentkezz itt
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">
            VISSZAJELZÉSEK
          </h2>
          
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <img src={testimonial.logo} alt="Partner logo" className="h-12" />
              </div>
              <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="text-black font-bold">{testimonial.name}</div>
              <div className="text-gray-600 text-sm">{testimonial.position}</div>
            </div>
          ))}
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
