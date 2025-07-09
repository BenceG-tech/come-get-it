import React from 'react';
import { Cake, Users, CircleDot, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const VenueStats: React.FC = () => {
  const { t } = useLanguage();
  const stats = [
    {
      icon: Cake,
      value: t('venues.stats.age.value'),
      label: t('venues.stats.age.label'),
      description: t('venues.stats.age.description')
    },
    {
      icon: Users,
      value: t('venues.stats.millennials.value'),
      label: t('venues.stats.millennials.label'),
      description: t('venues.stats.millennials.description')
    },
    {
      icon: CircleDot,
      value: t('venues.stats.women.value'),
      label: t('venues.stats.women.label'),
      description: t('venues.stats.women.description')
    },
    {
      icon: TrendingUp,
      value: t('venues.stats.active.value'),
      label: t('venues.stats.active.label'),
      description: t('venues.stats.active.description')
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-electric-100 mb-1 leading-tight">
                {stat.label}
              </div>
              <div className="text-xs text-electric-100/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};