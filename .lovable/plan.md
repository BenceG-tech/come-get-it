## Finomítás a `MibenSegitSection`-ön

Két apró változtatás, semmi más:

### 1. Editorial sorszámok eltávolítása
A bal felső sarokban lévő `01 — 04`, `02 — 04` stb. monospace számozás teljesen kikerül. Csak a kis ikon-chip marad ott.

### 2. Kártyák méretének visszafogása
Jelenleg `sm:grid-cols-2` + `aspect-[4/3]` + `max-w-6xl` → desktopon ~620px széles képek lettek, túl dominánsak.

Javaslat:
- **Visszaváltás 4 oszlopos gridre desktopon**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Kép-arány: `aspect-[3/4]`** (portré) — kompaktabb, magazinos
- **Konténer szűkítése**: `max-w-6xl` → `max-w-5xl`
- **Cím méret kisebb**: `text-xl md:text-2xl` → `text-lg md:text-xl`
- **Ikon-chip változatlan** (8×8, sarokban)
- **Hover-on csúszó leírás megmarad** változatlan logikával

### Mi marad érintetlen
- A 4 új kép (`reggeli/ebed/beulos/bulizas.jpg`).
- Szekció fejléc + subtitle.
- Cyan glow, hover lift, alsó fade a címhez, border viselkedés.
- I18n kulcsok.

### Érintett fájl
- `src/components/MibenSegitSection.tsx` — két apró edit (sorszám-blokk törlése + grid/arány/cím méret tweak).