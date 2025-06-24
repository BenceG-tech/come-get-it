
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
    }, 3000);

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
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,212,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-12">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-64 h-32 md:w-80 md:h-40 mx-auto object-contain filter brightness-110"
              onError={(e) => {
                console.log('Logo failed to load:', e.currentTarget.src);
                e.currentTarget.style.border = '2px solid red';
              }}
            />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Ingyen ital minden napra
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Fedezd fel a város legjobb helyeit és gyűjts pontokat minden itallal
          </p>

          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 mb-16"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj elő
          </Button>

          <div className="mt-16 relative">
            <div className="relative w-full max-w-sm mx-auto">
              {appImages.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`Come Get It App Screenshot ${index + 1}`} 
                  className={`w-full h-auto rounded-2xl transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                />
              ))}
            </div>
            
            {/* Image indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {appImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
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
