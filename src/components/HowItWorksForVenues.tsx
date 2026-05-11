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
    <section id="how-it-works-venues" className="py-16 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            Csatlakozás 5 lépésben
          </h2>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {/* Desktop connector line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-[8%] right-[8%] top-[88px] h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent z-0"
          />
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative z-10 h-full flex flex-col items-center text-center p-5 md:p-6 rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              <div className="text-2xl font-anton text-nf-primary mb-3">
                {step.number}
              </div>
              <div className="mb-4 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">
                {step.title}
              </h4>
              <p className="text-xs md:text-sm text-white/60 leading-snug">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
