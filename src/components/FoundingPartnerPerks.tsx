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
        <div className="relative rounded-3xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 shadow-[0_30px_80px_-20px_rgba(0,188,212,0.35)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nf-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight text-center mb-8">
              Founding Partner kizárólagos előnyök
            </h2>

            <ul className="space-y-4 max-w-2xl mx-auto mb-10">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center">
                    <Check className="w-4 h-4 text-nf-primary" strokeWidth={2} />
                  </span>
                  <span className="text-base md:text-lg text-white/85 leading-relaxed">{perk}</span>
                </li>
              ))}
            </ul>

            <p className="text-center text-xl md:text-2xl lg:text-3xl font-anton uppercase tracking-tight text-nf-primary drop-shadow-[0_0_25px_rgba(0,188,212,0.45)]">
              Csak az első 15 budapesti vendéglátóhely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
