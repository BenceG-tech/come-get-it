
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

  // Fallback image for error handling
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=800&fit=crop";

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onSignupClick();
  };

  // Enhanced image loading with fallback
  const getImageWithFallback = (imageUrl: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(imageUrl);
      img.onerror = () => {
        console.warn(`Failed to load image: ${imageUrl}, using fallback`);
        resolve(fallbackImage);
      };
      img.src = imageUrl;
    });
  };

  // Get images for mockups with different indices
  const getLeftPhoneImage = () => {
    return appImages[sharedCurrentIndex] || fallbackImage;
  };

  const getRightPhoneImage = () => {
    return appImages[(sharedCurrentIndex + 1) % appImages.length] || fallbackImage;
  };

  const getCenterPhoneImage = () => {
    return appImages[(sharedCurrentIndex + 2) % appImages.length] || fallbackImage;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Enhanced Background glow effects - much stronger */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/40 via-blue-500/50 to-purple-500/40 rounded-full blur-3xl opacity-80 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/30 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/30 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Additional glow layers for more intensity */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* iPhone Mockups Section with sliding carousel */}
        <div className="relative w-full max-w-4xl h-[600px] mb-8 overflow-hidden">
          <div className="relative w-full h-full flex justify-center items-center">
            <TouchCarousel 
              images={appImages}
              slideTransition="slide"
              showIndicators={false}
              currentIndex={sharedCurrentIndex}
              onIndexChange={setSharedCurrentIndex}
              autoPlay={true}
              autoPlayInterval={4000}
            />
            
            {/* Phone mockup overlays */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              {/* Left Phone */}
              <div className="absolute transform -rotate-12 -translate-x-32 z-20">
                <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/60 border border-gray-800">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                    <img 
                      src={getLeftPhoneImage()}
                      alt="App Screenshot"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Center Phone */}
              <div className="relative z-30">
                <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-500/60 border border-gray-800">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                    <img 
                      src={getCenterPhoneImage()}
                      alt="App Screenshot"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Phone */}
              <div className="absolute transform rotate-12 translate-x-32 z-10">
                <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-purple-500/60 border border-gray-800">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                    <img 
                      src={getRightPhoneImage()}
                      alt="App Screenshot"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators - bigger, more animated */}
        <div className="flex space-x-4 mb-8 z-30">
          {appImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSharedCurrentIndex(index)}
              className={`relative w-4 h-4 rounded-full transition-all duration-500 transform ${
                index === sharedCurrentIndex 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/70 scale-150 animate-pulse' 
                  : 'bg-gray-600 hover:bg-gray-400 scale-100 hover:scale-125'
              }`}
            >
              {index === sharedCurrentIndex && (
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Section - moved headline up */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight px-4 animate-glow">
            Ingyen ital minden napra!
          </h1>

          <div className="mb-8">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-64 h-32 md:w-80 md:h-40 lg:w-96 lg:h-48 mx-auto object-contain filter brightness-110"
            />
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/40 neon-glow-button animate-pulse"
            onClick={handleCTAClick}
          >
            🍻 Csatlakozz az első 1000-hez
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
