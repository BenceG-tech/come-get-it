
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onSignupClick: () => void;
}

const HeroSection = ({ onSignupClick }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const appImages = [
    "/lovable-uploads/49708be5-5db5-4f1e-adcf-e3b9ad6ddf45.png",
    "/lovable-uploads/f0cc07ae-c5b2-4896-a0d4-f57b96428e82.png",
    "/lovable-uploads/c437ca67-a828-4beb-a8a8-749b0b662e4b.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % appImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [appImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-80 h-40 md:w-96 md:h-48 lg:w-[28rem] lg:h-56 mx-auto lg:mx-0 object-contain filter brightness-110 mb-8"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Ingyen ital<br />minden napra!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/25 animate-pulse"
            onClick={onSignupClick}
          >
            Regisztrálj elő! 🍻
          </Button>
        </div>

        {/* Right side - iPhone Mockups */}
        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[600px]">
          {/* First iPhone - Left */}
          <div className="relative transform -rotate-12 translate-x-8 z-20">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Dynamic Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                
                {/* Screen Content */}
                <div className="relative w-full h-full">
                  {appImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`App Screenshot ${index + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second iPhone - Right */}
          <div className="relative transform rotate-12 -translate-x-8 z-10">
            <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-blue-500/20 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Dynamic Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                
                {/* Screen Content */}
                <div className="relative w-full h-full">
                  {appImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`App Screenshot ${index + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === (currentImageIndex + 1) % appImages.length ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
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

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {appImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
