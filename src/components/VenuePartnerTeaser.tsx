import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, BarChart3 } from 'lucide-react';
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
    <section id="venue-teaser" className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('venue_teaser.title')}
          </h2>
          <p className="mt-4 text-base md:text-lg text-nf-text-muted max-w-3xl mx-auto leading-relaxed">
            {t('venue_teaser.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="nf-card p-6 md:p-7 text-center hover:-translate-y-1 hover:border-nf-primary transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center shadow-neon">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors">
                {t(card.titleKey)}
              </h3>
              <p className="text-sm md:text-base text-nf-text-muted leading-relaxed">
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
