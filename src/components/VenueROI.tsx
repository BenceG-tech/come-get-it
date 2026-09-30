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
              A pilot előtt együtt végignézzük az ajánlat önköltségét és az általad vállalt keretet. A rendszer a QR-beváltást rögzíti; az esetleges további rendelést, átlagos költést és visszatérést csak külön, előre egyeztetett mérési módszerrel vizsgáljuk. Így a döntésed valós adatokon alapulhat, nem feltételezett bevételen.
            </p>

            <div className="border-t border-nf-primary/20 pt-8 mt-8 text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-anton text-nf-primary tracking-tight uppercase leading-[1.05] [text-shadow:0_0_35px_rgba(0,188,212,0.55)]">
                A beváltás tény. A megtérülést együtt vizsgáljuk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
