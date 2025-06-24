
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from './LoadingSpinner';
import ConfettiAnimation from './ConfettiAnimation';
import { useVibration } from '@/hooks/useVibration';

const SignupSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { vibrate } = useVibration();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !gdprAccepted) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setShowSuccess(true);
      setShowConfetti(true);
      vibrate([100, 50, 100]); // Success vibration pattern
      
      setTimeout(() => {
        setIsSubmitted(false);
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <section id="signup" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Foglalj helyet most
          </h2>
          <p className="text-gray-400 mb-8">
            Iratkozz fel, és az elsők között értesítünk
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type="email"
                placeholder="Email címed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 h-12 transition-all duration-300 ${
                  showError ? 'border-red-500 animate-shake' : ''
                }`}
                required
                disabled={isLoading}
              />
              {showError && (
                <p className="text-red-400 text-sm mt-2 animate-fade-in">
                  Kérlek add meg az email címed és fogadd el az adatkezelési feltételeket!
                </p>
              )}
            </div>
            
            <div className="flex items-start gap-3 text-left">
              <input
                type="checkbox"
                id="gdpr"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 accent-cyan-400"
                required
                disabled={isLoading}
              />
              <label htmlFor="gdpr" className="text-sm text-gray-400">
                Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
              </label>
            </div>
            
            <Button 
              type="submit"
              disabled={!gdprAccepted || isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Feldolgozás...</span>
                </div>
              ) : isSubmitted ? (
                '✓ Sikeresen regisztráltál!'
              ) : (
                'Regisztrálok'
              )}
            </Button>
          </form>
          
          {showSuccess && (
            <div className="mt-6 animate-fade-in">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-medium text-lg">
                  🍻 Cheers! Sikeresen csatlakoztál!
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Hamarosan jelentkezünk az első ingyenes itallal!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <ConfettiAnimation 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </>
  );
};

export default SignupSection;
