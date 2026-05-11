import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const FOMOSection: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-2xl border border-dashed border-nf-primary/40 bg-white/[0.03] backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at top left, rgba(0,188,212,0.10), transparent 60%)',
          }}
        >
          <div className="flex items-center gap-5 flex-1">
            <div className="shrink-0 w-14 h-14 rounded-full border border-nf-primary/50 bg-nf-primary/[0.08] flex items-center justify-center shadow-[0_0_30px_rgba(0,188,212,0.35)]">
              <Tag className="w-6 h-6 text-nf-primary" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-anton uppercase text-white tracking-tight mb-2">
                {t('fomo.title')}
              </h2>
              <p className="text-white/75 text-sm md:text-base leading-relaxed">
                {t('fomo.p1')}
              </p>
              <p className="text-white/55 text-xs md:text-sm mt-1">
                {t('fomo.p2')}
              </p>
            </div>
          </div>

          <div className="md:shrink-0 md:ml-auto">
            <Button
              variant="neon"
              size="lg"
              className="w-full md:w-auto py-4 px-8 text-base md:text-lg"
              onClick={() => {
                analytics.ctaClick('fomo_section', t('fomo.button'));
                document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('fomo.button')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
