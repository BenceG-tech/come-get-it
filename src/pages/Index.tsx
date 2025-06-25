
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
      <section className="relative py-8 px-4 flex items-center overflow-hidden min-h-screen lg:min-h-0">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col items-center space-y-6">
                {/* Main title at top on mobile - INGYEN ITAL in white */}
                <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight text-center">
                  <span className="text-white">INGYEN ITAL</span><br />
                  <span className="text-cyan-400">MINDEN NAPRA</span>
                </h1>
                
                {/* Even larger logo on mobile */}
                <div className="mb-4">
                  <img 
                    src="/lovable-uploads/eda5993e-c319-4f3a-981d-fe1d39a1d33c.png" 
                    alt="Come Get It Logo" 
                    className="h-40 md:h-48 w-auto object-contain mx-auto"
                  />
                </div>
                
                {/* Subtitle between logo and phone */}
                <p className="text-lg md:text-xl text-cyan-100 mb-4 max-w-lg mx-auto text-center">
                  Fedezd fel Budapest legjobb helyeit, szerezz ingyen italokat és segíts másokon
                </p>
                
                {/* Phone mockup with better positioning */}
                <div className="relative w-full flex justify-center overflow-hidden h-80">
                  <div className="transform scale-100 translate-y-12">
                    <PhoneMockup imageIndex={currentImageIndex} />
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                {/* Main Headline */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                  INGYEN ITAL<br />
                  <span className="text-cyan-400">MINDEN NAPRA</span>
                </h1>
                
                {/* Come Get It Logo */}
                <div className="mb-8 flex justify-center lg:justify-start">
                  <img 
                    src="/lovable-uploads/eda5993e-c319-4f3a-981d-fe1d39a1d33c.png" 
                    alt="Come Get It Logo" 
                    className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                  />
                </div>
                
                {/* Description */}
                <p className="text-base md:text-lg lg:text-xl text-cyan-100 mb-8 max-w-lg mx-auto lg:mx-0">
                  Fedezd fel Budapest legjobb helyeit, szerezz ingyen italokat és segíts másokon
                </p>
                
                {/* CTA Button */}
                <div className="flex justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                    onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Kezdjük el! 🚀
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right side - Phone Mockup (Desktop only) */}
            <div className="hidden lg:flex justify-center lg:justify-center order-1 lg:order-2">
              <PhoneMockup imageIndex={currentImageIndex} className="transform scale-75 md:scale-85 lg:scale-90" />
            </div>
          </div>
        </div>
      </section>

      {/* DRINK Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Phone Mockup */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <PhoneMockup imageIndex={currentImageIndex} />
            </div>
            
            {/* Right - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                DRINK.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Ingyen ital minden nap
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg">
                Regisztrálj, válassz egy helyet és szerezd meg a napi ingyen italodat. 
                Egyszerű, gyors, minden nap új lehetőség.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LINK Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                LINK.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Kapcsolódj a közösséghez
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg">
                Fedezd fel Budapest rejtett kincseit, találj új barátokat és 
                legyél része egy különleges közösségnek.
              </p>
            </div>
            
            {/* Right - Phone Mockup */}
            <div className="flex justify-center lg:justify-start">
              <PhoneMockup imageIndex={(currentImageIndex + 1) % appImages.length} />
            </div>
          </div>
        </div>
      </section>

      {/* EARN Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Phone Mockup */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <PhoneMockup imageIndex={(currentImageIndex + 2) % appImages.length} />
            </div>
            
            {/* Right - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                EARN.
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-100 mb-6 font-medium">
                Gyűjts pontokat és segíts
              </p>
              <p className="text-lg text-cyan-200/80 max-w-lg">
                Minden fogyasztásért pontot kapsz, amit értékes jutalmakra válthatsz. 
                Közben automatikusan támogatod a jótékonyságot.
              </p>
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
            {[
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
