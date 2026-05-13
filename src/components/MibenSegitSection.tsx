import React from 'react';
import { Coffee, UtensilsCrossed, Sofa, PartyPopper } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import bgReggeli from '@/assets/miben-segit/reggeli.jpg';
import bgEbed from '@/assets/miben-segit/ebed.jpg';
import bgBeulos from '@/assets/miben-segit/beulos.jpg';
import bgBulizas from '@/assets/miben-segit/bulizas.jpg';

export const MibenSegitSection: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Coffee, titleKey: 'miben_segit.cards.1.title', descKey: 'miben_segit.cards.1.description', bg: bgReggeli },
    { icon: UtensilsCrossed, titleKey: 'miben_segit.cards.2.title', descKey: 'miben_segit.cards.2.description', bg: bgEbed },
    { icon: Sofa, titleKey: 'miben_segit.cards.3.title', descKey: 'miben_segit.cards.3.description', bg: bgBeulos },
    { icon: PartyPopper, titleKey: 'miben_segit.cards.4.title', descKey: 'miben_segit.cards.4.description', bg: bgBulizas },
  ];

  return (
    <section id="miben-segit" className="py-20 px-4 bg-nf-background nf-section-glow relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(0,188,212,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            {t('miben_segit.title')}
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed">
            {t('miben_segit.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {cards.map(({ icon: Icon, titleKey, descKey, bg }, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-nf-primary/15 transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_24px_70px_-12px_rgba(0,188,212,0.45)]"
            >
              {/* Image area */}
              <div
                className="relative aspect-[3/4] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${bg})` }}
              >
                {/* Constant darkening overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors duration-500"
                />

                {/* Top-left larger icon chip */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-nf-primary/50 bg-nf-background/50 backdrop-blur-md flex items-center justify-center group-hover:border-nf-primary group-hover:bg-nf-primary/15 group-hover:shadow-[0_0_24px_rgba(0,188,212,0.55)] transition-all duration-500">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Always-visible info panel (title + description) */}
              <div
                className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-5 pt-4 pb-4 sm:pt-5 sm:pb-5 border-t border-nf-primary/30"
                style={{
                  backgroundColor: 'rgba(5,5,5,0.6)',
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                }}
              >
                <h3 className="font-sans font-bold uppercase tracking-wider text-white text-sm sm:text-base mb-1.5 group-hover:text-nf-primary transition-colors">
                  {t(titleKey)}
                </h3>
                <p
                  className="text-xs sm:text-sm text-white/85 leading-snug"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
                >
                  {t(descKey)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
