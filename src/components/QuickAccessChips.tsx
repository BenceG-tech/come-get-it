import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Wine, Gift, Rocket } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const QuickAccessChips: React.FC = () => {
  const { t } = useI18n();
  const onClick = (name: string) => () => analytics.ctaClick('quick_access_chips', name);

  const chipCls =
    'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm';

  return (
    <nav className="lg:hidden w-full px-4 -mt-4 mb-6" aria-label={t('quick_access.aria')}>
      <div className="flex gap-2 overflow-x-auto">
        <Link to="/vendeglatohelyek" onClick={onClick(t('nav.venues'))} className={chipCls} aria-label={t('nav.venues')}>
          <Store className="h-4 w-4 text-electric-300" />
          <span>{t('nav.venues')}</span>
        </Link>
        <Link to="/italmarkak" onClick={onClick(t('nav.brands'))} className={chipCls} aria-label={t('nav.brands')}>
          <Wine className="h-4 w-4 text-electric-300" />
          <span>{t('nav.brands')}</span>
        </Link>
        <Link to="/rewards-partners" onClick={onClick(t('nav.rewards'))} className={chipCls} aria-label={t('nav.rewards')}>
          <Gift className="h-4 w-4 text-electric-300" />
          <span>{t('nav.rewards')}</span>
        </Link>
        <Link to="/come-get-it-accelerator" onClick={onClick(t('nav.accelerator'))} className={chipCls} aria-label={t('nav.accelerator')}>
          <Rocket className="h-4 w-4 text-electric-300" />
          <span>{t('nav.accelerator')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default QuickAccessChips;
