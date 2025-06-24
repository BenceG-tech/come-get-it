
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
      {/* Hero Section - Optimized for mobile */}
      <section className="relative py-8 md:py-16 px-4 text-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Logo - Much larger on mobile */}
          <div className="mb-6 md:mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="h-32 md:h-28 lg:h-32 w-auto object-contain"
            />
          </div>

          {/* Main Headline - Better mobile spacing */}
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight px-2">
            INGYEN ITAL<br />MINDEN NAPRA!
          </h2>
          
          {/* Subheadline - Better mobile text size */}
          <p className="text-sm md:text-lg lg:text-2xl text-cyan-100 mb-6 md:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Fedezd fel Budapest legjobb helyeit, szerezd meg az első italt minden nap ingyen – 
            fedezz fel, gyűjts pontokat, segíts másokon!
          </p>

          {/* CTA Button - Better mobile sizing */}
          <Button 
            size="lg" 
            className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-3 px-6 md:py-4 md:px-12 text-sm md:text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0 mb-8 md:mb-12"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj elő! 🍻
          </Button>

          {/* Hero App Images - Better mobile sizing */}
          <div className="flex justify-center items-center mt-6">
            <div className="relative max-w-xs md:max-w-sm lg:max-w-md">
              <img 
                src={heroImages[currentImageIndex]}
                alt="Come Get It App Preview" 
                className="w-full h-auto object-contain transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* IGYÁL Section - Mobile optimized */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Mobile: Text first, Desktop: Image first on right */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 lg:mb-6 leading-none">
                IGYÁL.
              </h2>
              <p className="text-lg md:text-xl lg:text-3xl text-cyan-100 mb-4 lg:mb-6 font-medium">
                Ingyen ital minden nap
              </p>
              <p className="text-sm md:text-base lg:text-lg text-cyan-200/80 max-w-lg mx-auto lg:mx-0">
                Fedezd fel a város legjobb helyeit, igyál minden nap ingyen – új hely, új élmény!
              </p>
            </div>
            
            {/* Mobile: Image second, Desktop: Image on left */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
              <div className="max-w-xs md:max-w-sm lg:max-w-md">
                <img 
                  src={sectionImages.drink}
                  alt="Ingyen ital minden nap" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KAPCSOLÓDJ Section - Mobile optimized */}
      <section className="py-8 md:py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 lg:mb-6 leading-none">
                KAPCSOLÓDJ.
              </h2>
              <p className="text-lg md:text-xl lg:text-3xl text-cyan-100 mb-4 lg:mb-6 font-medium">
                Csatlakozz a közösséghez
              </p>
              <p className="text-sm md:text-base lg:text-lg text-cyan-200/80 max-w-lg mx-auto lg:mx-0">
                Csak csatold a bankkártyád, minden költés automatikusan pontokká válik.
              </p>
            </div>
            
            {/* Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-xs md:max-w-sm lg:max-w-md">
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

      {/* GYŰJTS Section - Mobile optimized */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Mobile: Text first, Desktop: Text on right */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 lg:mb-6 leading-none">
                GYŰJTS.
              </h2>
              <p className="text-lg md:text-xl lg:text-3xl text-cyan-100 mb-4 lg:mb-6 font-medium">
                Pontokat kapsz, segítesz másokon
              </p>
              <p className="text-sm md:text-base lg:text-lg text-cyan-200/80 max-w-lg mx-auto lg:mx-0 mb-6 lg:mb-8">
                Gyűjts pontokat minden költéssel, váltsd be jutalmakra, és minden ital után automatikusan támogatod a jótékonyságot is.
              </p>
              
              {/* Charity Mini Box - Better mobile sizing */}
              <div className="inline-flex bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30 rounded-2xl p-3 md:p-4 backdrop-blur-sm max-w-xs md:max-w-none mx-auto lg:mx-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <Heart className="text-pink-400 flex-shrink-0" size={16} />
                  <p className="text-pink-100 font-medium text-xs md:text-sm">
                    Minden ital után jótékonyságot is támogatsz!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mobile: Image second, Desktop: Image on left */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
              <div className="max-w-xs md:max-w-sm lg:max-w-md">
                <img 
                  src={sectionImages.collect}
                  alt="Pontgyűjtés és jótékonyság" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉLVEZD Section - Mobile optimized */}
      <section className="py-8 md:py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 lg:mb-6 leading-none">
                ÉLVEZD.
              </h2>
              <p className="text-lg md:text-xl lg:text-3xl text-cyan-100 mb-4 lg:mb-6 font-medium">
                Ingyen italod minden nap!
              </p>
              <p className="text-sm md:text-base lg:text-lg text-cyan-200/80 max-w-lg mx-auto lg:mx-0">
                Mutasd meg az applikációt, és élvezd ingyen italodat a város legjobb helyein!
              </p>
            </div>
            
            {/* Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-xs md:max-w-sm lg:max-w-md">
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

      {/* Miért éri meg? Section - Better mobile optimization */}
      <section className="py-12 md:py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-white">
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

          {/* Mobile: Stacked Cards instead of Carousel */}
          <div className="lg:hidden space-y-4">
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
                  className={`bg-gradient-to-br ${card.gradientClass} p-4 md:p-5 rounded-2xl backdrop-blur-sm border border-cyan-400/20`}
                >
                  <div className="text-center space-y-3">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* FOMO Section - Better mobile spacing */}
      <section className="py-12 md:py-20 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 md:mb-6 text-white">
            Legyél alapító tag
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-cyan-100 mb-6 md:mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz
          </p>
          <p className="text-sm md:text-base lg:text-lg text-cyan-300 mb-8 md:mb-12">
            Írjuk együtt Budapest új italtérképét
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-3 px-6 md:py-4 md:px-12 text-sm md:text-base lg:text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Csatlakozz most
            </Button>
          </div>
        </div>
      </section>

      {/* Signup Form - Better mobile optimization */}
      <section id="signup" className="py-12 md:py-20 px-4 bg-gray-900/30">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-white">
            Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
          </h2>
          <p className="text-sm md:text-base text-cyan-100 mb-6 md:mb-8">
            Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4 md:space-y-6">
            <Input
              type="email"
              placeholder="Email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-cyan-400/30 text-white placeholder-cyan-200/70 focus:border-cyan-300 focus:ring-cyan-300 h-10 md:h-12 text-sm md:text-base"
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
              <label htmlFor="gdpr" className="text-xs md:text-sm text-cyan-100">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted}
              className="w-full brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-3 md:py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0 animate-pulse-slow text-sm md:text-base"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Csatlakozom az első 1000-hez'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-4 md:mt-6 text-cyan-300 font-medium text-sm md:text-base">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Fixed Sticky CTA - Better mobile sizing */}
      <div className="fixed bottom-3 md:bottom-4 lg:bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
        <Button 
          className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-2 px-4 md:py-3 md:px-6 lg:px-8 rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand animate-pulse-slow text-xs md:text-sm lg:text-base"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
