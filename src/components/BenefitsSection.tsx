
import React from 'react';
import { Wine, Home, DollarSign } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-16 leading-tight">
          Miért éri meg mindenkinek?
        </h2>

        {/* Three columns */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Felhasználó */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Wine className="w-16 h-16 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Felhasználó
            </h3>
            <p className="text-lg text-electric-100 mb-6 leading-relaxed">
              Olcsón iszol,<br />
              új helyeket fedezel fel.
            </p>
            <ul className="text-left text-white space-y-3">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Ingyen ital minden nap</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Exkluzív ajánlatok, pontgyűjtés</span>
              </li>
            </ul>
          </div>

          {/* Vendéglátóhely */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Home className="w-16 h-16 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Vendéglátóhely
            </h3>
            <p className="text-lg text-electric-100 mb-6 leading-relaxed">
              Növekvő forgalom,<br />
              hűséges vendégek.
            </p>
            <ul className="text-left text-white space-y-3">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Visszatérő, lojális közönség</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Ingyen promóció, adatalapú marketing</span>
              </li>
            </ul>
          </div>

          {/* Italszponzor */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <DollarSign className="w-16 h-16 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Italszponzor
            </h3>
            <p className="text-lg text-electric-100 mb-6 leading-relaxed">
              Erősebb jelenlét,<br />
              mérhető reklám.
            </p>
            <ul className="text-left text-white space-y-3">
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Új márkakedvelők</span>
              </li>
              <li className="flex items-start">
                <span className="text-electric-300 mr-2">•</span>
                <span>Több ital fogy, instant feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
