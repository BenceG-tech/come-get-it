# Cinematic hover effect — minden value-prop kártyára

## Kontextus

A leírt 9-pontos effektus eredetileg egy gazdagabb kártyára készült (háttérkép, top-right kerek ikon overlay, deliverables-lista, „Részletek →" nyíl). A mi `azure-beam glass-effect` kártyáink egyszerűbbek: ikon + cím + leírás. Az effektusból azokat a rétegeket alkalmazzuk, amelyeknek van értelmük a jelenlegi struktúrán — projekt azúr színeivel (`hsl(187 100% 42%)` = `electric-300` / `nf-primary`).

## Mit kapunk hover-re minden `.azure-beam` kártyán

1. **Keret**: `border-white/10` → `border-electric-300/60`, 500ms
2. **Shadow**: semleges → `shadow-azure` (azúr glow a kártya alatt), 500ms
3. **Lebegés**: `-translate-y-1` (lágy emelkedés), 500ms
4. **Ikon (kerek konténer vagy lucide ikon)**: `scale-110 rotate-6`, 500ms — már részben megvan, egységesítjük
5. **Cím (h3/h4)**: fehér → `text-electric-300`, 300ms (már megvan)
6. **Leírás (p)**: `line-clamp-2` → `line-clamp-none` smooth, 500ms ease-out (CSS Grid `0fr` → `1fr` trükkel azokon a kártyákon, ahol a leírás hosszú)
7. **Alsó accent vonal**: `h-0.5 bg-gradient-to-r from-transparent via-electric-300 to-transparent`, `scale-x-0` → `scale-x-100`, `origin-left`, 700ms — új réteg a kártya aljához
8. **Futó azúr beam** a kereten: marad ahogy van (már működik hover-re)

Kihagyott rétegek (mert nincs hozzá UI elem): háttérkép Ken Burns zoom, sötét gradiens overlay, top-right floating ikon transform, "Részletek →" nyíl.

## Implementáció

**`src/index.css` — bővítjük a `.azure-beam` utility-t** (egy helyen, hogy minden kártyán automatikusan érvényesüljön):

```css
.azure-beam {
  position: relative;
  isolation: isolate;
  transition: border-color 500ms, box-shadow 500ms, transform 500ms;
}
.azure-beam:hover {
  border-color: hsl(187 100% 60% / 0.6);
  box-shadow: 0 20px 60px -10px hsl(187 100% 42% / 0.55);
  transform: translateY(-4px);
}

/* Alsó accent vonal — minden .azure-beam után */
.azure-beam::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, hsl(187 100% 50%), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 700ms ease-out;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
}
.azure-beam:hover::after { transform: scaleX(1); }

/* Leírás kibontás (opt-in: szülő .azure-beam, gyermek .azure-clamp) */
.azure-beam .azure-clamp {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 500ms ease-out;
}
.azure-beam:hover .azure-clamp { grid-template-rows: 1fr; }
.azure-beam .azure-clamp > * { overflow: hidden; }
```

**Ikon hover egységesítés**: ahol az ikon nincs `group-hover:scale-110 group-hover:rotate-6 transition-all duration-500` osztályokkal ellátva, kiegészítjük a 4 érintett fájlban (`Italmarkak.tsx`, `RewardsPartners.tsx`, `ComeGetItAccelerator.tsx`, `VenueWhyWorth.tsx`). A kártya gyökér `<div>`-jén már `group` osztály van.

**Leírás-clamp opt-in**: a kompaktabb kártyákon (Italmarkak features/target/valueProps, Rewards features/valueProps) a `<p>` köré egy `<div className="azure-clamp">` wrapper kerül a smooth height animációhoz. A nagyon rövid leírású kártyákon (How it works számozott lépések) elhagyjuk — ott nincs vágni való.

**Színek**: a custom property-ket `hsl(187 100% 42%)` (azúr / nf-primary) értékkel használjuk, hogy 1:1 illeszkedjen a Neon Fidelity palettához.

## Hatókör

- `src/index.css` — `.azure-beam` utility bővítése (egyetlen helyen, globálisan minden kártyára)
- `src/components/VenueWhyWorth.tsx` — ikon hover osztályok
- `src/pages/Italmarkak.tsx` — ikon hover + `azure-clamp` wrapper a `<p>`-k köré (4 grid)
- `src/pages/RewardsPartners.tsx` — ugyanaz (3 grid)
- `src/pages/ComeGetItAccelerator.tsx` — ikon hover + `azure-clamp` (2 grid)

A kártyák mérete, pozícionálása és layoutja **nem változik** — csak hover-állapotok és egy alsó dekoratív vonal.
