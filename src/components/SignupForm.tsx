
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { getSupabaseClient } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
      const supabase = getSupabaseClient();
      
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Build source context with UTM params and referrer
      const params = new URLSearchParams(window.location.search);
      const utmPairs = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']
        .map((k) => (params.get(k) ? `${k}=${params.get(k)}` : ''))
        .filter(Boolean)
        .join('&');
      const ref = document.referrer ? `ref=${encodeURIComponent(document.referrer)}` : '';
      const path = `path=${encodeURIComponent(window.location.pathname)}`;
      const source = ['main_signup_form', utmPairs && `utm:${utmPairs}`, ref, path]
        .filter(Boolean)
        .join(' | ');

      console.log('Starting email registration for:', email);
      
      // Send notification email to admin and user
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: { 
          type: 'user_signup',
          data: { 
            email: email,
            timestamp: new Date().toISOString(),
            source
          }
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't block the signup if email fails, just log it
      }

      // Persist to database (insert-only; RLS allows public inserts)
      const { error: dbError } = await supabase
        .from('waitlist_signups')
        .insert([{ email, source }]);

      if (dbError) {
        console.warn('DB insert failed (waitlist_signups):', dbError);
      }

      // Track analytics
      analytics.signupSubmit(email);
      analytics.signupSuccess();

      setLastEmail(email);
      setIsSubmitted(true);
      setEmail('');
      setGdprAccepted(false);

      console.log('Registration completed successfully for:', lastEmail || email);

      toast({
        title: "Sikeres regisztráció!",
        description: "Köszönjük a regisztrációt! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.",
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

  const handleResendWelcome = async () => {
    if (!lastEmail) {
      toast({ title: 'Hiányzó email', description: 'Nincs elmentett email cím az újraküldéshez.', variant: 'destructive' });
      return;
    }

    try {
      setIsResending(true);
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase client not available');

      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'user_signup',
          data: {
            email: lastEmail,
            timestamp: new Date().toISOString(),
            source: 'resend_welcome_button'
          },
          sendWelcome: true,
          notifyAdmin: false,
        },
      });

      if (error) {
        console.error('Resend welcome error:', error);
        throw new Error('Az üdvözlő email újraküldése nem sikerült.');
      }

      toast({ title: 'Email újraküldve', description: 'Ellenőrizd a beérkező, promóciók vagy spam mappát is.' });
    } catch (err: any) {
      toast({ title: 'Hiba', description: err.message || 'Nem sikerült újraküldeni az emailt.', variant: 'destructive' });
    } finally {
      setIsResending(false);
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
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 space-y-4">
              <p className="text-green-400 text-lg">
                ✅ Sikeres regisztráció! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.
              </p>
              <p className="text-gray-300 text-sm">Ha nem látod az üdvözlő emailt, ellenőrizd a Promóciók vagy Spam mappát.</p>
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={handleResendWelcome}
                  disabled={isResending}
                  className="border-[#27dddf] text-[#27dddf] hover:bg-[#27dddf] hover:text-black"
                >
                  {isResending ? 'Újraküldés...' : 'Üdvözlő email újraküldése'}
                </Button>
              </div>
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
                  Elfogadom az <Link to="/adatvedelmi-szabalyzat" target="_blank" rel="noopener noreferrer" className="text-[#27dddf] underline focus:outline-none focus:ring-2 focus:ring-[#27dddf]/50">adatvédelmi szabályzatot</Link>
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
