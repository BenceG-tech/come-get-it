## Changes

### 1. Hero copy (`src/i18n/hu.json` + `src/i18n/en.json`)
Update `accelerator_page.hero` keys:
- `line1`: `"LÉGY OTT,"`
- `line2`: `"AZ ELSŐK KÖZÖTT."`
- `subtitle`: `"A Come Get It Founding Partner Program a budapesti launch előtti exkluzív szakasz. Vendéglátóhelyek, italmárkák és rewards-partnerek számára nyitva — csak az elsőként csatlakozóknak."`

Mirror reasonable English equivalents in `en.json`. CTA, layout, phone mockup, and content below the hero stay unchanged. (Hero in `ComeGetItAccelerator.tsx` already renders once — no duplicate found.)

### 2. Navigation labels → "Founding Partner Program"
- `src/i18n/hu.json` `nav.accelerator`: `"Come Get It Accelerator"` → `"Founding Partner Program"`
- `src/i18n/hu.json` `mobile_menu.accelerator`: `"Gyorsítóprogram"` → `"Founding Partner Program"`
- `src/i18n/hu.json` `mobile_menu.accelerator_desc`: update to `"Exkluzív launch előtti program"` (short supporting line)
- Same updates to `src/i18n/en.json` (`nav.accelerator`, `mobile_menu.accelerator`, `mobile_menu.accelerator_desc`)

URLs unchanged. `Navigation.tsx` and `MobileNavigation.tsx` already reference these keys, no JSX edits needed.

### 3. Footer (`src/components/Footer.tsx` line 22)
Change link text `Accelerator` → `Founding Partner Program`. URL stays `/come-get-it-accelerator`.
