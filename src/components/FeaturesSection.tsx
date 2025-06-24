
import React from 'react';
import { MapPin, Award, Heart } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-gray-900/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          Miért válaszd a Come Get It-et?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-cyan-500/30 group-hover:scale-110">
              <MapPin size={32} className="text-cyan-400 transition-all duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Fedezd fel a várost</h3>
            <p className="text-gray-400">Találd meg a legjobb helyeket GPS alapú navigációval</p>
          </div>

          <div className="text-center group">
            <div className="relative w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-cyan-500/30 group-hover:scale-110 overflow-hidden">
              <Award size={32} className="text-cyan-400 transition-all duration-300 group-hover:scale-110" />
              
              {/* Animated points */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Gyűjts pontokat</h3>
            <p className="text-gray-400">Váltsd be a pontjaidat menő jutalmakra és élményekre</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-cyan-500/30 group-hover:scale-110">
              <Heart size={32} className="text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Segíts másokon</h3>
            <p className="text-gray-400">Minden ital után automatikusan támogatsz jótékonysági célokat</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
