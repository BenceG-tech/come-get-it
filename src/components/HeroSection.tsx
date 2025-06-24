
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TouchCarousel from './TouchCarousel';
import { useRipple } from '@/hooks/useRipple';

interface HeroSectionProps {
  onSignupClick: () => void;
}

const HeroSection = ({ onSignupClick }: HeroSectionProps) => {
  const [sharedCurrentIndex, setSharedCurrentIndex] = useState(0);
  const createRipple = useRipple();

  const appImages = [
    "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png",
    "/lovable-uploads/f0cc07ae-c5b2-4896-a0d4-f57b96428e82.png",
    "/lovable-uploads/c437ca67-a828-4beb-a8a8-749b0b662e4b.png"
  ];

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onSignupClick();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Enhanced Background glow effects with movement */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Moving city skyline silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          <div className="flex space-x-2 animate-pulse">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-cyan-400 opacity-30"
                style={{
                  width: Math.random() * 20 + 10 + 'px',
                  height: Math.random() * 80 + 40 + 'px',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* iPhone Mockups Section - Single Carousel Container */}
        <div className="relative w-full max-w-md h-[600px] mb-12">
          {/* Enhanced Glow Effects Behind Phones */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          {/* Single Phone Mockup with Carousel Inside */}
          <div className="relative z-20 w-full h-full flex justify-center items-center">
            <div className="w-72 h-[580px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/60 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition="slide"
                    showIndicators={false}
                    currentIndex={sharedCurrentIndex}
                    onIndexChange={setSharedCurrentIndex}
                    autoPlay={true}
                    autoPlayInterval={5000}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Better spaced text */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-4">
            Ingyen ital minden napra!
          </h1>

          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-96 h-48 md:w-[28rem] md:h-56 lg:w-[32rem] lg:h-64 object-contain filter brightness-110"
            />
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-6 leading-relaxed">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 px-16 text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/25 neon-glow-button"
              onClick={handleCTAClick}
            >
              Regisztrálj most!
            </Button>
          </div>
        </div>
      </div>

      {/* Main Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {appImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setSharedCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === sharedCurrentIndex 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
