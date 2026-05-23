
# LLM-láthatóság javítása

## Jelenlegi helyzet (jó hír)

A projektben **már fut egy build-időben működő prerender plugin** (`src/seo/prerender-plugin.ts`, `vite.config.ts`-ben aktiválva). Minden publikus route-ra (`/`, `/vendeglatohelyek`, `/italmarkak`, `/rewards-partners`, `/partnerek`, `/come-get-it-accelerator`, `/adatvedelmi-szabalyzat`) statikus HTML generálódik a `dist/`-ben, amelyben szemantikus `<main>`, `<h1>`, `<h2>`, listák és JSON-LD is van. Tehát az LLM-ek **már most látnak alaptartalmat** JS futtatása nélkül.

A `public/llms.txt` és `public/llm.html` is létezik.

## Mi hiányzik

1. A prerendelt `bodyHtml`-ek **rövidek és általánosak** — nincs benne az aktuális GIVE számláló-narratíva, Founding Partner Program, az élő FAQ szekció szövegei, árazási részletek, social proof, „miben segít" 4 lépéses folyamat részletei. Az LLM-ek így csak a vázat látják, nem a teljes pitch-t.
2. A `llms.txt` csak route-linkeket sorol fel, **nem ad át tartalmat** — pedig a spec engedi a tényalapú leírást.
3. A `llm.html` jó, de hiányoznak belőle: Founding Partner Program, várólista bónuszok, partner-onboarding lépések, kapcsolat (Bence Gátai, +36 70 585 2053).
4. Nincs **route-onkénti dedikált AI-narratíva** — pl. `/llm-vendeglatohelyek.html` jellegű strukturált összefoglaló.

## Mit építünk

### A) Prerender `bodyHtml` blokkok bővítése — `src/seo/routes.ts`

Minden route `bodyHtml` mezőjét bővítem a tényleges oldali tartalom **szöveges, szemantikus** lenyomatával. Példa a `/` route-ra:

- Hero: a teljes „Nem tudod, hova menj ma?" + alszöveg
- „Miben segít" 4 kártya: cím + leírás mindegyikről
- GIVE szekció: a teljes narratíva (1 ital = 1 napi tiszta víz, kumulatív számláló)
- Pricing: ingyenes vs. előfizetés (990 Ft/hét, 2 990 Ft/hó) konkrét különbségekkel
- Founding Partner Program rövid leírás + link
- FAQ (legalább 8 Q&A)
- Social proof: hány előregisztráció / célváros
- Footer linkek

Hasonló bővítés:
- `/vendeglatohelyek`: VenueROI számai, VenueWhyWorth pontok, HowItWorksForVenues lépések, VenueKeyFeatures lista, jelentkezési űrlap mezőinek leírása
- `/italmarkak`: brand aktivációs csomagok részletesen, kampánymérés metrikák
- `/rewards-partners`: jutalom-típusok, beváltási flow példák
- `/partnerek`: mindhárom partnertípus 2-3 mondatos összefoglalója + link
- `/come-get-it-accelerator`: programstruktúra, kohort méret, időtartam

Ez tisztán **adatfájl-szerkesztés**, semmilyen React kódot nem érint, az élő weboldal kinézete nem változik. Csak a `dist/<route>/index.html`-ek `#root` belseje lesz dúsabb az LLM-eknek/crawlereknek.

### B) `public/llms.txt` bővítése

A `## Pages` lista alá két új szekciót teszek:

- `## Mi a Come Get It` — 2-3 bekezdés tényalapú leírás (üzleti modell, GIVE, indulási piac, célközönség)
- `## Kulcsadatok` — bullet pontok: árazás, indulási város, kapcsolat, alapító, státusz (waitlist)

A spec szerint a `>` blockquote alá szabad markdown bekezdés mehet.

### C) `public/llm.html` frissítése

- Hozzáadom: Founding Partner Program szekció (mi ez, kik jelentkezhetnek, mit kapnak)
- Frissítem a Kapcsolat blokkot: Bence Gátai, +36 70 585 2053, hello@come-get-it.app
- Bővítem a GYIK-et 5-6 új kérdéssel (Founding Partner, várólistán mi a sorrend, mikor indul élesben, hogyan működik a QR fizetés összekapcsolás, mi van ha nincs partnerhely a közelemben)

### D) `index.html` apró kiegészítés

A `<head>` JSON-LD blokkokba adok egy `FAQPage` schema-t a fő GYIK-kel — Google és LLM crawlerek így strukturáltan megkapják a kérdés-választ.

## Mit NEM csinálunk most

- **Nem váltunk SSR-re** (Next.js/Remix) — túl nagy refaktor, és a prerender ugyanazt nyújtja statikus oldalakra.
- **Nem írunk LLM-eknek screenshot-szolgáltatót** — a screenshot képesség a crawler kliensén múlik (ChatGPT Atlas, Perplexity Comet, Claude tool use tud, sima ChatGPT nem). A jobb prerendert látva ezek az eszközök is pontosabb screenshotot készítenek.
- **Nem módosítjuk a React komponenseket** — a felhasználói élmény és UI változatlan marad.

## Technikai részletek

- Érintett fájlok: `src/seo/routes.ts` (legnagyobb diff), `public/llms.txt`, `public/llm.html`, `index.html` (1 új JSON-LD blokk)
- Build-időben automatikusan érvényesül — Publish után az új `dist/` HTML-ek élesednek
- A pluginban semmit nem kell módosítani, már most pontosan ezt csinálja
- Tesztelhető lokálisan: `npm run build` után `dist/index.html`-t megnézve a `#root` belsejében ott kell lennie a teljes bővített HTML-nek
- Cache: a `og:updated_time`-ot is bumpolom, hogy a social/LLM cache frissüljön

## Várt eredmény

Amikor ChatGPT-nek beilleszted `come-get-it.app`-ot:
- Fetcheli a HTML-t → most már **teljes szöveges tartalmat** kap a kezdőlapról (hero, miben segít, GIVE, pricing, FAQ)
- Ha követi a `<a>` linkeket → minden aloldalon szintén teljes tartalom van
- A `/llms.txt`-ből explicit struktúra
- A `/llm.html`-ből AI-orientált tényösszefoglaló
- JSON-LD-ből gépi olvasható schema (Organization, WebSite, MobileApplication, FAQPage, Service, BreadcrumbList)

A screenshot-képes LLM kliensek (ChatGPT Atlas, Comet) ettől függetlenül tudnak screenshotot készíteni — ezt nem mi szolgáltatjuk, de a gyorsabb és teljesebb HTML miatt a screenshotjaik is hűebbek lesznek.
