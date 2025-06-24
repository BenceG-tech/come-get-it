
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRipple } from '@/hooks/useRipple';

interface StickyCTAProps {
  onSignupClick: () => void;
}

const StickyCTA = ({ onSignupClick }: StickyCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const createRipple = useRipple();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > heroBottom + 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onSignupClick();
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      isVisible 
        ? 'translate-y-0 opacity-100 animate-bounce-in' 
        : 'translate-y-full opacity-0'
    }`}>
      <Button 
        className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-semibold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        onClick={handleClick}
        style={{
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(147, 51, 234, 0.3)',
          animation: 'pulse 2s ease-in-out infinite, subtle-float 3s ease-in-out infinite'
        }}
      >
        {/* Enhanced neon border effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-75 blur-sm animate-pulse"></div>
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        
        <span className="relative z-10 flex items-center gap-2">
          🍻 Csatlakozz az első 1000-hez
        </span>
      </Button>
    </div>
  );
};

export default StickyCTA;
