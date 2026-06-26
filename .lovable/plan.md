## Cél
A `HowItWorks.tsx` 4 kártyájának ikonjait élővé tenni — diszkrét, mégis figyelemfelkeltő animációkkal, framer-motion-nel. Nem rakunk háttérképet vagy textúrát; a változás kizárólag az ikon-medálon belül történik.

## Megközelítés
- Új komponens: `src/components/how-it-works/AnimatedStepIcon.tsx`
- Egy `kind` prop alapján (`choose` / `walk` / `drink` / `give`) eltérő animáció minden kártyához
- Mindegyik animáció **folyamatos, lassú loop** (4-6 mp), `viewport={{ once: false }}` + `whileInView`, hogy csak akkor pörögjön, ha látszik. Hover esetén kicsit gyorsul.
- A számbadge (1-4) körül enyhe pulzáló halo gyűrű (cyan glow), `motion.div` `animate={{ scale, opacity }}` 2 mp loop.

## Animációk kártyánként

1. **Válassz — MapPin (térkép tűhegy)**
   - A tű enyhén lebeg fel-le (`y: [0, -4, 0]`)
   - Alatta egy SVG koncentrikus "radar pulzus" gyűrű, ami szétterjed és elhalványul (loop)

2. **Menj el — Footprints (lépések)**
   - Két lábnyom váltakozva villan fel (bal-jobb-bal-jobb), `opacity` lépcsőzés
   - Enyhe horizontal drift (`x: [0, 2, 0]`)

3. **Igyál — Wine (pohár)**
   - A pohár SVG-jén belül egy folyadékszint emelkedik-süllyed (cyan gradient fill mask animáció), vagy egyszerűbben: pohár enyhe billegése (`rotate: [-3, 3, -3]`) + felül egy kis buborék emelkedik
   - Megoldás: SVG-be wrappolt Wine ikon + egy kis cyan kör ami felfelé úszik és elhalványul (buborék)

4. **Adj vissza — HeartHandshake**
   - A szív rész lüktet (`scale: [1, 1.15, 1]`, 1.2 mp loop)
   - Cyan glow pulzál a háttérben szinkronban

## Technikai megvalósítás
- `framer-motion` már a projektben van (project knowledge alapján)
- A meglévő `<card.icon className="w-7 h-7 text-nf-primary" />` helyére `<AnimatedStepIcon kind={card.kind} />` kerül
- Desktop és mobile változat is ezt használja
- `prefers-reduced-motion` esetén az animációk leállnak (a `motion` ezt natívan tudja respektálni `useReducedMotion()` hookkal)

## Érintett fájlok
- `src/components/how-it-works/AnimatedStepIcon.tsx` (új)
- `src/components/HowItWorks.tsx` (icon swap + opcionális halo a badge köré, `kind` mező a cards tömbbe)

## Mit NEM csinálunk
- Nincs új háttérkép, nincs textúra, nincs dot grid
- A kártya háttér és border változatlan
- A timeline rail (számok + szaggatott vonal) változatlan
