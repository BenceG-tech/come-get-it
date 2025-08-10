import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Handshake, Mail, Phone, User, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { useI18n } from '@/hooks/useI18n';

type PartnerType = 'rewards' | 'brand' | 'accelerator';

interface PartnerApplicationSectionProps {
  id: string;
  partnerType: PartnerType;
}

export const PartnerApplicationSection: React.FC<PartnerApplicationSectionProps> = ({ id, partnerType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const labels = {
    heading: t(`partner_application.${partnerType}.heading`),
    sub1: t(`partner_application.${partnerType}.sub1`),
    sub2: t(`partner_application.${partnerType}.sub2`),
    company: t(`partner_application.${partnerType}.company`),
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.companyName) {
      toast({
        title: 'Hiányzó adatok',
        description: 'Kérjük, töltsd ki az összes kötelező mezőt.',
        variant: 'destructive',
      });
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      toast({
        title: 'Demo mód',
        description: 'Az alkalmazás demo módban fut. A jelentkezés sikeres lenne élesben.',
      });
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      // Source context (UTM + referrer + route)
      const params = new URLSearchParams(window.location.search);
      const utmPairs = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']
        .map(k => (params.get(k) ? `${k}=${params.get(k)}` : ''))
        .filter(Boolean)
        .join('&');
      const ref = document.referrer ? `ref=${encodeURIComponent(document.referrer)}` : '';
      const path = `path=${encodeURIComponent(window.location.pathname)}`;
      const source = [`${partnerType}_application_form`, utmPairs && `utm:${utmPairs}`, ref, path]
        .filter(Boolean)
        .join(' | ');

      // Email notification via Edge Function (reuse venue_application with enriched source)
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'venue_application',
          data: { 
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            venueName: formData.companyName,
            partnerType,
            timestamp: new Date().toISOString(),
            source
          }
        }
      });

      if (error) throw error;

      // Persist minimal lead in venue_applications table (maps companyName -> venue_name)
      const { error: dbError } = await supabase
        .from('venue_applications')
        .insert([{ 
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          venue_name: formData.companyName,
        }]);
      if (dbError) {
        console.warn('DB insert failed (venue_applications):', dbError);
      }

      setIsSubmitted(true);
      toast({
        title: '🤝 Jelentkezés elküldve!',
        description: 'Köszönjük! Hamarosan felvesszük veled a kapcsolatot. Ellenőrizd az emailed!',
      });

      // Reset after some time
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', companyName: '' });
        setIsSubmitted(false);
      }, 8000);

    } catch (err) {
      console.error('Error sending partner application:', err);
      toast({
        title: 'Hiba történt',
        description: 'Nem sikerült elküldeni a jelentkezést. Próbáld újra később.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id={id} className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-green-500/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-4">🎉 Köszönjük a jelentkezést!</h2>
              <p className="text-green-100 text-lg mb-4">Sikeresen megkaptuk a jelentkezésed.</p>
              <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-white text-sm">
                  📧 <strong>Ellenőrizd az emailed</strong> – visszaigazolást küldtünk<br/><br/>
                  📞 Hamarosan keresni fogunk
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
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
            {labels.heading}
          </h2>
          <p className="text-lg text-white mb-2">{labels.sub1}</p>
          <p className="text-electric-100 max-w-2xl mx-auto">{labels.sub2}</p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-100 text-sm">⚠️ Demo mód: Email küldés jelenleg nem elérhető</p>
          </div>
        )}

        {/* Form */}
        <Card className="glass-effect border-electric-300/20">
          <CardHeader>
            <CardTitle className="text-white text-center text-xl">Jelentkezés</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-name`} className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Név *
                  </Label>
                  <Input
                    id={`${id}-name`}
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="Teljes név"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`} className="text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email *
                  </Label>
                  <Input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="email@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-phone`} className="text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Telefon
                  </Label>
                  <Input
                    id={`${id}-phone`}
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="+36 30 123 4567"
                    disabled={isLoading}
                  />
                </div>

                {/* Company/Brand */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-companyName`} className="text-white flex items-center">
                    <Store className="w-4 h-4 mr-2" />
                    {labels.company}
                  </Label>
                  <Input
                    id={`${id}-companyName`}
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="Márka vagy cég neve"
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
                      Küldés...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 mr-2" />
                      Jelentkezés elküldése
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-electric-100 text-sm">
            🎯 Mérhető eredmények • 🚀 Gyors indulás • 👥 Elkötelezett közönség
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerApplicationSection;
