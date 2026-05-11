## Változtatások

### 1. Hero — törésvonal eltávolítása
A `HeroSection.tsx`-ben a Parliament háttérkép alsó/felső maszkjából eredő látható "vágás" mellett a parliament-kép sávhatára egy vízszintes csíknak látszik. Az `img` mask-ját lazítom (puhább fade) + esetleges `bg-gradient` találkozást teljes egészében átfedő gradient-tel takarom, hogy ne legyen éles átmenet. (A `ReflectionFloor`-ből a horizon glow-t korábban már kivettük.)

### 2. Új koktélpohár (4. csatolt kép)
- Bemásolom: `user-uploads://Runway_..._Szerkesztve.png` → `src/assets/cocktail-pour.png`
- `HeroSection.tsx`-ben a meglévő `cocktail-glass.png` helyett ezt importálom.
- Pozíció: a telefon **jobb oldalára** kerül (jelenleg balra van, kód: `flex items-end justify-center` és az `img -ml-6`). Átállítom úgy, hogy a pohár a telefon jobb oldalán legyen, kissé lejjebb és kicsit jobbra dőlve (kb. `rotate-[8deg] translate-x-4 translate-y-6`), nagyobb méret (`w-44 xl:w-56`), drop-shadow megmarad. A kép maga már úgy néz ki mintha felülről töltenék, így a dőléssel ezt erősítjük.
- Mobilon is megjelenik kicsiben (`block w-28` a phone mellett jobbra), nem csak desktopon — vagy maradhat csak desktop, ha túl szűk; alapértelmezésnek desktop-only marad, mobilon kihagyom hogy ne torlódjon.

### 3. Kártya háttérképek cseréje (Hova üljünk be / Hol bulizzunk / Jótékonysági partner)
A jelenlegi `lounge-evening.jpg`, `nightclub-party.jpg`, `charity-water.jpg` képek nem tetszenek. Újragenerálok 3 új képet `premium` minőségben, sötétebb, atmoszférikusabb és relevánsabb stílusban:
- `lounge-evening.jpg` → modern sötét lounge mély tealgreen/cyan ambient fénnyel, plüss bársony fotelek, üres koktélasztal, finom bokeh — nincs zsúfoltság
- `nightclub-party.jpg` → finomabb klub környezet, lézersugarak helyett puha cyan/magenta ambient, sziluettes tánctér, kevésbé "rave"
- `charity-water.jpg` → tiszta vízcsepp makró sötét háttéren cyan visszaverődéssel, minimalista (jelenleg már ilyen, de sötétebb verzió)

### 4. Kártyák egy árnyalattal sötétebbek
A `glass-image-card.tsx` overlay-ben:
- alap kép opacity: `0.55` → `0.45`
- hover opacity: `0.8` → `0.7`
- sötét gradient erősítése: `rgba(3,7,13,0.55) → 0.25 → cyan 0.08` helyett `rgba(3,7,13,0.7) → 0.4 → cyan 0.08`

### Érintett fájlok
- `src/components/HeroSection.tsx` (parliament mask + cocktail import/pozíció)
- `src/components/ui/glass-image-card.tsx` (overlay finomítás)
- 3 új generált asset: `lounge-evening.jpg`, `nightclub-party.jpg`, `charity-water.jpg` (felülírás)
- 1 új másolt asset: `src/assets/cocktail-pour.png`
