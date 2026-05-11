## Mobil 2×2 grid a `MibenSegitSection`-ben

Jelenleg mobilon `grid-cols-1` (egymás alatt 4 nagy portré-kártya). Kérés: **mobilon is 2×2** legyen.

### Változtatás
- `MibenSegitSection.tsx` grid osztály:
  - **Régi:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6`
  - **Új:** `grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6`
- Mobilon a kisebb kártyákhoz finomítás (csak ha `<sm`):
  - Cím: `text-lg md:text-xl` → `text-base sm:text-lg md:text-xl`
  - Belső paddingek (`left-5 right-5 bottom-5`, ikon `top-4 left-4`) maradnak — még jól férnek `~165px` széles kártyán.

### Mi marad
- Portré arány (`aspect-[3/4]`), ikon-chip, hover-csúszó leírás, fade, glow, képek.
- Tablet és desktop layout (sm/lg breakpoint) változatlan.

### Érintett fájl
- `src/components/MibenSegitSection.tsx` — egy sor grid + egy cím-osztály tweak.