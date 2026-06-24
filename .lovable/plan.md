## Cél
A `MibenSegitSection` kártyáin a kép nagy részét most eltakarja az alsó szöveges panel + a sötétítő overlay. A kép legyen a főszereplő, a szöveg pedig kompakt, alul, nem rátakarva.

## Új kártya-felépítés (mobil-first, 2x2 grid marad)

```
┌─────────────────────┐
│  ◯ ikon (top-left)  │
│                     │
│      KÉP (4:3)      │  ← teljesen látszik, csak alul finom gradient a kontrasztért
│                     │
├─────────────────────┤
│  HOL REGGELIZZEK?   │  ← külön szövegblokk a kép ALATT, nem rajta
│  Találj helyet...   │     (kártya háttér: nf-background/elevated)
└─────────────────────┘
```

### Konkrét változások a `src/components/MibenSegitSection.tsx`-ben

1. **Kép arány**: `aspect-[3/4]` → `aspect-[4/3]` (alacsonyabb, szélesebb — több vizuális hangsúly a képnek, kevesebb függőleges hely).
2. **Szöveg pozíció**: az `absolute inset-x-0 bottom-0` panel megszűnik. Helyette a szöveg a kép alatt, normál flow-ban, a kártyán belüli külön `<div className="p-4">` blokkban.
3. **Kép sötétítés**: a teljes `bg-black/55` overlay törlődik. Helyette csak egy vékony alsó gradient (`from-black/60 via-black/0`) a kép alsó ~30%-án, hogy az ikon és a kép széle ne ütközzön a háttérrel, de a kép tartalma tisztán látszódjon.
4. **Ikon chip**: marad bal felül, változatlan stílusban (a gradient alatta is olvashatóvá teszi).
5. **Cím szín**: alap fehér, hover `text-nf-primary` (marad). Az aktív/kiemelt kártya logika (a képen a "HOL EBÉDELJEK?" cyan) most globális hover — nem nyúlunk hozzá.
6. **Kártya háttér**: `bg-nf-surface/40` a szöveg-blokk mögé, hogy elváljon a section hátterétől, de illeszkedjen a Neon Fidelity stílushoz.

### Mit NEM bántunk
- Section cím, subtitle, háttér-gradient, glow.
- Képek (`bgReggeli`, `bgEbed`, `bgBeulos`, `bgBulizas`) és i18n kulcsok.
- Grid struktúra (`grid-cols-2 lg:grid-cols-4`).
- Más szekciók/komponensek.

### Sikerkritérium
- Mind a 4 képen tisztán látszik a fő motívum (kávé, étel, kanapé, parti).
- A cím + leírás a kép ALATT van, nem rajta.
- Mobil és desktop nézetben is kiegyensúlyozott a kártya magassága.
- Megmarad a Neon Fidelity hangulat (cyan ikon-chip, border-glow hover).
