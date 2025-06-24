
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Award, Heart } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        {/* City Night Background Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop" 
            alt="City Night" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Neon Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,212,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          {/* Real Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/81ea66f7-5d6b-434b-b314-0a8a8d65364f.png" 
              alt="Come Get It Logo" 
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>

          {/* Hero Tagline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Ingyen ital minden napra!
          </h1>
          
          <p className="text-xl md:text-2xl text-cyan-400 mb-6 font-semibold">
            Fedezd fel a város legjobb helyeit
          </p>

          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Regisztrálj most – az elsők között lehetsz!
          </p>

          {/* Mobile Screenshots Preview */}
          <div className="flex justify-center gap-4 mb-12">
            <img 
              src="/lovable-uploads/dad5f770-5cd6-4a2c-833e-3fa3b689c748.png" 
              alt="App Screenshots" 
              className="max-w-md h-auto opacity-90 rounded-lg"
            />
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 text-xl rounded-full shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all duration-300 transform hover:scale-105"
            onClick={() => document.querySelector('#signup-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj elő!
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Így működik...
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <span className="text-black font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Fedezd fel</h3>
              <p className="text-gray-300">Találd meg a legjobb helyeket a városban</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <span className="text-black font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Válaszd ki</h3>
              <p className="text-gray-300">Kérd a napi ingyenes italodat</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <span className="text-black font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Mutasd meg</h3>
              <p className="text-gray-300">Mutasd a telefonod a pultosnak</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <span className="text-black font-bold text-2xl">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Élvezd!</h3>
              <p className="text-gray-300">Koccints és élvezd az italodat!</p>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Miért válaszd a Come Get It-et?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <MapPin size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Fedezd fel a várost</h3>
              <p className="text-gray-300 text-lg">Találd meg a legjobb helyeket GPS alapú navigációval</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <Award size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Gyűjts pontokat</h3>
              <p className="text-gray-300 text-lg">Váltsd be a pontjaidat menő jutalmakra és exkluzív élményekre</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <Heart size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Segíts másokon</h3>
              <p className="text-gray-300 text-lg">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Exkluzív jutalmak várnak!
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Gyűjts pontokat minden itallal – váltsd be menő jutalmakra vagy exkluzív élményekre!
              </p>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Premium italok és koktélok
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  VIP események és party-k
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Exkluzív badge-ek és címek
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <div className="w-64 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl border-2 border-cyan-400/30 p-4 shadow-2xl shadow-cyan-400/20">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=700&fit=crop" 
                  alt="Rewards Interface" 
                  className="w-full h-full object-cover rounded-2xl opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOMO Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Legyél alapító tag!
          </h2>
          <p className="text-2xl text-gray-300 mb-8">
            Az első 1000 regisztrálónak exkluzív bónusz!
          </p>
          <p className="text-xl text-cyan-400 mb-12 font-semibold">
            Írjuk együtt Budapest új italtérképét!
          </p>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop" 
              alt="Friends celebrating" 
              className="w-full max-w-2xl mx-auto rounded-2xl opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Pre-registration Form */}
      <section id="signup-form" className="py-20 px-4 bg-gradient-to-t from-black to-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Foglalj helyet most!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Iratkozz fel, és az elsők között értesítünk!
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-6 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Add meg az email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-cyan-400/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 h-12 text-lg"
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
              <label htmlFor="gdpr" className="text-sm text-gray-400 leading-relaxed">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok, hogy a Come Get It kapcsolatba lépjen velem az app indulásával kapcsolatban.
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold py-4 text-lg shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Regisztrálok!'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-6 text-cyan-400 font-semibold animate-fade-in text-lg">
              Köszönjük! Hamarosan jelentkezünk az exkluzív infókkal!
            </p>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
        <Button 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-2xl shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all duration-300 transform hover:scale-105 animate-pulse"
          onClick={() => document.querySelector('#signup-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🍻 Az első 1000 között!
        </Button>
      </div>
    </div>
  );
};

export default Index;
