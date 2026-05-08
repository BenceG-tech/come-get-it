import React from 'react';
import { MapPin, Footprints, Wine, HeartHandshake } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const HowItWorks: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { number: 1, icon: MapPin,         titleKey: 'how_it_works.cards.1.title', descKey: 'how_it_works.cards.1.description' },
    { number: 2, icon: Footprints,     titleKey: 'how_it_works.cards.2.title', descKey: 'how_it_works.cards.2.description' },
    { number: 3, icon: Wine,           titleKey: 'how_it_works.cards.3.title', descKey: 'how_it_works.cards.3.description' },
    { number: 4, icon: HeartHandshake, titleKey: 'how_it_works.cards.4.title', descKey: 'how_it_works.cards.4.description' },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-nf-background overflow-visible">
      <div className="max-w-6xl mx-auto overflow-visible">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white mb-4 tracking-tight">
            {t('how_it_works.headline')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('how_it_works.subheadline')}
          </p>
        </div>

        <div className="relative">
          {/* Dotted cyan connector — desktop only */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-[88px] left-[12%] right-[12%] border-t border-dashed border-nf-primary/30 pointer-events-none"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 relative">
            {cards.map((card) => (
              <div
                key={card.number}
                className="group relative bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 rounded-2xl p-6 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.4)] transition-all duration-500 min-h-[200px]"
              >
                <div className="relative mb-6 flex justify-center lg:justify-start">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border border-nf-primary/50 bg-nf-primary/[0.06] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                      <card.icon className="w-7 h-7 text-nf-primary" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-nf-primary rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_15px_rgba(0,188,212,0.6)]">
                      {card.number}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 text-center lg:text-left group-hover:text-nf-primary transition-colors duration-300">
                  {t(card.titleKey)}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed text-center lg:text-left">
                  {t(card.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
