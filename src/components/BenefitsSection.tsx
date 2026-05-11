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
            <div
              key={idx}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-nf-primary/20 bg-cover bg-center transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
              style={{ backgroundImage: `url(${bg})` }}
            >
              {/* Dark gradient overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.95) 100%)',
                }}
              />

              {/* Top-left icon medallion */}
              <div className="absolute top-4 left-4 z-10">
                <div className="w-10 h-10 rounded-full border border-nf-primary/50 bg-nf-primary/[0.12] backdrop-blur-sm flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.55)] transition-all duration-500">
                  <Icon className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>

              {/* Bottom-aligned text */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-10">
                <h3 className="font-anton uppercase tracking-tight text-white text-base md:text-lg leading-tight mb-2 group-hover:text-nf-primary transition-colors">
                  {t(titleKey)}
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
