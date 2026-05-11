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
    <section id="how-it-works" className="py-20 px-4 bg-nf-background nf-section-glow overflow-visible">
      <div className="max-w-6xl mx-auto overflow-visible">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white mb-4 tracking-tight">
            {t('how_it_works.headline')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('how_it_works.subheadline')}
          </p>
        </div>

        {/* Desktop: horizontal cards with dotted connector */}
        <div className="hidden lg:block relative">
          <div
            aria-hidden="true"
            className="absolute top-[88px] left-[12%] right-[12%] border-t border-dashed border-nf-primary/30 pointer-events-none"
          />
          <div className="grid grid-cols-4 gap-6 pb-4 relative">
            {cards.map((card) => (
              <div
                key={card.number}
                className="group relative bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 rounded-2xl p-6 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.4)] transition-all duration-500 min-h-[200px]"
              >
                <div className="relative mb-6 flex justify-start">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border border-nf-primary/50 bg-nf-primary/[0.06] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                      <card.icon className="w-7 h-7 text-nf-primary" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-nf-primary rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_15px_rgba(0,188,212,0.6)]">
                      {card.number}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nf-primary transition-colors duration-300">
                  {t(card.titleKey)}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t(card.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden flex flex-col">
          {cards.map((card, idx) => {
            const isLast = idx === cards.length - 1;
            return (
              <div key={card.number} className="flex gap-4 relative">
                {/* Left rail: badge + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full bg-nf-primary text-black font-bold text-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,188,212,0.6)] z-10">
                    {card.number}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="flex-1 w-px border-l border-dashed border-nf-primary/30 my-1"
                    />
                  )}
                </div>

                {/* Card */}
                <div className="group flex-1 mb-4 bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 rounded-2xl p-5 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.4)] transition-all duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full border border-nf-primary/50 bg-nf-primary/[0.06] flex items-center justify-center shrink-0">
                      <card.icon className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {t(card.titleKey)}
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
