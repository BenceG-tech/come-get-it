
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const FOMOSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
  <section className="py-24 px-4 bg-black">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
        {t('fomo.title')}
      </h2>
      <p className="text-xl text-white mb-8">
        {t('fomo.subtitle')}
      </p>
      <p className="text-lg text-white mb-12">
        {t('fomo.description')}
      </p>
      
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {t('fomo.cta')}
        </Button>
      </div>
    </div>
  </section>
  );
};
