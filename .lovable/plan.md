## Mit találtam a súgóban (CustomerSupport widget)

A jobb alsó sarokban lévő ⚪️ chat-buborék mögötti panel három problémát rejt:

### 1. Tartalmi hiba — Pontok & Jutalmak szekció tört
A `getFaqData` mind a `free_drinks`, mind a `points_rewards` esetén ugyanazokat a section-kulcsokat használja (`miert_adunk`, `hogyan_juthatsz`, `miert_nem_latok`…). De a `hu.json` `support.faq.points_rewards.sections` alatt egészen más kulcsok vannak (`mi_az_a_rewards`, `hogyan_szerezhetek_pontokat`, `mire_kolthetem`, `biztonsag`, `kartya_frissitese`, `lejarnak_pontok`, `miert_nem_kaptam_pontot`, stb.). Eredmény: a "Pontok és Jutalmak" kártyára kattintva a kulcs-stringek vagy üres tartalom jelenik meg a megírt 10 cikk helyett. Ezt javítani kell.

### 2. Duplikációk a kódban és UI-on
- A footer navigáció (Home / Üzenetek / Súgó) **4-szer** ki van írva inline (renderFooterNav létezik, de a 3 fő view mégis saját másolatot rendel — ezért inkonzisztens az aktív állapot stílusa is).
- A header (cím + CG/IT körök + bezár gomb) **3-szor** van duplikálva.
- A 4 kategória-kártya kétszer jelenik meg: a Kezdőoldalon és a Súgó tabon, eltérő stílussal — felesleges és kicsit zavaró.

### 3. Nem márkahű design (Come Get It / Neon Fidelity)
- Saját színek (`bg-electric-300`, `bg-ocean-400/600/700`, `bg-green-600`, `bg-red-600`) használata a globális `nf-primary` / design token helyett.
- "CG" és "IT" mini-körök hack-szerűek; ezek helyett a meglévő `Logo` komponens illik.
- Gombok nem pill-shape-ek (Core memo: pill-shaped buttons), és nem használják a `Button variant="neon"` változatot.
- Up/down feedback gombok piros/zöld — kilóg a sötét cyan paletta hangulatából.

---

## Terv

### A) Tartalmi javítás (`src/components/CustomerSupport.tsx`)
- `getFaqData` paraméterezett legyen — kapja meg a section-id-k listáját. A `points_rewards`-hoz a tényleges 10 kulcsot adjuk át, a `free_drinks`-hez a meglévő 7-et.
- Eredmény: a Pontok és Jutalmak alatt megjelenik mind a 10 cikk a már megírt hu/en tartalommal.

### B) Duplikációk megszüntetése
- Egyetlen `renderHeader({ title, compact })` használata mindenhol (home / messages / help / detail) — a "CG/IT" mini-körök helyett a `Logo` komponens kicsiben.
- Egyetlen `renderFooterNav()` minden viewn, az aktív tab prop-ból jön.
- A Kezdőoldalon a 4 kategória-kártya rövidített chip-listára cserélve ("Gyakori témák"), a részletes 4 kártya csak a Súgó tabon marad — így nincs duplikált blokk.

### C) Márkahű design (Neon Fidelity)
- Színek: `bg-electric-300` → `bg-nf-primary`, `hover:bg-nf-primary-hover`. Sötét felületek: `bg-nf-surface`, `bg-nf-surface-alt`, határ: `border-nf-border`, kiemelés: `text-nf-primary`. Semmilyen `green-600`/`red-600` nincs többé.
- Gombok: `Button variant="neon"` használata (pill, glow), CTA-knál a meglévő `shadow-neon` / hover-glow.
- Lebegő trigger gomb (chat-buborék): cyan glow ring, halvány pulzálás (CSS-only, opcionális `animate-pulse`-szal), pill-érzet — méret változatlan.
- Feedback ("Megválaszolta a kérdésed?"): két pill chip, neutrál sötét háttér, cyan kiemelés a kiválasztotton — pipa / X ikonnal.
- Tartalomjegyzék dropdown: jelenlegi stílus marad, de cyan focus-ring.
- Header logó: a "CG / IT" mini-körök helyett `<Logo className="h-6 w-auto" />` és "Come Get It Súgó" felirat.

### D) Apró szöveg-finomítások
- "support.home.greeting_title": `Szia! 👋` → marad, de subtitle: `Miben segíthetünk ma?`
- "support.help.collections_count": `4 gyűjtemény` mellé → `Válassz témát`
- CTA gomb a detail nézet alján: `További kérdés esetén írj nekünk` → marad, de pill + neon variant.

### Érintett fájlok
- `src/components/CustomerSupport.tsx` — refaktor + design token-ek + tartalom-kulcs javítás.
- `src/i18n/hu.json` és `src/i18n/en.json` — csak ha kell mikro szöveg-frissítés (greeting_subtitle).
- Nincs új csomag, nincs új komponens — minden meglévő primitívekre épül.

Nincs üzleti logika módosítás, csak frontend / UI / i18n.
