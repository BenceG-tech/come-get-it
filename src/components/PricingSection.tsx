import React from 'react';
import { Check, Info, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { analytics } from '@/lib/analytics';

export const PricingSection: React.FC = () => {
  const { t } = useI18n();

  const freeBullets = [
    'pricing.free.b1',
    'pricing.free.b2',
    'pricing.free.b3',
    'pricing.free.b4',
    'pricing.free.b5',
    'pricing.free.b6',
  ];

  const plusBullets = [
    'pricing.plus.b1',
    'pricing.plus.b2',
    'pricing.plus.b3',
    'pricing.plus.b4',
    'pricing.plus.b5',
  ];

  const scrollToSignup = (cta: string) => {
    analytics.ctaClick(cta, t(`pricing.${cta === 'pricing_free' ? 'free' : 'plus'}.cta`));
    document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 text-base md:text-lg text-nf-text-muted max-w-3xl mx-auto leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* FREE card */}
          <div className="nf-card p-6 md:p-8 flex flex-col">
            <div className="text-xs font-bold tracking-[0.2em] text-nf-text-muted mb-3">
              {t('pricing.free.label')}
            </div>
            <div className="text-4xl md:text-5xl font-anton text-white mb-6">
              {t('pricing.free.price')}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {freeBullets.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm md:text-base text-nf-text">
                  <Check className="w-5 h-5 text-nf-primary shrink-0 mt-0.5" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-nf-primary/60 text-nf-primary hover:bg-nf-primary/10 hover:text-nf-primary py-4 text-base"
              onClick={() => scrollToSignup('pricing_free')}
            >
              {t('pricing.free.cta')}
            </Button>
          </div>

          {/* PLUS card - highlighted */}
          <div className="nf-card p-6 md:p-8 flex flex-col relative border-2 border-nf-primary shadow-neon-strong">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-nf-primary text-black text-xs font-bold tracking-wide">
              {t('pricing.plus.badge')}
            </div>
            <div className="text-xs font-bold tracking-[0.2em] text-nf-primary mb-3">
              {t('pricing.plus.label')}
            </div>
            <div className="text-2xl md:text-3xl font-anton text-white mb-6 leading-tight">
              {t('pricing.plus.price')}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plusBullets.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm md:text-base text-nf-text">
                  <Check className="w-5 h-5 text-nf-primary shrink-0 mt-0.5" />
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="neon"
              size="lg"
              className="py-4 text-base"
              onClick={() => scrollToSignup('pricing_plus')}
            >
              {t('pricing.plus.cta')}
            </Button>
          </div>
        </div>

        {/* Info row */}
        <div className="mt-8 nf-card p-5 md:p-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-nf-primary shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-nf-text-muted leading-relaxed">
            {t('pricing.info')}
          </p>
        </div>

        {/* Launch promo banner */}
        <div className="mt-6 rounded-2xl border-2 border-nf-primary bg-gradient-to-r from-nf-primary/15 via-nf-primary/10 to-nf-secondary/15 p-5 md:p-6 flex items-start gap-3 shadow-neon">
          <Gift className="w-6 h-6 text-nf-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-nf-primary mb-1">
              {t('pricing.promo.label')}
            </div>
            <p className="text-sm md:text-base text-white leading-relaxed">
              {t('pricing.promo.body')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
