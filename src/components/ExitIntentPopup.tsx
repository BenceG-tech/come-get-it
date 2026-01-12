
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/useI18n';

interface ExitIntentPopupProps {
  onClose: () => void;
  onSignup: (email: string) => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onSignup }) => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    // Show popup with animation delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    analytics.exitIntentShow();
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Let the parent handle the actual signup + email sending to avoid duplicates
      analytics.exitIntentConvert();
      onSignup(email);
    } catch (error) {
      console.error('Error handling exit intent signup:', error);
      toast({
        title: t('exit_intent.toasts.error_title'),
        description: t('exit_intent.toasts.error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      <div className={`bg-nf-surface border border-nf-border rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-nf-text-muted hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
            {t('exit_intent.title')}
          </h3>
          <p className="text-nf-text-muted">
            {t('exit_intent.subtitle')}
          </p>
        </div>

        {/* Quick signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder={t('exit_intent.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          
          <Button 
            type="submit"
            variant="neon"
            disabled={isLoading}
            className="w-full py-3"
          >
            {isLoading ? t('exit_intent.submitting') : t('exit_intent.submit')}
          </Button>
        </form>

        <p className="text-xs text-nf-text-muted/60 text-center mt-4">
          {t('exit_intent.footer')}
        </p>
      </div>
    </div>
  );
};
