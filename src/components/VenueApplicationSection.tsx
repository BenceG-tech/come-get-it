
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Handshake, Mail, Phone, User, Store } from 'lucide-react';
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
    
    // Basic validation
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
      console.log('Attempting to send venue application...');
      
      // Generate source tracking
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
      
      // If Supabase is configured, use the secure endpoint
      if (supabase) {
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
                title: t('venue_app.toasts.error_title'),
                description: t('venue_app.toasts.error_desc'),
                variant: "destructive",
              });
            }
            setIsLoading(false);
            return;
          }

          toast({
            title: t('venue_app.toasts.success_title'),
            description: t('venue_app.toasts.success_desc'),
          });
          setIsSubmitted(true);
          
          // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        venueName: '',
        venueType: '',
        addressCity: '',
        dailyCustomerCount: '',
        availability: '',
      });
          
          // Reset form after successful submission
          setTimeout(() => {
            setIsSubmitted(false);
          }, 8000);
        } catch (error) {
          console.error('Error calling secure venue application function:', error);
          toast({
            title: t('venue_app.toasts.error_title'),
            description: t('venue_app.toasts.error_desc'),
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      } else {
        // Demo fallback (no backend)
        toast({
          title: t('venue_app.toasts.demo_title'),
          description: t('venue_app.toasts.demo_desc'),
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error sending venue application:', error);
      toast({
        title: t('venue_app.toasts.error_title'),
        description: t('venue_app.toasts.error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
    <section id="partnerek" className="py-16 px-4 bg-nf-background">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Köszönjük!
              </h2>
              <p className="text-green-100 text-lg mb-4">
                24 órán belül felvesszük veled a kapcsolatot.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="venue-application" className="py-16 px-4 bg-nf-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nf-primary to-nf-secondary flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Csatlakozz az első 15 közé
          </h2>
          <p className="text-base md:text-lg text-nf-text-muted max-w-2xl mx-auto leading-relaxed">
            A Founding Partner Program szeptember 1-ig nyitva — vagy amíg az első 15 hely megtelik. Nincs fizetési kötelezettség, nincs hosszú szerződés.
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
            <p className="text-yellow-100 text-sm">
              {t('venue_app.demo_banner')}
            </p>
          </div>
        )}

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {t('venue_app.form.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-nf-primary" />
                    {t('form_common.name_label')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('form_common.full_name_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-nf-primary" />
                    {t('form_common.email_label')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('form_common.email_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-nf-primary" />
                    {t('form_common.phone_label')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('form_common.phone_placeholder')}
                    disabled={isLoading}
                  />
                </div>

                {/* Venue Name */}
                <div className="space-y-2">
                  <Label htmlFor="venueName" className="text-white flex items-center">
                    <Store className="w-4 h-4 mr-2 text-nf-primary" />
                    {t('venue_app.form.venue_name_label')}
                  </Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    type="text"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    placeholder={t('venue_app.form.venue_name_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Venue Type */}
                <div className="space-y-2">
                  <Label htmlFor="venueType" className="text-white">
                    Helység típusa *
                  </Label>
                  <select
                    id="venueType"
                    value={formData.venueType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border bg-nf-surface-alt border-nf-border text-white focus:border-nf-primary focus:outline-none focus:ring-2 focus:ring-nf-primary/20 transition-colors duration-200"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Válassz típust...</option>
                    <option value="Étterem">Étterem</option>
                    <option value="Bár">Bár</option>
                    <option value="Kávézó">Kávézó</option>
                    <option value="Kocsma">Kocsma</option>
                    <option value="Borozó">Borozó</option>
                    <option value="Club/Szórakozóhely">Club/Szórakozóhely</option>
                    <option value="Cukrászda">Cukrászda</option>
                    <option value="Egyéb">Egyéb</option>
                  </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="addressCity" className="text-white">
                    Város *
                  </Label>
                  <Input
                    id="addressCity"
                    type="text"
                    value={formData.addressCity}
                    onChange={handleInputChange}
                    placeholder="Pl.: Budapest"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Daily Customer Count */}
                <div className="space-y-2">
                  <Label htmlFor="dailyCustomerCount" className="text-white">
                    Becsült napi vendégszám *
                  </Label>
                  <select
                    id="dailyCustomerCount"
                    value={formData.dailyCustomerCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border bg-nf-surface-alt border-nf-border text-white focus:border-nf-primary focus:outline-none focus:ring-2 focus:ring-nf-primary/20 transition-colors duration-200"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Válassz tartományt...</option>
                    <option value="0-50">0-50 vendég</option>
                    <option value="51-100">51-100 vendég</option>
                    <option value="101-200">101-200 vendég</option>
                    <option value="200+">200+ vendég</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  variant="neon"
                  disabled={isLoading}
                  className="py-3 px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      {t('venue_app.form.sending')}
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 mr-2" />
                      {t('venue_app.form.submit')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits for Venues */}
        <div className="mt-8 text-center">
          <p className="text-nf-text-muted text-sm">
            {t('venue_app.benefits_line')}
          </p>
        </div>
      </div>
    </section>
  );
};
