
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SignupForm: React.FC = () => {
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
    <section id="signup" className="py-24 px-4 bg-[#0f384e]/20">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
        </h2>
        <p className="text-white mb-8">
          Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
        </p>
        
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0c323f]/50 border-[#3ba1cb]/30 text-white placeholder-[#3ba1cb]/70 focus:border-[#27dddf] focus:ring-[#27dddf] h-12"
            required
          />
          
          <div className="flex items-start gap-3 text-left">
            <input
              type="checkbox"
              id="gdpr"
              checked={gdprAccepted}
              onChange={(e) => setGdprAccepted(e.target.checked)}
              className="mt-1 accent-[#27dddf]"
              required
            />
            <label htmlFor="gdpr" className="text-sm text-white">
              Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
            </label>
          </div>
          
          <Button 
            type="submit"
            disabled={!gdprAccepted}
            className="w-full brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0"
          >
            {isSubmitted ? '✓ Sikeresen regisztráltál!' : 'Regisztrálj most!'}
          </Button>
        </form>
        
        {isSubmitted && (
          <p className="mt-6 text-white font-medium">
            Köszönjük! Hamarosan jelentkezünk!
          </p>
        )}
      </div>
    </section>
  );
};
