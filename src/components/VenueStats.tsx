import React from 'react';
import { Users, Smartphone, MoonStar, ListChecks } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const items = [
  {
    icon: Users,
    title: 'BUDAPESTI FELNŐTT KÖZÖNSÉG',
    description: 'A helyet és új élményeket kereső vendégeket célozzuk; pontos arányt nem állítunk.',
  },
  {
    icon: Smartphone,
    title: 'MOBILE-FIRST GENERÁCIÓ',
    description: 'A helyválasztás pillanatában találkozhatnak az ajánlatoddal.',
  },
  {
    icon: MoonStar,
    title: 'ESTI ÉS AFTERWORK-AKTÍV',
    description: 'A pilotban az általad kijelölt napokon és idősávokban próbálunk elérni vendégeket.',
  },
  {
    icon: ListChecks,
    title: 'A WAITLISTÜNKRŐL INDUL AZ ELSŐ KÖR',
    description: 'A pilot eredményét valós beváltásokon ellenőrizzük, nem előre feltételezett közönségen.',
  },
];

export const VenueStats: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-nf-primary/80">
            {t('venue_details.audience_title')}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-sm md:text-base font-bold text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors duration-300">
                 {t(`venue_details.audience.${index + 1}.title`)}
              </div>
              <div className="text-xs md:text-sm text-white/60 leading-snug">
                 {t(`venue_details.audience.${index + 1}.description`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

