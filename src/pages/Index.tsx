
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Users, Heart, TrendingUp, Target, DollarSign } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero section images - új app képek
  const heroImages = [
    "/lovable-uploads/b8de9d8b-ec2e-482f-aff7-5e6ec494dc15.png",
    "/lovable-uploads/5a427655-9aa6-4f6f-806c-0bb1d16ac3fc.png"
  ];

  // Section specific images
  const sectionImages = {
    connect: "/lovable-uploads/5c014411-1010-4173-8dec-a3bd46b669f3.png",
    collect: "/lovable-uploads/3967a105-4028-4e5b-86f1-e8b3055e1315.png",
    drink: "/lovable-uploads/13e9248a-5ac2-499c-a23d-3d912a5b2dfd.png",
    payment: "/lovable-uploads/81fae439-c877-4e78-b3c9-2bb59be47499.png",
    celebration: "/lovable-uploads/74cc9ecc-6fc7-4ddf-ae33-0d75d9baace4.png"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 text-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Logo - nagyobb mobilnézetben */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="h-20 md:h-20 lg:h-24 w-auto object-contain"
            />
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            INGYEN ITAL<br />MINDEN NAPRA!
          </h2>
          
          {/* Subheadline */}
          <p className="text-base md:text-xl lg:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Fedezd fel Budapest legjobb helyeit, szerezd meg az első italt minden nap ingyen – 
            fedezz fel, gyűjts pontokat, segíts másokon!
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-4 px-6 md:px-12 text-base md:text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0 mb-12"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj elő! 🍻
          </Button>

          {/* Hero App Images - váltakozó megjelenítés */}
          <div className="flex justify-center items-center mt-8">
            <div className="relative max-w-sm md:max-w-md lg:max-w-lg">
              <img 
                src={heroImages[currentImageIndex]}
                alt="Come Get It App Preview" 
                className="w-full h-auto object-contain transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* IGYÁL Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="max-w-sm md:max-w-md">
                <img 
                  src={sectionImages.drink}
                  alt="Ingyen ital minden nap" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-none">
                IGYÁL.
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-6 font-medium">
                Ingyen ital minden nap
              </p>
              <p className="text-base md:text-lg text-cyan-200/80 max-w-lg">
                Fedezd fel a város legjobb helyeit, igyál minden nap ingyen – új hely, új élmény!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KAPCSOLÓDJ Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-none">
                KAPCSOLÓDJ.
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-6 font-medium">
                Csatlakozz a közösséghez
              </p>
              <p className="text-base md:text-lg text-cyan-200/80 max-w-lg">
                Csak csatold a bankkártyád, minden költés automatikusan pontokká válik.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-sm md:max-w-md">
                <img 
                  src={sectionImages.payment}
                  alt="Kártya csatlakoztatása" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GYŰJTS Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="max-w-sm md:max-w-md">
                <img 
                  src={sectionImages.collect}
                  alt="Pontgyűjtés és jótékonyság" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-none">
                GYŰJTS.
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-6 font-medium">
                Pontokat kapsz, segítesz másokon
              </p>
              <p className="text-base md:text-lg text-cyan-200/80 max-w-lg mb-8">
                Gyűjts pontokat minden költéssel, váltsd be jutalmakra, és minden ital után automatikusan támogatod a jótékonyságot is.
              </p>
              
              {/* Charity Mini Box */}
              <div className="inline-flex bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Heart className="text-pink-400 flex-shrink-0" size={20} />
                  <p className="text-pink-100 font-medium text-sm">
                    Minden ital után jótékonyságot is támogatsz!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉLVEZD Section - Új szekció a celebration képpel */}
      <section className="py-12 md:py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-none">
                ÉLVEZD.
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-6 font-medium">
                Ingyen italod minden nap!
              </p>
              <p className="text-base md:text-lg text-cyan-200/80 max-w-lg">
                Mutasd meg az applikációt, és élvezd ingyen italodat a város legjobb helyein!
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-sm md:max-w-md">
                <img 
                  src={sectionImages.celebration}
                  alt="Élvezd ingyen italodat!" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Miért éri meg? Section - Modernized */}
      <section className="py-16 md:py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">
            Miért éri meg?
          </h2>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {[
              {
                title: "FELHASZNÁLÓ",
                icon: Users,
                description: "Olcsóbb italok, új élmények, exkluzív jutalmak.",
                gradientClass: "from-cyan-400/20 via-blue-500/20 to-cyan-300/20"
              },
              {
                title: "VENDÉGLÁTÓHELY",
                icon: TrendingUp,
                description: "Több vendég, hűséges visszatérők, új forgalom.",
                gradientClass: "from-blue-400/20 via-purple-500/20 to-blue-300/20"
              },
              {
                title: "ITALMÁRKÁK",
                icon: Target,
                description: "Márkaépítés, célzott marketing, értékes adat.",
                gradientClass: "from-cyan-300/20 via-teal-400/20 to-cyan-200/20"
              }
            ].map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className={`relative group bg-gradient-to-br ${card.gradientClass} p-6 rounded-2xl backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-300/40 transition-all duration-300 hover:scale-105`}
                >
                  <div className="relative z-10 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                        <IconComponent size={24} className="text-cyan-300" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-black text-white mb-3">
                      {card.title}
                    </h3>
                    
                    <p className="text-sm text-cyan-100/90 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {[
                  {
                    title: "FELHASZNÁLÓ",
                    icon: Users,
                    description: "Olcsóbb italok, új élmények, exkluzív jutalmak.",
                    gradientClass: "from-cyan-400/20 via-blue-500/20 to-cyan-300/20"
                  },
                  {
                    title: "VENDÉGLÁTÓHELY",
                    icon: TrendingUp,
                    description: "Több vendég, hűséges visszatérők, új forgalom.",
                    gradientClass: "from-blue-400/20 via-purple-500/20 to-blue-300/20"
                  },
                  {
                    title: "ITALMÁRKÁK",
                    icon: Target,
                    description: "Márkaépítés, célzott marketing, értékes adat.",
                    gradientClass: "from-cyan-300/20 via-teal-400/20 to-cyan-200/20"
                  }
                ].map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <CarouselItem key={index}>
                      <div 
                        className={`relative bg-gradient-to-br ${card.gradientClass} p-5 rounded-2xl mx-2 backdrop-blur-sm border border-cyan-400/20`}
                      >
                        <div className="relative z-10 text-center space-y-3">
                          <div className="flex justify-center mb-3">
                            <div className="w-10 h-10 bg-cyan-400/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                              <IconComponent size={20} className="text-cyan-300" />
                            </div>
                          </div>
                          
                          <h3 className="text-base font-black text-white mb-2">
                            {card.title}
                          </h3>
                          
                          <p className="text-xs text-cyan-100/90 font-medium leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="bg-cyan-400/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/30" />
              <CarouselNext className="bg-cyan-400/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/30" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* FOMO Section */}
      <section className="py-16 md:py-20 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-white">
            Legyél alapító tag
          </h2>
          <p className="text-lg md:text-xl text-cyan-100 mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz
          </p>
          <p className="text-base md:text-lg text-cyan-300 mb-12">
            Írjuk együtt Budapest új italtérképét
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-4 px-8 md:px-12 text-base md:text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Csatlakozz most
            </Button>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-16 md:py-20 px-4 bg-gray-900/30">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
          </h2>
          <p className="text-cyan-100 mb-8">
            Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-cyan-400/30 text-white placeholder-cyan-200/70 focus:border-cyan-300 focus:ring-cyan-300 h-12"
              required
            />
            
            <div className="flex items-start gap-3 text-left">
              <input
                type="checkbox"
                id="gdpr"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 accent-cyan-400"
                required
              />
              <label htmlFor="gdpr" className="text-sm text-cyan-100">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted}
              className="w-full brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0 animate-pulse-slow"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Csatlakozom az első 1000-hez'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-6 text-cyan-300 font-medium">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Fixed Sticky CTA */}
      <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
        <Button 
          className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-3 px-4 md:px-6 lg:px-8 rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand animate-pulse-slow text-sm md:text-base"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
