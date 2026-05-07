import React from 'react';
import { Clock, Users, MapPin, BarChart3 } from 'lucide-react';

const items = [
  {
    icon: Clock,
    title: 'HOLTIDŐ-FÓKUSZ',
    description: 'Akkor hozunk vendéget, amikor üresek az asztalok.',
  },
  {
    icon: Users,
    title: 'GEN Z & MILLENNIÁL',
    description: 'A budapesti, vendéglátóhelyekre járó fiatal felnőtt közönség.',
  },
  {
    icon: MapPin,
    title: 'LOKÁCIÓ-ALAPÚ ÉRTESÍTÉS',
    description: 'A juzereink push-üzenetet kapnak, ha 500 méteren belül vannak.',
  },
  {
    icon: BarChart3,
    title: 'VALÓDI MÉRÉS',
    description: 'Banki tranzakciók és app-aktivitás alapján — nem becslések.',
  },
];

export const VenueStats: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-nf-primary to-nf-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-neon">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-sm md:text-base font-black text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors duration-300">
                {item.title}
              </div>
              <div className="text-xs md:text-sm text-nf-text-muted/80 leading-snug">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
