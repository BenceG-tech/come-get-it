import React from 'react';
import { Cake, Users, CircleDot, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const VenueStats: React.FC = () => {
  const { t } = useI18n();
  const stats = [
    {
      icon: Cake,
      value: "24",
      label: t('venues.stats.items.1.label'),
      description: t('venues.stats.items.1.description')
    },
    {
      icon: Users,
      value: "91%",
      label: t('venues.stats.items.2.label'),
      description: t('venues.stats.items.2.description')
    },
    {
      icon: CircleDot,
      value: "56%",
      label: t('venues.stats.items.3.label'),
      description: t('venues.stats.items.3.description')
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: t('venues.stats.items.4.label'),
      description: t('venues.stats.items.4.description')
    }
  ];

  return (
    <section className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-neon">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-nf-primary transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-nf-text-muted mb-1 leading-tight">
                {stat.label}
              </div>
              <div className="text-xs text-nf-text-muted/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
