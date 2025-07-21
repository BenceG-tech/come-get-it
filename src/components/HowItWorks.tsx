
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
    <section 
      className="py-16 md:py-24 px-4 bg-black"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-lg">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 id="how-it-works-heading" className="text-white mb-4">
            HOGYAN MŰKÖDIK
          </h2>
        </div>
        
        <div className="grid-responsive-4 stagger-children">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="text-center group card-interactive"
            >
              <div className="mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto glass-card rounded-full flex items-center justify-center shadow-brand-glow group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              <h3 className="text-sm md:text-lg font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="body-small text-electric-100 leading-tight px-2">
                {step.description}
              </p>
              
              {/* Step number indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-electric-300 text-black rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {step.number}
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-12 animate-fade-in-up">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 bg-electric-300 rounded-full"></div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-electric-300 to-neon-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
