import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analytics } from '@/lib/analytics';

interface ExitIntentPopupProps {
  onClose: () => void;
  onSignup: (email: string) => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onSignup }) => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup with animation delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    analytics.exitIntentShow();
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSignup(email);
      analytics.exitIntentConvert();
      setIsVisible(false);
      setTimeout(onClose, 300);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0'
    }`}>
      <div className={`bg-black border border-electric-300/30 rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-electric-100 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white mb-2">
            Ne maradj le! 🍻
          </h3>
          <p className="text-electric-100">
            Légy az elsők között, akik megkapják az értesítést az induláskor
          </p>
        </div>

        {/* Quick signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/50 border-electric-300/30 text-white placeholder:text-electric-100/60"
            required
          />
          
          <Button 
            type="submit"
            className="w-full brand-gradient-cta hover:shadow-2xl text-white font-semibold py-3 rounded-full transition-all duration-300 neon-glow-brand"
          >
            Regisztrálok az értesítésre
          </Button>
        </form>

        <p className="text-xs text-electric-100/60 text-center mt-4">
          Exkluzív bónusz az első 1000 regisztrálónak
        </p>
      </div>
    </div>
  );
};