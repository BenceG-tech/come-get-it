
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Star, Target, TrendingUp, Users, BarChart, MapPin, Heart, Lightbulb, Award, Zap, Clock, MessageCircle } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const ComeGetItAccelerator = () => {
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";
  const freshImage = "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png";

  const howItWorksSteps = [
    {
      number: "1",
      title: "MUTASD MEG AZ ITALOD",
      description: "A főváros legizgalmasabb helyein, a Come Get It közösség tagjainak!"
    },
    {
      number: "2", 
      title: "FELHASZNÁLÓINK FELFEDEZNEK",
      description: "Minden nap új helyeket fedeznek fel, és kipróbálnak egy-egy ingyen italt – akár pont a te márkádból!"
    },
    {
      number: "3",
      title: "VALÓS IDEJŰ VISSZAJELZÉSEK",
      description: "Élménybeszámolókat és tartalmakat kapunk tőlük – segítünk, hogy továbbfejleszd a kínálatodat."
    }
  ];

  const freshFeatures = [
    "Minimum 5 budapesti partnerhelyen elérhető a márkád itala",
    "Akár 250–500 minta/ital eljuttatása valódi, fiatalos célközönséghez",
    "Folyamatos visszacsatolás: A/B teszt, ízvariánsok kipróbálása",
    "Közösségi média és helyi influencer bevonás",
    "Heti jelentés az eredményekről, felhasználói insightok",
    "Egyedi megjelenés a CGI appban, térképen, ajánlókban"
  ];

  const superFreshFeatures = [
    "Már akár 1–2 helyszín is elég a teszteléshez",
    "100–250 minta eljuttatása, első hiteles visszajelzések",
    "Kiemelés az app ajánlott italkínálatában",
    "Közösségi poszt vagy hírlevél megjelenés",
    "Heti feedback jelentés, gyors iterációs javaslatok"
  ];

  const benefits = [
    {
      icon: Users,
      title: "VALÓDI CÉLKÖZÖNSÉG",
      description: "Több száz potenciális törzsvendég próbálja ki az italod már a tesztidőszakban"
    },
    {
      icon: BarChart,
      title: "ADATVEZÉRELT FEJLESZTÉS",
      description: "Visszajelzéseket közvetlenül felhasználhatod fejlesztésre vagy marketingre"
    },
    {
      icon: Zap,
      title: "NULLA MARKETINGKÖLTSÉG",
      description: "Kiemelkedő elérés a Come Get It partnerlistán keresztül"
    },
    {
      icon: Target,
      title: "GYORS PIACRALÉPÉS",
      description: "A leggyorsabb út a helyi közönséghez nagyobb kampány előtt"
    }
  ];

  const targetAudience = [
    {
      icon: Users,
      value: "18-34",
      label: "ÉVESEK",
      description: "Aktív, városi fiatalok"
    },
    {
      icon: Heart,
      value: "NYITOTT",
      label: "ÚJDONSÁGOKRA",
      description: "Trendi helyekre, minőségi italokra"
    },
    {
      icon: MapPin,
      value: "TÁRSASÁGI",
      label: "ÉLETMÓD",
      description: "Bulizni, új helyeket felfedezni"
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
                <span className="block text-white mb-2">COME GET IT</span>
                <span className="block text-electric-300 mb-4">GYORSÍTÓ</span>
                <span className="block text-2xl md:text-3xl text-electric-100 font-normal leading-relaxed">
                  Indítsd be a márkádat a Come Get It közösséggel!
                </span>
              </h1>
              
              <div className="space-y-6 mb-8">
                <p className="text-xl text-electric-100 leading-relaxed">
                  Friss, fiatalos, innovatív ital- vagy vendéglátómárka vagy, és szeretnél minél több embert elérni Budapesten?
                </p>
                <p className="text-lg text-electric-100 leading-relaxed">
                  A Come Get It most építi az új generációs, élményalapú közösségét – csatlakozz az elsők között italgyártóként, hogy már a nyitás előtt felépíthessük együtt a márkád következő nagy sztoriját!
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezz most a pilot programba!
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
      <section className="py-20 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-300 to-ocean-600 rounded-full flex items-center justify-center mb-6 shadow-lg unified-neon-glow">
                  <span className="text-2xl font-black text-white">{step.number}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                <p className="text-electric-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Packages */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              PROGRAMCSOMAGOK ITALMÁRKÁKNAK
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Fresh Package */}
            <div className="glass-effect rounded-3xl p-8 border-2 border-electric-300/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-electric-300">FRESH</h3>
                <Star className="w-8 h-8 text-electric-300" />
              </div>
              <p className="text-lg text-electric-100 mb-6">
                Innovatív, induló vagy épp újra pozícionált márkáknak
              </p>
              
              <div className="space-y-4">
                {freshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-electric-300 rounded-full flex-shrink-0 mt-2"></div>
                    <p className="text-electric-100">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Super Fresh Package */}
            <div className="glass-effect rounded-3xl p-8 border-2 border-green-400/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-green-400">SUPER-FRESH</h3>
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-lg text-electric-100 mb-6">
                Vadonatúj márkáknak vagy első tesztkampányhoz
              </p>
              
              <div className="space-y-4">
                {superFreshFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2"></div>
                    <p className="text-electric-100">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              MIT ADUNK MELLÉ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <BarChart className="w-12 h-12 mx-auto mb-4 text-electric-300" />
              <h4 className="text-lg font-bold text-white mb-2">ADATVEZÉRELT RIPORTOK</h4>
              <p className="text-electric-100 text-sm">Folyamatos insight a célközönség fogyasztási szokásairól</p>
            </div>
            <div className="text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-electric-300" />
              <h4 className="text-lg font-bold text-white mb-2">MARKETING TÁMOGATÁS</h4>
              <p className="text-electric-100 text-sm">Sztorik, reels, social media posztok, célzott kampányok</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-electric-300" />
              <h4 className="text-lg font-bold text-white mb-2">BRAND AWARENESS</h4>
              <p className="text-electric-100 text-sm">Kiemelt helyen jelenhetsz meg már az app indulása előtt is</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-electric-300" />
              <h4 className="text-lg font-bold text-white mb-2">VISSZACSATOLÁS</h4>
              <p className="text-electric-100 text-sm">Részletes feedbackek, élő visszajelzések</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Worth It */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              MIÉRT ÉRI MEG?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center glass-effect rounded-2xl p-6">
                <benefit.icon className="w-16 h-16 mx-auto mb-4 text-electric-300" />
                <h4 className="text-lg font-bold text-white mb-3">{benefit.title}</h4>
                <p className="text-electric-100 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              ÁTLAGOS FELHASZNÁLÓINK
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetAudience.map((stat, index) => (
              <div key={index} className="text-center glass-effect rounded-2xl p-8">
                <stat.icon className="w-16 h-16 mx-auto mb-4 text-electric-300" />
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-electric-100">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            JELENTKEZZ MOST A PILOT PROGRAMBA!
          </h2>
          <p className="text-xl text-electric-100 mb-4 leading-relaxed">
            Indulás előtt garantáltan bekerülsz a legelső ajánlott márkák közé, extra támogatást kapsz a marketingtől az edukáción át a fogyasztói insightokig.
          </p>
          <p className="text-lg text-electric-100 mb-8">
            Kérj személyre szabott ajánlatot!
          </p>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0 mr-4"
            >
              hello@comegetit.hu
            </Button>
          </div>
          
          <div className="mt-12 glass-effect rounded-2xl p-6">
            <p className="text-lg font-bold text-electric-300 mb-4">
              Ne várj, légy az elsők között, akik meghatározzák Budapest új italtrendjeit a Come Get It közösséggel!
            </p>
          </div>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
