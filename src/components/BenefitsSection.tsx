import React from 'react';
import { Wine, Home, DollarSign, Users } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import bgUser from '@/assets/venue-why/lokacio-push.jpg';
import bgVenue from '@/assets/venue-why/uj-vendegek.jpg';
import bgSponsor from '@/assets/venue-why/nulla-rizikó.jpg';
import bgCommunity from '@/assets/miben-segit/beulos.jpg';

interface BenefitCard {
  icon: React.ElementType;
  titleKey: string;
  bodyKey: string;
  li1Key: string;
  li2Key: string;
  glow: string;
  bg: string;
}

export const BenefitsSection: React.FC = () => {
  const { t } = useI18n();

  const cards: BenefitCard[] = [
    {
      icon: Wine,
      titleKey: 'benefits.user.title',
      bodyKey: 'benefits.user.body',
      li1Key: 'benefits.user.li1',
      li2Key: 'benefits.user.li2',
      glow:
        'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(0,188,212,0.20) 0%, transparent 60%)',
      bg: bgUser,
    },
    {
      icon: Home,
      titleKey: 'benefits.venue.title',
      bodyKey: 'benefits.venue.body',
      li1Key: 'benefits.venue.li1',
      li2Key: 'benefits.venue.li2',
      glow:
        'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,188,212,0.18) 0%, transparent 65%)',
      bg: bgVenue,
    },
    {
      icon: DollarSign,
      titleKey: 'benefits.sponsor.title',
      bodyKey: 'benefits.sponsor.body',
      li1Key: 'benefits.sponsor.li1',
      li2Key: 'benefits.sponsor.li2',
      glow:
        'radial-gradient(ellipse 70% 50% at 80% 90%, rgba(0,188,212,0.22) 0%, transparent 65%)',
      bg: bgSponsor,
    },
    {
      icon: Users,
      titleKey: 'benefits.community.title',
      bodyKey: 'benefits.community.body',
      li1Key: 'benefits.community.li1',
      li2Key: 'benefits.community.li2',
      glow:
        'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(0,188,212,0.20) 0%, transparent 60%)',
      bg: bgCommunity,
    },
  ];

  return (
    <section className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white text-center mb-12 leading-tight tracking-tight">
          {t('benefits.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map(({ icon: Icon, titleKey, bodyKey, li1Key, li2Key, glow, bg }, idx) => (
            <div
              key={idx}
              className="group relative h-full min-h-[320px] rounded-2xl overflow-hidden border border-nf-primary/20 bg-cover bg-center p-6 flex flex-col transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(5,5,5,0.70) 0%, rgba(5,5,5,0.90) 100%)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: glow }}
              />
              <div className="relative flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full border border-nf-primary/40 bg-nf-primary/[0.08] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <Icon className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="relative text-lg md:text-xl font-bold text-white text-center mb-3 group-hover:text-nf-primary transition-colors">
                {t(titleKey)}
              </h3>
              <p className="relative text-sm md:text-base text-white/65 text-center mb-4 leading-relaxed">
                {t(bodyKey)}
              </p>
              <ul className="relative mt-auto text-left text-white/85 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-nf-primary mr-2 mt-1">•</span>
                  <span>{t(li1Key)}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nf-primary mr-2 mt-1">•</span>
                  <span>{t(li2Key)}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
