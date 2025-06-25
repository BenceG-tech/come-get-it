
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
  const [earnImageIndex, setEarnImageIndex] = useState(0);

  const appImages = [
    "/lovable-uploads/49f35936-0231-47c1-9c05-932a0e8cbf6b.png",
    "/lovable-uploads/ea91230f-2ead-48f2-8c86-e8b0522217a7.png",
    "/lovable-uploads/8776d75d-72ee-4984-8b92-a0dcd00dec82.png",
    "/lovable-uploads/b836712d-530e-4a04-a518-1707ae12f75b.png",
    "/lovable-uploads/fe824679-3c0a-4703-a2c9-524d026bb134.png"
  ];

  // Link section uses specific image
  const linkImage = "/lovable-uploads/d9b38dee-209b-4035-9d5a-5026e973ed21.png";

  // Earn section uses these two images alternating
  const earnImages = [
    "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png",
    "/lovable-uploads/574c49aa-62ba-49c3-9425-e564722b764e.png"
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
    const earnInterval = setInterval(() => {
      setEarnImageIndex((prevIndex) => 
        (prevIndex + 1) % earnImages.length
      );
    }, 4000);

    return () => clearInterval(earnInterval);
  }, [earnImages.length]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const PhoneMockup = ({ imageUrl, className }: { imageUrl: string; className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="w-64 h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl phone-mockup-glow border border-[#3ba1cb]/30">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
          
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
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
      {/* Navigation Bar with Logo */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#3ba1cb]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Hide logo on mobile, show on desktop */}
            <img 
              src="/lovable-uploads/eda5993e-c319-4f3a-981d-fe1d39a1d33c.png" 
              alt="Come Get It Logo" 
              className="h-14 w-auto object-contain hidden md:block"
            />
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#drink" className="text-white hover:text-[#27dddf] transition-colors">Drink</a>
            <a href="#link" className="text-white hover:text-[#27dddf] transition-colors">Link</a>
            <a href="#earn" className="text-white hover:text-[#27dddf] transition-colors">Earn</a>
            <a href="#signup" className="text-white hover:text-[#27dddf] transition-colors">Regisztrálj</a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-glow-primary rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-glow-secondary rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
            {/* Left side - Large Headlines and CTA */}
            <div className="flex flex-col justify-center">
              {/* Mobile Layout */}
              <div className="lg:hidden text-center space-y-8">
                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="text-white block">INGYEN ITAL</span>
                  <span className="text-white block">MINDEN NAPRA</span>
                </h1>
                
                <p className="text-lg md:text-xl text-white max-w-lg mx-auto">
                  Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
                </p>
                
                <Button 
                  size="lg" 
                  className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-6 px-12 text-xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                  onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Regisztrálj most!
                </Button>

                {/* Phone mockup for mobile - cropped to show only bottom half */}
                <div className="flex justify-center mt-8 overflow-hidden h-64">
                  <div className="transform translate-y-[-50%]">
                    <PhoneMockup imageUrl={appImages[currentImageIndex]} />
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Large Left-aligned Content */}
              <div className="hidden lg:block text-left space-y-8">
                {/* Massive Headline */}
                <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-black leading-none tracking-tight">
                  <span className="text-white block mb-2">INGYEN ITAL</span>
                  <span className="text-white block">MINDEN NAPRA</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl xl:text-2xl text-white max-w-2xl font-medium leading-relaxed">
                  Fedezd fel Budapestet, igyál minden nap ingyen, szerezz pontokat és bulizz a barátaiddal!
                </p>
                
                {/* CTA Button */}
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-6 px-16 text-2xl rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
                    onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Regisztrálj most!
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right side - Bleeding Edge Phone Mockup (Desktop only) */}
            <div className="hidden lg:flex justify-end items-center relative h-full">
              <div className="absolute inset-0 bg-gradient-radial from-[#3ba1cb]/20 via-[#27dddf]/10 to-transparent blur-3xl"></div>
              
              {/* Phone positioned to bleed off the right edge */}
              <div className="relative transform scale-125 translate-x-24 xl:translate-x-32">
                <PhoneMockup imageUrl={appImages[currentImageIndex]} className="phone-mockup-glow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRINK Section */}
      <section id="drink" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Phone Mockup */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-glow-secondary opacity-30 blur-2xl"></div>
              <div className="relative">
                <PhoneMockup imageUrl={appImages[currentImageIndex]} />
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                DRINK.
              </h2>
              <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
                Ingyen ital minden nap
              </p>
              <p className="text-lg text-white max-w-lg">
                Regisztrálj, válassz egy helyet és szerezd meg a napi ingyen italodat. 
                Egyszerű, gyors, minden nap új lehetőség.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LINK Section */}
      <section id="link" className="py-20 px-4 bg-[#0f384e]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                LINK.
              </h2>
              <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
                Kapcsolódj a közösséghez
              </p>
              <p className="text-lg text-white max-w-lg">
                Fedezd fel Budapest rejtett kincseit, találj új barátokat és 
                legyél része egy különleges közösségnek.
              </p>
            </div>
            
            {/* Right - Phone Mockup with specific image */}
            <div className="flex justify-center lg:justify-start relative">
              <div className="absolute inset-0 bg-glow-primary opacity-40 blur-2xl"></div>
              <div className="relative">
                <PhoneMockup imageUrl={linkImage} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EARN Section */}
      <section id="earn" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Phone Mockup with alternating earn images */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-glow-secondary opacity-35 blur-3xl"></div>
              <div className="relative">
                <PhoneMockup imageUrl={earnImages[earnImageIndex]} />
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                EARN.
              </h2>
              <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
                Gyűjts pontokat és segíts
              </p>
              <p className="text-lg text-white max-w-lg">
                Minden fogyasztásért pontot kapsz, amit értékes jutalmakra válthatsz. 
                Közben automatikusan támogatod a jótékonyságot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-24 px-4 bg-[#0c323f]/30">
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
                gradientClass: "from-[#3ba1cb] via-[#27dddf] to-[#0f384e]",
                glowColor: "rgba(59, 161, 203, 0.6)"
              },
              {
                title: "IGYÁL ÉS GYŰJTS.",
                icon: Zap,
                description: "Minden nap jár egy ingyen ital, minden fogyasztás után pont jár.",
                benefit: "Pontjaidat értékes jutalmakra válthatod!",
                gradientClass: "from-[#27dddf] via-[#3ba1cb] to-[#0c323f]",
                glowColor: "rgba(39, 221, 223, 0.6)"
              },
              {
                title: "SEGÍTS!",
                icon: Heart,
                description: "Minden ital után automatikusan támogatod a jótékonyságot.",
                benefit: "Iszol, szórakozol, közben jót teszel – win-win.",
                gradientClass: "from-[#0f384e] via-[#0c323f] to-[#3ba1cb]",
                glowColor: "rgba(15, 56, 78, 0.6)"
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
                    gradientClass: "from-[#3ba1cb] via-[#27dddf] to-[#0f384e]",
                    glowColor: "rgba(59, 161, 203, 0.6)"
                  },
                  {
                    title: "IGYÁL ÉS GYŰJTS.",
                    icon: Zap,
                    description: "Minden nap jár egy ingyen ital, minden fogyasztás után pont jár.",
                    benefit: "Pontjaidat értékes jutalmakra válthatod!",
                    gradientClass: "from-[#27dddf] via-[#3ba1cb] to-[#0c323f]",
                    glowColor: "rgba(39, 221, 223, 0.6)"
                  },
                  {
                    title: "SEGÍTS!",
                    icon: Heart,
                    description: "Minden ital után automatikusan támogatod a jótékonyságot.",
                    benefit: "Iszol, szórakozol, közben jót teszel – win-win.",
                    gradientClass: "from-[#0f384e] via-[#0c323f] to-[#3ba1cb]",
                    glowColor: "rgba(15, 56, 78, 0.6)"
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
              className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj most!
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
          <p className="text-xl text-white mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz
          </p>
          <p className="text-lg text-white mb-12">
            Írjuk együtt Budapest új italtérképét
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj most
            </Button>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-24 px-4 bg-[#0f384e]/20">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
          </h2>
          <p className="text-white mb-8">
            Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0c323f]/50 border-[#3ba1cb]/30 text-white placeholder-[#3ba1cb]/70 focus:border-[#27dddf] focus:ring-[#27dddf] h-12"
              required
            />
            
            <div className="flex items-start gap-3 text-left">
              <input
                type="checkbox"
                id="gdpr"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 accent-[#27dddf]"
                required
              />
              <label htmlFor="gdpr" className="text-sm text-white">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted}
              className="w-full brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Regisztrálj most!'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-6 text-white font-medium">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Fixed Sticky CTA */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
        <Button 
          className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-3 px-6 lg:px-8 rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand animate-pulse-slow"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Regisztrálj most!
        </Button>
      </div>
    </div>
  );
};

export default Index;
