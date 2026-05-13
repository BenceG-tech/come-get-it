/**
 * Shared SEO/route data — BROWSER + NODE SAFE.
 * Plain TypeScript data only. Do NOT import React, hooks, window, document,
 * or any browser-only API from this file. Imported by both:
 *   - the React <SEO> component (client runtime)
 *   - the build-time Vite prerender plugin (Node)
 */

export const SITE_ORIGIN = "https://come-get-it.app";
export const DEFAULT_OG_IMAGE =
  "https://come-get-it.app/og/og-main-v2.jpg?v=20260513";

export type JsonLd = Record<string, unknown>;

export interface RouteSEO {
  path: string;
  /** dist subdirectory ("" for root index.html) */
  distDir: string;
  title: string;
  description: string;
  h1: string;
  /** Crawlable, semantic HTML body fragment injected inside #root. */
  bodyHtml: string;
  lastmod: string;
  noindex?: boolean;
  priority?: number;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  jsonLd?: JsonLd[];
}

const breadcrumb = (name: string, slug: string): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Főoldal", item: `${SITE_ORIGIN}/` },
    { "@type": "ListItem", position: 2, name, item: `${SITE_ORIGIN}/${slug}` },
  ],
});

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    distDir: "",
    title: "Come Get It – Találd meg, hova menj ma Budapesten",
    description:
      "Mutatjuk Budapest partnerhelyeit, ahol napi ingyen italt, pontokat és jutalmakat kapsz — válassz könnyebben, hova menj enni, inni vagy bulizni.",
    h1: "Nem tudod, hova menj ma?",
    lastmod: "2026-05-06",
    priority: 1.0,
    changefreq: "weekly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Nem tudod, hova menj ma?</h1>
    <p>A <strong>Come Get It</strong> segít eldönteni, hova menj Budapesten. Megmutatja azokat a partnerhelyeket, ahol <strong>napi ingyen italt</strong>, pontokat és jutalmakat kapsz — így könnyebb választani, hol reggelizz, ebédelj, igyál vagy bulizz.</p>
  </header>
  <section>
    <h2>Miben segít?</h2>
    <ul>
      <li><strong>Hol reggelizzek?</strong> – Találj helyet, ahol a napindításhoz extra jutalom is jár.</li>
      <li><strong>Hol ebédeljek?</strong> – Válassz gyorsabban a közeli partnerhelyek közül.</li>
      <li><strong>Hova üljünk be?</strong> – Találj jó helyet kávéra, randira vagy afterworkre.</li>
      <li><strong>Hol bulizzunk?</strong> – Menj oda, ahol az esti program mellé napi ingyen ital is jár.</li>
    </ul>
  </section>
  <section>
    <h2>Hogyan működik</h2>
    <ol>
      <li><strong>Válassz</strong> – Nézd meg, melyik partnerhely ad ma pluszt.</li>
      <li><strong>Menj el</strong> – Indulj el oda, ahol tényleg megéri beülni.</li>
      <li><strong>Igyál</strong> – Használd ki a napi ingyen italod és gyűjts pontokat.</li>
      <li><strong>Adj vissza</strong> – Minden beváltott ital egy nap tiszta ivóvizet biztosít egy rászorulónak.</li>
    </ol>
  </section>
  <section>
    <h2>Két használati mód</h2>
    <ul>
      <li><strong>Ingyenes verzió:</strong> regisztrálj, gyűjts pontokat és válts be jutalmakat.</li>
      <li><strong>Előfizetés:</strong> 990 HUF / hét vagy 2990 HUF / hó – napi 1 ingyen ital partnerhelyeken.</li>
    </ul>
  </section>
  <section>
    <h2>Csatlakozz a várólistához</h2>
    <p>Az indulás Budapesten kezdődik. <a href="/#signup">Iratkozz fel a várólistára</a>, és elsők között próbálhatod ki.</p>
  </section>
  <nav aria-label="További oldalak">
    <ul>
      <li><a href="/vendeglatohelyek">Vendéglátóhelyeknek</a></li>
      <li><a href="/italmarkak">Italmárkáknak</a></li>
      <li><a href="/rewards-partners">Rewards Partnerek</a></li>
      <li><a href="/come-get-it-accelerator">Come Get It Accelerator</a></li>
      <li><a href="/adatvedelmi-szabalyzat">Adatvédelmi szabályzat</a></li>
      <li><a href="/llm.html">AI/LLM összefoglaló</a></li>
    </ul>
  </nav>
</main>`.trim(),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Mennyibe kerül a Come Get It?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A pontgyűjtős verzió ingyenes. Az opcionális előfizetés 990 HUF/hét vagy 2990 HUF/hó, ami napi 1 ingyen italt tartalmaz partnerhelyeken.",
            },
          },
          {
            "@type": "Question",
            name: "Hol indul először?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Az indulás Budapesten kezdődik, később országos terjeszkedés.",
            },
          },
          {
            "@type": "Question",
            name: "Mi az a GIVE?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Minden beváltott italért egy napi tiszta ivóvizet biztosítunk egy rászorulónak. Az appban visszamenőleg is látod a saját hozzájárulásodat.",
            },
          },
        ],
      },
    ],
  },

  {
    path: "/vendeglatohelyek",
    distDir: "vendeglatohelyek",
    title: "Vendéglátóhelyeknek – Több vendég | Come Get It",
    description:
      "A Come Get It segít, hogy azok találjanak rád, akik épp helyet keresnek Budapesten — az ingyen ital pedig segít, hogy téged válasszanak.",
    h1: "Több vendég. Egyszerűbben.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Vendéglátóhelyeknek – Csatlakozz a Come Get It hálózathoz</h1>
    <p>A Come Get It egy hűségrendszer és forgalomgenerátor magyarországi vendéglátóhelyek számára. Bárok, kávézók és éttermek új vendégeket szereznek, miközben mérhető visszatérést és kampányhatást kapnak.</p>
  </header>
  <section>
    <h2>Kinek szól</h2>
    <ul>
      <li>Bárok, pubok és koktélbárok Budapesten és környékén.</li>
      <li>Kávézók és bisztrók, akik visszatérő vendégekre építenek.</li>
      <li>Éttermek, akik italforgalmat és élményt is kínálnak.</li>
    </ul>
  </section>
  <section>
    <h2>Miért éri meg csatlakozni</h2>
    <ul>
      <li><strong>Új vendégek:</strong> a Come Get It közössége aktívan keres partnerhelyeket.</li>
      <li><strong>Hűségrendszer dobozból:</strong> nincs külön kártya, az app intézi.</li>
      <li><strong>Mérhető forgalom:</strong> valós idejű analitika a beváltásokról.</li>
      <li><strong>Subscription forgalom:</strong> az előfizetők naponta visszatérnek a napi italért.</li>
    </ul>
  </section>
  <section>
    <h2>Hogyan zajlik az onboarding</h2>
    <ol>
      <li>Jelentkezel a partneri űrlapon.</li>
      <li>Egyeztetünk az ajánlatról és a beváltási mechanizmusról.</li>
      <li>QR-kódot és partnerprofilt kapsz – élesedsz az appban.</li>
      <li>Mérjük az első kampányt és optimalizálunk.</li>
    </ol>
  </section>
  <section>
    <h2>Jelentkezés</h2>
    <p>Tölts ki a <a href="/vendeglatohelyek#apply">partneri jelentkezési űrlapot</a>, vagy írj nekünk: <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a>.</p>
  </section>
</main>`.trim(),
    jsonLd: [
      breadcrumb("Vendéglátóhelyeknek", "vendeglatohelyek"),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Come Get It Vendéglátóhely Partneri Program",
        provider: { "@type": "Organization", name: "Come Get It" },
        areaServed: { "@type": "City", name: "Budapest" },
        description:
          "Hűségrendszer, új vendégek és mérhető forgalom vendéglátóhelyek számára.",
      },
    ],
  },

  {
    path: "/italmarkak",
    distDir: "italmarkak",
    title: "Italmárkáknak – Légy ott a fogyasztásnál | Come Get It",
    description:
      "Juttasd el az italodat azokhoz, akik épp helyet választanak Budapesten — kóstolás valódi helyzetben, mérhető eredményekkel.",
    h1: "Légy ott, amikor inni készülnek.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Italmárkáknak – Mérhető fogyasztói aktiváció</h1>
    <p>A Come Get It közvetlen csatornát ad italmárkáknak a fogyasztókhoz a fogyasztás pillanatában. Aktivációk, sponsorship és kampánymérés egy helyen.</p>
  </header>
  <section>
    <h2>Brand aktivációs lehetőségek</h2>
    <ul>
      <li>Termékfókuszú kampányok partnerhelyeken (kóstoltatás, double points, free pour).</li>
      <li>Subscription bundle-ök – a napi ingyen ital lehet a te márkád.</li>
      <li>In-app megjelenések, push és tematikus jutalmak.</li>
    </ul>
  </section>
  <section>
    <h2>Kampánymérés</h2>
    <ul>
      <li>Valós idejű adat a beváltásokról, helyszínekről, időpontokról.</li>
      <li>Demográfiai és viselkedési insightok (anonimizálva, GDPR-konform).</li>
      <li>Konverziós tölcsér: megjelenés → érdeklődés → beváltás.</li>
    </ul>
  </section>
  <section>
    <h2>Sponsorship</h2>
    <p>Lehetőség a Come Get It Accelerator vagy szezonális kampányok exkluzív italpartneri pozíciójára.</p>
  </section>
  <section>
    <h2>Célközönség</h2>
    <p>18–45 éves városi fogyasztók Magyarországon, akik aktívan járnak vendéglátóhelyekre, nyitottak új márkákra és értékelik a felelős fogyasztást.</p>
  </section>
  <section>
    <h2>Kapcsolat</h2>
    <p>Brand kampányért írj nekünk: <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a> vagy tölts ki egy <a href="/italmarkak#apply">érdeklődési űrlapot</a>.</p>
  </section>
</main>`.trim(),
    jsonLd: [
      breadcrumb("Italmárkáknak", "italmarkak"),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Come Get It Brand Activation",
        provider: { "@type": "Organization", name: "Come Get It" },
        areaServed: { "@type": "Country", name: "Hungary" },
        description:
          "Mérhető fogyasztói aktiváció és kampánymérés italmárkák számára.",
      },
    ],
  },

  {
    path: "/rewards-partners",
    distDir: "rewards-partners",
    title: "Rewards Partnerek – Új közönség | Come Get It",
    description:
      "Ajánlj jutalmat azoknak, akik Budapesten keresnek programot vagy új élményt — érj el új közönséget a Come Get It-en keresztül.",
    h1: "Legyél a következő program, amit választanak.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Rewards Partnerek – Kínálj jutalmat, érj el új közönséget</h1>
    <p>A Rewards Partnerek olyan márkák, szolgáltatók és élményszolgáltatók, akik jutalmakat kínálnak a Come Get It közösségének. Cserébe új vásárlókat, márkaismertséget és mérhető beváltást kapnak.</p>
  </header>
  <section>
    <h2>Mit adnak a partnerek</h2>
    <ul>
      <li>Termékminta, kupon, kedvezmény vagy élményutalvány.</li>
      <li>Időszakos exkluzív ajánlatok a Come Get It közösségnek.</li>
      <li>Sorsolásos vagy pontbeváltásos jutalmak.</li>
    </ul>
  </section>
  <section>
    <h2>Miért éri meg</h2>
    <ul>
      <li>Új, célzott közönség elérése extra hirdetési költség nélkül.</li>
      <li>Mérhető beváltás: pontosan látod, ki és mikor váltotta be a jutalmat.</li>
      <li>Pozícionálás egy felelős, közösségi márkaüzenet (GIVE) mellett.</li>
    </ul>
  </section>
  <section>
    <h2>Hogyan váltják be a felhasználók</h2>
    <ol>
      <li>A user pontjaiból vagy előfizetéséből „kiválasztja” a te jutalmadat az appban.</li>
      <li>Egyedi QR-kódot kap.</li>
      <li>A QR-t bemutatja nálad vagy a webshopodban beváltja – mi mérjük a tranzakciót.</li>
    </ol>
  </section>
  <section>
    <h2>Jelentkezés</h2>
    <p>Írj nekünk a <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a> címre, vagy <a href="/rewards-partners#apply">jelentkezz az űrlapon</a>.</p>
  </section>
</main>`.trim(),
    jsonLd: [
      breadcrumb("Rewards Partnerek", "rewards-partners"),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Come Get It Rewards Partner Program",
        provider: { "@type": "Organization", name: "Come Get It" },
        description:
          "Jutalom-katalógus partnerprogram márkák és szolgáltatók számára.",
      },
    ],
  },

  {
    path: "/partnerek",
    distDir: "partnerek",
    title: "Partnerek – Csatlakozz a Come Get It hálózathoz",
    description:
      "Vendéglátóhelyek, italmárkák és rewards-partnerek hub: nézd meg, hogyan dolgozhatsz együtt a Come Get It-tel és kik a már csatlakozott partnerek.",
    h1: "Partnerek",
    lastmod: "2026-05-06",
    priority: 0.7,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Partnerek – Dolgozz együtt a Come Get It-tel</h1>
    <p>A Come Get It három partnertípussal dolgozik: vendéglátóhelyek, italmárkák és rewards-partnerek. Ezen az oldalon megtalálod, melyik program neked való.</p>
  </header>
  <section>
    <h2>Partnertípusok</h2>
    <ul>
      <li><a href="/vendeglatohelyek">Vendéglátóhelyeknek</a> – bárok, kávézók, éttermek számára.</li>
      <li><a href="/italmarkak">Italmárkáknak</a> – aktivációk és kampánymérés.</li>
      <li><a href="/rewards-partners">Rewards Partnerek</a> – jutalmak és élmények kínálata.</li>
      <li><a href="/come-get-it-accelerator">Accelerator</a> – induló partnerek gyorsítóprogramja.</li>
    </ul>
  </section>
  <section>
    <h2>Kapcsolat</h2>
    <p>Írj nekünk: <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a></p>
  </section>
</main>`.trim(),
    jsonLd: [breadcrumb("Partnerek", "partnerek")],
  },

  {
    path: "/come-get-it-accelerator",
    distDir: "come-get-it-accelerator",
    title: "Come Get It Accelerator – Nőj a hálózatunkkal",
    description:
      "Az Accelerator induló vendéglátóhelyeknek és italmárkáknak: mentorálás, közös marketing, beta hozzáférés és kiemelt pozíció a Come Get It-ben.",
    h1: "Come Get It Accelerator – Nőj a hálózatunkkal",
    lastmod: "2026-05-06",
    priority: 0.7,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Come Get It Accelerator – Nőj a hálózatunkkal</h1>
    <p>A Come Get It Accelerator egy célzott program induló és növekedési fázisban lévő vendéglátóhelyeknek és italmárkáknak. Mentorálást, közös marketinget, beta hozzáférést és kiemelt pozíciót adunk a Come Get It hálózatban.</p>
  </header>
  <section>
    <h2>Kinek szól</h2>
    <ul>
      <li>Új vagy 1–3 éves budapesti vendéglátóhelyek, akik gyors növekedést akarnak.</li>
      <li>Független és craft italmárkák, akik elosztást és aktivációt keresnek.</li>
      <li>Innovatív koncepciók (zero-proof, helyi termelők), akik új közönséget céloznak.</li>
    </ul>
  </section>
  <section>
    <h2>Mit adunk</h2>
    <ul>
      <li>Személyes mentorálás vendéglátós és marketing szakértőktől.</li>
      <li>Közös kampányok és médiamegjelenések.</li>
      <li>Beta hozzáférés új app-funkciókhoz és adathoz.</li>
      <li>Kiemelt pozíció a Come Get It in-app felfedezőjében.</li>
    </ul>
  </section>
  <section>
    <h2>Jelentkezés</h2>
    <ol>
      <li>Tölts ki egy rövid jelentkezési űrlapot.</li>
      <li>Bemutatkozó hívás (20 perc).</li>
      <li>Bekerülsz a soron következő Accelerator kohortba.</li>
    </ol>
    <p>Indulás: <a href="/come-get-it-accelerator#apply">Jelentkezem az Acceleratorba</a> vagy írj a <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a> címre.</p>
  </section>
</main>`.trim(),
    jsonLd: [breadcrumb("Come Get It Accelerator", "come-get-it-accelerator")],
  },

  {
    path: "/adatvedelmi-szabalyzat",
    distDir: "adatvedelmi-szabalyzat",
    title: "Adatvédelmi szabályzat – Come Get It",
    description:
      "A Come Get It adatvédelmi szabályzata: milyen adatokat kezelünk, milyen célból, milyen jogalapon, meddig őrizzük, és milyen jogaid vannak.",
    h1: "Adatvédelmi szabályzat",
    lastmod: "2025-08-08",
    priority: 0.3,
    changefreq: "yearly",
    bodyHtml: `
<main data-prerender="true">
  <article>
    <h1>Adatvédelmi szabályzat</h1>
    <p>Hatályos: 2025-08-08</p>
    <p>A Come Get It alkalmazás és weboldal (come-get-it.app) üzemeltetőjeként elkötelezettek vagyunk a személyes adatok védelme mellett. Ez a szabályzat összefoglalja, milyen adatokat kezelünk, milyen célból, milyen jogalapon, meddig őrizzük meg azokat, és milyen jogaid vannak.</p>

    <h2>Adatkezelő</h2>
    <p>Név: Come Get It<br/>E-mail: <a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a></p>

    <h2>Kezelt adatok köre</h2>
    <ul>
      <li>Várólistás regisztráció: e‑mail cím, időbélyeg, forrás/UTM adatok.</li>
      <li>Üzleti jelentkezés: név, e‑mail, telefonszám (ha megadod), cégadatok (ha megadod).</li>
      <li>Hozzájárulások: marketing és kommunikációs beállítások.</li>
      <li>Technikai adatok: IP-cím, böngésző és eszköz adatok, sütikhez kapcsolódó azonosítók.</li>
      <li>Analitika: oldal- és esemény‑mérési adatok (összesített, anonimizált/pszeudonimizált módon).</li>
    </ul>

    <h2>Adatkezelés céljai és jogalapja</h2>
    <ul>
      <li>Várólista és kapcsolatfelvétel: hozzájárulásod alapján (GDPR 6. cikk (1) a)).</li>
      <li>Szolgáltatás fejlesztése és biztonság: jogos érdekünk (GDPR 6. cikk (1) f)).</li>
      <li>Marketing kommunikáció: csak hozzájárulással (bármikor visszavonható).</li>
    </ul>

    <h2>Adatfeldolgozók és címzettek</h2>
    <ul>
      <li>Supabase (adatbázis, Edge Functions, e‑mail értesítések továbbítása).</li>
      <li>Google Analytics 4 (forgalom‑ és eseménymérés).</li>
      <li>Hoszting és infrastruktúra szolgáltatók a webalkalmazás üzemeltetéséhez.</li>
    </ul>

    <h2>Sütik (cookie‑k)</h2>
    <p>A működéshez szükséges sütiket és analitikai sütiket használunk. A sütik a böngésződ beállításaiban korlátozhatók vagy törölhetők.</p>

    <h2>Adatmegőrzés</h2>
    <p>A várólistás adatokat legfeljebb az indulást követő 24 hónapig őrizzük meg, vagy az érintetti törlési kérelem beérkezéséig.</p>

    <h2>Érintetti jogok</h2>
    <ul>
      <li>Hozzáférés, helyesbítés, törlés, adatkezelés korlátozása.</li>
      <li>Adathordozhatóság és tiltakozás a jogos érdeken alapuló kezelés ellen.</li>
      <li>Hozzájárulás bármikori visszavonása.</li>
    </ul>

    <h2>Panasz benyújtása</h2>
    <p>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH), 1055 Budapest, Falk Miksa utca 9-11. – naih.hu</p>

    <h2>Kapcsolat</h2>
    <p><a href="mailto:hello@come-get-it.app">hello@come-get-it.app</a></p>
  </article>
</main>`.trim(),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Adatvédelmi szabályzat – Come Get It",
        url: `${SITE_ORIGIN}/adatvedelmi-szabalyzat`,
        inLanguage: "hu-HU",
      },
    ],
  },
];

export const getRouteByPath = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);

export const absoluteUrl = (path: string): string =>
  path.startsWith("http")
    ? path
    : `${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
