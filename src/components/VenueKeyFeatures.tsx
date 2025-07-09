import React from 'react';
import { PhoneMockup } from './PhoneMockup';
import { GlassWater, Star, CheckCircle, MapPin, Footprints } from 'lucide-react';

export const VenueKeyFeatures: React.FC = () => {
  const venueDetailImage = "/lovable-uploads/306d0815-37a6-4087-8408-3986c94eb037.png";

  const features = [
    {
      icon: GlassWater,
      title: "NÖVELD A FORGALMAT",
      description: "Az alkalmazás növeli a fogyasztást és visszahozza a vendégeket több pontért és jutalmakért."
    },
    {
      icon: Star,
      title: "DUSK JUTALMAK",
      description: "Te döntöd el, milyen jutalmakat adsz – és így növeled az újralátogatások számát."
    },
    {
      icon: CheckCircle,
      title: "EGYSZERŰ BEVEZETÉS",
      description: "Semmi extra oktatás vagy berendezés. Minden egyszerűen működik."
    },
    {
      icon: Footprints,
      title: "KÖVETHETŐ LÁBNYOM",
      description: "Küldünk néhány kódot és reklámanyagot a helyed számára - ez minden, amire szükség van."
    },
    {
      icon: MapPin,
      title: "GPS",
      description: "Segítünk a vendégeknek megtalálni a helyed és egyszerűen eljutni hozzád."
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-anton text-white mb-6">
            KULCS FUNKCIÓK
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup imageUrl={venueDetailImage} className="scale-110" />
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-electric-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-electric-100 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};