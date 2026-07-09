import React from 'react';

export const VenueROI: React.FC = () => {
  return (
    <section id="venue-roi" className="py-20 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-anton uppercase text-white tracking-tight">
            Számoljunk együtt
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/60 max-w-3xl mx-auto">
            Egy példa — a te számaiddal az első beszélgetésen végigszámoljuk.
          </p>
        </div>

        <div className="relative rounded-3xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 shadow-[0_30px_80px_-20px_rgba(0,188,212,0.3)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              Mondjuk, a free drink önköltsége <span className="text-nf-primary font-semibold">400 Ft</span>. Ha a beváltó vendég átlagosan rendel mellé még egy kört vagy egy ételt — mondjuk <span className="text-nf-primary font-semibold">3 000 Ft</span> értékben —, akkor egyetlen új vendég többszörösen fedezi az ital költségét.
            </p>

            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              A kérdés nem az, hogy ez elméletben igaz-e, hanem hogy nálad, a te időablakodban mennyi lesz a valós utóköltés. Pontosan ezt méri a pilot: <span className="text-white">beváltás → utóköltés → visszatérés</span>, 30 naponta közösen kiértékelve.
            </p>

            <div className="border-t border-nf-primary/20 pt-6 mt-4 text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-anton text-nf-primary tracking-tight [text-shadow:0_0_35px_rgba(0,188,212,0.55)]">
                Nem mi mondjuk meg, hogy megéri.
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-anton text-white tracking-tight mt-1">
                Az adataid fogják.
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs md:text-sm text-white/55 max-w-3xl mx-auto leading-relaxed">
          A pilot 30 napos ciklusokban fut. Az első ciklus végén együtt nézzük meg: hány beváltás történt, mennyi volt a valós utóköltés, és megérte-e a te helyeden — nem előre ígért számok, hanem saját adat.
        </p>
      </div>
    </section>
  );
};
