
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !gdprAccepted) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérjük, töltse ki az email címet és fogadja el az adatkezelési tájékoztatót.",
        variant: "destructive",
      });
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
      
      // Email küldés a Supabase Edge Function-ön keresztül
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
      
      setIsSubmitted(true);
      toast({
        title: "🎉 Sikeres regisztráció!",
        description: "Köszönjük! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel. Ellenőrizd az email fiókodat!",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setEmail('');
        setGdprAccepted(false);
        setIsSubmitted(false);
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
    <section id="signup" className="py-24 px-4 bg-[#0f384e]/20">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          {t('signup.title')}
        </h2>
        <p className="text-white mb-8">
          {t('signup.subtitle')}
        </p>
        
        {!isSupabaseConfigured() && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-100 text-sm">
              ⚠️ Demo Mode: Email küldés jelenleg nem elérhető
            </p>
          </div>
        )}
        
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder={t('signup.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0c323f]/50 border-[#3ba1cb]/30 text-white placeholder-[#3ba1cb]/70 focus:border-[#27dddf] focus:ring-[#27dddf] h-12"
            required
            disabled={isLoading}
          />
          
          <div className="flex items-start gap-3 text-left">
            <input
              type="checkbox"
              id="gdpr"
              checked={gdprAccepted}
              onChange={(e) => setGdprAccepted(e.target.checked)}
              className="mt-1 accent-[#27dddf]"
              required
              disabled={isLoading}
            />
            <label htmlFor="gdpr" className="text-sm text-white">
              Elfogadom az adatkezelési tájékoztatót és hozzájárulok a kapcsolatfelvételhez
            </label>
          </div>
          
          <Button 
            type="submit"
            disabled={!gdprAccepted || isLoading}
            className="w-full brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-brand border-0"
          >
            {isLoading ? '⏳ Küldés...' : isSubmitted ? t('signup.success') : t('signup.submit')}
          </Button>
        </form>
        
        {isSubmitted && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-white font-medium mb-2">
              🎉 Köszönjük a regisztrációt!
            </p>
            <p className="text-green-100 text-sm">
              Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.<br/>
              <strong>Ellenőrizd az email fiókodat</strong> az exkluzív előnyeidért!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
