
import React from 'react';
import { Wine, Home, DollarSign, Users } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white text-center mb-12 leading-tight">
          Miért éri meg mindenkinek?
        </h2>

        {/* 2x2 Grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Felhasználó */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Wine className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              Felhasználó
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              Új helyek, napi ingyen ital.
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Pontgyűjtés, jutalmak</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Exkluzív ajánlatok</span>
              </li>
            </ul>
          </div>

          {/* Vendéglátóhely */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Home className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              Vendéglátóhely
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              Több vendég, nagyobb forgalom.
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Lojális közönség</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Ingyenes promóció</span>
              </li>
            </ul>
          </div>

          {/* Italszponzor */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <DollarSign className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              Italszponzor
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              Erősebb márka, mérhető eredmény.
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Új fogyasztók</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Azonnali visszajelzés</span>
              </li>
            </ul>
          </div>

          {/* Közösség */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              Közösség
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              Közös élmény, jótékony hatás.
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Új barátságok</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2 text-xs">•</span>
                <span>Minden italoddal segítesz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
