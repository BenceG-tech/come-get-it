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
    <section className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-sm md:text-base font-bold text-white mb-2 tracking-wide group-hover:text-nf-primary transition-colors duration-300">
                {item.title}
              </div>
              <div className="text-xs md:text-sm text-white/60 leading-snug">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
