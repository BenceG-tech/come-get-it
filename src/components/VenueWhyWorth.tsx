import React from 'react';
import { Users, DollarSign, Clock, BarChart3, MapPin, DoorOpen } from 'lucide-react';
import bgUjVendegek from '@/assets/venue-why/uj-vendegek.jpg';
import bgNullaRizko from '@/assets/venue-why/nulla-rizko.jpg';
import bgTeDontod from '@/assets/venue-why/te-dontod.jpg';
import bgAdatok from '@/assets/venue-why/adatok-insight.jpg';
import bgLokacio from '@/assets/venue-why/lokacio-push.jpg';
import bgKilepes from '@/assets/venue-why/kockazatmentes-kilepes.jpg';

const cards = [
  {
    icon: Users,
    title: 'Vendég a döntés pillanatában',
    description: 'A userünk akkor nyitja meg az appot, amikor épp azt kérdezi: hova menjek ma? Te ott jelensz meg a válaszai között — pont az általad kijelölt időablakban.',
    bg: bgUjVendegek,
  },
  {
    icon: DollarSign,
    title: 'Nulla pénzügyi rizikó',
    description: 'Az első 6 hónap teljesen jutalékmentes. Nincs fix havidíj, nincs setup-fee. A free drink költsége a beszerzési árad. Hogy ez megtérül-e — pontosan ezt mérjük együtt: minden beváltás mellé látod az utóköltést is.',
    bg: bgNullaRizko,
  },
  {
    icon: Clock,
    title: 'Te döntöd el, mit és mikor adsz ingyen',
    description: 'Te választod ki: melyik italt, melyik napokon, melyik órákban. Csak holtidőben (pl. 14-17 között)? Csak limonádét, sört nem? Csak hétköznap? Te szabod meg a szabályokat — mi végrehajtjuk.',
    bg: bgTeDontod,
  },
  {
    icon: BarChart3,
    title: 'Adatok, amiket sehol máshol nem kapsz',
    description: 'Látod, hány beváltás történt, mikor, új vagy visszatérő vendég volt-e, és mennyit költött az ingyen ital után. A/B tesztelheted az ajánlatod hétről hétre.',
    bg: bgAdatok,
  },
  {
    icon: MapPin,
    title: 'HAMAROSAN — Lokáció-alapú push az utcán',
    description: 'Ha egy juzer 500 méteres körzetedben elsétál, az appja értesítést dob: „Itt és itt kapsz egy ingyen sört, Come Get It." Ez egy acquisition-csatorna, amit hagyományos kuponozóknál nem kapsz meg.',
    bg: bgLokacio,
  },
  {
    icon: DoorOpen,
    title: 'Kockázatmentes kilépés',
    description: 'A pilot 30 napos ciklusokban fut, közös kiértékeléssel. Ha az adatok alapján nem működik nálad — egy üzenet, és levesszük a rendszerből. Nincs lock-in, nincs büntetés.',
    bg: bgKilepes,
  },
];

export const VenueWhyWorth: React.FC = () => {
  return (
    <section id="venue-why-worth" className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            Miért éri meg neked?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-nf-primary/20 bg-nf-surface/40 transition-all duration-500 hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]"
            >
              {/* Image area — fully visible */}
              <div
                className="relative aspect-[21/9] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${card.bg})` }}
              >
                {/* Subtle top gradient so icon stays readable */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
                />

                {/* Top-left icon medallion */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-nf-primary/50 bg-nf-background/60 backdrop-blur-md flex items-center justify-center group-hover:border-nf-primary group-hover:shadow-[0_0_25px_rgba(0,188,212,0.55)] transition-all duration-500">
                    <card.icon className="w-4 h-4 md:w-5 md:h-5 text-nf-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Text block BELOW the image */}
              <div className="px-5 pt-4 pb-5 md:pt-5 md:pb-6 border-t border-nf-primary/20 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-nf-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
