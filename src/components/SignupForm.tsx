
import React, { useState, useEffect } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { AlertCircle, CheckCircle2, Mail, Shield } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { toast } = useToast();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email cím megadása kötelező');
      setIsEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Kérjük, adjon meg egy érvényes email címet');
      setIsEmailValid(false);
      return false;
    }
    setEmailError('');
    setIsEmailValid(true);
    return true;
  };

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const timeoutId = setTimeout(() => {
        validateEmail(email);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setEmailError('');
      setIsEmailValid(false);
    }
  }, [email]);

  useEffect(() => {
    analytics.signupFormView();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !gdprAccepted) {
      if (!gdprAccepted) {
        toast({
          title: "Hiányzó adatok",
          description: "Kérjük, fogadja el az adatkezelési tájékoztatót.",
          variant: "destructive",
        });
      }
      return;
    }

    const supabase = getSupabaseClient();
    
    if (!supabase) {
      console.warn('Supabase not configured, showing demo success message');
      toast({
        title: "Demo Mode",
        description: "Az alkalmazás demo módban fut. A regisztráció sikeres lenne éles környezetben.",
      });
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to send email notification...');
      
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'user_signup',
          data: {
            email: email
          }
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Email notification sent successfully:', data);
      
      analytics.signupSubmit(email);
      analytics.signupSuccess();
      
      setIsSubmitted(true);
      toast({
        title: "🎉 Sikeres regisztráció!",
        description: "Köszönjük! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel. Ellenőrizd az email fiókodat!",
      });

      setTimeout(() => {
        setEmail('');
        setGdprAccepted(false);
        setIsSubmitted(false);
        setEmailError('');
        setIsEmailValid(false);
      }, 5000);

    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Hiba történt",
        description: "Sajnos nem sikerült elküldeni a regisztrációt. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      id="signup" 
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-black via-ocean-900/20 to-black"
      aria-labelledby="signup-heading"
    >
      <div className="container-sm">
        <div className="text-center animate-fade-in-up">
          <h2 id="signup-heading" className="mb-6 text-white">
            Csatlakozz az első 1000 taghoz, és élvezd az exkluzív előnyöket!
          </h2>
          <p className="body-large text-white/80 mb-8 max-w-2xl mx-auto">
            Lépj be elsőként a Come Get It közösségébe – értesítünk az indulásról és a bónuszokról!
          </p>
        </div>
        
        {!isSupabaseConfigured() && (
          <div className="message-warning mb-6 animate-fade-in-up max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Demo Mode: Email küldés jelenleg nem elérhető</span>
          </div>
        )}
        
        <form 
          onSubmit={handleEmailSubmit} 
          className="space-y-6 max-w-md mx-auto animate-fade-in-up"
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="email" className="sr-only">
              Email cím
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="Email címed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "input-field pl-12 h-12",
                  emailError && "input-error",
                  isEmailValid && "input-success"
                )}
                required
                disabled={isLoading}
                aria-describedby={emailError ? "email-error" : undefined}
                aria-invalid={!!emailError}
              />
              {isEmailValid && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              )}
            </div>
            {emailError && (
              <div id="email-error" className="message-error" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{emailError}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdpr"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-electric-300 bg-transparent border-white/30 rounded focus:ring-electric-300 focus:ring-2 focus:ring-offset-0"
                required
                disabled={isLoading}
                aria-describedby="gdpr-description"
              />
              <label htmlFor="gdpr" className="body-small text-white/90 cursor-pointer flex-1">
                <span id="gdpr-description">
                  Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
                </span>
              </label>
            </div>
          </div>
          
          <EnhancedButton 
            type="submit"
            disabled={!gdprAccepted || !isEmailValid || isLoading}
            loading={isLoading}
            success={isSubmitted}
            buttonSize="lg"
            className="w-full"
            aria-describedby="submit-button-help"
          >
            {isLoading ? 'Küldés...' : isSubmitted ? 'Sikeresen regisztráltál!' : 'Regisztrálj most!'}
          </EnhancedButton>
          
          <div id="submit-button-help" className="sr-only">
            {!gdprAccepted && "Az adatkezelési tájékoztató elfogadása szükséges a regisztrációhoz"}
            {!isEmailValid && "Érvényes email cím megadása szükséges"}
          </div>
        </form>
        
        {isSubmitted && (
          <div className="message-success mt-6 max-w-md mx-auto animate-scale-in" role="status" aria-live="polite">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-2">Köszönjük a regisztrációt!</p>
                <p className="text-sm opacity-90">
                  Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.<br/>
                  <strong>Ellenőrizd az email fiókodat</strong> az exkluzív előnyeidért!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-white/60 body-small">
            <Shield className="w-4 h-4" />
            <span>Az adataid biztonságban vannak. Spam-mentes garancia.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
