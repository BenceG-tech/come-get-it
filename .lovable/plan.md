# HU mobil overflow javítás — Rewards Partnerek hero (folytatás)

## Probléma
A magyar fordítások hosszú, nem-tördelhető szavakat tartalmaznak ("rewards-partner­program", "rewards-partnerként", "felhasználóink", "költésük"), amelyek mobilon (402px) kilógnak a viewportból. Az angol verzió rövidebb / könnyebben tördelhető szavakat használ, ezért ott nem látszik a hiba.

Konkrétan túlnyúlik:
1. Az alcím `<p>` ("A felhasználóink minden költésük után pontot…")
2. A "phase_note" doboz ("A rewards-partnerprogram a felhasználói bázis…")
3. A CTA gomb ("Csatlakozom rewards-partnerként") — a hosszú szó nyújtja szét a gombot a viewporton túl.

## Megoldás
Csak a `src/pages/RewardsPartners.tsx` hero blokk presentational módosítása — szó-tördelést engedélyezünk ezekre az elemekre.

### Konkrét változtatások

1) Alcím:
```tsx
<p className="text-base md:text-lg ... max-w-xl mx-auto lg:mx-0 break-words [hyphens:auto]">
```

2) Phase-note doboz:
```tsx
<div className="... text-sm text-white/70 break-words [hyphens:auto]">
```

3) CTA gomb — engedjük tördelni a szöveget mobilon, hogy ne nyújtsa szét a gombot:
```tsx
<Button
  variant="neon"
  size="lg"
  className="py-4 px-6 sm:px-10 text-base sm:text-lg max-w-full whitespace-normal break-words [hyphens:auto] text-center"
  ...
>
```

A `[hyphens:auto]` Tailwind arbitrary utility a CSS `hyphens: auto`-t adja hozzá, ami magyar `lang="hu"` mellett automatikusan elválasztja a hosszú szavakat. Ha a böngésző nem támogatná, a `break-words` (`overflow-wrap: break-word`) garantálja, hogy a hosszú szó megtörjön a konténer szélénél.

Funkcionális/üzleti logika nem változik, csak Tailwind className-ek bővülnek.

## Érintett fájlok
- `src/pages/RewardsPartners.tsx` — három className módosítás a hero szekcióban (kb. 145–175 sor körül).

## Verifikáció
Mobile preview (402px), HU nyelv: alcím, phase-note és gomb a viewporton belül marad; hosszú szavak elválasztva vagy tördelve. Desktop megjelenés változatlan.
