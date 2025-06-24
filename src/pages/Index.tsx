
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Award, Heart } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
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
          {/* Logo placeholder */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl shadow-cyan-400/50 animate-pulse">
              CGI
            </div>
          </div>

          {/* Neon Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Come Get It!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Az új generációs app, ahol minden lépéseddel pontokat gyűjtesz, 
            jutalmakat szerezhetsz és jótékonykodást támogatsz
          </p>

          {/* Mobile Screenshots Preview */}
          <div className="flex justify-center gap-4 mb-12 opacity-80">
            <div className="w-20 h-40 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-cyan-400/30 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1551038247-3d9af20df552?w=400&h=800&fit=crop" alt="App Screenshot 1" className="w-full h-full object-cover rounded-lg opacity-60" />
            </div>
            <div className="w-20 h-40 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-cyan-400/30 flex items-center justify-center transform scale-110">
              <img src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=800&fit=crop" alt="App Screenshot 2" className="w-full h-full object-cover rounded-lg opacity-60" />
            </div>
            <div className="w-20 h-40 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-cyan-400/30 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=800&fit=crop" alt="App Screenshot 3" className="w-full h-full object-cover rounded-lg opacity-60" />
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 text-xl rounded-full shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all duration-300 transform hover:scale-105"
          >
            Regisztrálj elő!
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Hogyan működik?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">Töltsd le az appot</h3>
                  <p className="text-gray-300 text-lg">Regisztrálj egyszerűen és kezdj el pontokat gyűjteni minden lépéseddel</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">Fedezd fel a városod</h3>
                  <p className="text-gray-300 text-lg">Keresd meg a partnerek helyeit és gyűjts pontokat minden látogatással</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">Válts pontokat jutalmakra</h3>
                  <p className="text-gray-300 text-lg">Cseréld be a pontjaidat exkluzív ajánlatokra és kedvezményekre</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">Támogass jótékonysági célokat</h3>
                  <p className="text-gray-300 text-lg">Pontjaid egy részével automatikusan támogatsz karitatív szervezeteket</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl border-2 border-cyan-400/30 p-4 shadow-2xl shadow-cyan-400/20">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=700&fit=crop" 
                  alt="App Interface" 
                  className="w-full h-full object-cover rounded-2xl opacity-80"
                />
              </div>
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
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Okos helykeresés</h3>
              <p className="text-gray-300 text-lg">Találd meg könnyen a partnerhelyeket GPS alapú navigációval és térképes felülettel</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <Award size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Pontgyűjtés & jutalmak</h3>
              <p className="text-gray-300 text-lg">Minden aktivitásodért pontokat kapsz, amiket értékes jutalmakra válthatsz be</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70">
                <Heart size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Jótékonyság</h3>
              <p className="text-gray-300 text-lg">Pontjaid automatikusan támogatnak jótékonysági szervezeteket - jót teszel használat közben</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-black to-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Légy az elsők között!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Iratkozz fel és értesülj elsőként a Come Get It app indulásáról
          </p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Add meg az email címed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800 border-cyan-400/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
              required
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold px-8 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300"
            >
              {isSubmitted ? '✓ Kész!' : 'Feliratkozás'}
            </Button>
          </form>
          
          {isSubmitted && (
            <p className="mt-4 text-cyan-400 font-semibold animate-fade-in">
              Köszönjük! Hamarosan jelentkezünk!
            </p>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
        <Button 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-2xl shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all duration-300 transform hover:scale-105"
          onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          🚀 Regisztrálj most!
        </Button>
      </div>
    </div>
  );
};

export default Index;
