
import React from 'react';
import { Button } from '@/components/ui/button';

interface FOMOSectionProps {
  onSignupClick: () => void;
}

const FOMOSection = ({ onSignupClick }: FOMOSectionProps) => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Legyél alapító tag
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Az első 1000 regisztrálónak exkluzív bónusz
        </p>
        <p className="text-lg text-cyan-400 mb-12">
          Írjuk együtt Budapest új italtérképét
        </p>
        
        <Button 
          size="lg" 
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300"
          onClick={onSignupClick}
        >
          Csatlakozz most
        </Button>
      </div>
    </section>
  );
};

export default FOMOSection;
