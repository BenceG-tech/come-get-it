
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Check, Users, Target, TrendingUp, BarChart, Heart, Zap, Clock, MessageCircle, Eye, Globe, Award } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const ComeGetItAccelerator = () => {
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";

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

  const freshSamplingFeatures = [
    "Minimum 5 budapesti partnerhelyen elérhető a márkád itala",
    "Akár 250–500 minta/ital eljuttatása valódi, fiatalos célközönséghez",
    "Folyamatos visszacsatolás: A/B teszt, ízvariánsok kipróbálása"
  ];

  const freshMarketingFeatures = [
    "Közösségi média és helyi influencer bevonás",
    "Exkluzív megjelenés, story, poszt vagy reels",
    "Egyedi megjelenés a CGI appban, térképen, ajánlókban"
  ];

  const freshDataFeatures = [
    "Heti jelentés az eredményekről, felhasználói insightok",
    "Kézzelfogható eredmények és analytics"
  ];

  const superFreshSamplingFeatures = [
    "Már akár 1–2 helyszín is elég a teszteléshez",
    "100–250 minta eljuttatása, első hiteles visszajelzések"
  ];

  const superFreshMarketingFeatures = [
    "Kiemelés az app ajánlott italkínálatában",
    "Közösségi poszt vagy hírlevél megjelenés"
  ];

  const superFreshDataFeatures = [
    "Heti feedback jelentés, gyors iterációs javaslatok"
  ];

  const stats = [
    { number: "24", label: "ÁTLAG ÉLETKOR", icon: Users },
    { number: "91%", label: "MILLENNIALS & GEN-Z", icon: TrendingUp },
    { number: "250+", label: "AKTÍV FELHASZNÁLÓ", icon: Target },
    { number: "85%", label: "BUDAPESTI LAKOSOK", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
                <span className="block text-white mb-2">COME GET IT</span>
                <span className="block text-electric-300 mb-3">GYORSÍTÓ</span>
                <span className="block text-lg md:text-xl text-electric-100 font-normal leading-relaxed">
                  Indítsd be a márkádat a Come Get It közösséggel!
                </span>
              </h1>
              
              <div className="space-y-4 mb-6">
                <p className="text-lg text-electric-100 leading-relaxed">
                  Friss, fiatalos, innovatív ital- vagy vendéglátómárka vagy, és szeretnél minél több embert elérni Budapesten?
                </p>
                <p className="text-base text-electric-100 leading-relaxed">
                  A Come Get It most építi az új generációs, élményalapú közösségét – csatlakozz az elsők között italgyártóként!
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-3 px-6 text-base rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezz most a pilot programba!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              HOGYAN MŰKÖDIK?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-electric-300 to-ocean-600 rounded-full flex items-center justify-center mb-4 shadow-lg unified-neon-glow">
                  <span className="text-xl font-black text-white">{step.number}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-electric-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Packages */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              PROGRAMCSOMAGOK ITALMÁRKÁKNAK
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fresh Package */}
            <div className="glass-effect rounded-2xl p-6 border-2 border-electric-300/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-electric-300">FRESH</h3>
                <Award className="w-6 h-6 text-electric-300" />
              </div>
              <p className="text-sm text-electric-100 mb-6">
                Innovatív, induló vagy épp újra pozícionált márkáknak
              </p>
              
              {/* Sampling Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-electric-300 mr-2" />
                  <h4 className="text-sm font-bold text-electric-300">SAMPLING / LIQUID ON LIPS</h4>
                </div>
                <div className="space-y-2">
                  {freshSamplingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <MessageCircle className="w-4 h-4 text-electric-300 mr-2" />
                  <h4 className="text-sm font-bold text-electric-300">MARKETING & EVENTS</h4>
                </div>
                <div className="space-y-2">
                  {freshMarketingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Section */}
              <div>
                <div className="flex items-center mb-2">
                  <BarChart className="w-4 h-4 text-electric-300 mr-2" />
                  <h4 className="text-sm font-bold text-electric-300">DATA DRIVEN</h4>
                </div>
                <div className="space-y-2">
                  {freshDataFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Super Fresh Package */}
            <div className="glass-effect rounded-2xl p-6 border-2 border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-green-400">SUPER-FRESH</h3>
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm text-electric-100 mb-6">
                Vadonatúj márkáknak vagy első tesztkampányhoz
              </p>
              
              {/* Sampling Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-green-400 mr-2" />
                  <h4 className="text-sm font-bold text-green-400">SAMPLING / LIQUID ON LIPS</h4>
                </div>
                <div className="space-y-2">
                  {superFreshSamplingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Section */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <MessageCircle className="w-4 h-4 text-green-400 mr-2" />
                  <h4 className="text-sm font-bold text-green-400">MARKETING & EVENTS</h4>
                </div>
                <div className="space-y-2">
                  {superFreshMarketingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Section */}
              <div>
                <div className="flex items-center mb-2">
                  <BarChart className="w-4 h-4 text-green-400 mr-2" />
                  <h4 className="text-sm font-bold text-green-400">DATA DRIVEN</h4>
                </div>
                <div className="space-y-2">
                  {superFreshDataFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-electric-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - White Background */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-3">
              ÁTLAGOS FELHASZNÁLÓINK
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-3 text-electric-300" />
                <div className="text-4xl font-black text-black mb-1">{stat.number}</div>
                <div className="text-sm font-bold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-base text-gray-700 max-w-2xl mx-auto">
              18–34 év közötti, aktív, városi fiatalok. Nyitottak az újdonságokra, trendi helyekre, minőségi italokra. 
              Elsősorban bulizni, társasági életet élni, új helyeket felfedezni szeretnek.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              MIT ADUNK MELLÉ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <BarChart className="w-10 h-10 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">ADATVEZÉRELT RIPORTOK</h4>
              <p className="text-xs text-electric-100">Folyamatos insight a célközönség fogyasztási szokásairól</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">MARKETING TÁMOGATÁS</h4>
              <p className="text-xs text-electric-100">Sztorik, reels, social media posztok, célzott kampányok</p>
            </div>
            <div className="text-center">
              <Eye className="w-10 h-10 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">BRAND AWARENESS</h4>
              <p className="text-xs text-electric-100">Kiemelt helyen jelenhetsz meg már az app indulása előtt is</p>
            </div>
            <div className="text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">VISSZACSATOLÁS</h4>
              <p className="text-xs text-electric-100">Részletes feedbackek, élő visszajelzések</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Worth It */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              MIÉRT ÉRI MEG?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center glass-effect rounded-xl p-4">
              <Users className="w-12 h-12 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">VALÓDI CÉLKÖZÖNSÉG</h4>
              <p className="text-xs text-electric-100">Több száz potenciális törzsvendég próbálja ki az italod</p>
            </div>
            <div className="text-center glass-effect rounded-xl p-4">
              <BarChart className="w-12 h-12 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">ADATVEZÉRELT FEJLESZTÉS</h4>
              <p className="text-xs text-electric-100">Visszajelzéseket közvetlenül felhasználhatod</p>
            </div>
            <div className="text-center glass-effect rounded-xl p-4">
              <Zap className="w-12 h-12 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">NULLA MARKETINGKÖLTSÉG</h4>
              <p className="text-xs text-electric-100">Kiemelkedő elérés a Come Get It partnerlistán keresztül</p>
            </div>
            <div className="text-center glass-effect rounded-xl p-4">
              <Target className="w-12 h-12 mx-auto mb-3 text-electric-300" />
              <h4 className="text-base font-bold text-white mb-2">GYORS PIACRALÉPÉS</h4>
              <p className="text-xs text-electric-100">A leggyorsabb út a helyi közönséghez</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            JELENTKEZZ MOST A PILOT PROGRAMBA!
          </h2>
          <p className="text-lg text-electric-100 mb-3">
            Indulás előtt garantáltan bekerülsz a legelső ajánlott márkák közé.
          </p>
          <p className="text-base text-electric-100 mb-8">
            Kérj személyre szabott ajánlatot!
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0 mb-8"
          >
            APPLY FOR THE 2024 ACCELERATOR
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="glass-effect rounded-xl p-4">
            <p className="text-base font-bold text-electric-300">
              Ne várj, légy az elsők között, akik meghatározzák Budapest új italtrendjeit a Come Get It közösséggel!
            </p>
            <p className="text-sm text-electric-100 mt-2">
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
