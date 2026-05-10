## Cél

1. Navigáció átstruktúrálása: a "Dolgozz velünk" dropdown helyett egy egyetlen **Partnerek** link, ami egy új gyűjtő oldalra (`/partnerek`) mutat. Mellette megmarad a Vendéglátóhelyek és a Founding Partner Program. Az `/italmarkak` és `/rewards-partners` route-ok megmaradnak (SEO + a Partnerek oldalról linkelünk rá), csak a fő navból tűnnek el.
2. Új `/partnerek` gyűjtő oldal: hero + 3 nagy kártya-szekció (vendéglátóhely / italmárka / rewards) + záró Founding Partner sáv.
3. Szöveg-fixek a meglévő hero szekciókban (Vendéglátóhelyek, Italmárkák, Rewards, Founding Partner Program).

A design / brand színek / layout érintetlenek maradnak — minden új elem a meglévő `nf-primary` cyan + glass card stílusban készül (ugyanaz a `cardCls` / `chipCls` minta, mint az `Italmarkak.tsx` / `RewardsPartners.tsx` oldalakon).

---

## 1. Navigáció

### `src/components/Navigation.tsx` (desktop)
- A `DropdownMenu` (4 alpontos "Dolgozz velünk") teljesen kikerül.
- Helyette 3 sima link, ebben a sorrendben:
  - Főoldal (a logó már ezt szolgálja, külön nem kell)
  - **Vendéglátóhelyek** → `/vendeglatohelyek`
  - **Partnerek** → `/partnerek` (új)
  - **Founding Partner Program** → `/come-get-it-accelerator`
- A Drink/Link/Earn/Give scroll-gombok maradnak változatlanul (ezek nem oldalak, hanem főoldali szekciók).

### `src/components/MobileNavigation.tsx`
- Az "Italmárkák" és "Jutalom partnerek" `<li>` blokkok törlése.
- Új `<li>` "Partnerek" beszúrása a Vendéglátóhelyek után, `Handshake` (lucide) ikonnal, `to="/partnerek"`-re mutatva.
- Sorrend: Főoldal → Vendéglátóhelyek → Partnerek → Founding Partner Program → Támogatás.
- Új i18n kulcsok: `mobile_menu.partners` és `mobile_menu.partners_desc` mind HU/EN-ben.

### `src/components/Footer.tsx`
- Az "Oldalak" lista frissítése a fenti 4 elemre (Főoldal, Vendéglátóhelyek, Partnerek, Founding Partner Program). Az Italmárkák és Rewards Partnerek linkek kikerülnek a footer-ből is.

### `src/i18n/hu.json` és `en.json`
- Új kulcs: `nav.partners_link` = "Partnerek" / "Partners" (a meglévő `nav.partners` = "Dolgozz velünk" marad addig, amíg referál rá valami; ha sehol nem használjuk, törlésre kerül).
- Új kulcsok: `mobile_menu.partners`, `mobile_menu.partners_desc`.
- Új kulcsblokk: `partners_page.*` (lásd lent a 2. pont szövegeit).

---

## 2. Új `/partnerek` oldal

### Új fájlok
- `src/pages/Partnerek.tsx` — az oldal komponense.

### Routing — `src/App.tsx`
- Új import: `import Partnerek from "./pages/Partnerek";`
- Új route a catch-all FÖLÖTT: `<Route path="/partnerek" element={<Partnerek />} />`

### Oldal szerkezet (`Partnerek.tsx`)

Wrapper: ugyanaz, mint a többi aloldalon (`min-h-screen bg-black text-white` + `MobileNavigation`, `Navigation`, `Footer`, `CustomerSupport`, `SEO`, `analytics.pageView('partnerek')`).

**Hero szekció** — ugyanaz a háttér-recept, mint a `VenueHeroSection`-ben (HeroBackground + bal oldali sötét overlay), DE a jobb oldalon NINCS phone mockup, mert ez egy gyűjtő oldal. Egyszerű középre zárt szöveg-blokk:
- Badge (cyan pill): `PARTNERPROGRAM — 2026`
- H1 (font-anton, 2 sor): `ÉPÍTSÜK KÖZÖSEN` / `BUDAPEST ÉJSZAKAI ÉLETÉT.` (2. sor `text-nf-primary` glow)
- Sub: `Három különböző módon csatlakozhatsz a Come Get It-hez. Találd meg a tiédet.`

**3 nagy partner-szekció** (egymás alatt, `py-12 px-4`, max-w-5xl, váltakozó `bg-nf-background` / `bg-nf-surface`). Mindegyik egy nagy glass-card:
```
border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 md:p-10
```
Tartalom:
- Phase tag (pill, cyan): "1. FÁZIS — INDULÁS" v. "2. FÁZIS — INDULÁS UTÁN"
- H2 (`font-anton`, white)
- Leíró bekezdés (`text-white/75`)
- 3 bullet — `flex items-start gap-2`, cyan `Check` v. `Sparkle` ikon + szöveg
- CTA gomb: `<Button variant="neon">Részletek <ArrowRight/></Button>` `<Link to="...">` wrapperben + `analytics.ctaClick('partners_page', '<type>')`

A 3 szekció pontos szövege (a user által megadott copy):

1. **Vendéglátóhelyek** → `/vendeglatohelyek`  
   Phase: "1. FÁZIS — INDULÁS". H2: "Vendéglátóhely vagy?". Leírás: "Új vendégeket hozunk a holtidőkben. A napi ingyen ital ad nekik konkrét okot, hogy ma este hozzád menjenek — a többit a hely már intézi." Bulletek: "6 hónap jutalékmentesen" / "Új vendégek a holtidőkben" / "Valós fogyasztói adatok".
2. **Italmárkák** → `/italmarkak`  
   Phase: "2. FÁZIS — INDULÁS UTÁN". H2: "Italmárka vagy?". Leírás: "Mutasd meg az italodat azoknak, akik most döntenek arról, mit isznak. Nem reklámként — első kortyként. Sampling at scale, mérhető eredménnyel." Bulletek: "Precíz célzás Gen Z & Millennial fogyasztókra" / "Real-time sampling-adatok" / "Mérhető brand-aktivációk".
3. **Rewards-partnerek** → `/rewards-partners`  
   Phase: "2. FÁZIS — INDULÁS UTÁN". H2: "Rewards-partner vagy?". Leírás: "A felhasználóink minden költésük után pontot gyűjtenek. Mire váltják be? Erre te válaszolsz. Jegyek, élmények, sportbérlet, beauty, kávé, brunch — bármi, ami egy budapesti fiatalnak érték." Bulletek: "Új közönség elérése" / "Pozitív brand-élmény" / "Mérhető beváltás".

**Záró Founding Partner sáv** (alul, kiemelt cyan-keretes banner, hasonló a `Italmarkak.tsx` final-CTA bannerhez):
- H3 (`font-anton`): "Founding Partner státusz minden kategóriában"
- Szöveg: "Az első 15 vendéglátóhely, az első italmárkák és az első rewards-partnerek lifetime kedvezményt és Founding Partner státuszt kapnak. Csak indulás előtt elérhető."
- CTA: `Founding Partner Program →` linkel `/come-get-it-accelerator`-re.

Minden szöveg i18n-en keresztül, új `partners_page.*` kulcsblokkban (HU + EN egyaránt).

### SEO
- title: `Partnerek — Vendéglátóhely, italmárka, rewards | Come Get It`
- description: `Három mód, ahogyan csatlakozhatsz a Come Get It-hez: vendéglátóhelyként, italmárkaként vagy rewards-partnerként.`
- canonical: `/partnerek`
- BreadcrumbList JSON-LD (Főoldal → Partnerek)

---

## 3. Szöveg-fixek a meglévő oldalakon

Csak i18n értékeket cserélünk, JSX nem változik. Két fájl: `src/i18n/hu.json` (és tükrözve `en.json` az angol megfelelőkkel — a kapcsolódó kulcsok angolja már létezik, csak ha új sztring kerül be).

### Vendéglátóhelyek (`venues.hero.subtitle`)
Új érték: "Új vendégeket hozunk a holtidőkben. A napi ingyen ital ad nekik konkrét okot, hogy ma este hozzád menjenek — a többit a hely már intézi."

### Founding Partner Program (`accelerator_page.hero.subtitle`)
Új érték: "Az első 15 vendéglátóhely, az első italmárkák, az első rewards-partnerek. 6 hónap jutalékmentesen, lifetime kedvezménnyel, közös launch-PR-rel. Csak indulás előtt — utána már nincs ilyen."

### Italmárkák
- `brands_page.hero.line1` = `"AZ ELSŐ KORTYNÁL"`, `brands_page.hero.line2` = `"TALÁLKOZUNK."`
- `brands_page.hero.subtitle` = "Mutasd meg az italodat azoknak, akik most döntenek arról, mit isznak. Nem reklámként — első kortyként. Sampling at scale, mérhető eredménnyel."
- A 2. fázis infobox szövege most hardcoded a `Italmarkak.tsx` 92. során. Új kulcs `brands_page.hero.phase_note` bevezetése + JSX csere `t('brands_page.hero.phase_note')`-ra. Érték: "Az italmárka-aktivációkat a Founding Partner-vendéglátóhelyek aláírása után indítjuk. Most jelentkezhetsz early access-szel — a célközönség és az első kampánytervek nálunk vannak, készen várjuk, hogy közösen bemutassuk."

### Rewards Partners
- `rewards_page.hero.line1` = `"LEGYÉL OTT, AMIKOR"`, `rewards_page.hero.line2` = `"PONTOKAT VÁLTANAK BE."`
- `rewards_page.hero.subtitle` = "A felhasználóink minden költésük után pontot gyűjtenek. Mire váltják be? Erre te válaszolsz. Jegyek, élmények, sportbérlet, beauty, kávé, brunch — bármi, ami egy budapesti fiatalnak érték."
- `rewards_page.hero.cta` = "Csatlakozom rewards-partnerként"
- A 2. fázis infobox most hardcoded a `RewardsPartners.tsx` 141. során. Új kulcs `rewards_page.hero.phase_note` + JSX csere. Érték: "A rewards-partnerprogram a felhasználói bázis kialakulása után, a 2. fázisban indul el. Most jelentkezhetsz early access-szel, hogy a beváltási menüben az elsők között szerepelj, amikor a programot elindítjuk."

---

## Mit NEM változtatunk

- `/italmarkak` és `/rewards-partners` route-ok megmaradnak.
- Ezeknek az oldalaknak minden további szekciója (How It Works, Features, Target, Stats, Final CTA, alkalmazási űrlap, analytics) változatlan.
- Hero phone mockup, glow, layout — érintetlen.
- Brand színek, font, animációk — érintetlen.
- Edge function / Supabase logika — érintetlen.

---

## Érintett fájlok összegzése

- `src/App.tsx` — új route
- `src/pages/Partnerek.tsx` — ÚJ
- `src/components/Navigation.tsx` — dropdown → Partnerek link
- `src/components/MobileNavigation.tsx` — két `<li>` törlés, egy beszúrás
- `src/components/Footer.tsx` — Oldalak lista frissítése
- `src/pages/Italmarkak.tsx` — hero infobox `t()`-re cserélés
- `src/pages/RewardsPartners.tsx` — hero infobox `t()`-re cserélés
- `src/i18n/hu.json` és `src/i18n/en.json` — szövegcserék + új kulcsok (`partners_page.*`, `mobile_menu.partners*`, `*.hero.phase_note`)
