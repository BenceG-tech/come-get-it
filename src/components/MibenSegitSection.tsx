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
              {/* Image */}
              <div
                className="relative aspect-[3/4] bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})` }}
              >
                {/* Bottom-only fade for title legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none transition-opacity duration-500 group-hover:opacity-70"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.75) 80%, rgba(5,5,5,0.9) 100%)',
                  }}
                />

                {/* Top-left small icon chip */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-8 h-8 rounded-full border border-white/25 bg-nf-background/40 backdrop-blur-md flex items-center justify-center group-hover:border-nf-primary/80 group-hover:bg-nf-primary/15 transition-all duration-500">
                    <Icon className="w-4 h-4 text-white group-hover:text-nf-primary transition-colors" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title — fades out on hover when description appears */}
                <h3 className="absolute left-4 right-4 bottom-4 sm:left-5 sm:right-5 sm:bottom-5 z-10 font-anton uppercase tracking-tight text-white text-base sm:text-lg md:text-xl leading-none transition-opacity duration-300 group-hover:opacity-0">
                  {t(titleKey)}
                </h3>

                {/* Description — fast fade-in, GPU composited */}
                <div className="absolute inset-x-0 bottom-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out transform-gpu [will-change:opacity]">
                  <div
                    className="px-5 pt-5 pb-5 border-t border-nf-primary/30"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.7) 30%, rgba(5,5,5,0.88) 100%)',
                    }}
                  >
                    <p
                      className="text-sm text-white/95 leading-relaxed"
                      style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
                    >
                      {t(descKey)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
