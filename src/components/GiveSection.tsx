import React from 'react';
import { Heart, Wine } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const GiveSection: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <section id="give" className="py-20 px-4 relative bg-nf-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Icon Composition */}
          <div className="flex justify-center lg:justify-end relative order-2 lg:order-1">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-nf-primary/20 via-nf-secondary/10 to-transparent rounded-full blur-3xl scale-150 animate-pulse-slow" />
              
              {/* Icon container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                {/* Background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-nf-primary/10 to-nf-secondary/5 rounded-full" />
                
                {/* Heart icon - large, centered */}
                <div className="relative z-10 flex items-center justify-center">
                  <Heart 
                    className="w-32 h-32 md:w-40 md:h-40 text-nf-primary fill-nf-primary/30 animate-pulse" 
                    strokeWidth={1.5}
                  />
                  
                  {/* Wine glass overlaid on heart */}
                  <Wine 
                    className="absolute w-16 h-16 md:w-20 md:h-20 text-white/90 -bottom-2 -right-2" 
                    strokeWidth={1.5}
                  />
                </div>
                
                {/* Decorative rings */}
                <div className="absolute inset-4 border border-nf-primary/20 rounded-full" />
                <div className="absolute inset-8 border border-nf-primary/10 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
              {t('give.title')}
            </h2>
            <p className="text-2xl md:text-3xl text-white mb-6 font-medium">
              {t('give.subtitle')}
            </p>
            <p className="text-lg text-nf-text-muted max-w-lg mb-8">
              {t('give.body')}
            </p>
            <blockquote className="text-base md:text-lg text-nf-text-muted/80 italic border-l-2 border-nf-primary pl-4 max-w-lg">
              "{t('give.quote')}"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
