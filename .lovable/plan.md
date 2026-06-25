## Cél
A főoldali hero szekció telefon mockupjában az **első** képet (jelenleg `/lovable-uploads/1d253158-a9a3-4377-bfe6-480c7551ca4b.webp` — az, amelyiken nem látszik térkép) lecserélni a most feltöltött screenshotra (Vinozza / Kiscsibe Reggeliző listás nézet).

## Lépések

1. **Asset feltöltés CDN-re**
   - `lovable-assets create --file /mnt/user-uploads/9D01517A-BB98-45D6-BF87-C0D0FC927242.png --filename hero-app-venues.png > src/assets/hero-app-venues.png.asset.json`

2. **`src/pages/Index.tsx` módosítása**
   - Új import: `import heroVenuesAsset from '@/assets/hero-app-venues.png.asset.json';`
   - `appImages` tömb első elemét lecserélni `heroVenuesAsset.url`-re, a második (térképes) elem marad.

## Érintetlen
- `PhoneMockup.tsx`, `HeroSection.tsx` — változatlan, csak a forrás URL frissül.
- A többi oldal és kép (drink, earn, link) érintetlen.
- A régi `1d253158-...webp` fájl marad a `public/lovable-uploads/`-ban (más helyen még lehet rá hivatkozás), csak a hero már nem használja.
