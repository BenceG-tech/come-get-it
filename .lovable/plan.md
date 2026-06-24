## Cél
A főoldali `VenuePartnerTeaser` szekció 3 kártyájához (ÚJ VENDÉGEK / NULLA RIZIKÓ / VALÓDI INSIGHT) képeket adok ugyanazzal a layouttal, amit a `MibenSegitSection` és `BenefitsSection` használ — így vizuálisan konzisztens lesz, és élnek a kártyák.

## Új AI-generált képek (`src/assets/venue-teaser/`)
Mindegyik cinematic, dark moody, cyan (#00bcd4) neon glow, Budapest nightlife DNA.

1. **uj-vendegek.jpg** — vendégek belépnek egy meleg fényű bárba, holtidőből élet
2. **nulla-rizko.jpg** — nyitott ajtó / kézfogás bárpultnál, biztonság-érzet
3. **valodi-insight.jpg** — bárpult fölött subtle adat-glow / telefon analytics

## Layout (azonos a többi szekcióval)
- Kártya: `flex flex-col overflow-hidden`, meglévő border + hover glow marad
- Felső blokk: `aspect-[16/10]` háttérkép, subtle top gradient (`from-black/60 to-transparent h-1/3`), bal felül kör-ikon medál (jelenlegi középre igazítás helyett)
- Alsó blokk: `border-t border-nf-primary/20`, padding, cím + leírás (balra igazítva, mint a `VenueWhyWorth`-ben)
- Grid változatlan: `md:grid-cols-3`

## Mit NEM bántunk
- Címek, leírások, ikonok, i18n kulcsok, CTA gomb, szekció heading
- Egyéb szekciók
- Csak a `VenuePartnerTeaser.tsx` változik + 3 új kép

## Sikerkritérium
A 3 kártya képpel jelenik meg a főoldalon, vizuálisan ugyanolyan súlyú, mint a `MibenSegit` / `Benefits` szekciók.
