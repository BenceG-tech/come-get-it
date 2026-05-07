import React from 'react';

const stats = [
  { value: '~100-150', label: 'új vendég havonta' },
  { value: '75%', label: 'extra-költő arány (átlag 3500 Ft)' },
  { value: '~525 000 Ft', label: 'extra forgalom havonta' },
  { value: '~30-50 000 Ft', label: 'ingyen italok beszerzési költsége' },
];

export const VenueROI: React.FC = () => {
  return (
    <section id="venue-roi" className="py-20 px-4 bg-nf-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Mit hozhat egy átlagos hónap?
          </h2>
        </div>

        <div className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-br from-nf-surface/90 to-black/80 border-2 border-nf-primary/60 shadow-[0_0_50px_rgba(0,188,212,0.25)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nf-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-center text-base md:text-lg text-nf-text-muted mb-8">
              Egy átlagos Come Get It partner havonta:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10">
              {stats.map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-5xl font-anton text-nf-primary tracking-tight mb-2 [text-shadow:0_0_25px_rgba(0,188,212,0.5)]">
                    {s.value}
                  </div>
                  <div className="text-sm md:text-base text-nf-text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-nf-primary/30 pt-8 text-center">
              <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-nf-text-muted mb-3">
                Tiszta extra haszon
              </div>
              <div className="text-4xl md:text-6xl lg:text-7xl font-anton text-nf-primary tracking-tight [text-shadow:0_0_35px_rgba(0,188,212,0.6)]">
                ~475 000 Ft <span className="text-2xl md:text-3xl text-white/80">/ hó</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs md:text-sm text-nf-text-muted/70 max-w-3xl mx-auto leading-relaxed">
          *A számok a UK-piaci Dusk app benchmark-jain és belső modellezésünken alapulnak. A pontos eredmény hely-, kerület- és időszak-függő. Az első 2 hét pilot-mérés alapján közösen kalibrálunk.
        </p>
      </div>
    </section>
  );
};
