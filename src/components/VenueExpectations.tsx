import React from 'react';
import { Check } from 'lucide-react';

const expectations = [
  'Jelölj ki 1–2 gyenge időablakot, ahol az ingyen ital tényleg beterelhet vendéget.',
  'Egy staff-felelőst adj a projektnek, aki érti a flow-t és tudja tanítani a többieket.',
  'Fogadd el a standard beváltási flow-t (a vendég a helyszínen az appban kéri, a pultos beváltja).',
  'Ülj le velünk 30 naponta 30 percre megnézni az adatokat és eldönteni, mit optimalizálunk.',
];

export const VenueExpectations: React.FC = () => {
  return (
    <section id="venue-expectations" className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 shadow-[0_30px_80px_-20px_rgba(0,188,212,0.25)] overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-nf-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight text-center mb-4">
              Mit várunk tőled?
            </h2>
            <p className="text-center text-base md:text-lg text-white/65 max-w-2xl mx-auto mb-8 leading-relaxed">
              Egy jó pilot két oldalról áll. Mi hozzuk a rendszert, a láthatóságot, a mérést és a betanítást. Tőled ezt a négyet kérjük:
            </p>

            <ul className="space-y-4 max-w-2xl mx-auto">
              {expectations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center">
                    <Check className="w-4 h-4 text-nf-primary" strokeWidth={2} />
                  </span>
                  <span className="text-base md:text-lg text-white/85 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
