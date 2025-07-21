
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { getSupabaseClient } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, signUp } = useAuth();

  useEffect(() => {
    // Track when signup form is viewed
    analytics.signupFormView();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Hiba",
        description: "Kérjük, adja meg az email címét.",
        variant: "destructive"
      });
      return;
    }

    if (!gdprAccepted) {
      toast({
        title: "Hiba", 
        description: "Kérjük, fogadja el az adatvédelmi szabályzatot a folytatáshoz.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      analytics.signupSubmit(email);

      // Use Supabase Auth for registration
      const { error: authError } = await signUp(email, 'temp-password-' + Math.random());
      
      if (authError && !authError.message.includes('already registered')) {
        throw authError;
      }

      // Also send notification email to admin
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.functions.invoke('send-notification-email', {
          body: { 
            type: 'signup',
            email: email,
            timestamp: new Date().toISOString(),
            source: 'main_signup_form'
          }
        });
      }

      analytics.signupSuccess();

      setIsSubmitted(true);
      setEmail('');
      setGdprAccepted(false);

      toast({
        title: "Sikeres regisztráció!",
        description: "Ellenőrizze email fiókját a megerősítéshez. Értesítést küldünk, amikor az alkalmazás elérhető lesz.",
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      
      toast({
        title: "Hiba történt",
        description: error.message || "Kérjük, próbálja meg később újra.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show signup form if user is already authenticated
  if (user) {
    return (
      <section id="signup" className="py-20 bg-gradient-to-b from-black to-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6">
              ÜDVÖZÖLJÜK!
            </h2>
            <div className="bg-[#3ba1cb]/20 border border-[#3ba1cb]/30 rounded-lg p-6">
              <p className="text-[#27dddf] text-lg">
                ✅ Már regisztrált! Értesítjük, amikor az alkalmazás elérhető lesz.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-20 bg-gradient-to-b from-black to-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {isSubmitted ? (
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6">
              KÖSZÖNJÜK A REGISZTRÁCIÓT!
            </h2>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
              <p className="text-green-400 text-lg">
                ✅ Sikeres regisztráció! Ellenőrizze email fiókját a megerősítéshez.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6">
              LEGYÉL KÖZTÜNK ELSŐK KÖZÖTT!
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Csatlakozz a várólistánkhoz és értesülj elsőként, amikor elindítjuk az alkalmazást!
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                type="email"
                placeholder="Add meg az email címed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-[#3ba1cb] text-white placeholder-gray-400 text-center"
                disabled={isLoading}
              />
              
              <div className="flex items-center space-x-2 justify-center">
                <Checkbox
                  id="gdpr"
                  checked={gdprAccepted}
                  onCheckedChange={(checked) => setGdprAccepted(checked as boolean)}
                  className="border-[#3ba1cb] data-[state=checked]:bg-[#3ba1cb]"
                />
                <label htmlFor="gdpr" className="text-sm text-gray-300 cursor-pointer">
                  Elfogadom az <span className="text-[#27dddf] underline">adatvédelmi szabályzatot</span>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#3ba1cb] to-[#27dddf] hover:from-[#27dddf] hover:to-[#3ba1cb] text-black font-bold py-3 text-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'REGISZTRÁCIÓ...' : 'REGISZTRÁLOK'}
              </Button>
            </form>
            
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-4">Vagy</p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/auth'}
                className="border-[#27dddf] text-[#27dddf] hover:bg-[#27dddf] hover:text-black"
              >
                Teljes regisztráció Google fiókkal
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
