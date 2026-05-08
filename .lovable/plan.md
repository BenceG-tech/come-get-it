## Vizuális redesign — Főoldal felső szakasz + Come Get It logó

A feltöltött `Transparent_1_copy.png` (átlátszó "Come Get It" script logó) lesz az új márka-vizuál a headerben, footerben, és minden helyen, ahol jelenleg a "Come Get It" szövegmárka jelenik meg. A főoldal felső szekciói átkapnak egy filmes, sötétkék/fekete + cyan glow look-ot a referenciakép alapján. **Tartalom, sorrend, linkek, formok, fordítások, analytics, SEO változatlan.**

### 1. Logó-eszköz

- `user-uploads://Transparent_1_copy.png` → `src/assets/come-get-it-logo.png`
- Új komponens: `src/components/ui/Logo.tsx` — `<img src=... alt="Come Get It" className="h-8 md:h-10 w-auto" />`
- Behelyettesítve:
  - `Navigation.tsx` (a `t('nav.brand')` szövegmárka helyett, link megmarad `/`-ra)
  - `MobileNavigation.tsx` (ua.)
  - `Footer.tsx` (a "Come Get It" h3 helyett)
- Más oldalakon (Vendéglatohelyek, Italmarkak stb.) a Navigation komponensen keresztül automatikusan érvényesül.

### 2. Hero (`HeroSection.tsx`)

- Háttér: filmes Budapest éjszaka kép (`/lovable-uploads/...` meglévő városkép, ha van — különben generálok egyet `src/assets/budapest-night-hero.jpg` néven), sötét navy overlay (`bg-[#050b18]/80` + radial cyan glow).
- Headline 2. sora cyan: `text-nf-primary` a `title_line2` spanre.
- Bal oldal: badge + headline + subtitle + social proof + CTA-k — **szöveg változatlan**, csak tipográfia/spacing.
- Jobb oldal: PhoneMockup nagyobb (`scale-110`), mellette/mögötte cyan glow. **Nem teszek rá szövegdobozt.** A jelenlegi `appImages` marad (a PhoneMockup belül a screenshotot mutatja); ital-vizuált nem rakok mellé, mert új asset-generálás külön kérdés — a meglévő telefonos mockup marad, csak premium glow-val.
- Eltávolítom a régi `hero-shape-1/2` absztrakt formákat — helyette a városi háttér + cyan radial glow-k.

### 3. Hero alatti benefit ikonok

- Jelenleg ezek a `MibenSegitSection` előtt nincsenek külön — a referenciaképen 4 kis ikon (Napi 1 ingyen ital / Pontok & Jutalmak / Adj vissza / Budapesten). **Ezek a sávban már léteznek mint `MibenSegitSection` kártyák** vagy `QuickAccessChips` — ellenőrzöm; ha nincsenek, NEM adok hozzá újat (mert a user szabály: ne változtassunk tartalmat / sorrendet). Csak a meglévő elemeket stilizálom át.

### 4. `MibenSegitSection`

- Glassmorphism: `bg-white/[0.03] backdrop-blur-md border border-nf-primary/20`.
- Ikon: kör (`rounded-full`) cyan vonalas keret, ikon `text-nf-primary` `stroke-[1.5]` (line style), nem gradiens fill.
- Hover: `border-nf-primary/60`, soft cyan box-shadow glow.
- Egységes magasság: `h-full flex flex-col`.

### 5. `HowItWorks` ("Válassz. Menj el. Igyál. Adj vissza.")

- 4 vízszintes glass-step kártya desktopon (változatlan: `lg:grid-cols-4`).
- Kis cyan számbadge (már van), kör line ikon (már van) — finomítva: glassmorphism BG, vékonyabb cyan border.
- Desktop: szaggatott cyan connector vonal a kártyák között (pseudo-element vagy közbenső `<div>`-ekkel a gridben — abszolút pozíciójú szaggatott `border-t border-dashed border-nf-primary/30`, csak `lg:` breakpointon).
- Mobil: 1 oszlop / 2x2 stack.

### 6. `DrinkSection` (első Drink blokk)

- Split layout megmarad. Bal oldal tipográfia premiumosítása (`font-anton`, nagyobb tracking).
- Jobb oldal phone mockup soft cyan glow-val (a meglévő `PhoneMockup` glow-ja már OK, finomhangolás).
- Subtle dark gradient bg: `bg-gradient-to-b from-nf-background via-[#050b18] to-nf-background`.
- **Szöveg, CTA változatlan.**

### 7. Globális finomságok (`index.css`)

- Új utility: `.cyan-glow-soft { box-shadow: 0 0 60px -10px hsl(187 100% 42% / 0.35); }`
- Esetleges szaggatott vonal segéd: `.dotted-cyan-line { border-top: 1px dashed hsl(187 100% 42% / 0.3); }`

### Érintett fájlok

```
src/assets/come-get-it-logo.png           (új — feltöltésből másolva)
src/components/ui/Logo.tsx                 (új)
src/components/Navigation.tsx              (logó csere)
src/components/MobileNavigation.tsx        (logó csere)
src/components/Footer.tsx                  (logó csere)
src/components/HeroSection.tsx             (vizuál: háttér, glow, 2. sor cyan, phone scale)
src/components/MibenSegitSection.tsx       (glass kártyák, line ikonok)
src/components/HowItWorks.tsx              (glass + dotted connector)
src/components/DrinkSection.tsx            (premium split, glow, gradient bg)
src/index.css                              (új cyan glow utility-k)
```

### Amit NEM változtatok

- Egy szó copy / fordítás sem.
- Sorrend, route-ok, formok, gombok funkciója, analytics eventek, SEO meta-k.
- Más oldalak (Vendéglatohelyek, Italmarkak stb.) layoutja — csak a logó frissül a megosztott Navigation/Footer-en keresztül.

Jóváhagyás után megépítem.