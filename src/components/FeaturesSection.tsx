
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Heart, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "FEDEZD FEL.",
      icon: MapPin,
      description: "Találd meg Budapest legmenőbb helyeit GPS alapon.",
      benefit: "Új helyek, új arcok, új élmények – minden nap!",
      gradientClass: "from-[#3ba1cb] via-[#27dddf] to-[#0f384e]",
      glowColor: "rgba(59, 161, 203, 0.6)"
    },
    {
      title: "IGYÁL ÉS GYŰJTS.",
      icon: Zap,
      description: "Minden nap jár egy ingyen ital, minden fogyasztás után pont jár.",
      benefit: "Pontjaidat értékes jutalmakra válthatod!",
      gradientClass: "from-[#27dddf] via-[#3ba1cb] to-[#0c323f]",
      glowColor: "rgba(39, 221, 223, 0.6)"
    },
    {
      title: "SEGÍTS!",
      icon: Heart,
      description: "Minden ital után automatikusan támogatod a jótékonyságot.",
      benefit: "Iszol, szórakozol, közben jót teszel – win-win.",
      gradientClass: "from-[#0f384e] via-[#0c323f] to-[#3ba1cb]",
      glowColor: "rgba(15, 56, 78, 0.6)"
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#0c323f]/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white">
          Miért válaszd a Come Get It-et?
        </h2>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12">
          {features.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={index}
                className={`relative group animate-fade-in bg-gradient-to-br ${card.gradientClass} p-8 rounded-3xl transform transition-all duration-500 hover:scale-105`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  boxShadow: `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor.replace('0.6', '0.3')}`
                }}
              >
                <div className="relative z-10 text-center space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <IconComponent size={40} className="text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-lg text-white/90 font-medium leading-tight">
                    {card.description}
                  </p>
                  
                  <p className="text-base text-white/80 italic font-medium">
                    {card.benefit}
                  </p>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
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
                    <div 
                      className={`relative bg-gradient-to-br ${card.gradientClass} p-8 rounded-3xl mx-2`}
                      style={{
                        boxShadow: `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor.replace('0.6', '0.3')}`
                      }}
                    >
                      <div className="relative z-10 text-center space-y-6">
                        <div className="flex justify-center mb-6">
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <IconComponent size={40} className="text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-4">
                          {card.title}
                        </h3>
                        
                        <p className="text-base text-white/90 font-medium leading-tight">
                          {card.description}
                        </p>
                        
                        <p className="text-sm text-white/80 italic font-medium">
                          {card.benefit}
                        </p>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
            <CarouselNext className="bg-white/20 border-white/30 text-white hover:bg-white/30" />
          </Carousel>
        </div>

        <div className="flex justify-center mt-16">
          <Button 
            size="lg" 
            className="brand-gradient-cta hover:shadow-2xl text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 neon-glow-brand border-0"
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Regisztrálj most!
          </Button>
        </div>
      </div>
    </section>
  );
};
