import React from 'react';
import { Download, UserPlus, Wine, Star } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Download,
      title: "TÖLTSD LE",
      description: "Töltsd le az appot"
    },
    {
      number: 2,
      icon: UserPlus,
      title: "REGISZTRÁLJ",
      description: "Regisztrálj és linkeld a kártyádat"
    },
    {
      number: 3,
      icon: Wine,
      title: "IGYÁL",
      description: "Élvezd napi welcome drink-ed"
    },
    {
      number: 4,
      icon: Star,
      title: "GYŰJTS PONTOKAT",
      description: "Gyűjtsd a pontokat és váltsd be további ingyen italokra, kedvezményekre"
    }
  ];

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            HOGYAN MŰKÖDIK
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-electric-300/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-electric-300/10">
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              <h3 className="text-sm md:text-lg font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-xs md:text-sm text-electric-100 leading-tight px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};