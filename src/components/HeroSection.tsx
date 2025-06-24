
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TouchCarousel from './TouchCarousel';
import { useRipple } from '@/hooks/useRipple';
import { useDragGesture } from '@/hooks/useDragGesture';

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

  // Drag gesture for the entire phone mockup area
  const { dragState, touchHandlers, mouseHandlers } = useDragGesture({
    onDragStart: () => {
      console.log('Phone mockup drag started');
    },
    onDragMove: (deltaX, velocity) => {
      // Visual feedback during drag is handled via CSS transform
    },
    onDragEnd: (deltaX, velocity) => {
      const threshold = 100; // pixels
      const velocityThreshold = 0.5;
      
      if (Math.abs(deltaX) > threshold || Math.abs(velocity) > velocityThreshold) {
        if (deltaX > 0 || velocity > velocityThreshold) {
          // Swipe right - go to previous image
          const prevIndex = (sharedCurrentIndex - 1 + appImages.length) % appImages.length;
          setSharedCurrentIndex(prevIndex);
        } else if (deltaX < 0 || velocity < -velocityThreshold) {
          // Swipe left - go to next image
          const nextIndex = (sharedCurrentIndex + 1) % appImages.length;
          setSharedCurrentIndex(nextIndex);
        }
      }
    },
    threshold: 10
  });

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onSignupClick();
  };

  // Calculate transform for phone mockups during drag
  const getPhoneTransform = () => {
    if (!dragState.isDragging) return {};
    
    const dragOffset = Math.max(-200, Math.min(200, dragState.deltaX * 0.8)); // Limit and dampen movement
    
    return {
      transform: `translateX(${dragOffset}px)`,
      transition: 'none'
    };
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

        {/* Right side - Draggable iPhone Mockups */}
        <div 
          className="relative order-1 lg:order-2 flex justify-center items-center h-[600px] cursor-grab active:cursor-grabbing select-none"
          {...touchHandlers}
          {...mouseHandlers}
          style={{ 
            touchAction: 'pan-y pinch-zoom',
            ...getPhoneTransform()
          }}
        >
          {/* First iPhone - Left - Interactive carousel */}
          <div className="relative transform -rotate-12 translate-x-8 z-20 transition-transform duration-300">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <div className="relative w-full h-full">
                  <TouchCarousel 
                    images={appImages}
                    slideTransition={slideTransition}
                    showIndicators={false}
                    currentIndex={sharedCurrentIndex}
                    onIndexChange={setSharedCurrentIndex}
                    autoPlay={!dragState.isDragging}
                    autoPlayInterval={4000}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second iPhone - Right - Synchronized carousel */}
          <div className="relative transform rotate-12 -translate-x-8 z-10 transition-transform duration-300">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
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

          {/* Enhanced Glow Effects Behind Phones */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Drag feedback indicator */}
          {dragState.isDragging && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
              {dragState.deltaX > 0 ? '← Előző' : '→ Következő'}
            </div>
          )}
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
