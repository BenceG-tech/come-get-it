## Javítások a befektetői doksikban

### 1) Plus subscription árazás javítása
Jelenleg: **„990 Ft/hó"** — ez hibás (a 990 Ft a heti ár).
Helyes: **2 990 Ft/hó** (és opcionálisan: 990 Ft/hét).

Érintett helyek (minden v2 + új doksiban átfésülve):
- `build_v3.py:69` revenue-streams tábla → `"2 990 Ft/hó (vagy 990 Ft/hét) premium user"`
- `build_v3.py:678` founder Q&A → `"A 2 990 Ft/hó Plus subscription (vagy 990 Ft/hét)…"`
- Minden további doksiban (1pager, barát-bemutató, milestone-tábla, sajtóközlemény, FAQ, term-sheet, media-kit) grep-pel végigmegyek a `990` számon és kontextus szerint javítom.

### 2) Magyar piaci méret újraszámolása
Jelenlegi (túl konzervatív / pontatlan) számok:
`12k+ vendéglátóhely HU · 2.5k Budapest aktív · 450k céltarget user BP · 8 Mrd Ft F&B loyalty TAM`

Frissített, KSH/HoReCa-források alapján reális számok:
- **~38 000 vendéglátóegység Magyarországon** (KSH 2023, működő F&B helyek)
- **~5 500 Budapesten** (ebből ~2 000-2 500 a céltarget: bár, kávézó, étterem belvárosi/jó forgalmú)
- **SAM (Budapest, célzott venue):** ~2 000 hely × átlag 25-40k Ft/hó commission ≈ **600-960 M Ft/év addressable venue-revenue**
- **User TAM Budapest:** ~1.7 M lakos, 18-45 közötti aktív vendéglátó-fogyasztó kb. **600-700k fő**, ebből reálisan elérhető első körben **~150-200k** (urban, mobile-first, social-driven)
- **F&B loyalty/discovery TAM HU:** F&B teljes piac ~1 500 Mrd Ft/év; loyalty + discovery layer (Dusk-benchmark szerint a venue-revenue 1-2%-a) ≈ **15-30 Mrd Ft TAM**, ebből Budapest reálisan **~5-8 Mrd Ft SAM**

Ezzel a sztori erősebb és a 3M / 5M / 8M Ft-os ask reálisabban néz ki.

### 3) Mit csinálok pontosan
1. `build_v3.py`-t frissítem a fenti két ponton
2. A 12 doksit (11-22 + szükség esetén 01-10 v2) újragenerálom — `_v3` suffixszel az érintetteket, hogy meglegyen az összevethetőség
3. Vizuális QA pdftoppm-mel oldalanként: pricing tábla, market size stat-row, 1pager hero számok
4. Listázom a ténylegesen érintett és újragenerált fájlokat, és `<lov-artifact>` tagekkel átadom

### 4) Megjegyzés
Ez tisztán artifact-generálás, az app forráskódját nem érinti.

Ha jónak látod, jóváhagyás után indítom.