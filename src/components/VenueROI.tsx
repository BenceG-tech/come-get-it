import React from 'react';

export const VenueROI: React.FC = () => {
  return (
    <section id="venue-roi" className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            Számoljunk együtt
          </h2>
        </div>

        <div className="relative rounded-3xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 shadow-[0_30px_80px_-20px_rgba(0,188,212,0.3)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto text-center md:text-left">
              Egy példa — az első beszélgetésen a te számaiddal számoljuk végig: mondjuk a free drink önköltsége 400 Ft. Ha a beváltó vendég rendel mellé még egy kört vagy egy ételt — mondjuk 3 000 Ft értékben —, egyetlen új vendég többszörösen fedezi az ital költségét. A kérdés nem az, hogy ez elméletben igaz-e, hanem hogy nálad, a te időablakodban mennyi lesz a valós utóköltés. Pontosan ezt méri a pilot: beváltás → utóköltés → visszatérés, 30 naponta közösen kiértékelve.
            </p>

            <div className="border-t border-nf-primary/20 pt-8 mt-8 text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-anton text-nf-primary tracking-tight uppercase leading-[1.05] [text-shadow:0_0_35px_rgba(0,188,212,0.55)]">
                Nem mi mondjuk meg, hogy megéri. Az adataid fogják.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

