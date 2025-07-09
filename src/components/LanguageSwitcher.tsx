import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/10 rounded-full p-1 backdrop-blur-sm border border-white/20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('hu')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
          language === 'hu'
            ? 'bg-white text-black shadow-lg'
            : 'text-white hover:bg-white/10'
        }`}
      >
        HU
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
          language === 'en'
            ? 'bg-white text-black shadow-lg'
            : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </Button>
    </div>
  );
};