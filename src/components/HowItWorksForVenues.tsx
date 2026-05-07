import React from 'react';
import { MessageCircle, FileSignature, Settings, Rocket, ShieldCheck } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: MessageCircle,
    title: 'Beszélgetünk',
    description: 'Online vagy személyesen találkozunk. Megmutatjuk az appot, az admin felületet, és válaszolunk minden kérdésedre.',
  },
  {
    number: '2',
    icon: FileSignature,
    title: 'Aláírjuk a Letter of Intent-et',
    description: 'Egy egyszerű szándéknyilatkozat, hogy szeptemberben együtt indulunk. Most még nincs szerződéses kötelezettséged — csak egy közös elköteleződés a launch-ra.',
  },
  {
    number: '3',
    icon: Settings,
    title: 'Beállítjuk a profilodat',
    description: 'Felvesszük a helyed adatait, az ingyen italok körét, az időablakokat. Te döntöd el, mit, mikor és kinek.',
  },
  {
    number: '4',
    icon: Rocket,
    title: 'Elindulunk szeptember 1-én',
    description: 'A Founding Partner badge-eddel az első naptól megjelensz az appban. PR-megjelenés, social media, launch-kampány — közösen csináljuk.',
  },
  {
    number: '5',
    icon: ShieldCheck,
    title: 'Az első 6 hónap teljesen jutalékmentes',
    description: 'Pénz csak akkor lép be a képbe, ha mindketten azt látjuk, hogy működik. Onnantól is csak a Come Get It által generált forgalomból, alacsony jutalék mellett.',
  },
];

export const HowItWorksForVenues: React.FC = () => {
  return (
    <section id="how-it-works-venues" className="py-16 px-4 bg-nf-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Csatlakozás 5 lépésben
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="nf-card p-5 md:p-6 text-center group hover:scale-105 hover:shadow-neon transition-all duration-300"
            >
              <div className="text-2xl font-black text-nf-primary mb-3">
                {step.number}
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-neon">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="text-sm md:text-base font-black text-white mb-2 group-hover:text-nf-primary transition-colors duration-300">
                {step.title}
              </h4>
              <p className="text-xs md:text-sm text-nf-text-muted leading-snug">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
