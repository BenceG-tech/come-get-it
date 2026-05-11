import React from 'react';
import { Wine, Home, DollarSign, Users } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { GlassImageCard } from '@/components/ui/glass-image-card';
import userFriendsDrinks from '@/assets/user-friends-drinks.jpg';
import venueBartender from '@/assets/venue-bartender.jpg';
import brandBottles from '@/assets/brand-bottles.jpg';
import charityWater from '@/assets/charity-water.jpg';

interface BenefitCard {
  icon: React.ElementType;
  titleKey: string;
  bodyKey: string;
  li1Key: string;
  li2Key: string;
  bgImage: string;
  bgPosition?: string;
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
      bgImage: userFriendsDrinks,
      bgPosition: 'center',
    },
    {
      icon: Home,
      titleKey: 'benefits.venue.title',
      bodyKey: 'benefits.venue.body',
      li1Key: 'benefits.venue.li1',
      li2Key: 'benefits.venue.li2',
      bgImage: venueBartender,
      bgPosition: 'center',
    },
    {
      icon: DollarSign,
      titleKey: 'benefits.sponsor.title',
      bodyKey: 'benefits.sponsor.body',
      li1Key: 'benefits.sponsor.li1',
      li2Key: 'benefits.sponsor.li2',
      bgImage: brandBottles,
      bgPosition: 'center',
    },
    {
      icon: Users,
      titleKey: 'benefits.community.title',
      bodyKey: 'benefits.community.body',
      li1Key: 'benefits.community.li1',
      li2Key: 'benefits.community.li2',
      bgImage: charityWater,
      bgPosition: 'center',
    },
  ];

  return (
    <section className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white text-center mb-12 leading-tight tracking-tight">
          {t('benefits.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map(({ icon: Icon, titleKey, bodyKey, li1Key, li2Key, bgImage, bgPosition }, idx) => (
            <GlassImageCard
              key={idx}
              bgImage={bgImage}
              bgPosition={bgPosition}
              className="h-full min-h-[320px] p-6 flex flex-col"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full border border-nf-primary/40 bg-nf-primary/[0.08] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <Icon className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white text-center mb-3 group-hover:text-nf-primary transition-colors">
                {t(titleKey)}
              </h3>
              <p className="text-sm md:text-base text-white/70 text-center mb-4 leading-relaxed">
                {t(bodyKey)}
              </p>
              <ul className="mt-auto text-left text-white/85 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-nf-primary mr-2 mt-1">•</span>
                  <span>{t(li1Key)}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nf-primary mr-2 mt-1">•</span>
                  <span>{t(li2Key)}</span>
                </li>
              </ul>
            </GlassImageCard>
          ))}
        </div>
      </div>
    </section>
  );
};
