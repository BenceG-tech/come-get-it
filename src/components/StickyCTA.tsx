
import React from 'react';
import { Button } from '@/components/ui/button';

interface StickyCTAProps {
  onSignupClick: () => void;
}

const StickyCTA = ({ onSignupClick }: StickyCTAProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button 
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
        onClick={onSignupClick}
      >
        🍻 Csatlakozz az első 1000-hez
      </Button>
    </div>
  );
};

export default StickyCTA;
