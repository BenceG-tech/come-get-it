## Cél

1. **Visszaállítani** az összes value-prop kártyát az eredeti `glass-effect` markup-jára (a `ServiceCard` cseréje miatt több helyen rosszul pozicionálódik a tartalom).
2. **ServiceCard komponenst eltávolítani** a kódból (használat nélkül).
3. **Egységes "futó kék fénycsóva" effektust** (`azure-beam`) bevezetni egyetlen CSS utility osztályként, és minden value-prop kártyára rárakni — ez az egyetlen új vizuális elem.

## 1. Új CSS utility: `.azure-beam` az `src/index.css`-ben

A `@layer utilities` blokkba (a `.unified-neon-glow:hover` után). Modern conic-gradient + `@property` trükk a kártya keretén futó kék fénycsóváért:

```css
.azure-beam { position: relative; isolation: isolate; }
.azure-beam::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--azure-beam-angle, 0deg),
    transparent 0deg 280deg,
    hsl(187 100% 60% / 0.9) 320deg,
    hsl(187 100% 70% / 1) 340deg,
    hsl(187 100% 60% / 0.9) 360deg,
    transparent 400deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: azure-beam-spin 4s linear infinite;
  pointer-events: none;
}
@property --azure-beam-angle {
  syntax: '<angle>'; initial-value: 0deg; inherits: false;
}
@keyframes azure-beam-spin { to { --azure-beam-angle: 360deg; } }
```

Eredmény: a kártya keretén egy kb. 80°-os fényívű azúr csóva fut körbe folyamatosan, 4 másodperces ciklusban. Nincs hover-trigger, mindig megy.

## 2. Visszaállítás — `ServiceCard` cseréje az eredeti markup-ra

Minden alábbi helyen visszaírjuk az eredeti `<div className="glass-effect rounded-... ">` blokkot, **+ hozzáadjuk** az `azure-beam` osztályt a kártya gyökerére:

| Fájl | Sorok | Mit állítunk vissza |
|---|---|---|
| `src/components/VenueWhyWorth.tsx` | 48–58 | `nf-card p-6 md:p-7` 6 kártya |
| `src/pages/Italmarkak.tsx` | 128–139 | "How it works" 4 kártya (number + icon + title + desc) |
| `src/pages/Italmarkak.tsx` | 154–164 | "Features" 4 kártya |
| `src/pages/Italmarkak.tsx` | 177–187 | "Target audience" 3 kártya |
| `src/pages/Italmarkak.tsx` | 194–204 | Value-props 4 kártya |
| `src/pages/RewardsPartners.tsx` | 181–192 | "How it works" 4 kártya |
| `src/pages/RewardsPartners.tsx` | 219–229 | "Features" 2 kártya |
| `src/pages/RewardsPartners.tsx` | 242–252 | "A jutalom-partnerség előnyei" 4 kártya |
| `src/pages/ComeGetItAccelerator.tsx` | 156–167 | "Hogyan működik?" 5 kártya (eredeti `glass-effect` markup `step.number`-rel) |
| `src/pages/ComeGetItAccelerator.tsx` | 189–197 | "Miért válassz minket?" 4 kártya |

Minden visszaállított kártya className-je így alakul (példa):
```tsx
className="azure-beam glass-effect rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300"
```

A `ServiceCard` import sorokat töröljük a 4 fájlból (`Italmarkak.tsx`, `RewardsPartners.tsx`, `ComeGetItAccelerator.tsx`, `VenueWhyWorth.tsx`).

## 3. Takarítás

- `src/components/ui/ServiceCard.tsx` fájl törlése (már nincs használatban).
- `tailwind.config.ts` `boxShadow` blokkban a múltkor hozzáadott `azure`, `azure-strong`, `elegant` tokenek **maradnak** (ártalmatlanok, később jól jöhetnek), nem piszkáljuk.
- `framer-motion` csomag bent marad (a projekt máshol is használja a Memory szerint).

## Tech megjegyzés

- A `conic-gradient` + `@property` + `mask-composite: exclude` kombináció modern böngészőkben (Chrome 105+, Safari 16.4+, Firefox 128+) hardware-gyorsított, JS nélkül animálódik.
- Mivel a `.azure-beam::before` `inset: -1px` és `mask`-kal csak a keretet rajzolja, **nem fed le tartalmat**, és nem kell `overflow:hidden` — a meglévő `glass-effect` belső padding/igazítás érintetlen marad, a tartalom pozicionálási problémák megszűnnek.
- A keret `rounded-xl` / `rounded-2xl` automatikusan öröklődik a `border-radius: inherit` miatt.
