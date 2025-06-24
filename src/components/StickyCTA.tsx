
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
        className="relative overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 neon-glow-button"
        onClick={handleClick}
      >
        🍻 Csatlakozz az első 1000-hez
      </Button>
    </div>
  );
};

export default StickyCTA;
