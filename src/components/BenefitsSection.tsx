
import React from 'react';
import { Wine, Home, DollarSign, Users } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const BenefitsSection: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-16 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white text-center mb-12 leading-tight tracking-tight">
          {t('benefits.title')}
        </h2>

        {/* 2x2 Grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Felhasználó */}
          <div className="text-center p-4 nf-card hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <Wine className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.user.title')}
            </h3>
            <p className="text-sm md:text-base text-nf-text-muted mb-4 leading-relaxed">
              {t('benefits.user.body')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.user.li1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.user.li2')}</span>
              </li>
            </ul>
          </div>

          {/* Vendéglátóhely */}
          <div className="text-center p-4 nf-card hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <Home className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.venue.title')}
            </h3>
            <p className="text-sm md:text-base text-nf-text-muted mb-4 leading-relaxed">
              {t('benefits.venue.body')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.venue.li1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.venue.li2')}</span>
              </li>
            </ul>
          </div>

          {/* Italszponzor */}
          <div className="text-center p-4 nf-card hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.sponsor.title')}
            </h3>
            <p className="text-sm md:text-base text-nf-text-muted mb-4 leading-relaxed">
              {t('benefits.sponsor.body')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.sponsor.li1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.sponsor.li2')}</span>
              </li>
            </ul>
          </div>

          {/* Közösség */}
          <div className="text-center p-4 nf-card hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.community.title')}
            </h3>
            <p className="text-sm md:text-base text-nf-text-muted mb-4 leading-relaxed">
              {t('benefits.community.body')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.community.li1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-nf-primary mr-2 text-xs">•</span>
                <span>{t('benefits.community.li2')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
