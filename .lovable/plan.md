## Mit változtatok a `MibenSegitSection` kártyákon

Fájl: `src/components/MibenSegitSection.tsx`

1. **Nagyobb ikon** — a bal felső chip 8×8 helyett ~12×12 (md:14×14), ikon 4×4 helyett 6×6 (md:7×7), erősebb cyan glow keret. Áthelyezhető picit beljebb (top-5 left-5).

2. **Sötétebb kép** — a háttérképre fix sötétítő réteg (nem csak alul fade): `absolute inset-0 bg-black/45` + a meglévő alsó gradient marad a szöveg olvashatóságért. Hover-en a sötétítés enyhül (`group-hover:bg-black/30`) hogy „életre keljen".

3. **Más cím-betűtípus** — az `font-anton uppercase` lecserélve nem-display fontra, ami eltér a fő H2-től. Két opció (a `tailwind.config.ts` alapján a projektben elérhető családok közül választok):
   - `font-sans` (Inter) **bold + tracking-wide + uppercase** — letisztult, egyértelműen másodlagos a főcímhez képest.
   - vagy `font-semibold` normál case (Title Case marad a copy-ban) — még lágyabb kontraszt.
   
   Default: **Inter `font-bold uppercase tracking-wider text-base`** — uppercase marad a vizuális ritmusért, de a karakter-rajz (Inter) tisztán elválik az Anton főcímtől.

4. **Alszöveg azonnal látszik** — a hover-only fade-in megszüntetése. A leírás egy mindig látható alsó panelben jelenik meg (sűrű blur háttér, cyan top-border). A cím föléje kerül kisebb méretben, és ott marad — nem tűnik el. Hover-en csak a keret/glow erősödik, és enyhén skálázódik a kép (`group-hover:scale-[1.03]`) a „mozgalom" érzéshez.

### Új kártya-szerkezet (sematikus)

```text
┌────────────────────────┐
│ [icon-chip]            │  ← nagyobb chip, top-left
│                        │
│   (sötétített kép)     │  ← bg-black/45 overlay
│                        │
├────────────────────────┤
│ HOL REGGELIZZEK?       │  ← Inter bold uppercase
│ Rövid leírás, ami      │  ← mindig látható
│ már alapból ott van.   │
└────────────────────────┘
```

A panel nem hover-függő → mobilon is azonnal informatív (ami most a 402px viewporton problémás, mert a leírások csak hover-en jelennek meg, érintőn pedig egyáltalán nem).

### Mit NEM piszkálok
- Háttérképek, ikonok kiválasztása, fordítási kulcsok, szekció-cím, glow gradient — marad.
- Más szekciók kártyái — marad.

### Érintett fájl
- `src/components/MibenSegitSection.tsx` (egyetlen fájl)

Jóváhagyás után megcsinálom.