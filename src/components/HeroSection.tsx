
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TouchCarousel from './TouchCarousel';
import { useRipple } from '@/hooks/useRipple';

interface HeroSectionProps {
  onSignupClick: () => void;
}

const HeroSection = ({ onSignupClick }: HeroSectionProps) => {
  const [slideTransition, setSlideTransition] = useState<'fade' | 'slide'>('slide');
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
      {/* Enhanced Moving City Skyline Background */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Moving neon city skyline - multiple layers for depth */}
        <div className="absolute bottom-0 left-0 w-full h-48 opacity-20">
          <div className="flex space-x-1 animate-pulse">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent opacity-60 shadow-lg shadow-cyan-400/30"
                style={{
                  width: Math.random() * 15 + 8 + 'px',
                  height: Math.random() * 120 + 60 + 'px',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Second layer of moving buildings */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-15 transform translate-x-4">
          <div className="flex space-x-2 animate-pulse">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-blue-400 via-cyan-500 to-transparent opacity-40"
                style={{
                  width: Math.random() * 12 + 6 + 'px',
                  height: Math.random() * 80 + 40 + 'px',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${3 + Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced floating neon glow effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/30 via-blue-500/40 to-cyan-400/30 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/25 via-cyan-500/35 to-blue-600/25 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/20 via-blue-400/30 to-cyan-500/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Logo at the top */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
            alt="Come Get It Logo" 
            className="w-80 h-40 md:w-96 md:h-48 lg:w-[28rem] lg:h-56 mx-auto object-contain filter brightness-110"
          />
        </div>

        {/* Enhanced iPhone Mockups with Intense Neon Glow */}
        <div className="relative flex justify-center items-center h-[600px] mb-8">
          {/* Intense neon glow behind phones */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/50 via-blue-500/60 to-cyan-400/50 rounded-full blur-3xl animate-pulse opacity-80"></div>
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-300/40 via-cyan-400/50 to-blue-300/40 rounded-full blur-2xl animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* First iPhone - Left - Interactive carousel */}
          <div className="relative transform -rotate-12 translate-x-8 z-20">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-400/60 border border-cyan-400/30">
              {/* Enhanced phone glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-[3rem] blur-lg"></div>
              <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition={slideTransition}
                    showIndicators={false}
                    currentIndex={sharedCurrentIndex}
                    onIndexChange={setSharedCurrentIndex}
                    autoPlay={true}
                    autoPlayInterval={4000}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second iPhone - Right - Synchronized carousel */}
          <div className="relative transform rotate-12 -translate-x-8 z-10">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-400/60 border border-blue-400/30">
              {/* Enhanced phone glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-[3rem] blur-lg"></div>
              <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition={slideTransition}
                    showIndicators={false}
                    currentIndex={sharedCurrentIndex}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Repositioned below mockups */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight neon-glow">
            Ingyen ital<br />minden napra!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <div className="mb-6">
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

        {/* Carousel Indicators */}
        <div className="mt-8 flex space-x-3 z-30">
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
      </div>
    </section>
  );
};

export default HeroSection;
