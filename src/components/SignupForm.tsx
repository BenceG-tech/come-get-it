
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { getSupabaseClient } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
 
export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useI18n();

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
      <section id="signup" className="py-20 bg-nf-background nf-section-glow">
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
    <section id="signup" className="py-12 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-2xl border border-dashed border-nf-primary/40 bg-white/[0.03] backdrop-blur-md p-6 md:p-10 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at bottom right, rgba(0,188,212,0.10), transparent 60%)',
          }}
        >
          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-anton uppercase text-white mb-4 tracking-tight">
                {t('signup.thanks_title')}
              </h2>
              <div className="rounded-2xl p-6 border border-nf-primary/30 bg-nf-primary/[0.05]">
                <p className="text-nf-primary text-lg mb-4">
                  {t('signup.success_line')}
                </p>
                <p className="text-white/55 text-sm mb-4">{t('signup.check_spam')}</p>
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
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-anton uppercase text-white mb-2 tracking-tight">
                {t('signup.main_title')}
              </h2>
              <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                {t('signup.subtitle')}
              </p>

              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
                <Input
                  type="email"
                  placeholder={t('signup.placeholder_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center bg-[#03070d]/80 border-nf-primary/25 text-white placeholder:text-white/40 focus:border-nf-primary focus:ring-2 focus:ring-nf-primary/30"
                  disabled={isLoading}
                />

                <div className="flex items-center space-x-2 justify-center">
                  <Checkbox
                    id="gdpr"
                    checked={gdprAccepted}
                    onCheckedChange={(checked) => setGdprAccepted(checked as boolean)}
                    className="border-nf-primary/40 data-[state=checked]:bg-nf-primary data-[state=checked]:border-nf-primary"
                  />
                  <label htmlFor="gdpr" className="text-sm text-white/60 cursor-pointer">
                    {t('signup.gdpr_label_prefix')}{' '}
                    <Link to="/adatvedelmi-szabalyzat" target="_blank" rel="noopener noreferrer" className="text-nf-primary underline focus:outline-none focus:ring-2 focus:ring-nf-primary/50">
                      {t('signup.privacy_policy')}
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="neon"
                  className="w-full py-3 text-lg shadow-[0_0_30px_rgba(0,188,212,0.4)]"
                  disabled={isLoading}
                >
                  {isLoading ? t('signup.button_loading') : t('signup.button')}
                </Button>
              </form>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};
