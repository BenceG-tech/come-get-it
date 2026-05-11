import React from 'react';
import { Coffee, UtensilsCrossed, Sofa, PartyPopper } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { GlassImageCard } from '@/components/ui/glass-image-card';
import breakfastCafe from '@/assets/breakfast-cafe.jpg';
import lunchBistro from '@/assets/lunch-bistro.jpg';
import loungeEvening from '@/assets/lounge-evening.jpg';
import nightclubParty from '@/assets/nightclub-party.jpg';

export const MibenSegitSection: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Coffee, titleKey: 'miben_segit.cards.1.title', descKey: 'miben_segit.cards.1.description', bgImage: breakfastCafe, bgPosition: 'center' },
    { icon: UtensilsCrossed, titleKey: 'miben_segit.cards.2.title', descKey: 'miben_segit.cards.2.description', bgImage: lunchBistro, bgPosition: 'center' },
    { icon: Sofa, titleKey: 'miben_segit.cards.3.title', descKey: 'miben_segit.cards.3.description', bgImage: loungeEvening, bgPosition: 'center' },
    { icon: PartyPopper, titleKey: 'miben_segit.cards.4.title', descKey: 'miben_segit.cards.4.description', bgImage: nightclubParty, bgPosition: 'center' },
  ];

  return (
    <section id="miben-segit" className="py-20 px-4 bg-nf-background relative overflow-hidden">
      {/* subtle cyan ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(0,188,212,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            {t('miben_segit.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {cards.map((card, idx) => (
            <GlassImageCard
              key={idx}
              bgImage={card.bgImage}
              bgPosition={card.bgPosition}
              className="h-full p-5 md:p-7 flex flex-col items-center text-center"
            >
              <div className="mb-5 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                <card.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">
                {t(card.titleKey)}
              </h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                {t(card.descKey)}
              </p>
            </GlassImageCard>
          ))}
        </div>
      </div>
    </section>
  );
};
