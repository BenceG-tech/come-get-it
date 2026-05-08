import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Handshake, Mail, Phone, User, Store, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { useI18n } from '@/hooks/useI18n';

export const VenueApplicationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venueName: '',
    venueType: '',
    addressCity: '',
    dailyCustomerCount: '',
    availability: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.venueName || !formData.venueType || !formData.addressCity || !formData.dailyCustomerCount) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérlek töltsd ki az összes kötelező mezőt.",
        variant: "destructive",
      });
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('Supabase not configured, showing demo success message');
      toast({
        title: t('venue_app.toasts.demo_title'),
        description: t('venue_app.toasts.demo_desc'),
      });
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const utmPairs = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']
        .map((k) => (params.get(k) ? `${k}=${params.get(k)}` : ''))
        .filter(Boolean)
        .join('&');
      const ref = document.referrer ? `ref=${encodeURIComponent(document.referrer)}` : '';
      const path = `path=${encodeURIComponent(window.location.pathname)}`;
      const source = ['venue_application_form', utmPairs && `utm:${utmPairs}`, ref, path]
        .filter(Boolean)
        .join(' | ');

      try {
        const { error: submitError } = await supabase.functions.invoke('send-notification-email', {
          body: {
            type: 'venue_application',
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              venueName: formData.venueName,
              venueType: formData.venueType,
              addressCity: formData.addressCity,
              dailyCustomerCount: formData.dailyCustomerCount,
              availability: formData.availability,
              source: source
            }
          }
        });

        if (submitError) {
          console.error('Error submitting venue application:', submitError);
          if (submitError.message?.includes('Too many requests')) {
            toast({ title: "Túl sok kérés", description: "Kérjük, várj egy kicsit, majd próbáld újra.", variant: "destructive" });
          } else if (submitError.message?.includes('Access denied')) {
            toast({ title: "Hozzáférés megtagadva", description: "Kérjük, próbáld újra később.", variant: "destructive" });
          } else {
            toast({ title: t('venue_app.toasts.error_title'), description: t('venue_app.toasts.error_desc'), variant: "destructive" });
          }
          setIsLoading(false);
          return;
        }

        toast({ title: t('venue_app.toasts.success_title'), description: t('venue_app.toasts.success_desc') });
        setIsSubmitted(true);

        setFormData({
          name: '', email: '', phone: '', venueName: '', venueType: '',
          addressCity: '', dailyCustomerCount: '', availability: '',
        });

        setTimeout(() => setIsSubmitted(false), 8000);
      } catch (error) {
        console.error('Error calling secure venue application function:', error);
        toast({ title: t('venue_app.toasts.error_title'), description: t('venue_app.toasts.error_desc'), variant: "destructive" });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error sending venue application:', error);
      toast({ title: t('venue_app.toasts.error_title'), description: t('venue_app.toasts.error_desc'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="partnerek" className="py-16 px-4 bg-nf-background">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-nf-primary/40 bg-white/[0.04] backdrop-blur-md p-12 text-center shadow-[0_30px_120px_-30px_rgba(0,188,212,0.45)]">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border border-nf-primary/60 bg-nf-primary/[0.10] flex items-center justify-center shadow-[0_0_30px_rgba(0,188,212,0.45)]">
                <Building2 className="w-8 h-8 text-nf-primary" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-anton uppercase text-white mb-4 tracking-tight">Köszönjük!</h2>
            <p className="text-white/75 text-lg">24 órán belül felvesszük veled a kapcsolatot.</p>
          </div>
        </div>
      </section>
    );
  }

  const inputCls =
    'w-full px-3 py-2 rounded-lg bg-[#03070d]/80 border border-nf-primary/25 text-white placeholder:text-white/40 hover:border-nf-primary/50 focus:border-nf-primary focus:outline-none focus:ring-2 focus:ring-nf-primary/30 transition-colors duration-200';

  return (
    <section id="venue-application" className="py-20 px-4 bg-nf-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,188,212,0.10) 0%, transparent 70%)' }}
      />
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
              </div>
              <div className="w-12 h-12 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center">
                <Handshake className="w-5 h-5 text-nf-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white mb-4 tracking-tight">
            Csatlakozz az első 15 közé
          </h2>
          <p className="text-base md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            A Founding Partner Program szeptember 1-ig nyitva — vagy amíg az első 15 hely megtelik. Nincs fizetési kötelezettség, nincs hosszú szerződés.
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-nf-primary/10 border border-nf-primary/30 rounded-xl text-center">
            <p className="text-nf-primary text-sm">{t('venue_app.demo_banner')}</p>
          </div>
        )}

        <div className="relative rounded-2xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-6 md:p-12 shadow-[0_30px_120px_-30px_rgba(0,188,212,0.35)]">
          <h3 className="text-center text-xl font-bold text-white mb-8">
            {t('venue_app.form.title')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white flex items-center">
                  <User className="w-4 h-4 mr-2 text-nf-primary" />
                  {t('form_common.name_label')}
                </Label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange}
                  placeholder={t('form_common.full_name_placeholder')} required disabled={isLoading} className={inputCls} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-nf-primary" />
                  {t('form_common.email_label')}
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange}
                  placeholder={t('form_common.email_placeholder')} required disabled={isLoading} className={inputCls} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-nf-primary" />
                  {t('form_common.phone_label')}
                </Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                  placeholder={t('form_common.phone_placeholder')} required disabled={isLoading} className={inputCls} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueName" className="text-white flex items-center">
                  <Store className="w-4 h-4 mr-2 text-nf-primary" />
                  {t('venue_app.form.venue_name_label')}
                </Label>
                <Input id="venueName" name="venueName" type="text" value={formData.venueName} onChange={handleInputChange}
                  placeholder={t('venue_app.form.venue_name_placeholder')} required disabled={isLoading} className={inputCls} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueType" className="text-white">Helyszín típusa *</Label>
                <select id="venueType" value={formData.venueType} onChange={handleInputChange}
                  className={inputCls} required disabled={isLoading}>
                  <option value="">Válassz típust...</option>
                  <option value="bár">Bár</option>
                  <option value="kávézó">Kávézó</option>
                  <option value="étterem">Étterem</option>
                  <option value="koktélbár">Koktélbár</option>
                  <option value="pub">Pub</option>
                  <option value="egyéb">Egyéb</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressCity" className="text-white">Cím *</Label>
                <Input id="addressCity" type="text" value={formData.addressCity} onChange={handleInputChange}
                  placeholder="Pl. 1075 Budapest, Király u. 21." required disabled={isLoading} className={inputCls} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyCustomerCount" className="text-white">Becsült napi vendégszám *</Label>
                <select id="dailyCustomerCount" value={formData.dailyCustomerCount} onChange={handleInputChange}
                  className={inputCls} required disabled={isLoading}>
                  <option value="">Válassz tartományt...</option>
                  <option value="0-50">0-50</option>
                  <option value="50-150">50-150</option>
                  <option value="150-300">150-300</option>
                  <option value="300+">300+</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="availability" className="text-white">Mikor érnél rá egy 30 perces beszélgetésre?</Label>
                <Input id="availability" type="text" value={formData.availability} onChange={handleInputChange}
                  placeholder="Pl. jövő héten délután 14-17 között" disabled={isLoading} className={inputCls} />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" variant="neon" disabled={isLoading}
                className="py-3 px-8 w-full sm:w-auto shadow-[0_0_30px_rgba(0,188,212,0.45)]">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    {t('venue_app.form.sending')}
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Founding Partner jelentkezés elküldése
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-center px-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nf-primary/30 bg-nf-primary/[0.06]">
            <ShieldCheck className="w-4 h-4 text-nf-primary shrink-0" strokeWidth={1.5} />
            <p className="text-white/75 text-sm">{t('venue_app.benefits_line')}</p>
          </span>
        </div>
      </div>
    </section>
  );
};
