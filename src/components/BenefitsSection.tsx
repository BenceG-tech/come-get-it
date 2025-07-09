
import React from 'react';
import { Wine, Home, DollarSign, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white text-center mb-12 leading-tight">
          {t('benefits.title')}
        </h2>

        {/* 2x2 Grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Felhasználó */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Wine className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.users.title')}
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              {t('benefits.users.description')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              {(t('benefits.users.items') as string[]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-electric-300 mr-2 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendéglátóhely */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Home className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.venues.title')}
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              {t('benefits.venues.description')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              {(t('benefits.venues.items') as string[]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-electric-300 mr-2 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Italszponzor */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <DollarSign className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.sponsors.title')}
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              {t('benefits.sponsors.description')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              {(t('benefits.sponsors.items') as string[]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-electric-300 mr-2 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Közösség */}
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 md:w-14 md:h-14 text-electric-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3">
              {t('benefits.community.title')}
            </h3>
            <p className="text-sm md:text-base text-electric-100 mb-4 leading-relaxed">
              {t('benefits.community.description')}
            </p>
            <ul className="text-left text-white space-y-2 text-sm">
              {(t('benefits.community.items') as string[]).map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-electric-300 mr-2 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
