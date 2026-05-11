# Mobil overflow javítás — Rewards Partnerek hero

## Probléma
A `/rewards-partners` oldal hero szekciójában mobil nézetben (≤402px) a főcím kilóg a képernyőből. Az Anton font, uppercase, `text-5xl` (48px) méretben a "LEGYÉL OTT, AMIKOR" és "PONTOKAT VÁLTANAK BE." sorok szélesebbek, mint a 370px-es belső tartalmi terület, ezért a szöveg jobbra túlnyúlik (a section `overflow-hidden`-je elrejti a scrollbart, de a vágott szöveg vizuálisan így is csúnya).

A többi hero (HeroSection, VenueHeroSection) rövidebb sorokkal dolgozik, ott nincs hiba — csak a rewards oldal címe hosszabb.

## Megoldás
Csak a `src/pages/RewardsPartners.tsx` hero `<h1>`-ét módosítjuk — kisebb mobil betűméret és tördelést segítő utility-k. Funkcionális/üzleti logika nem változik.

### Konkrét változtatás
A jelenlegi:
```tsx
<h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight uppercase">
```
helyett:
```tsx
<h1 className="text-[2.25rem] xs:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.95] md:leading-[0.9] tracking-tight uppercase break-words">
```

- Mobil: `text-[2.25rem]` (~36px) → "PONTOKAT VÁLTANAK BE." kényelmesen befér 402px alatt is.
- `break-words` biztosítja, hogy szélsőséges esetben se nyúljon túl.
- `leading-[0.95]` mobilon picit lazábbra a kétsoros olvashatóságért, desktopon marad `0.9`.
- `sm`/`md`/`lg`/`xl` méretek érintetlenek — desktop look nem változik.

### Opcionális: alcím
Az alcím `text-base` mobilon már most is jó, nem kell módosítani.

## Érintett fájlok
- `src/pages/RewardsPartners.tsx` — egy sor (a hero `<h1>` className).

## Verifikáció
Mobile preview (402px) — a két címsor a viewporton belül marad, semmi nem lóg ki jobbra.
