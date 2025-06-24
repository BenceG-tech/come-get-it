
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

  const appImages = [
    "/lovable-uploads/49f35936-0231-47c1-9c05-932a0e8cbf6b.png",
    "/lovable-uploads/ea91230f-2ead-48f2-8c86-e8b0522217a7.png",
    "/lovable-uploads/8776d75d-72ee-4984-8b92-a0dcd00dec82.png",
    "/lovable-uploads/b836712d-530e-4a04-a518-1707ae12f75b.png",
    "/lovable-uploads/fe824679-3c0a-4703-a2c9-524d026bb134.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % appImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [appImages.length]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const PhoneMockup = ({ imageIndex, className }: { imageIndex: number; className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="w-64 h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl neon-glow-brand border border-cyan-400/30">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={appImages[imageIndex % appImages.length]}
              alt={`App Screenshot`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white brand-gradient-cta bg-clip-text text-transparent mb-2">
              COME GET IT
            </h1>
            <div className="w-24 h-1 brand-gradient-cta mx-auto rounded-full neon-glow-brand"></div>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            INGYEN ITAL<br />MINDEN NAPRA!
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Fedezd fel Budapest legjobb helyeit, szerezd meg az első italt minden nap ingyen – 
            fedezz fel, gyűjts pontokat, segíts másokon!
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0 mb-12"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj elő! 🍻
          </Button>

          {/* Phone Mockups */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <PhoneMockup imageIndex={currentImageIndex} className="hidden md:block transform -rotate-12 scale-90" />
            <PhoneMockup imageIndex={(currentImageIndex + 1) % appImages.length} className="transform rotate-6" />
            <PhoneMockup imageIndex={(currentImageIndex + 2) % appImages.length} className="hidden md:block transform -rotate-3 scale-95" />
          </div>
        </div>
      </section>

      {/* IGYÁL Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <PhoneMockup imageIndex={currentImageIndex} />
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                IGYÁL.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Ingyen ital minden nap
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg">
                Fedezd fel a város legjobb helyeit, igyál minden nap ingyen – új hely, új élmény!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KAPCSOLÓDJ Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                KAPCSOLÓDJ.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Csatlakozz a közösséghez
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg">
                Csak csatold a bankkártyád, minden költés automatikusan pontokká válik.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <PhoneMockup imageIndex={(currentImageIndex + 1) % appImages.length} />
            </div>
          </div>
        </div>
      </section>

      {/* GYŰJTS Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <PhoneMockup imageIndex={(currentImageIndex + 2) % appImages.length} />
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                GYŰJTS.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Pontokat kapsz, segítesz másokon
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg mb-6">
                Gyűjts pontokat minden költéssel, váltsd be jutalmakra, és minden ital után automatikusan támogatod a jótékonyságot is.
              </p>
              
              {/* Charity Mini Box */}
              <div className="inline-block bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30 rounded-2xl p-4 neon-glow-brand">
                <div className="flex items-center gap-3">
                  <Heart className="text-pink-400" size={24} />
                  <p className="text-pink-100 font-medium text-sm">
                    Minden ital után jótékonyságot is támogatsz!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Miért éri meg? Section */}
      <section className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white">
            Miért éri meg?
          </h2>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-12">
            {[
              {
                title: "FELHASZNÁLÓ",
                icon: Users,
                description: "Olcsóbb italok, új élmények, exkluzív jutalmak.",
                gradientClass: "from-cyan-400 via-blue-500 to-cyan-300",
                glowColor: "rgba(57, 204, 204, 0.6)"
              },
              {
                title: "VENDÉGLÁTÓHELY",
                icon: TrendingUp,
                description: "Több vendég, hűséges visszatérők, új forgalom.",
                gradientClass: "from-blue-400 via-purple-500 to-blue-300",
                glowColor: "rgba(0, 116, 217, 0.6)"
              },
              {
                title: "ITALMÁRKÁK",
                icon: Target,
                description: "Márkaépítés, célzott marketing, értékes adat.",
                gradientClass: "from-cyan-300 via-teal-400 to-cyan-200",
                glowColor: "rgba(102, 224, 255, 0.6)"
              }
            ].map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className={`relative group animate-fade-in bg-gradient-to-br ${card.gradientClass} p-8 rounded-3xl transform transition-all duration-500 hover:scale-105`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    boxShadow: `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor.replace('0.6', '0.3')}`
                  }}
                >
                  <div className="relative z-10 text-center space-y-6">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <IconComponent size={40} className="text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-4">
                      {card.title}
                    </h3>
                    
                    <p className="text-lg text-white/90 font-medium leading-tight">
                      {card.description}
                    </p>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
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
                    gradientClass: "from-cyan-400 via-blue-500 to-cyan-300",
                    glowColor: "rgba(57, 204, 204, 0.6)"
                  },
                  {
                    title: "VENDÉGLÁTÓHELY",
                    icon: TrendingUp,
                    description: "Több vendég, hűséges visszatérők, új forgalom.",
                    gradientClass: "from-blue-400 via-purple-500 to-blue-300",
                    glowColor: "rgba(0, 116, 217, 0.6)"
                  },
                  {
                    title: "ITALMÁRKÁK",
                    icon: Target,
                    description: "Márkaépítés, célzott marketing, értékes adat.",
                    gradientClass: "from-cyan-300 via-teal-400 to-cyan-200",
                    glowColor: "rgba(102, 224, 255, 0.6)"
                  }
                ].map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <CarouselItem key={index}>
                      <div 
                        className={`relative bg-gradient-to-br ${card.gradientClass} p-8 rounded-3xl mx-2`}
                        style={{
                          boxShadow: `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor.replace('0.6', '0.3')}`
                        }}
                      >
                        <div className="relative z-10 text-center space-y-6">
                          <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                              <IconComponent size={40} className="text-white" />
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-black text-white mb-4">
                            {card.title}
                          </h3>
                          
                          <p className="text-base text-white/90 font-medium leading-tight">
                            {card.description}
                          </p>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
              <CarouselNext className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* FOMO Section */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Legyél alapító tag
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz
          </p>
          <p className="text-lg text-cyan-300 mb-12">
            Írjuk együtt Budapest új italtérképét
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Csatlakozz most
            </Button>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
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
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
        <Button 
          className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-3 px-6 lg:px-8 rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand animate-pulse-slow"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
