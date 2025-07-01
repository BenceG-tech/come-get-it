
import React from 'react';
import { Compass, CreditCard, Wine, Gift } from 'lucide-react';

export const HowItWorksForVenues: React.FC = () => {
  const steps = [
    {
      icon: Compass,
      title: "Regisztrálj",
      description: "Jelentkezz partnerségre egyszerűen"
    },
    {
      icon: CreditCard,
      title: "Állítsd be",
      description: "Konfiguráljuk a rendszered"
    },
    {
      icon: Wine,
      title: "Fogadj vendégeket",
      description: "Automatikus promóció indul"
    },
    {
      icon: Gift,
      title: "Kövesd eredményeket",
      description: "Részletes jelentések és analytics"
    }
  ];

  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            HOGYAN MŰKÖDIK?
          </h3>
          <p className="text-lg text-electric-100 max-w-2xl mx-auto">
            Négy egyszerű lépésben partnereink lesztek
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-electric-300/30 transition-all duration-300">
                  <step.icon className="w-10 h-10 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {step.title}
              </h4>
              
              <p className="text-electric-100 leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
