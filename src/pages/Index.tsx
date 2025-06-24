import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Miért válaszd a Come Get It-et?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 neon-glow-3d-brand">
                <MapPin size={40} className="text-cyan-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fedezd fel a várost</h3>
              <p className="text-cyan-100 mb-3">Találd meg a legjobb helyeket GPS alapú navigációval</p>
              <p className="text-sm text-cyan-300 italic font-medium">Új helyek, új barátok – minden napra egy új élmény!</p>
            </div>

            <div className="text-center group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 neon-glow-3d-brand">
                <Award size={40} className="text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Gyűjts pontokat</h3>
              <p className="text-cyan-100 mb-3">Váltsd be a pontjaidat menő jutalmakra és élményekre</p>
              <p className="text-sm text-blue-300 italic font-medium">Minden pont egy lépés közelebb a következő szinthez!</p>
            </div>

            <div className="text-center group animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 neon-glow-3d-brand">
                <Heart size={40} className="text-cyan-200" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Segíts másokon</h3>
              <p className="text-cyan-100 mb-3">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
              <p className="text-sm text-cyan-300 italic font-medium">Iszol, szórakozol és közben jót teszel – ez a win-win!</p>
            </div>
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
          className="brand-gradient-cta hover:shadow-2xl text-gray-900 font-semibold py-3 px-6 lg:px-8 rounded-full transition-all duration-300 transform hover:scale-105 border-0 neon-glow-brand animate-pulse-slow"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
