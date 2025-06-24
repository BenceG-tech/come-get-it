
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignupSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && gdprAccepted) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section id="signup" className="py-24 px-4 bg-gray-900/30">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Foglalj helyet most
        </h2>
        <p className="text-gray-400 mb-8">
          Iratkozz fel, és az elsők között értesítünk
        </p>
        
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 h-12"
            required
          />
          
          <div className="flex items-start gap-3 text-left">
            <input
              type="checkbox"
              id="gdpr"
              checked={gdprAccepted}
              onChange={(e) => setGdprAccepted(e.target.checked)}
              className="mt-1 accent-cyan-400"
              required
            />
            <label htmlFor="gdpr" className="text-sm text-gray-400">
              Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
            </label>
          </div>
          
          <Button 
            type="submit"
            disabled={!gdprAccepted}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Regisztrálok'}
          </Button>
        </form>
        
        {isSubmitted && (
          <p className="mt-6 text-cyan-400 font-medium">
            Köszönjük! Hamarosan jelentkezünk!
          </p>
        )}
      </div>
    </section>
  );
};

export default SignupSection;
