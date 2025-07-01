
import React from 'react';
import { MapPin, CreditCard, Wine, Gift } from 'lucide-react';

export const HowItWorksForVenues: React.FC = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Fedezd fel a legjobb helyeket",
      description: "Találd meg Budapest legmenőbb helyeit, és mutasd be ajánlatodat az aktív közösségnek."
    },
    {
      icon: CreditCard,
      title: "Regisztrálj digitálisan",
      description: "Pár kattintás, és vendégeid máris pontokat gyűjtenek vagy igénybe vehetik az ingyen italt."
    },
    {
      icon: Wine,
      title: "Gyűjts pontokat minden vásárlásnál",
      description: "Minden fogyasztás után pontok – vagy napi 1 ingyen ital."
    },
    {
      icon: Gift,
      title: "Váltsd be jutalmakra",
      description: "A pontokat kedvezményekre, extra italokra vagy exkluzív ajánlatokra válthatják be."
    }
  ];

  return (
    <section className="py-16 px-4 bg-black/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            HOGYAN MŰKÖDIK?
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-electric-300/30 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {step.title}
              </h4>
              
              <p className="text-electric-100 text-sm leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
