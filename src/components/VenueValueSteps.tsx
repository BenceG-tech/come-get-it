import React from 'react';
import { ArrowRight, HeartHandshake, ScanLine } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const icons = [ArrowRight, HeartHandshake, ScanLine];

export const VenueValueSteps: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-14 px-4 bg-nf-background nf-section-glow" aria-label={t('venue_value.title')}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-anton uppercase text-foreground text-center mb-9">{t('venue_value.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {icons.map((Icon, index) => (
            <div key={index} className="border-t border-nf-primary/50 pt-5">
              <div className="flex items-center gap-3 text-nf-primary mb-3">
                <Icon aria-hidden="true" className="w-6 h-6 shrink-0" />
                <h3 className="font-anton text-2xl uppercase">{t(`venue_value.steps.${index + 1}.title`)}</h3>
              </div>
              <p className="text-nf-text-muted leading-relaxed">{t(`venue_value.steps.${index + 1}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};