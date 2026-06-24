## Cél
A `BenefitsSection` (Felhasználók / Vendéglátóhelyek / Italmárkák / Rewards Partnerek / Közösség) kártyáin ugyanaz a probléma, mint korábban a MibenSegit-nél: a kép szinte teljesen el van sötétítve és a szöveg ráül — a releváns vizuális (emberek, polc, üvegek, telefon, közösség) alig látszik.

Ugyanazt a mintát alkalmazom, mint a MibenSegit kártyákon:

### Új felépítés
```
┌────────────────┐
│ ◯ ikon         │
│   KÉP (4:3)    │  ← teljes egészében látszik
├────────────────┤
│ FELHASZNÁLÓK   │  ← szöveg a kép ALATT
│ Több élmény... │
└────────────────┘
```

### Konkrét változások — `src/components/BenefitsSection.tsx`
1. A kártya `aspect-[3/4]` egészként megszűnik. A kártya `flex flex-col`, a kép `aspect-[4/3]`-ra vált és csak a felső blokkot foglalja el.
2. Eltávolítom a teljes sötét gradient overlay-t. Csak egy keskeny felső gradient marad (`from-black/55 to-transparent`, top ~⅓), hogy az ikon-medál tisztán látszódjon.
3. A szöveg kikerül a kép alá, normál flow-ban, külön panelba (`px-4 pt-3.5 pb-4 border-t border-nf-primary/20`), `bg-nf-surface/40` kártya háttéren.
4. Az ikon-medál marad bal felül a képen.
5. Hover effect (border glow, lift, kép finom zoom) megmarad / átvezetve.

### Mit NEM bántunk
- Section cím, képek, i18n kulcsok, grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`).
- Egyéb komponensek.

### Sikerkritérium
Mind az 5 kártyán azonosíthatóan látszik a fő kép (arcok, polc, üvegek, telefon, közösség), és a szöveg külön blokkban van alatta — nem takar.
