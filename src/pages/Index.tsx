import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Award, Heart, Users, TrendingUp, Target, DollarSign, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const featureCards = [
    {
      title: "FEDEZD FEL.",
      icon: MapPin,
      description: "Találd meg Budapest legmenőbb helyeit GPS alapon.",
      benefit: "Új helyek, új arcok, új élmények – minden nap!",
      gradientClass: "from-cyan-400 via-blue-500 to-cyan-300",
      glowColor: "rgba(57, 204, 204, 0.6)"
    },
    {
      title: "IGYÁL ÉS GYŰJTS.",
      icon: Zap,
      description: "Minden nap jár egy ingyen ital, minden fogyasztás után pont jár.",
      benefit: "Pontjaidat értékes jutalmakra válthatod!",
      gradientClass: "from-blue-400 via-purple-500 to-blue-300",
      glowColor: "rgba(0, 116, 217, 0.6)"
    },
    {
      title: "SEGÍTS!",
      icon: Heart,
      description: "Minden ital után automatikusan támogatod a jótékonyságot.",
      benefit: "Iszol, szórakozol, közben jót teszel – win-win.",
      gradientClass: "from-cyan-300 via-teal-400 to-cyan-200",
      glowColor: "rgba(102, 224, 255, 0.6)"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pb-32">
        {/* Background glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Desktop - Alternating Logo and Title */}
            <div className="mb-8 lg:mb-12 hidden lg:block h-96 flex items-center justify-center lg:justify-start">
              {showLogo ? (
                <div className="transition-opacity duration-500">
                  <img 
                    src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
                    alt="Come Get It Logo" 
                    className="w-[40rem] h-80 lg:w-[45rem] lg:h-96 mx-auto lg:mx-0 object-contain filter brightness-110"
                  />
                </div>
              ) : (
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight transition-opacity duration-500">
                  Ingyen ital<br />minden napra!
                </h1>
              )}
            </div>
            
            <p className="text-lg md:text-xl lg:text-2xl text-cyan-100 mb-8 lg:mb-12 max-w-xl mx-auto lg:mx-0 hidden lg:block">
              Fedezd fel, élvezd, gyűjts pontokat és segíts másokon – minden nap, mindenhol.
            </p>

            <div className="flex justify-center lg:justify-start hidden lg:flex">
              <Button 
                size="lg" 
                className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-4 px-10 lg:px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Regisztrálj elő! 🍻
              </Button>
            </div>
          </div>

          {/* Right side - iPhone Mockups */}
          <div className="relative order-1 lg:order-2 flex flex-col justify-center items-center">
            <div className="relative flex justify-center items-center h-[500px] lg:h-[600px]">
              {/* First iPhone - Left */}
              <div className="relative transform -rotate-12 translate-x-4 lg:translate-x-8 z-20">
                <div className="w-56 h-[460px] lg:w-64 lg:h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl neon-glow-brand border border-cyan-400/30">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 lg:w-32 h-5 lg:h-6 bg-black rounded-b-2xl z-30"></div>
                    
                    <div className="relative w-full h-full">
                      {appImages.map((image, index) => (
                        <div 
                          key={index}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <img 
                            src={image}
                            alt={`App Screenshot ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Second iPhone - Right */}
              <div className="relative transform rotate-12 -translate-x-4 lg:-translate-x-8 z-10">
                <div className="w-56 h-[460px] lg:w-64 lg:h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl neon-glow-brand border border-blue-400/30">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 lg:w-32 h-5 lg:h-6 bg-black rounded-b-2xl z-30"></div>
                    
                    <div className="relative w-full h-full">
                      {appImages.map((image, index) => (
                        <div 
                          key={index}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                            index === (currentImageIndex + 2) % appImages.length ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <img 
                            src={image}
                            alt={`App Screenshot ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only content below phones */}
            <div className="lg:hidden flex flex-col items-center mt-1 px-4 w-full max-w-sm mx-auto">
              <div className="mb-3 h-28 flex items-center justify-center">
                {showLogo ? (
                  <div className="transition-opacity duration-500">
                    <img 
                      src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
                      alt="Come Get It Logo" 
                      className="w-64 h-28 object-contain filter brightness-110"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center transition-opacity duration-500">
                    Ingyen ital<br />minden napra!
                  </h1>
                )}
              </div>
              
              <p className="text-base md:text-lg text-cyan-100 mb-5 text-center">
                Fedezd fel, élvezd, gyűjts pontokat és segíts másokon – minden nap, mindenhol.
              </p>
              
              <div className="flex justify-center w-full">
                <Button 
                  size="lg" 
                  className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-3 px-8 text-base rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                  onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Regisztrálj elő! 🍻
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white">
            Miért válaszd a Come Get It-et?
          </h2>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-12">
            {featureCards.map((card, index) => {
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
                    
                    <h3 className="text-3xl font-black text-white mb-4">
                      {card.title}
                    </h3>
                    
                    <p className="text-lg text-white/90 font-medium leading-tight">
                      {card.description}
                    </p>
                    
                    <p className="text-base text-white/80 italic font-medium">
                      {card.benefit}
                    </p>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {featureCards.map((card, index) => {
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
                          
                          <h3 className="text-2xl font-black text-white mb-4">
                            {card.title}
                          </h3>
                          
                          <p className="text-base text-white/90 font-medium leading-tight">
                            {card.description}
                          </p>
                          
                          <p className="text-sm text-white/80 italic font-medium">
                            {card.benefit}
                          </p>
                        </div>
                        
                        {/* Gradient overlay */}
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

          {/* Simple CTA */}
          <div className="flex justify-center mt-16">
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Kezdjük el! 🚀
            </Button>
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
              className="w-full brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0"
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
