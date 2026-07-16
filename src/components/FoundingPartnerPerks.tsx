import React from 'react';
import { Check } from 'lucide-react';

const perks = [
  '6 hónap teljesen jutalékmentes',
  'Founding Partner badge az appban — örökre',
  'Megjelenés a közös launch-PR-ben',
  'Saját social media tartalom rólunk az indulás körül',
  'Lifetime preferred jutalék-sáv (alacsonyabb, mint a későbbi partnereké)',
  'Korai hozzáférés a brand-kampányokhoz (Heineken, Coca-Cola és más nagy márkák szponzorált aktivációihoz)',
  'Rendszeres személyes konzultáció a CGI csapattal',
];

export const FoundingPartnerPerks: React.FC = () => {
  return (
    <section id="founding-partner-perks" className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 shadow-[0_30px_80px_-20px_rgba(0,188,212,0.35)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nf-primary/10 rounded-full blur-3xl pointer-events-none" />
          {/* Cyan mesh/wave decoration on right */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-30"
            style={{
              WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
              maskImage: 'linear-gradient(to left, black, transparent)',
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none" fill="none">
              <path d="M0 80 Q100 40 200 90 T400 70" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.5" />
              <path d="M0 160 Q100 110 200 170 T400 150" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.4" />
              <path d="M0 240 Q100 200 200 250 T400 230" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.35" />
              <path d="M0 320 Q100 280 200 330 T400 310" stroke="hsl(var(--nf-primary))" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>

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

            <div className="text-center">
              <span className="inline-block px-6 py-3 rounded-full border border-nf-primary/40 bg-nf-primary/10 text-xl md:text-2xl lg:text-3xl font-anton uppercase tracking-tight text-nf-primary drop-shadow-[0_0_25px_rgba(0,188,212,0.45)]">
                Csak az első 15 budapesti vendéglátóhely.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
