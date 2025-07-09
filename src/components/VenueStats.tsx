import React from 'react';
import { Cake, Users, CircleDot, TrendingUp } from 'lucide-react';

export const VenueStats: React.FC = () => {
  const stats = [
    {
      icon: Cake,
      value: "24",
      label: "ÁTLAG ÉLETKOR",
      description: "Fiatal, aktív korosztály"
    },
    {
      icon: Users,
      value: "91%",
      label: "MILLENNIÁL & GEN Z ADATBÁZIS",
      description: "Célzott demográfia"
    },
    {
      icon: CircleDot,
      value: "56%",
      label: "NŐI KÖZÖNSÉG",
      description: "Kiegyensúlyozott arány"
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "ESTE/HÉTVÉGÉN AKTÍV",
      description: "Rendszeres látogatók"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-300/20 to-ocean-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-electric-300 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-electric-300 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-electric-100 mb-1 leading-tight">
                {stat.label}
              </div>
              <div className="text-xs text-electric-100/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};