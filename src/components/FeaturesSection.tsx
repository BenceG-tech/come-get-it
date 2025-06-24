
import React from 'react';
import { MapPin, Award, Heart } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-gray-900/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          Miért válaszd a Come Get It-et?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group animate-fade-in">
            <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl shadow-cyan-500/20 border border-cyan-400/20">
              {/* Custom 3D-style glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-2xl blur-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-2xl blur-md"></div>
              
              <MapPin size={36} className="text-cyan-300 transition-all duration-500 group-hover:scale-125 group-hover:text-cyan-200 relative z-10" />
              
              {/* Animated particles on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Fedezd fel a várost</h3>
            <p className="text-gray-400 mb-3">Találd meg a legjobb helyeket GPS alapú navigációval</p>
            <p className="text-cyan-300 text-sm font-medium">Új helyek, új barátok – minden napra egy új élmény!</p>
          </div>

          <div className="text-center group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl shadow-purple-500/20 border border-purple-400/20 overflow-hidden">
              {/* Custom 3D-style glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl blur-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-2xl blur-md"></div>
              
              <Award size={36} className="text-purple-300 transition-all duration-500 group-hover:scale-125 group-hover:text-purple-200 relative z-10" />
              
              {/* Enhanced animated points */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                    style={{
                      top: `${15 + Math.random() * 70}%`,
                      left: `${15 + Math.random() * 70}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Gyűjts pontokat</h3>
            <p className="text-gray-400 mb-3">Váltsd be a pontjaidat menő jutalmakra és élményekre</p>
            <p className="text-purple-300 text-sm font-medium">Játékos kihívások és exkluzív kedvezmények várnak!</p>
          </div>

          <div className="text-center group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-20 h-20 bg-gradient-to-br from-red-500/30 to-orange-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl shadow-red-500/20 border border-red-400/20">
              {/* Custom 3D-style glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent rounded-2xl blur-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-2xl blur-md"></div>
              
              <Heart size={36} className="text-red-300 transition-all duration-500 group-hover:scale-125 group-hover:text-red-200 group-hover:animate-pulse relative z-10" />
              
              {/* Heart particles animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-red-400 animate-bounce"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '1.2s',
                      fontSize: '8px'
                    }}
                  >
                    ♥
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Segíts másokon</h3>
            <p className="text-gray-400 mb-3">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
            <p className="text-red-300 text-sm font-medium">Szórakozz és változtass a világon – egy kortyban!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
