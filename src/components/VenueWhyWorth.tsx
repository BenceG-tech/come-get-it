import React from 'react';
import { Users, DollarSign, Clock, BarChart3, MapPin, DoorOpen } from 'lucide-react';

const cards = [
  {
    icon: Users,
    title: 'Garantált új vendégek',
    description: 'A juzereink azért nyitják meg az appot, mert döntéshelyzetben vannak: „hova menjek ma?" Te megjelensz a válaszuk között.',
  },
  {
    icon: DollarSign,
    title: 'Nulla pénzügyi rizikó',
    description: 'Az első 6 hónap teljesen jutalékmentes. Nincs fix havidíj, nincs setup-fee. A free drink költsége a beszerzési árad — egy alacsony marketing-befektetés, amiért egy átlagos 3500 Ft-ot költő vendéget kapsz cserébe.',
  },
  {
    icon: Clock,
    title: 'Te döntöd el, mit és mikor adsz ingyen',
    description: 'Te választod ki: melyik italt, melyik napokon, melyik órákban. Csak holtidőben (pl. 14-17 között)? Csak limonádét, sört nem? Csak hétköznap? Te szabod meg a szabályokat — mi végrehajtjuk.',
  },
  {
    icon: BarChart3,
    title: 'Adatok, amiket sehol máshol nem kapsz',
    description: 'Megmondjuk, ki mikor jött be, melyik italra reagáltak jobban, hányan tértek vissza. A/B tesztelheted: egyik héten sör, másikon bor, harmadikon limonádé. Pontosan látod, mi vonzza a célközönségedet.',
  },
  {
    icon: MapPin,
    title: 'Lokáció-alapú push az utcán',
    description: 'Ha egy juzer 500 méteres körzetedben elsétál, az appja értesítést dob: „Itt és itt kapsz egy ingyen sört, Come Get It." Ez egy acquisition-csatorna, amit hagyományos kuponozóknál nem kapsz meg.',
  },
  {
    icon: DoorOpen,
    title: 'Kockázatmentes kilépés',
    description: 'Ha 2 hét után úgy látod, a juzereink csak az ingyen italért jönnek és nem maradnak — egy üzenet és levesszük a rendszerből. Nincs lock-in, nincs büntetés. A program csak akkor működik, ha mindkettőnk nyer.',
  },
];

export const VenueWhyWorth: React.FC = () => {
  return (
    <section id="venue-why-worth" className="py-20 px-4 bg-nf-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            Miért éri meg neked?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group relative h-full flex flex-col p-6 md:p-7 rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              <div className="mb-4 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] group-hover:border-nf-primary group-hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-500">
                <card.icon className="w-6 h-6 md:w-7 md:h-7 text-nf-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
