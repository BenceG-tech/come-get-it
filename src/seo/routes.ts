/**
 * Shared SEO/route data — BROWSER + NODE SAFE.
 * Plain TypeScript data only. Do NOT import React, hooks, window, document,
 * or any browser-only API from this file. Imported by both:
 *   - the React <SEO> component (client runtime)
 *   - the build-time Vite prerender plugin (Node)
 */

export const SITE_ORIGIN = "https://come-get-it.app";
export const DEFAULT_OG_IMAGE =
  "https://come-get-it.app/og/og-main-v3.jpg?v=20260513b";

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
      "Ingyenes béta: mutatjuk Budapest partnerhelyeit, ahol elérhető ingyen italokat válthatsz be, pontokat gyűjthetsz és jutalmakat igényelhetsz.",
    h1: "Nem tudod, hova menj ma?",
    lastmod: "2026-09-28",
    priority: 1.0,
    changefreq: "weekly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Nem tudod, hova menj ma?</h1>
    <p>A <strong>Come Get It</strong> segít eldönteni, hova menj Budapesten. Megmutatja azokat a partner vendéglátóhelyeket, ahol <strong>éppen elérhető ingyen italt</strong> válthatsz be, pontokat gyűjthetsz és jutalmakat igényelhetsz — így könnyebb választani, hol reggelizz, ebédelj, igyál vagy bulizz.</p>
    <p>Státusz: <strong>ingyenes bétaverzió</strong>. Fizetős előfizetés nincs. Az elérhető ajánlatok a partnerhelyek aktuális készletétől és nyitvatartásától függnek. Indulás Budapesten, magyar nyelvű app.</p>
  </header>

  <section>
    <h2>Miben segít a Come Get It?</h2>
    <ul>
      <li><strong>Hol reggelizzek?</strong> – Találj helyet, ahol a napindításhoz extra jutalom is jár (kávé + croissant pontokért, napi kedvezmények).</li>
      <li><strong>Hol ebédeljek?</strong> – Válassz gyorsabban a közeli partnerhelyek közül; lásd, hol érdemes ma beülni.</li>
      <li><strong>Hova üljünk be?</strong> – Találj jó helyet kávéra, randira vagy afterworkre, ahol az élmény mellé jutalom is jár.</li>
      <li><strong>Hol bulizzunk?</strong> – Menj oda, ahol az esti program mellé éppen extra ajánlat is elérhető.</li>
    </ul>
  </section>

  <section>
    <h2>Hogyan működik</h2>
    <ol>
      <li><strong>Regisztrálj</strong> – e-mail címmel és jelszóval, ingyenesen.</li>
      <li><strong>Fedezd fel</strong> – nézd meg a térképen és a listán a partner vendéglátóhelyeket.</li>
      <li><strong>Váltsd be</strong> – ha épp van elérhető ajánlat, a helyszínen a pultos igazolja vissza a beváltást.</li>
      <li><strong>Gyűjts</strong> – pontokat kapsz, amiket az appban elérhető jutalmakra válthatsz.</li>
    </ol>
  </section>

  <section>
    <h2>Árazás</h2>
    <ul>
      <li><strong>Ingyenes bétaverzió:</strong> minden jelenlegi funkció ingyenes.</li>
      <li>Fizetős előfizetés vagy appon belüli vásárlás jelenleg nincs.</li>
    </ul>
    <p>Az ingyen italok és jutalmak a partnerhelyek aktuális készletétől, kínálatától és nyitvatartásától függnek, ezért nem garantáltak.</p>
  </section>

  <section>
    <h2>Tervezett fejlesztések</h2>
    <p>Hosszabb távon szeretnénk társadalmi célú programot és további funkciókat indítani. Ezek egyelőre tervek: amíg nem élesek, nem ígérünk hozzájuk kapcsolódó hatást vagy szolgáltatást.</p>
  </section>

  <section>
    <h2>Founding Partner Program</h2>
    <p>Az ital a meghívó: a partner maga szabja meg az ajánlatot, készletet és időablakot, a Come Get It pedig a választás pillanatában segít megtalálni a helyét. A beváltást mérjük; az utóköltést és visszatérést csak külön egyeztetett pilotban vizsgáljuk. A folytatás külön írásos megállapodás kérdése. Részletek: <a href="/partnerek">/partnerek</a>.</p>
  </section>

  <section>
    <h2>Gyakori kérdések</h2>
    <dl>
      <dt>Mennyibe kerül a Come Get It?</dt>
      <dd>Az app jelenleg ingyenes bétaverzióban érhető el. Fizetős előfizetés nincs.</dd>
      <dt>Hol érhető el?</dt>
      <dd>Budapesti partnerhelyeken, folyamatosan bővülő listával.</dd>
      <dt>Garantált a napi ingyen ital?</dt>
      <dd>Nem. Az ajánlatok a partnerhelyek aktuális készletétől és nyitvatartásától függnek, és bármikor elfogyhatnak vagy változhatnak.</dd>
      <dt>Hogyan működik a beváltás?</dt>
      <dd>Az appban kiválasztod az elérhető ajánlatot, a helyszínen pedig a pultos igazolja vissza a beváltást.</dd>
      <dt>Hogyan törölhetem a fiókom?</dt>
      <dd>Az appban: Profil &gt; Fiók &gt; Fiók törlése, vagy e-mailben a <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> címen. Részletek: <a href="/support">/support</a>.</dd>
      <dt>Mi van, ha nincs partnerhely a közelemben?</dt>
      <dd>Az app egy térképen megmutatja a legközelebbi partnereket. Az indulás Budapesten történik, ahol már több helyszín lesz elérhető. Új városokba a kereslet alapján terjeszkedünk.</dd>
      <dt>Hogyan csatlakozhat egy vendéglátóhely vagy márka?</dt>
      <dd>Vendéglátóhelyként a <a href="/vendeglatohelyek">/vendeglatohelyek</a>, italmárkaként a <a href="/italmarkak">/italmarkak</a>, jutalompartnerként a <a href="/rewards-partners">/rewards-partners</a> oldalon jelentkezhetsz.</dd>
    </dl>
  </section>

  <section>
    <h2>Csatlakozz a várólistához</h2>
    <p>Az indulás Budapesten kezdődik. <a href="/#signup">Iratkozz fel a várólistára</a>, és elsők között próbálhatod ki. A várólistás regisztráció ingyenes, e-mailben értesítünk az induláskor és a Founding Partner kedvezményekről.</p>
  </section>

  <section>
    <h2>Kapcsolat</h2>
    <p>E-mail: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a><br/>Alapító: Bence Gátai, +36 70 585 2053<br/>Közösségi média: @comegetit_app (Instagram, TikTok)</p>
  </section>

  <nav aria-label="További oldalak">
    <ul>
      <li><a href="/vendeglatohelyek">Vendéglátóhelyeknek</a></li>
      <li><a href="/partnerek">Partnerek (hub)</a></li>
      <li><a href="/italmarkak">Italmárkáknak</a></li>
      <li><a href="/rewards-partners">Rewards Partnerek</a></li>
      <li><a href="/come-get-it-accelerator">Come Get It Accelerator</a></li>
      <li><a href="/support">Támogatás</a></li>
      <li><a href="/felhasznalasi-feltetelek">Felhasználási feltételek</a></li>
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
              text: "Az app jelenleg ingyenes bétaverzióban érhető el. Fizetős előfizetés nincs.",
            },
          },
          {
            "@type": "Question",
            name: "Hol érhető el?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Budapesti partner vendéglátóhelyeken, folyamatosan bővülő listával.",
            },
          },
          {
            "@type": "Question",
            name: "Garantált a napi ingyen ital?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nem. Az elérhető ingyen italok és jutalmak a partnerhelyek aktuális készletétől és nyitvatartásától függnek.",
            },
          },
        ],
      },
    ],
  },

  {
    path: "/vendeglatohelyek",
    distDir: "vendeglatohelyek",
    title: "Vendéglátóhelyeknek – Az ital a meghívó | Come Get It",
    description:
      "Te szabod meg az ajánlatot és az időablakot; a Come Get It segít a helyválasztás pillanatában. Mérhető beváltás, garantált forgalom nélkül.",
    h1: "Az ital a meghívó. Az élményből lehet törzsvendég.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Vendéglátóhelyeknek – Csatlakozz a Come Get It hálózathoz</h1>
     <p>Az ital a meghívó. A Come Get It segít a vendégnek a döntés pillanatában rátalálni a helyedre. A partner maga állítja be az ajánlatot, készletet, napot és időablakot; a pilot a beváltásokat méri, és eredményt nem ígér előre.</p>
  </header>

  <section>
    <h2>Kinek szól</h2>
    <ul>
      <li>Bárok, pubok és koktélbárok Budapesten és környékén.</li>
      <li>Kávézók és bisztrók, akik visszatérő vendégekre építenek.</li>
      <li>Éttermek, akik italforgalmat és élményt is kínálnak.</li>
      <li>Új koncepciók (zero-proof, craft, helyi termelők), akik gyors közönségépítést akarnak.</li>
    </ul>
  </section>

  <section>
    <h2>Miért éri meg csatlakozni</h2>
    <ul>
      <li><strong>Felfedezhetőség:</strong> a bétafelhasználók az appban láthatják az aktív partnerhelyet és ajánlatot.</li>
       <li><strong>Helyszíni élmény:</strong> a kiszolgálás, hangulat és további kínálat a partner kezében marad.</li>
      <li><strong>Mért beváltás:</strong> a sikeres beváltások megjelennek a partner riportjában.</li>
      <li><strong>Pilotértékelés:</strong> a visszatérést és az utóköltést csak külön, előre egyeztetett módszerrel vizsgáljuk.</li>
       <li><strong>Időzítés:</strong> az ajánlat csak az előre egyeztetett készlet és időablak szerint jelenik meg.</li>
    </ul>
  </section>

  <section>
    <h2>Hogyan működik a beváltás</h2>
    <ol>
      <li>A vendég megrendel a kasszánál.</li>
      <li>A vendég az „Itt vagyok” gombbal jelzi, hogy megérkezett.</li>
      <li>A vendég megmutatja a telefonját a pultosnak, aki a vendég telefonján megnyomja a BEVÁLTOM gombot.</li>
      <li>A sikeres beváltás megjelenik a partner riportjában. A rendszer nem kapcsolódik a vendég bankkártyájához.</li>
    </ol>
  </section>

  <section>
    <h2>Onboarding lépések</h2>
    <ol>
      <li>Jelentkezés a partneri űrlapon.</li>
      <li>20 perces egyeztetés az ajánlatról és a beváltási mechanizmusról.</li>
      <li>Partnerprofil és a helyszíni, vendégtelefonos beváltás bemutatása.</li>
      <li>Élesedés az appban + első kampány mérése.</li>
    </ol>
  </section>

  <section>
    <h2>Founding Partner Program</h2>
     <p>Kis létszámú budapesti pilot: az ajánlatot és mérési feltételeket előre rögzítjük, a beváltásokat közösen értékeljük. Hosszú távú kapcsolat csak külön írásos megállapodással jöhet létre.</p>
  </section>

  <section>
    <h2>Jelentkezés</h2>
    <p>Tölts ki a <a href="/vendeglatohelyek#apply">partneri jelentkezési űrlapot</a>, vagy írj nekünk: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a>. Telefon: Bence Gátai, +36 70 585 2053.</p>
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
          "Időzíthető partnerajánlat a helyválasztás pillanatában és mérhető beváltás; forgalmi eredmény nem garantált.",
      },
    ],
  },

  {
    path: "/italmarkak",
    distDir: "italmarkak",
    title: "Italmárkáknak – Légy ott a fogyasztásnál | Come Get It",
    description:
      "Tervezett 2. fázis: első korty valódi partnerhelyen, egyeztetett ajánlattal és mérhető beváltással. Early access italmárkáknak.",
    h1: "Légy ott, amikor inni készülnek.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Italmárkáknak – Mérhető fogyasztói aktiváció</h1>
     <p>Ne csak mutasd meg: add az első kortyot. A 2. fázisra tervezett italmárka-pilot valós partnerhelyen, a választás pillanatában mutathatja be az italt. A beváltás mérhető, más eredményt előre nem ígérünk.</p>
  </header>
  <section>
    <h2>Brand aktivációs lehetőségek</h2>
    <ul>
      <li>Termékfókuszú kampányok partnerhelyeken (kóstoltatás, double points, free pour).</li>
      <li>Tervezett csomagajánlatok – a partnerhelyen elérhető ingyen ital lehet a te márkád.</li>
       <li>Az appban tervezett időzített megjelenések; lokációs push jelenleg nem működik.</li>
    </ul>
  </section>
  <section>
    <h2>Kampánymérés</h2>
    <ul>
       <li>Sikeres beváltások a jóváhagyott helyszíni pilotban.</li>
       <li>Fogyasztói visszajelzés csak külön elindított, megfelelően kezelt kampányban.</li>
       <li>Nincs igazolt közönségarány vagy garantált kampányeredmény.</li>
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
    <p>Brand kampányért írj nekünk: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> vagy tölts ki egy <a href="/italmarkak#apply">érdeklődési űrlapot</a>.</p>
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
          "Tervezett helyszíni kóstoltatási pilot italmárkáknak; beváltások mérésével, garantált elérés nélkül.",
      },
    ],
  },

  {
    path: "/rewards-partners",
    distDir: "rewards-partners",
    title: "Rewards Partnerek – Új közönség | Come Get It",
    description:
      "A 2. fázisban a jutalom továbbviheti a helyszíni élményt. Egyeztetett ajánlat és mérhető beváltás, garantált forgalom nélkül.",
    h1: "Legyél a következő program, amit választanak.",
    lastmod: "2026-05-06",
    priority: 0.8,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Rewards Partnerek – Kínálj jutalmat, érj el új közönséget</h1>
     <p>Az ital elindíthatja a látogatást, a jutalom továbbviheti a kapcsolatot. A 2. fázisban a partner egyeztetett jutalmat kínálhat a pozitív helyszíni élmény után; a beváltás mérhető, új vásárló vagy forgalom nem garantált. A jelenlegi béta nem kapcsol bankkártyát.</p>
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
       <li>Mérhető beváltás a külön elindított rewards-pilotban, előre egyeztetett feltételekkel.</li>
      <li>Korlátozott, előre egyeztetett pilot valós beváltási adatokkal.</li>
    </ul>
  </section>
  <section>
    <h2>Hogyan váltják be a felhasználók</h2>
    <ol>
      <li>A user a pontjaiból „kiválasztja” a te jutalmadat az appban.</li>
      <li>A megérkezést az appban jelzi.</li>
      <li>A telefonját megmutatja a pultosnak; a pultos a vendég telefonján jóváhagyja a beváltást.</li>
    </ol>
  </section>
  <section>
    <h2>Jelentkezés</h2>
    <p>Írj nekünk a <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> címre, vagy <a href="/rewards-partners#apply">jelentkezz az űrlapon</a>.</p>
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
      "A vendéglátóhely időzített ajánlata segíti a döntést, a márka első kortyot adhat, a jutalom továbbviheti a kapcsolatot. Mérhető beváltás.",
    h1: "Partnerek",
    lastmod: "2026-05-06",
    priority: 0.7,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Partnerek – Dolgozz együtt a Come Get It-tel</h1>
     <p>Az ital a meghívó: a hely szabja meg az ajánlatot, készletet és időablakot; a Come Get It segít a helyválasztás pillanatában. A beváltás mérhető, a helyszíni élményből lehet visszatérés. Italmárkák és jutalompartnerek a 2. fázisban kapcsolódhatnak be.</p>
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
    <p>Írj nekünk: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a></p>
  </section>
</main>`.trim(),
    jsonLd: [breadcrumb("Partnerek", "partnerek")],
  },

  {
    path: "/come-get-it-accelerator",
    distDir: "come-get-it-accelerator",
    title: "Founding Partner Program – Teszteljük együtt | Come Get It",
    description:
      "Kis létszámú kontrollált pilot: időzített ajánlat, mérhető beváltás és közös kiértékelés. Nincs garantált eredmény vagy automatikus folytatás.",
    h1: "Ne higgy nekünk vakon. Teszteljük le együtt.",
    lastmod: "2026-05-06",
    priority: 0.7,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <header>
    <h1>Come Get It Accelerator – Nőj a hálózatunkkal</h1>
     <p>A Founding Partner Program kis létszámú, kontrollált pilot. Nem feltételezzük, hogy az ingyen ital működik: helyenként rögzítjük az ajánlatot, készletet és időablakot, mérjük a beváltást, majd közösen értékelünk. Nincs automatikus hosszú távú elköteleződés.</p>
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
       <li>Előre egyeztetett ajánlat, készlet, időablak és leállítási feltételek.</li>
       <li>Helyszíni folyamat és helyszíni beváltási próba az indulás előtt.</li>
       <li>Saját helyed sikeres beváltásainak közös értékelése.</li>
       <li>Utóköltés és visszatérés csak külön előre egyeztetett mérésben.</li>
    </ul>
  </section>
  <section>
    <h2>Jelentkezés</h2>
    <ol>
      <li>Tölts ki egy rövid jelentkezési űrlapot.</li>
      <li>Bemutatkozó hívás (20 perc).</li>
      <li>Bekerülsz a soron következő Accelerator kohortba.</li>
    </ol>
    <p>Indulás: <a href="/come-get-it-accelerator#apply">Jelentkezem az Acceleratorba</a> vagy írj a <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> címre.</p>
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
    lastmod: "2026-09-28",
    priority: 0.3,
    changefreq: "yearly",
    bodyHtml: `
<main data-prerender="true">
  <article>
    <h1>Adatvédelmi szabályzat</h1>
    <p>Hatályos: 2026-09-28</p>
    <p>A Come Get It alkalmazás és weboldal (come-get-it.app) üzemeltetőjeként elkötelezettek vagyunk a személyes adatok védelme mellett. Ez a szabályzat összefoglalja, milyen adatokat kezelünk, milyen célból, milyen jogalapon, meddig őrizzük meg azokat, és milyen jogaid vannak.</p>

    <h2>Adatkezelő</h2>
    <p>Név: Gátai Bence, a Come Get It szolgáltatás üzemeltetője<br/>E-mail: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a><br/>Telefon: <a href="tel:+36705852053">+36 70 585 2053</a></p>

    <h2>Kezelt adatok köre</h2>
    <ul>
      <li>Várólistás regisztráció: e‑mail cím, időbélyeg, forrás/UTM adatok.</li>
      <li>Üzleti jelentkezés: név, e‑mail, telefonszám (ha megadod), cégadatok (ha megadod).</li>
      <li>Hozzájárulások: marketing és kommunikációs beállítások.</li>
      <li>Mobilalkalmazás-fiók: felhasználói azonosító, e‑mail cím, megjelenített név, opcionális telefonszám és fióklétrehozási idő.</li>
      <li>Bejelentkezési adatok: a Supabase által kezelt hitelesítési adatok; választható külső belépésnél a szolgáltató által átadott azonosító és engedélyezett profiladatok.</li>
      <li>Pontos helyadat: csak külön engedéllyel, az app használata közben, közeli helyekhez és a helyszíni beváltás ellenőrzéséhez. Háttérbeli helymeghatározást nem végzünk.</li>
      <li>Használati adatok: kedvencek, pontok, jutalmak, partnerhely, kiválasztott ital, beváltási időpont és az egyszer használatos token állapota.</li>
      <li>Technikai és biztonsági adatok: IP-cím, munkamenet-azonosítók, kérés-, hiba- és visszaélés-megelőzési naplók.</li>
    </ul>
    <p>A jelenlegi ingyenes béta nem kér bankkártyaadatot, nem fér hozzá kártyás tranzakciókhoz, nem tartalmaz appon belüli vásárlást, és nem végez más vállalkozások alkalmazásain vagy weboldalain keresztüli követést.</p>

    <h2>Adatkezelés céljai és jogalapja</h2>
    <ul>
      <li>Várólista és kapcsolatfelvétel: hozzájárulásod alapján (GDPR 6. cikk (1) a)).</li>
      <li>Fiók, partnerhelyek, jutalmak és beváltások biztosítása: szerződés teljesítése vagy szerződéskötést megelőző lépések (GDPR 6. cikk (1) b)).</li>
      <li>Pontos helyadat: külön hozzájárulásod alapján (GDPR 6. cikk (1) a)).</li>
      <li>Szolgáltatás fejlesztése, biztonság, csalás- és visszaélés-megelőzés: jogos érdekünk (GDPR 6. cikk (1) f)).</li>
      <li>Jogszabályi vagy hatósági kötelezettségek: jogi kötelezettség (GDPR 6. cikk (1) c)).</li>
      <li>Marketing kommunikáció: csak hozzájárulással (bármikor visszavonható).</li>
    </ul>

    <h2>Adatfeldolgozók és címzettek</h2>
    <ul>
      <li>Supabase (adatbázis, hitelesítés, Edge Functions).</li>
      <li>Resend (tranzakciós és értesítő e‑mailek küldése).</li>
      <li>Expo/EAS és az alkalmazás-áruházak (alkalmazás-összeállítás és terjesztés).</li>
      <li>Hoszting- és infrastruktúra-szolgáltatók a weboldal és az alkalmazás üzemeltetéséhez.</li>
    </ul>

    <h2>Sütik (cookie‑k)</h2>
    <p>Csak a működéshez szükséges tárolást használjuk (pl. bejelentkezési munkamenet). Külső analitikai vagy marketing követőkódot nem futtatunk.</p>

    <h2>Fiók és adatok törlése</h2>
    <p>A mobilalkalmazásban: Profil &gt; Fiók &gt; Fiók törlése. Ha nem tudsz belépni, írj a <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> címre a regisztrált e‑mail címedről.</p>

    <h2>Adatmegőrzés</h2>
    <p>A várólistás adatokat legfeljebb az indulást követő 24 hónapig vagy törlési kérelemig őrizzük meg. A fiókadatait a fiók fennállásáig kezeljük; törléskor az azonosító adatokat töröljük vagy anonimizáljuk, kivéve a kötelező vagy jogi igényhez szükséges megőrzést.</p>

    <h2>Adatbiztonság</h2>
    <p>Hozzáférés-szabályozást, titkosított adatátvitelt, szerveroldali jogosultság-ellenőrzést és egyszer használatos beváltási tokent alkalmazunk. Jelszót, teljes QR-kódot vagy beváltási titkot ne küldj e-mailben vagy chatben.</p>

    <h2>Érintetti jogok</h2>
    <ul>
      <li>Hozzáférés, helyesbítés, törlés, adatkezelés korlátozása.</li>
      <li>Adathordozhatóság és tiltakozás a jogos érdeken alapuló kezelés ellen.</li>
      <li>Hozzájárulás bármikori visszavonása.</li>
    </ul>

    <h2>18 éven aluliak</h2>
    <p>Az alkoholtartalmú ajánlatokkal kapcsolatos funkciók 18 éven aluliaknak nem szólnak.</p>

    <h2>Panasz benyújtása</h2>
    <p>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH), 1055 Budapest, Falk Miksa utca 9-11. – naih.hu</p>

    <h2>Kapcsolat</h2>
    <p><a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a></p>
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

  {
    path: "/support",
    distDir: "support",
    title: "Támogatás és kapcsolat – Come Get It",
    description:
      "Segítség a Come Get It ingyenes béta alkalmazáshoz: kapcsolat, gyakori témák és fióktörlés lépésről lépésre.",
    h1: "Támogatás",
    lastmod: "2026-09-20",
    priority: 0.5,
    changefreq: "monthly",
    bodyHtml: `
<main data-prerender="true">
  <article>
    <h1>Támogatás</h1>
    <p>A Come Get It jelenleg ingyenes bétaverzióban érhető el. Ha kérdésed vagy problémád van, írj nekünk.</p>

    <h2>Kapcsolat</h2>
    <p>E-mail: <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> — általában 2 munkanapon belül válaszolunk.</p>

    <h2>Miben tudunk segíteni</h2>
    <ul>
      <li>Regisztráció, bejelentkezés, elfelejtett jelszó.</li>
      <li>Partnerhelyek keresése, térkép.</li>
      <li>Ingyen ital beváltása a helyszínen.</li>
      <li>Pontok és jutalmak.</li>
      <li>Hibabejelentés és adatkezelési kérések.</li>
    </ul>
    <p>Az elérhető jutalmak és ingyen italok a partnerhelyek aktuális készletétől és nyitvatartásától függnek.</p>

    <h2>Fiók törlése</h2>
    <p>A mobilalkalmazásban: Profil &gt; Fiók &gt; Fiók törlése. Ha nem tudsz bejelentkezni, írj a <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> címre a regisztrált e-mail címedről.</p>

    <h2>Jogi dokumentumok</h2>
    <p><a href="/adatvedelmi-szabalyzat">Adatvédelmi szabályzat</a> · <a href="/felhasznalasi-feltetelek">Felhasználási feltételek</a></p>
  </article>
</main>`.trim(),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Támogatás – Come Get It",
        url: `${SITE_ORIGIN}/support`,
        inLanguage: "hu-HU",
      },
    ],
  },

  {
    path: "/felhasznalasi-feltetelek",
    distDir: "felhasznalasi-feltetelek",
    title: "Felhasználási feltételek – Come Get It",
    description:
      "A Come Get It ingyenes bétaverziójának felhasználási feltételei: fiók, jutalmak elérhetősége, felelősség, kapcsolat.",
    h1: "Felhasználási feltételek",
    lastmod: "2026-09-28",
    priority: 0.3,
    changefreq: "yearly",
    bodyHtml: `
<main data-prerender="true">
  <article>
    <h1>Felhasználási feltételek</h1>
    <p>Hatályos: 2026-09-28</p>

    <h2>Üzemeltető és kapcsolat</h2>
    <p>Gátai Bence, a Come Get It szolgáltatás üzemeltetője · <a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> · <a href="tel:+36705852053">+36 70 585 2053</a></p>

    <h2>A szolgáltatás</h2>
    <p>A Come Get It mobilalkalmazás ingyenes bétaverzióban működik: partnerhelyeket kereshetsz, alkalmanként ingyen italt válthatsz be, pontokat gyűjthetsz és jutalmakat igényelhetsz. A funkciók változhatnak vagy időszakosan elérhetetlenek lehetnek.</p>

    <h2>Fiók</h2>
    <p>A használathoz e-mail címmel és jelszóval létrehozott fiók szükséges. Az alkalmazás 18 éven felülieknek szól. A fiókod bármikor törölheted az appban (Profil &gt; Fiók &gt; Fiók törlése) vagy e-mailben.</p>

    <h2>Italok, jutalmak és elérhetőség</h2>
    <p>Az ingyen italok és jutalmak a partnerhelyek aktuális készletétől és nyitvatartásától függnek. Nincs garantált vagy napi rendszerességű ingyen ital. A pontok nem válthatók készpénzre.</p>

    <h2>Nincs fizetős csomag</h2>
    <p>Jelenleg nem kínálunk előfizetést vagy appon belüli vásárlást.</p>

    <h2>Felelősség</h2>
    <p>A szolgáltatást „adott állapotában” nyújtjuk; a béta jellegből adódóan nem garantáljuk a folyamatos, hibamentes működést, sem az ajánlatok elérhetőségét.</p>

    <h2>Kapcsolat</h2>
    <p><a href="mailto:gataibence@gmail.com">gataibence@gmail.com</a> · <a href="/support">Támogatás</a> · <a href="/adatvedelmi-szabalyzat">Adatvédelmi szabályzat</a></p>
  </article>
</main>`.trim(),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Felhasználási feltételek – Come Get It",
        url: `${SITE_ORIGIN}/felhasznalasi-feltetelek`,
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
