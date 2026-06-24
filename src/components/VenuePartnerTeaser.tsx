import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, BarChart3, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { analytics } from '@/lib/analytics';
import bgUjVendegek from '@/assets/venue-teaser/uj-vendegek.jpg';
import bgNullaRizko from '@/assets/venue-teaser/nulla-rizko.jpg';
import bgValodiInsight from '@/assets/venue-teaser/valodi-insight.jpg';

export const VenuePartnerTeaser: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Users, titleKey: 'venue_teaser.cards.1.title', descKey: 'venue_teaser.cards.1.description', bg: bgUjVendegek },
    { icon: ShieldCheck, titleKey: 'venue_teaser.cards.2.title', descKey: 'venue_teaser.cards.2.description', bg: bgNullaRizko },
    { icon: BarChart3, titleKey: 'venue_teaser.cards.3.title', descKey: 'venue_teaser.cards.3.description', bg: bgValodiInsight },
  ];

  return (
    <section id="venue-teaser" className="py-20 px-4 bg-nf-background nf-section-glow relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(0,188,212,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center shadow-[0_0_30px_rgba(0,188,212,0.25)]">
              <Store className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            {t('venue_teaser.title')}
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/65 max-w-3xl mx-auto leading-relaxed">
            {t('venue_teaser.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              {/* Image area */}
              <div
                className="relative aspect-[21/9] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${card.bg})` }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
                />
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-nf-primary/50 bg-nf-background/60 backdrop-blur-md flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.55)] transition-all duration-500">
                    <card.icon className="w-4 h-4 md:w-5 md:h-5 text-nf-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Text block */}
              <div className="px-5 pt-4 pb-5 md:pt-5 md:pb-6 border-t border-nf-primary/20 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed">
                  {t(card.descKey)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="neon"
            size="lg"
            className="py-4 px-10 text-base md:text-lg"
            onClick={() => analytics.ctaClick('venue_teaser_cta', t('venue_teaser.cta'))}
          >
            <Link to="/vendeglatohelyek">{t('venue_teaser.cta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
