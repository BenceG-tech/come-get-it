import React from 'react';
import { Users, DollarSign, Clock, BarChart3, MapPin, DoorOpen } from 'lucide-react';
import { ServiceCard } from '@/components/ui/ServiceCard';

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Miért éri meg neked?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <ServiceCard
              key={idx}
              icon={card.icon}
              title={card.title}
              description={card.description}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
