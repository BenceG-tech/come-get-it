
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Heart, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const FeaturesSection: React.FC = () => {
  const { t } = useI18n();
  const features = [
    {
      title: t('home_features.cards.1.title'),
      icon: MapPin,
      description: t('home_features.cards.1.description'),
      benefit: t('home_features.cards.1.benefit'),
    },
    {
      title: t('home_features.cards.2.title'),
      icon: Zap,
      description: t('home_features.cards.2.description'),
      benefit: t('home_features.cards.2.benefit'),
    },
    {
      title: t('home_features.cards.3.title'),
      icon: Heart,
      description: t('home_features.cards.3.description'),
      benefit: t('home_features.cards.3.benefit'),
    }
  ];

  return (
    <section className="py-24 px-4 bg-nf-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white tracking-tight">
          {t('home_features.heading')}
        </h2>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12">
          {features.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={index}
                className="relative group animate-fade-in nf-card p-8 hover:-translate-y-2 hover:border-nf-primary hover:shadow-neon"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="relative z-10 text-center space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-2xl flex items-center justify-center shadow-neon">
                      <IconComponent size={40} className="text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-lg text-nf-text-muted font-medium leading-tight">
                    {card.description}
                  </p>
                  
                  <p className="text-base text-nf-primary italic font-medium">
                    {card.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <Carousel className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {features.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <CarouselItem key={index}>
                    <div className="nf-card p-8 mx-2">
                      <div className="relative z-10 text-center space-y-6">
                        <div className="flex justify-center mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-2xl flex items-center justify-center shadow-neon">
                            <IconComponent size={40} className="text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-4">
                          {card.title}
                        </h3>
                        
                        <p className="text-base text-nf-text-muted font-medium leading-tight">
                          {card.description}
                        </p>
                        
                        <p className="text-sm text-nf-primary italic font-medium">
                          {card.benefit}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-nf-surface border-nf-border text-white hover:bg-nf-surface-alt hover:border-nf-primary" />
            <CarouselNext className="bg-nf-surface border-nf-border text-white hover:bg-nf-surface-alt hover:border-nf-primary" />
          </Carousel>
        </div>

        <div className="flex justify-center mt-16">
          <Button 
            variant="neon"
            size="lg" 
            className="py-4 px-12 text-lg"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('home_features.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};
