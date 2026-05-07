## Changes

### 1. `src/components/VenueWhyWorth.tsx`
Update the `description` of the second card (`title: 'Nulla pénzügyi rizikó'`) to:

> "Az első 6 hónap teljesen jutalékmentes. Nincs fix havidíj, nincs setup-fee. A free drink költsége a beszerzési árad — egy alacsony marketing-befektetés, amiért egy átlagos 3500 Ft-ot költő vendéget kapsz cserébe."

Title, icon, styling: unchanged.

### 2. `src/pages/Italmarkak.tsx` — Statistics section
Replace the placeholder stats block (246+ / 91% / 250+ / 4.8) with four value-prop cards. Same 2-col-on-mobile / 4-col-on-desktop grid and same `glass-effect` card styling, but content swapped from `icon + number + label` to `icon + title + description`.

Replace the `statistics` array with a `valueProps` array using lucide icons `Target`, `MapPin`, `BarChart3`, `Rocket`:

1. **PRECÍZ CÉLZÁS** — "A Come Get It közössége budapesti, vendéglátóhelyekre járó fiatal felnőtt."
2. **VALÓDI HELYZET** — "A márkád ott van, ahol a fogyasztó épp dönt — nem hirdetésen, hanem a kezében."
3. **MÉRHETŐ HATÁS** — "Beváltások, ízlésvisszajelzések, demográfia — minden adatot megosztunk."
4. **RUGALMAS KAMPÁNY** — "Egy hetes kóstoltatástól országos launch-ig — együtt szabjuk a méretet."

Card markup updated to render: icon (top, electric-300), uppercase bold title, small muted description. Padding bumped slightly (`p-5`) so the description fits cleanly. Remove now-unused `brands_page.stats.labels.*` references in this file (i18n entries left intact in `hu.json`/`en.json` since unused keys are harmless).

No other sections touched.