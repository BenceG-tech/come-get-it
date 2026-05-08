import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Wine, Gift, Rocket } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const QuickAccessChips: React.FC = () => {
  const { t } = useI18n();
  const onClick = (name: string) => () => analytics.ctaClick('quick_access_chips', name);

  const items = [
    { to: '/vendeglatohelyek',        Icon: Store,  label: t('nav.venues') },
    { to: '/italmarkak',              Icon: Wine,   label: t('nav.brands') },
    { to: '/rewards-partners',        Icon: Gift,   label: t('nav.rewards') },
    { to: '/come-get-it-accelerator', Icon: Rocket, label: t('nav.accelerator') },
  ];

  return (
    <nav
      className="w-full px-4 py-8 md:py-10 bg-nf-background"
      aria-label={t('quick_access.aria')}
    >
      {/* Mobile: 2x2 glass grid */}
      <div className="lg:hidden max-w-md mx-auto grid grid-cols-2 gap-3">
        {items.map(({ to, Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClick(label)}
            aria-label={label}
            className="group flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 hover:border-nf-primary/60 hover:shadow-[0_10px_40px_-10px_rgba(0,188,212,0.4)] transition-all duration-300"
          >
            <Icon className="h-6 w-6 text-nf-primary" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs font-semibold text-white/85 text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop: single horizontal row with thin cyan dividers */}
      <div className="hidden lg:flex max-w-5xl mx-auto items-center justify-center">
        {items.map(({ to, Icon, label }, i) => (
          <Link
            key={to}
            to={to}
            onClick={onClick(label)}
            aria-label={label}
            className={`group flex-1 flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-white/80 hover:text-nf-primary transition-colors duration-300 ${
              i > 0 ? 'border-l border-nf-primary/15' : ''
            }`}
          >
            <Icon
              className="h-5 w-5 text-nf-primary group-hover:drop-shadow-[0_0_10px_rgba(0,188,212,0.7)] transition-all"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="whitespace-nowrap tracking-wide">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default QuickAccessChips;
