
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Award, Heart } from 'lucide-react';

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
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
                alt="Come Get It Logo" 
                className="w-48 h-24 md:w-56 md:h-28 mx-auto lg:mx-0 object-contain filter brightness-110 mb-8"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Ingyen ital<br />minden napra!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
            </p>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/25 animate-pulse"
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Regisztrálj elő! 🍻
            </Button>
          </div>

          {/* Right side - iPhone Mockups */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center h-[600px]">
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
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
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

      {/* Features */}
      <section className="py-24 px-4 bg-gray-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Miért válaszd a Come Get It-et?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Fedezd fel a várost</h3>
              <p className="text-gray-400">Találd meg a legjobb helyeket GPS alapú navigációval</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Gyűjts pontokat</h3>
              <p className="text-gray-400">Váltsd be a pontjaidat menő jutalmakra és élményekre</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Segíts másokon</h3>
              <p className="text-gray-400">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
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
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300"
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
            Foglalj helyet most
          </h2>
          <p className="text-gray-400 mb-8">
            Iratkozz fel, és az elsők között értesítünk
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
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Regisztrálok'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-6 text-cyan-400 font-medium">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Csatlakozz az első 1000-hez
        </Button>
      </div>
    </div>
  );
};

export default Index;
