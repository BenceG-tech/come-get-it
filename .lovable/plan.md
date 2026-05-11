## Cél
A hero szekciók aljáról és a Footer tetejéről eltüntetni a kékes-fekete (#03060d / #03070d) sávot, hogy egységes brand fekete (#050505 = `bg-nf-background`) legyen mindenhol.

## Miért látszik csak nálad?
A `#03060d` valójában enyhén kékes-fekete (RGB 3,6,13 — kékkomponens kétszerese a vörösnek). A MacBook Air M4 panel sRGB-ben pontosan rendereli, így a határvonal a `#050505` szekciókkal csak nagyon közelről látható. A te külső monitorod feltehetően vagy szélesebb gamut (P3/AdobeRGB), vagy hidegebb fehérpontra van kalibrálva — mindkettő felerősíti a kék árnyalat különbségét. Tehát nem rosszul kalibrált a Mac, csak elnézőbb. A javítás után minden monitoron egységes lesz.

## Változtatások

1. **`src/components/HeroBackground.tsx`** (36, 37)
   - `from-[#03060d] via-[#03060d]/85` → `from-nf-background via-nf-background/85`

2. **`src/components/HeroSection.tsx`** (48, 50)
   - Ugyanaz a két fade csere

3. **`src/components/VenueHeroSection.tsx`** (38, 39, 41)
   - Mindhárom fade (top, bottom, left) cseréje ugyanígy

4. **`src/components/Footer.tsx`** (11)
   - `bg-gradient-to-b from-[#03070d] to-black` → `bg-nf-background`
   - Border-top és minden más marad

## Mit NEM változtatok
- Hero parlament-kép, cyan glow, layout, animációk
- Footer tipográfia, ikonok, linkek
- Semmilyen más szekció

## Eredmény
A hero átmenet alja és a Footer tökéletesen egybeolvad a fölöttük lévő szekciókkal — eltűnik a kék sáv minden monitoron.
