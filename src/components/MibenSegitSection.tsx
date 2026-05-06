import React from 'react';
import { Coffee, UtensilsCrossed, Sofa, PartyPopper } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const MibenSegitSection: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Coffee, titleKey: 'miben_segit.cards.1.title', descKey: 'miben_segit.cards.1.description' },
    { icon: UtensilsCrossed, titleKey: 'miben_segit.cards.2.title', descKey: 'miben_segit.cards.2.description' },
    { icon: Sofa, titleKey: 'miben_segit.cards.3.title', descKey: 'miben_segit.cards.3.description' },
    { icon: PartyPopper, titleKey: 'miben_segit.cards.4.title', descKey: 'miben_segit.cards.4.description' },
  ];

  return (
    <section id="miben-segit" className="py-16 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('miben_segit.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="nf-card p-5 md:p-6 text-center hover:-translate-y-1 hover:border-nf-primary transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center shadow-neon">
                  <card.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">
                {t(card.titleKey)}
              </h3>
              <p className="text-sm text-nf-text-muted leading-relaxed">
                {t(card.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
