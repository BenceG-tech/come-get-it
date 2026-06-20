## Cél
A hero CTA gombok mobilon ne legyenek teljes szélességűek (oldaltól oldalig). Desktopon maradjanak az eddigi elrendezésben.

## Változtatások

### HeroSection.tsx
- Az elsődleges és másodlagos hero CTA gombokról eltávolítani a `w-full sm:w-auto` osztályt.
- Mobilon így a gombok a tartalmukhoz igazodó szélességet kapnak, és nem nyúlnak a képernyő széléig.

### VenueHeroSection.tsx
- Ugyanez a két gomb: `w-full sm:w-auto` eltávolítása.

## Nem érintett elemek
- StickyCallToAction: itt a gomb már csak középen, paddinggel jelenik meg, nem teljes szélességű.
- Egyéb oldalakon lévő gombok: csak a hero szekciók gombjai változnak.

## Ellenőrzés
- Mobil nézetben (390–430 px) a gomboknak középre igazítva, tartalomhoz igazított szélességgel kell megjelenniük, olvasható felirattal.