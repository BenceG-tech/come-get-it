import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Wine, Gift, Rocket } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export const QuickAccessChips: React.FC = () => {
  const onClick = (name: string) => () => analytics.ctaClick('quick_access_chips', name);

  const chipCls =
    'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm';

  return (
    <nav className="lg:hidden w-full px-4 -mt-4 mb-6" aria-label="Gyors elérés">
      <div className="flex gap-2 overflow-x-auto">
        <Link to="/vendeglatohelyek" onClick={onClick('Vendéglátóhelyek')} className={chipCls} aria-label="Vendéglátóhelyek">
          <Store className="h-4 w-4 text-electric-300" />
          <span>Vendéglátóhelyek</span>
        </Link>
        <Link to="/italmarkak" onClick={onClick('Italmárkák')} className={chipCls} aria-label="Italmárkák">
          <Wine className="h-4 w-4 text-electric-300" />
          <span>Italmárkák</span>
        </Link>
        <Link to="/rewards-partners" onClick={onClick('Jutalom partnerek')} className={chipCls} aria-label="Jutalom partnerek">
          <Gift className="h-4 w-4 text-electric-300" />
          <span>Jutalom partnerek</span>
        </Link>
        <Link to="/come-get-it-accelerator" onClick={onClick('Gyorsítóprogram')} className={chipCls} aria-label="Gyorsítóprogram">
          <Rocket className="h-4 w-4 text-electric-300" />
          <span>Gyorsítóprogram</span>
        </Link>
      </div>
    </nav>
  );
};

export default QuickAccessChips;
