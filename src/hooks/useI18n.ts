import { useLocale } from '@/contexts/LocaleContext';
import hu from '@/i18n/hu.json';
import en from '@/i18n/en.json';

const dict = { hu, en } as const;

export const useI18n = () => {
  const { lang, setLang } = useLocale();
  const t = (key: string): string => {
    const parts = key.split('.');
    let cur: any = dict[lang];
    for (const p of parts) {
      if (cur && p in cur) cur = cur[p];
      else {
        // Fallback to HU, then key
        let fallback: any = (dict as any).hu;
        for (const pp of parts) {
          if (fallback && pp in fallback) fallback = fallback[pp];
          else return key;
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    return typeof cur === 'string' ? cur : key;
  };

  return { t, lang, setLang };
};
