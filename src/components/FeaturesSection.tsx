
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
  );
};

export default FeaturesSection;
