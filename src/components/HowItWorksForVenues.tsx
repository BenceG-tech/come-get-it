
import React from 'react';
import { UserPlus, Settings, Users, BarChart } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const HowItWorksForVenues: React.FC = () => {
  const { t } = useI18n();
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: t('venues.how_it_works.steps.1.title'),
      description: t('venues.how_it_works.steps.1.description')
    },
    {
      number: "2", 
      icon: Settings,
      title: t('venues.how_it_works.steps.2.title'),
      description: t('venues.how_it_works.steps.2.description')
    },
    {
      number: "3",
      icon: Users,
      title: t('venues.how_it_works.steps.3.title'),
      description: t('venues.how_it_works.steps.3.description')
    },
    {
      number: "4",
      icon: BarChart,
      title: t('venues.how_it_works.steps.4.title'),
      description: t('venues.how_it_works.steps.4.description')
    }
  ];

  return (
    <section className="py-12 px-4 bg-nf-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {t('venues.how_it_works.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="nf-card p-6 text-center group hover:scale-105 hover:shadow-neon transition-all duration-300"
            >
              <div className="text-2xl font-black text-nf-primary mb-3">
                {step.number}
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-neon">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h4 className="text-sm font-black text-white mb-2 group-hover:text-nf-primary transition-colors duration-300">
                {step.title}
              </h4>
              
              <p className="text-xs text-nf-text-muted leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
