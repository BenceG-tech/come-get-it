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
    <section id="how-it-works" className="py-16 px-4 bg-nf-background overflow-visible">
      <div className="max-w-6xl mx-auto overflow-visible">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            {t('how_it_works.headline')}
          </h2>
          <p className="text-nf-text-muted text-lg max-w-2xl mx-auto">
            {t('how_it_works.subheadline')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
          {cards.map((card) => (
            <div
              key={card.number}
              className="bg-nf-surface border border-nf-border rounded-2xl p-6 hover:border-nf-primary/50 transition-all duration-300 group min-h-[180px]"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-nf-primary/50 flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-neon transition-all duration-300">
                  <card.icon className="w-7 h-7 text-nf-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-nf-primary rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {card.number}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nf-primary transition-colors duration-300">
                {t(card.titleKey)}
              </h3>
              <p className="text-nf-text-muted text-sm leading-relaxed">
                {t(card.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
