import React from 'react';
import { Users, Store, Wine, Gift, Heart } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import bgUser from '@/assets/benefits/felhasznalok.jpg';
import bgVenue from '@/assets/benefits/vendeglatohelyek.jpg';
import bgBrand from '@/assets/benefits/italmarkak.jpg';
import bgRewards from '@/assets/benefits/rewards-partnerek.jpg';
import bgCommunity from '@/assets/benefits/kozosseg.jpg';

interface BenefitCard {
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  bg: string;
}

export const BenefitsSection: React.FC = () => {
  const { t } = useI18n();

  const cards: BenefitCard[] = [
    { icon: Users, titleKey: 'benefits.user.title', descKey: 'benefits.user.desc', bg: bgUser },
    { icon: Store, titleKey: 'benefits.venue.title', descKey: 'benefits.venue.desc', bg: bgVenue },
    { icon: Wine, titleKey: 'benefits.brand.title', descKey: 'benefits.brand.desc', bg: bgBrand },
    { icon: Gift, titleKey: 'benefits.rewards.title', descKey: 'benefits.rewards.desc', bg: bgRewards },
    { icon: Heart, titleKey: 'benefits.community.title', descKey: 'benefits.community.desc', bg: bgCommunity },
  ];

  return (
    <section className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white text-center mb-12 leading-tight tracking-tight">
          {t('benefits.title')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {cards.map(({ icon: Icon, titleKey, descKey, bg }, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-nf-primary/20 bg-nf-surface/40 transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              {/* Image area — fully visible */}
              <div
                className="relative aspect-[4/3] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${bg})` }}
              >
                {/* Subtle top gradient so icon stays readable */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent pointer-events-none"
                />

                {/* Top-left icon medallion */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-10 h-10 rounded-full border border-nf-primary/50 bg-nf-background/60 backdrop-blur-md flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.55)] transition-all duration-500">
                    <Icon className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Text block BELOW the image */}
              <div className="px-4 pt-3.5 pb-4 md:pt-4 md:pb-5 border-t border-nf-primary/20">
                <h3 className="font-sans font-bold uppercase tracking-wider text-white text-sm sm:text-base leading-tight mb-1.5 group-hover:text-nf-primary transition-colors">
                  {t(titleKey)}
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-snug">
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
