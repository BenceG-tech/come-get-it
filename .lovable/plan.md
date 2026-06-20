# Gombok letisztítása — kisebb, lekerekített, halványabb glow

## Cél
A főoldal hero CTA-i és az egész alkalmazás gombjai (`Button` komponens) legyenek vizuálisan letisztultabbak: kompaktabb méret, lágyan lekerekített sarkok (rounded-lg), visszafogottabb cyan glow. A neon-fidelity karakter megmarad, de prémium / profi érzet erősödik. Olvashatóság és tap-target méret mobilon is garantált (min. 40px érintőfelület).

## Változtatások

### 1. `src/components/ui/button.tsx` — globális variánsok
- **Alap méretek kompaktabbra:**
  - `default`: `h-10 px-4` → `h-9 px-3.5 text-[13px]`
  - `sm`: `h-9 px-3` → `h-8 px-3 text-xs`
  - `lg`: `h-11 px-8` → `h-10 px-6 text-sm` (hero/CTA-kra)
  - `icon`: `h-10 w-10` → `h-9 w-9`
- **Lekerekítés egységesen `rounded-lg`** (default/sm/lg/icon — most vegyes `rounded-md`).
- **`neon` variáns letisztítva:**
  - Megmarad: `bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-semibold`
  - `rounded-full` → `rounded-lg` (lágyabb, modernebb)
  - `font-bold` → `font-semibold` (kevésbé harsány)
  - `shadow-neon-strong` → finomabb `shadow-[0_4px_20px_-4px_rgba(0,188,212,0.35)]`
  - Hover: `hover:scale-105` → `hover:scale-[1.02]` (visszafogottabb), glow enyhén erősödik `hover:shadow-[0_6px_24px_-4px_rgba(0,188,212,0.5)]`
  - `unified-neon-glow` osztály eltávolítva (ez okozza a túl erős világítást)
- **`outline` változatlan**, csak a magasság kompaktabb.

### 2. Hero CTA-k a főoldalon
A `HeroSection.tsx` (és ahol a `Button variant="neon"` szerepel hero-szerű kontextusban) — nincs külön kód, a fenti variáns-frissítés automatikusan érvényre jut. Ellenőrizzük:
- `src/components/HeroSection.tsx`
- `src/components/VenueHeroSection.tsx`
- `src/components/StickyCallToAction.tsx`

Ha valahol hardcoded `rounded-full` / extra `shadow-neon-strong` van a `className`-ben (felülírja a variánst), azt eltávolítjuk.

### 3. Mobil olvashatóság biztosítása
- Min. érintőfelület: a `lg` méret mobilon is 40px magas marad (`h-10`), így iOS/Android tap-target irányelv teljesül.
- Hero gombok teljes szélességűek mobilon (`w-full sm:w-auto`) — ahol már így van, marad; ahol nem, hozzáadjuk a hero CTA-knál.
- Text contrast ellenőrizve: cyan→ocean gradient + fehér text WCAG AA OK.

## Érintett fájlok
- `src/components/ui/button.tsx` (variáns- és méret-finomítás)
- `src/components/HeroSection.tsx` (hardcoded className tisztítás, ha kell)
- `src/components/VenueHeroSection.tsx` (ua.)
- `src/components/StickyCallToAction.tsx` (ua.)

## Amit NEM csinálunk
- Nem nyúlunk a színpalettához (electric/ocean marad).
- Nem cseréljük le a teljes Neon Fidelity stílust — csak a gombok finomodnak.
- Admin UI gombokat nem külön kezeljük: a globális `Button` frissítés automatikusan érvényesül ott is, de nem bontunk meg admin-specifikus layoutot.

## Verifikáció
Build után Playwright screenshot mobil (402px) + desktop (1280px) nézetben a `/` route-ról, hero CTA-k láthatóak, gombszöveg olvasható, glow visszafogott.