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
    description: 'A vendég akkor találkozhat a helyeddel, amikor azt keresi, hova menjen. Az ajánlat segít a választásban; a további élményt te adod.',
    bg: bgUjVendegek,
  },
  {
    icon: DollarSign,
    title: 'Előre tisztázott pilotköltség',
    description: 'A korlátozott pilotban nincs Come Get It platformdíj. Az ajánlat költségét és keretét előre rögzítjük; eredményt nem ígérünk.',
    bg: bgNullaRizko,
  },
  {
    icon: Clock,
    title: 'A keret a te kezedben van',
    description: 'Te választod ki az ajánlatot, a készletet, a napokat és az időablakot. A próba feltételeit együtt rögzítjük.',
    bg: bgTeDontod,
  },
  {
    icon: BarChart3,
    title: 'A beváltás a biztos adat',
    description: 'A saját helyed sikeres QR-beváltásait látod. Utóköltést, átlagos költést és visszatérést csak külön, előre egyeztetett pilotméréssel vizsgálunk.',
    bg: bgAdatok,
  },
  {
    icon: MapPin,
    title: 'HAMAROSAN — Lokáció-alapú push az utcán',
    description: 'A közelben járóknak szóló értesítés egy lehetséges későbbi fejlesztés. A jelenlegi bétában nem működő funkció.',
    bg: bgLokacio,
  },
  {
    icon: DoorOpen,
    title: 'Közös értékelés, külön folytatás',
    description: 'A pilotot egyeztetett ciklusokban értékeljük. Hosszú távú együttműködés csak külön írásos megállapodással jöhet létre.',
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
