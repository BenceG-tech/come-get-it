## Cél
A `VenueWhyWorth` szekció ("Miért éri meg neked?") 6 kártyájához hozzáadom ugyanazt a kép+szöveg layoutot, amit a `MibenSegitSection` / `BenefitsSection` használ — így a kártyák vizuálisan élnek, nem csak ikon+szöveg blokkok.

## Új képek (AI-generált, `src/assets/venue-why/`)
Mind cinematic, dark moody, cyan #00bcd4 neon glow, Budapest nightlife/hospitality DNA — illeszkedik a brandhez.

1. **uj-vendegek.jpg** — pezsgő bár / kávézó, vendégek belépnek az ajtón, meleg fények
2. **nulla-rizko.jpg** — kézfogás / "deal closed" hangulat egy bár pultjánál, biztonság-érzet
3. **te-dontod.jpg** — bartender naptárt / órát néz, kiválasztja a happy hour italt (kontroll, választás)
4. **adatok-insight.jpg** — bárpult fölött lebegő subtle grafikon-glow / telefon képernyő analytics adattal
5. **lokacio-push.jpg** — utca éjjel, valaki telefont néz, háttérben világító bár-cégér (geo-push érzet)
6. **kockazatmentes-kilepes.jpg** — nyitott ajtó kifelé, neon "exit" érzet, semmi lock-in

## Layout (azonos a MibenSegit mintával)
- Kártya: `flex flex-col`, `bg-nf-surface/40`, cyan border, hover lift + glow.
- Felső blokk: `aspect-[16/9]` (vagy `[4/3]`) háttérkép, subtle top gradient (`from-black/55 to-transparent h-1/3`), bal felül az ikon-medál marad.
- Alsó blokk: normál flow `border-t border-nf-primary/20`, padding, cím + leírás — a szöveg NEM takarja a képet.
- Grid változatlan: `md:grid-cols-2 lg:grid-cols-3`.

## Mit NEM bántunk
- Címeket, leírásokat, ikonokat, sorrendet, egyéb szekciókat.
- A `BenefitsSection` és `MibenSegitSection` már így néz ki — vizuálisan konzisztens lesz.

## Sikerkritérium
Mindegyik kártyán azonosíthatóan látszik egy téma-releváns kép a szöveg fölött; a "Miért éri meg neked?" szekció ugyanolyan vizuális súlyú, mint a fentebbi szekciók.
