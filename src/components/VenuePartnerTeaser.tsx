import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, BarChart3, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { analytics } from '@/lib/analytics';

export const VenuePartnerTeaser: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Users, titleKey: 'venue_teaser.cards.1.title', descKey: 'venue_teaser.cards.1.description' },
    { icon: ShieldCheck, titleKey: 'venue_teaser.cards.2.title', descKey: 'venue_teaser.cards.2.description' },
    { icon: BarChart3, titleKey: 'venue_teaser.cards.3.title', descKey: 'venue_teaser.cards.3.description' },
  ];

  return (
    <section id="venue-teaser" className="py-20 px-4 bg-nf-background relative overflow-hidden">
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

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group relative h-full bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 rounded-2xl p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <card.icon className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors">
                {t(card.titleKey)}
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                {t(card.descKey)}
              </p>
            </div>
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
