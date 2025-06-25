
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Handshake, Mail, Phone, User, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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
        title: "Hiányzó adatok",
        description: "Kérjük, töltse ki az összes kötelező mezőt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to send venue application...');
      
      // Email küldés a Supabase Edge Function-ön keresztül
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'venue_application',
          data: formData
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Venue application sent successfully:', data);

      setIsSubmitted(true);
      toast({
        title: "🤝 Jelentkezés elküldve!",
        description: "Köszönjük a jelentkezést! Hamarosan felvesszük Önnel a kapcsolatot. Ellenőrizze az email fiókját!",
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
        title: "Hiba történt",
        description: "Sajnos nem sikerült elküldeni a jelentkezést. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="partnerek" className="py-16 px-4 bg-[#0f384e]/10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-green-500/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                🎉 Köszönjük a jelentkezést!
              </h2>
              <p className="text-green-100 text-lg mb-4">
                Sikeresen megkaptuk a partner jelentkezését.
              </p>
              <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-white text-sm">
                  📧 <strong>Ellenőrizze az email fiókját</strong> - részletes tájékoztatót küldtünk a partnerség előnyeiről<br/><br/>
                  📞 Kollégánk hamarosan felveszi Önnel a kapcsolatot
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="partnerek" className="py-16 px-4 bg-[#0f384e]/10">
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
            Üzlettulajdonos vagy?
          </h2>
          <p className="text-lg text-white mb-2">
            Csatlakozz partnereink közé!
          </p>
          <p className="text-electric-100 max-w-2xl mx-auto">
            Növeld vendégeid számát, építs hűséges közönséget és szerezz új vásárlókat az ingyenes promócióinkkal.
          </p>
        </div>

        {/* Application Form */}
        <Card className="bg-black/40 border-electric-300/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center text-xl">
              Jelentkezés partnerségre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Név *
                  </Label>
                  <Input
                    id="name"
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
                  <Label htmlFor="email" className="text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email *
                  </Label>
                  <Input
                    id="email"
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
                  <Label htmlFor="phone" className="text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="+36 30 123 4567"
                    disabled={isLoading}
                  />
                </div>

                {/* Venue Name */}
                <div className="space-y-2">
                  <Label htmlFor="venueName" className="text-white flex items-center">
                    <Store className="w-4 h-4 mr-2" />
                    Üzlet neve *
                  </Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    type="text"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    className="bg-black/50 border-electric-300/30 text-white placeholder:text-gray-400 focus:border-electric-300"
                    placeholder="Vendéglátóhely neve"
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

        {/* Benefits for Venues */}
        <div className="mt-8 text-center">
          <p className="text-electric-100 text-sm">
            🎯 Ingyenes promóció • 📈 Növekvő forgalom • 👥 Hűséges vendégek • 📊 Mérhető eredmények
          </p>
        </div>
      </div>
    </section>
  );
};
