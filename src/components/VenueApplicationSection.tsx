import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Handshake, Mail, Phone, User, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VenueApplicationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venueName: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Here you would typically send the data to your backend
    console.log('Venue application submitted:', formData);
    
    toast({
      title: "Jelentkezés elküldve!",
      description: "Hamarosan felvesszük Önnel a kapcsolatot.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      venueName: '',
    });
  };

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
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 neon-glow-brand"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Jelentkezés elküldése
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
