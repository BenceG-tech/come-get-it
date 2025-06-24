
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRipple } from '@/hooks/useRipple';

interface HeroSectionProps {
  onSignupClick: () => void;
}

const HeroSection = ({ onSignupClick }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const createRipple = useRipple();

  const appImages = [
    "/lovable-uploads/c402c264-053b-4336-aa3e-090f7f071887.png",
    "/lovable-uploads/a589d6ef-39d5-4ff7-b38d-de1df1b429d6.png",
    "/lovable-uploads/bf557f3e-e40c-421a-8189-971ef9a8a486.png"
  ];

  // Fallback image for error handling
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=800&fit=crop";

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onSignupClick();
  };

  // Auto-rotate images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % appImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [appImages.length]);

  // Get images for mockups with different indices
  const getLeftPhoneImage = () => {
    return appImages[currentIndex] || fallbackImage;
  };

  const getRightPhoneImage = () => {
    return appImages[(currentIndex + 1) % appImages.length] || fallbackImage;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Enhanced Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/40 via-blue-500/50 to-purple-500/40 rounded-full blur-3xl opacity-80 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/30 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/30 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Additional glow layers for more intensity */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* iPhone Mockups Section - Two phones side by side like in reference */}
        <div className="relative w-full max-w-4xl h-[500px] mb-8 flex justify-center items-center">
          {/* Left Phone */}
          <div className="absolute transform -rotate-12 -translate-x-20 sm:-translate-x-32 z-20">
            <div className="w-48 sm:w-64 h-[400px] sm:h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-cyan-500/60 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <img 
                  src={getLeftPhoneImage()}
                  alt="App Screenshot"
                  className="w-full h-full object-cover transition-opacity duration-1000"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Phone */}
          <div className="absolute transform rotate-12 translate-x-20 sm:translate-x-32 z-10">
            <div className="w-48 sm:w-64 h-[400px] sm:h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-purple-500/60 border border-gray-800">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-6 bg-black rounded-b-2xl z-30"></div>
                <img 
                  src={getRightPhoneImage()}
                  alt="App Screenshot"
                  className="w-full h-full object-cover transition-opacity duration-1000"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight px-2 animate-glow">
            Ingyen ital minden napra!
          </h1>

          <div className="mb-8">
            <img 
              src="/lovable-uploads/c01cd0c3-7bce-4a6b-ab3b-b7af7849ed4e.png" 
              alt="Come Get It Logo" 
              className="w-32 h-16 sm:w-48 sm:h-24 md:w-64 md:h-32 mx-auto object-contain filter brightness-110"
            />
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Fedezd fel Budapest legjobb helyeit, minden nap egy új élménnyel!
          </p>

          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-8 sm:px-12 text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/40 neon-glow-button animate-pulse"
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
