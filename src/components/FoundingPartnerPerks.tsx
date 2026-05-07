import React from 'react';
import { Check } from 'lucide-react';

const perks = [
  '6 hónap teljesen jutalékmentes',
  'Founding Partner badge az appban — örökre',
  'Garantált megjelenés a launch-PR-ben',
  'Saját social media tartalom rólunk az indulás körül',
  'Lifetime preferred jutalék-sáv (alacsonyabb, mint a későbbi partnereké)',
  'Korai hozzáférés a brand-kampányokhoz (Heineken, Coca-Cola és más nagy márkák szponzorált aktivációihoz)',
  'Rendszeres személyes konzultáció a CGI csapattal',
];

export const FoundingPartnerPerks: React.FC = () => {
  return (
    <section id="founding-partner-perks" className="py-20 px-4 bg-nf-background">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-br from-nf-surface/90 to-black/80 border-2 border-nf-primary shadow-[0_0_60px_rgba(0,188,212,0.35)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nf-secondary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight text-center mb-8">
              Founding Partner kizárólagos előnyök
            </h2>

            <ul className="space-y-4 max-w-2xl mx-auto mb-10">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-nf-primary/15 border border-nf-primary/50 flex items-center justify-center">
                    <Check className="w-4 h-4 text-nf-primary" />
                  </span>
                  <span className="text-base md:text-lg text-white leading-relaxed">{perk}</span>
                </li>
              ))}
            </ul>

            <p className="text-center text-xl md:text-2xl lg:text-3xl font-anton tracking-tight text-nf-primary">
              Csak az első 15 budapesti vendéglátóhely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
