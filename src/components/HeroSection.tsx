
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TouchCarousel from './TouchCarousel';
import { useRipple } from '@/hooks/useRipple';

interface HeroSectionProps {
  onSignupClick: () => void;
}

const HeroSection = ({ onSignupClick }: HeroSectionProps) => {
  const [slideTransition, setSlideTransition] = useState<'fade' | 'slide'>('fade');
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
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-96 h-48 md:w-[28rem] md:h-56 lg:w-[32rem] lg:h-64 mx-auto lg:mx-0 object-contain filter brightness-110 mb-8"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Ingyen ital<br />minden napra!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <div className="mb-4">
            <label className="inline-flex items-center text-sm text-gray-400 mb-4">
              <input
                type="checkbox"
                checked={slideTransition === 'slide'}
                onChange={(e) => setSlideTransition(e.target.checked ? 'slide' : 'fade')}
                className="mr-2 accent-cyan-400"
              />
              Slide transition
            </label>
          </div>

          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/25 animate-pulse neon-glow-button"
            onClick={handleCTAClick}
          >
            Regisztrálj elő! 🍻
          </Button>
        </div>

        {/* Right side - iPhone Mockups with TouchCarousel */}
        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[600px]">
          {/* First iPhone - Left */}
          <div className="relative transform -rotate-12 translate-x-8 z-20">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition={slideTransition}
                    showIndicators={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second iPhone - Right */}
          <div className="relative transform rotate-12 -translate-x-8 z-10">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition={slideTransition}
                    showIndicators={false}
                    autoPlayInterval={5000}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Glow Effects Behind Phones */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Carousel Indicators */}
      <TouchCarousel 
        images={appImages}
        slideTransition={slideTransition}
        showIndicators={true}
        autoPlay={true}
      />
    </section>
  );
};

export default HeroSection;
