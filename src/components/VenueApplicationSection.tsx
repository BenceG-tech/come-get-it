
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.venueName) {
      toast({
        title: t('venue_app.toasts.missing_fields_title'),
        description: t('venue_app.toasts.missing_fields_desc'),
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
      
      // Build source context with UTM params and referrer
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
      
      // Email küldés a Supabase Edge Function-ön keresztül
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'venue_application',
          data: { ...formData, timestamp: new Date().toISOString(), source }
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Venue application sent successfully:', data);

      // Persist application to database (insert-only; RLS allows public inserts)
      const { error: dbError } = await supabase
        .from('venue_applications')
        .insert([{ 
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          venue_name: formData.venueName
        }]);
      if (dbError) {
        console.warn('DB insert failed (venue_applications):', dbError);
      }

      setIsSubmitted(true);
      toast({
        title: t('venue_app.toasts.success_title'),
        description: t('venue_app.toasts.success_desc'),
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          venueName: '',
        });
        setIsSubmitted(false);
      }, 8000);

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
    <section id="partnerek" className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">{/* Unified gradient background */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-green-500/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('venue_app.submitted.title')}
              </h2>
              <p className="text-green-100 text-lg mb-4">
                {t('venue_app.submitted.desc')}
              </p>
              <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-white text-sm">
                  {t('venue_app.submitted.email_tip')}<br/><br/>
                  {t('venue_app.submitted.call_tip')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="venue-application" className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">{/* Unified gradient background */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-electric-300" />
              <Handshake className="w-8 h-8 text-electric-300" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('venue_app.header.heading')}
          </h2>
          <p className="text-lg text-white mb-2">
            {t('venue_app.header.sub1')}
          </p>
          <p className="text-electric-100 max-w-2xl mx-auto">
            {t('venue_app.header.sub2')}
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-100 text-sm">
              {t('venue_app.demo_banner')}
            </p>
          </div>
        )}

        {/* Application Form */}
        <Card className="glass-effect border-electric-300/20">{/* Unified glass effect */}
          <CardHeader>
            <CardTitle className="text-white text-center text-xl">
              {t('venue_app.form.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {t('form_common.name_label')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder={t('form_common.full_name_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('form_common.email_label')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder={t('form_common.email_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {t('form_common.phone_label')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder={t('form_common.phone_placeholder')}
                    disabled={isLoading}
                  />
                </div>

                {/* Venue Name */}
                <div className="space-y-2">
                  <Label htmlFor="venueName" className="text-white flex items-center">
                    <Store className="w-4 h-4 mr-2" />
                    {t('venue_app.form.venue_name_label')}
                  </Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    type="text"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder={t('venue_app.form.venue_name_placeholder')}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 neon-glow-brand disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
          <p className="text-electric-100 text-sm">
            {t('venue_app.benefits_line')}
          </p>
        </div>
      </div>
    </section>
  );
};
