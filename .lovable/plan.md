## Cél
A `MibenSegitSection` (4 kártya: Reggeli / Ebéd / Beülős / Bulizás) újratervezése úgy, hogy:
- Vizuálisan **eltérjen** a most frissített `BenefitsSection`-től (ne ugyanaz a recept).
- A **képek érvényesüljenek**: kevesebb sötét overlay, kisebb ikon, rövidebb / diszkrétebb szöveg-takarás.
- A "Neon Fidelity" stílus megmaradjon (nf-background, cyan accent, font-anton, pill-szerű részletek).

## Új vizuális koncepció — "Editorial Frames"
A Benefits 5 db sűrű, sötét overlayes portré-kártyája helyett egy **magazin-szerű, levegős** layout:

- **2×2 grid** nagyobb képkockákkal (desktop: `lg:grid-cols-2`, mobil: `grid-cols-1`), `aspect-[4/3]` — tájkép-arány a portré helyett.
- A **kép a kártya teljes felületét** kitölti, **overlay nélkül** (nincs sötét gradient a tetején). Csak a **legalsó ~25%-on** egy lágy, alulról induló fade (`from-nf-background/95 to-transparent`), ami csak a címsort hangsúlyozza.
- A **ikon kikerül a kép közepéből**: apró, vékony körvonalas ikon-chip a **bal felső sarokban**, ~32px (a Benefits 40px medálnál kisebb és diszkrétebb), `bg-nf-background/40 backdrop-blur` — éppen csak jelzi a kategóriát, nem dominálja a képet.
- **Cím**: nagy, `font-anton uppercase`, csak a kép alján egy keskeny sávon, egy soros (a leírás default-ban **nem látszik**).
- **Leírás**: csak **hover-on** csúszik fel alulról egy fél-átlátszó cyan-tinted sávon (`translate-y` animáció), így a kép alapból tiszta marad.
- **Keret**: vékony `border-nf-primary/15`, hover-on `border-nf-primary/60` + finom cyan glow (azonos a Benefits-szel a brand-konzisztencia miatt, de a layout maga eltér).
- **Sorszám**: bal felső ikon mellett egy halvány `01 — 04` monospace számozás (editorial érzet).
- **Szekció fejléc**: marad a `font-anton` cím, alá egy rövid kísérő mondat (subtitle) kerül, hogy a szekció ne ugorjon rögtön a gridre.

## Új képek
A jelenlegi 4 kép (`src/assets/miben-segit/reggeli.jpg`, `ebed.jpg`, `beulos.jpg`, `bulizas.jpg`) lecserélése **premium tier**-en, **tájkép arányban (1280×960)**, hogy az új 4:3 kockákban natívan jól nézzenek ki és ne kelljen erősen croppolni.

Kép-irányelvek (mind sötét, cinematográf, cyan/neon highlightokkal — Neon Fidelity):
1. **reggeli.jpg** — Sötét, hangulatos kávézó reggeli fénnyel: gőzölgő specialty kávé közelről, fa pult, oldalról beeső meleg fény, háttérben blur croissant. Cyan reflexió üvegen.
2. **ebed.jpg** — Modern bisztró-jelenet felülnézetből: két tányér, kéz pohárral, sötét asztal, fókuszált természetes fény, minimalista plating.
3. **beulos.jpg** — Esti koktélbár intim szöglete: bőr boksz, gyertyafény, két pohár, háttérben bokeh palackok cyan neon visszfénnyel.
4. **bulizas.jpg** — Klub vagy rooftop éjjel: emelt kéz pezsgőspohárral, mozgásban lévő tömeg sziluettje, cyan/magenta fényfestés, filmes motion blur.

Minden képnél: **nincs felirat / logo / arc-fókusz**, csak hangulat — hogy a kis chipnek és címnek legyen helye az ikon ne ütközzön semmivel.

## Mi marad változatlan
- Szekció id (`miben-segit`), háttér (`bg-nf-background nf-section-glow`), a felső radial cyan glow.
- I18n kulcsok (`miben_segit.cards.1..4.title/description`) — csak egy új `subtitle` kulcs jön hozzá HU + EN-ben.
- Ikon-választás (`Coffee`, `UtensilsCrossed`, `Sofa`, `PartyPopper`).
- A többi szekció érintetlen.

## Technikai részletek
- Fájlok:
  - `src/components/MibenSegitSection.tsx` — teljes újraírás az új layout szerint.
  - `src/assets/miben-segit/{reggeli,ebed,beulos,bulizas}.jpg` — felülírás `imagegen` premium-mel, 1280×960 (4:3).
  - `src/i18n/hu.json` + `en.json` — új `miben_segit.subtitle` kulcs.
- Animáció: tisztán Tailwind `transition-all duration-500` + `group-hover:translate-y-0` a leírás-sávra (kezdetben `translate-y-full`). Nincs új lib.
- Reszponzív: mobil 1 oszlop, sm 2 oszlop, lg 2 oszlop nagyobb képekkel; az ikon-chip minden méretben `w-8 h-8`.

## Mit NEM csinálunk
- Nem nyúlunk a Benefits szekcióhoz.
- Nem váltunk színpalettát.
- Nem adunk hozzá új lib-et (framer-motion, GSAP).
- Nem változtatjuk a kártyák számát vagy sorrendjét.