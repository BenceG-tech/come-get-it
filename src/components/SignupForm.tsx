
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { getSupabaseClient } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
 
export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const { t } = useI18n();

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      analytics.ctaClick('signup_google', 'Google regisztráció');
      const { error } = await signInWithGoogle();
      if (error) {
        const msg = (error as any)?.message || '';
        const isProviderDisabled = /validation_failed|Unsupported provider|provider is not enabled/i.test(msg);
        toast({
          title: isProviderDisabled ? "Google bejelentkezés még nem elérhető" : "Hiba történt",
          description: isProviderDisabled
            ? "A Google regisztráció hamarosan elérhető lesz. Addig is regisztrálj e-mail címeddel feljebb."
            : "A Google regisztráció nem sikerült. Kérjük, próbáld újra.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Hiba történt",
        description: "Váratlan hiba történt. Kérjük, próbáld újra.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  useEffect(() => {
    // Track when signup form is viewed
    analytics.signupFormView();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: t('signup.toasts.error_title'),
        description: t('signup.toasts.missing_email'),
        variant: 'destructive'
      });
      return;
    }

    if (!gdprAccepted) {
      toast({
        title: t('signup.toasts.error_title'), 
        description: t('signup.toasts.gdpr_required'),
        variant: 'destructive'
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
      
      // If Supabase is configured, use the secure endpoint
      if (supabase) {
        try {
          const { error: submitError } = await supabase.functions.invoke('send-notification-email', {
            body: {
              type: 'user_signup',
              data: {
                email: email,
                source: source
              }
            }
          });

          if (submitError) {
            console.error('Error submitting signup:', submitError);
            if (submitError.message?.includes('Too many requests')) {
              toast({
                title: "Túl sok kérés",
                description: "Kérjük, várj egy kicsit, majd próbáld újra.",
                variant: "destructive",
              });
            } else if (submitError.message?.includes('Access denied')) {
              toast({
                title: "Hozzáférés megtagadva", 
                description: "Kérjük, próbáld újra később.",
                variant: "destructive",
              });
            } else {
              toast({
                title: t('signup.toasts.error_generic_title'),
                description: t('signup.toasts.error_generic_desc'),
                variant: "destructive",
              });
            }
            return;
          }

          // Track analytics
          analytics.signupSubmit(email);
          analytics.signupSuccess();

          setLastEmail(email);
          setIsSubmitted(true);
          setEmail('');
          setGdprAccepted(false);

          console.log('Registration completed successfully for:', email);

          toast({
            title: t('signup.toasts.success_title'),
            description: t('signup.toasts.success_desc'),
          });
        } catch (error) {
          console.error('Error calling secure signup function:', error);
          toast({
            title: t('signup.toasts.error_generic_title'),
            description: t('signup.toasts.error_generic_desc'),
            variant: 'destructive'
          });
        }
      } else {
        // Demo fallback (no backend)
        toast({
          title: t('signup.toasts.demo_title'),
          description: t('signup.toasts.demo_desc'),
        });
        setIsSubmitted(true);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      toast({
        title: t('signup.toasts.error_generic_title'),
        description: error.message || t('signup.toasts.error_generic_desc'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendWelcome = async () => {
    if (!lastEmail) {
      toast({ title: t('signup.toasts.resend_missing_title'), description: t('signup.toasts.resend_missing_desc'), variant: 'destructive' });
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
        throw new Error(t('signup.toasts.resend_failed_desc'));
      }

      toast({ title: t('signup.toasts.resend_success_title'), description: t('signup.toasts.resend_success_desc') });
    } catch (err: any) {
      toast({ title: t('signup.toasts.error_title'), description: err.message || t('signup.toasts.resend_failed_desc'), variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  };

  // Don't show signup form if user is already authenticated
  if (user) {
    return (
      <section id="signup" className="py-20 bg-nf-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6 tracking-tight">
              {t('signup.logged_in_title')}
            </h2>
            <div className="nf-card p-6 border-nf-primary/30">
              <p className="text-nf-primary text-lg">
                {t('signup.logged_in_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-20 bg-nf-background">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {isSubmitted ? (
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6 tracking-tight">
              {t('signup.thanks_title')}
            </h2>
            <div className="nf-card p-6 border-green-500/30 bg-green-500/10">
              <p className="text-green-400 text-lg mb-4">
                {t('signup.success_line')}
              </p>
              <p className="text-nf-text-muted text-sm mb-4">{t('signup.check_spam')}</p>
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={handleResendWelcome}
                  disabled={isResending}
                  className="border-nf-primary text-nf-primary hover:bg-nf-primary hover:text-black"
                >
                  {isResending ? t('signup.resend_loading') : t('signup.resend_button')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-anton text-white mb-6 tracking-tight">
              {t('signup.main_title')}
            </h2>
            <p className="text-nf-text-muted text-lg md:text-xl leading-relaxed">
              {t('signup.subtitle')}
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                type="email"
                placeholder={t('signup.placeholder_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center"
                disabled={isLoading}
              />
              
              <div className="flex items-center space-x-2 justify-center">
                <Checkbox
                  id="gdpr"
                  checked={gdprAccepted}
                  onCheckedChange={(checked) => setGdprAccepted(checked as boolean)}
                  className="border-nf-border data-[state=checked]:bg-nf-primary data-[state=checked]:border-nf-primary"
                />
                <label htmlFor="gdpr" className="text-sm text-nf-text-muted cursor-pointer">
                  {t('signup.gdpr_label_prefix')} <Link to="/adatvedelmi-szabalyzat" target="_blank" rel="noopener noreferrer" className="text-nf-primary underline focus:outline-none focus:ring-2 focus:ring-nf-primary/50">{t('signup.privacy_policy')}</Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                variant="neon"
                className="w-full py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? t('signup.button_loading') : t('signup.button')}
              </Button>
            </form>
            
            <div className="mt-8">
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-nf-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-nf-surface px-4 text-sm text-nf-text-muted uppercase tracking-wider">
                    {t('signup.or')}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="w-full py-4 text-base md:text-lg font-semibold rounded-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                {isGoogleLoading ? "Folyamatban..." : t('signup.full_registration_google')}
              </Button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
