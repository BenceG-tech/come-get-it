## Cél
A főoldali "Miben segít?" szekció kártyáin a hover-effekt finomítása: simább, lassabb átmenet és áttetsző háttér a felugró leírás alatt (full fekete helyett).

## Változások — `src/components/MibenSegitSection.tsx`

**1. Smoother előugrás (description panel)**
- A jelenlegi `translate-y-full → translate-y-0` váltás helyett kombinált fade + slide:
  - Alapértelmezett: `opacity-0 translate-y-6`
  - Hover: `opacity-100 translate-y-0`
- Átmenet finomítása: `duration-700` + `ease-[cubic-bezier(0.22,1,0.36,1)]` (soft "ease-out-expo" érzet) a jelenlegi `duration-500 ease-out` helyett.
- Kép zoom is lassabbra: `duration-[1100ms]` és kisebb skálázás (`group-hover:scale-[1.03]`).

**2. Áttetsző háttér a felugró szöveg alatt**
- A jelenlegi tömör `rgba(5,5,5,0.92→0.98)` gradient lecserélése áttetsző + blur kombóra:
  - `bg-nf-background/55` + `backdrop-blur-md`
  - Felül lágy gradient peremmel (`linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.55) 35%, rgba(5,5,5,0.7) 100%)`), hogy a szöveg olvasható maradjon, de a kép átsejlik.
- Felső border `border-nf-primary/40` → `border-nf-primary/30` (finomabb).

**3. Title fade a hover alatt**
- Hogy ne ütközzön a felugró panellel: a kártya alján lévő `<h3>` hover állapotban `opacity-0` finoman (`transition-opacity duration-500`), mert a felugró szöveg fedi.

**4. Bottom-fade gradient**
- Hover alatt is megmarad, de kicsit gyengítve, hogy a kép áttünése természetesebb legyen.

## Érintetlen
- Layout, grid, méretek, ikonok, i18n kulcsok, desktop megjelenés.
- Csak a `MibenSegitSection.tsx` módosul.
