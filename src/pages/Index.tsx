import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Award, Heart, Users, TrendingUp, Target, DollarSign, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const appImages = [
    "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png",
    "/lovable-uploads/f0cc07ae-c5b2-4896-a0d4-f57b96428e82.png",
    "/lovable-uploads/c437ca67-a828-4beb-a8a8-749b0b662e4b.png"
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Desktop Logo */}
            <div className="mb-8 hidden lg:block">
              <img 
                src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
                alt="Come Get It Logo" 
                className="w-80 h-40 md:w-96 md:h-48 mx-auto lg:mx-0 object-contain filter brightness-110 mb-8"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight hidden lg:block">
              Ingyen ital<br />minden napra!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 hidden lg:block">
              Fedezd fel, élvezd, gyűjts pontokat és segíts másokon – minden nap, mindenhol.
            </p>

            <Button 
              size="lg" 
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-cyan-intense"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj elő! 🍻
            </Button>
          </div>

          {/* Right side - iPhone Mockups */}
          <div className="relative order-1 lg:order-2 flex flex-col justify-center items-center">
            {/* iPhone Mockups Container */}
            <div className="relative flex justify-center items-center h-[600px]">
              {/* First iPhone - Left */}
              <div className="relative transform -rotate-12 translate-x-8 z-20">
                <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/20 border border-gray-800">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Dynamic Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                    
                    {/* Screen Content */}
                    <div className="relative w-full h-full">
                      {appImages.map((image, index) => (
                        <img 
                          key={index}
                          src={image}
                          alt={`App Screenshot ${index + 1}`} 
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Second iPhone - Right */}
              <div className="relative transform rotate-12 -translate-x-8 z-10">
                <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-500/20 border border-gray-800">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Dynamic Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                    
                    {/* Screen Content */}
                    <div className="relative w-full h-full">
                      {appImages.map((image, index) => (
                        <img 
                          key={index}
                          src={image}
                          alt={`App Screenshot ${index + 1}`} 
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === (currentImageIndex + 1) % appImages.length ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Glow Effects Behind Phones */}
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>

            {/* Mobile-only content below phones */}
            <div className="lg:hidden flex flex-col items-center mt-6">
              {/* Mobile Title */}
              <h1 className="text-4xl font-bold mb-2 text-white leading-tight text-center">
                Ingyen ital<br />minden napra!
              </h1>
              
              {/* Mobile Subtitle */}
              <p className="text-lg text-gray-300 mb-4 max-w-sm mx-auto text-center px-4">
                Fedezd fel, élvezd, gyűjts pontokat és segíts másokon – minden nap, mindenhol.
              </p>
              
              {/* Mobile Logo */}
              <div className="mt-2">
                <img 
                  src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
                  alt="Come Get It Logo" 
                  className="w-80 h-40 object-contain filter brightness-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators - Hidden on all devices */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden space-x-3 z-30">
          {appImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 px-4 bg-gray-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Miért válaszd a Come Get It-et?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce neon-glow-3d infographic-icon">
                <MapPin size={40} className="text-cyan-400 drop-shadow-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fedezd fel a várost</h3>
              <p className="text-gray-400 mb-3">Találd meg a legjobb helyeket GPS alapú navigációval</p>
              <p className="text-sm text-cyan-300 italic font-medium">Új helyek, új barátok – minden napra egy új élmény!</p>
            </div>

            <div className="text-center group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce neon-glow-3d-purple infographic-icon">
                <Award size={40} className="text-purple-400 drop-shadow-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Gyűjts pontokat</h3>
              <p className="text-gray-400 mb-3">Váltsd be a pontjaidat menő jutalmakra és élményekre</p>
              <p className="text-sm text-purple-300 italic font-medium">Minden pont egy lépés közelebb a következő szinthez!</p>
            </div>

            <div className="text-center group animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce neon-glow-3d-rose infographic-icon">
                <Heart size={40} className="text-rose-400 drop-shadow-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Segíts másokon</h3>
              <p className="text-gray-400 mb-3">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
              <p className="text-sm text-rose-300 italic font-medium">Iszol, szórakozol és közben jót teszel – ez a win-win!</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Infographic Section - "Miért éri meg?" */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Miért éri meg?
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Mindenki nyer – felhasználók, vendéglátóhelyek és partnerek egyaránt
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Felhasználó oszlop */}
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 neon-glow-3d infographic-icon">
                  <Users size={36} className="text-cyan-400 drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Felhasználó</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d">
                    <DollarSign size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Olcsóbb italok</h4>
                    <p className="text-sm text-gray-400">Kedvezmények minden nap</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d">
                    <Zap size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Új élmények</h4>
                    <p className="text-sm text-gray-400">Felfedezés minden napra</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendéglátóhely oszlop */}
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 neon-glow-3d-purple infographic-icon">
                  <TrendingUp size={36} className="text-purple-400 drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-purple-400">Vendéglátóhely</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d-purple">
                    <BarChart3 size={24} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Több forgalom</h4>
                    <p className="text-sm text-gray-400">Új vendégek naponta</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d-purple">
                    <Heart size={24} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Hűség építés</h4>
                    <p className="text-sm text-gray-400">Visszatérő vendégek</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Italgyártó/szponzor oszlop */}
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 neon-glow-3d-yellow infographic-icon">
                  <Target size={36} className="text-yellow-400 drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">Italgyártó</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d-yellow">
                    <Award size={24} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Márkaépítés</h4>
                    <p className="text-sm text-gray-400">Célzott marketing</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center neon-glow-3d-yellow">
                    <BarChart3 size={24} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Adatok</h4>
                    <p className="text-sm text-gray-400">Fogyasztói insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOMO Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Legyél alapító tag
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz
          </p>
          <p className="text-lg text-cyan-400 mb-12">
            Írjuk együtt Budapest új italtérképét
          </p>
          
          <Button 
            size="lg" 
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-cyan-intense"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Csatlakozz most
          </Button>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
          </h2>
          <p className="text-gray-400 mb-8">
            Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 h-12"
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
              <label htmlFor="gdpr" className="text-sm text-gray-400">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-cyan-intense"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Csatlakozom az első 1000-hez'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-6 text-cyan-400 font-medium">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Enhanced Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 sticky-cta-float neon-glow-cyan-ultra-intense"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
