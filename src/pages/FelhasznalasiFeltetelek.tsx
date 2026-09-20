import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { analytics } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";

const SUPPORT_EMAIL = "gataibence@gmail.com";

export default function FelhasznalasiFeltetelek() {
  useEffect(() => {
    analytics.pageView("felhasznalasi-feltetelek");
  }, []);

  return (
    <>
      <SEO
        title="Felhasználási feltételek – Come Get It"
        description="A Come Get It ingyenes bétaverziójának felhasználási feltételei: fiók, jutalmak elérhetősége, felelősség, kapcsolat."
        canonical="/felhasznalasi-feltetelek"
      />
      <main className="min-h-screen bg-background text-foreground">
        <article className="max-w-3xl mx-auto px-4 py-16">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Felhasználási feltételek</h1>
            <p className="text-muted-foreground mt-2">Hatályos: 2026-09-20</p>
          </header>

          <section className="space-y-8 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">1. A szolgáltatás</h2>
              <p>
                A Come Get It egy mobilalkalmazás, amellyel partner vendéglátóhelyeket kereshetsz, alkalmanként
                ingyen italt válthatsz be, pontokat gyűjthetsz és jutalmakat igényelhetsz. Az alkalmazás jelenleg
                <strong> ingyenes bétaverzióban</strong> működik: a funkciók fejlesztés alatt állnak, változhatnak,
                időszakosan elérhetetlenek lehetnek, és a szolgáltatás bármikor módosítható vagy szüneteltethető.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">2. Fiók</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>A használathoz e-mail címmel és jelszóval létrehozott fiók szükséges.</li>
                <li>Egy személy egy fiókot hozhat létre; a jelszavadért te felelsz.</li>
                <li>Az alkalmazás alkoholtartalmú italokhoz kapcsolódó ajánlatokat is tartalmazhat, ezért 18 éven felüliek használhatják.</li>
                <li>
                  A fiókod bármikor törölheted az appban (Profil &gt; Beállítások &gt; Fiók törlése), vagy e-mailben:{" "}
                  <a className="text-nf-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">3. Italok, jutalmak és elérhetőség</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Az ingyen italok és jutalmak a partnerhelyek aktuális kínálatától, készletétől és nyitvatartásától
                  függnek. Nincs garantált vagy napi rendszerességű ingyen ital.
                </li>
                <li>Egy ajánlat bármikor elfogyhat, módosulhat vagy megszűnhet, előzetes értesítés nélkül.</li>
                <li>A beváltás a helyszínen, a partner munkatársának közreműködésével történik.</li>
                <li>A pontok és jutalmak nem válthatók készpénzre, és nem ruházhatók át.</li>
                <li>A kiszolgálásért és az ital minőségéért a partner vendéglátóhely felel. A partner megtagadhatja a kiszolgálást.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">4. Nincs fizetős csomag</h2>
              <p>
                Jelenleg nem kínálunk előfizetést vagy fizetős funkciót, és az appon keresztül nem történik fizetés.
                Ha a jövőben fizetős szolgáltatást vezetünk be, arról előre tájékoztatunk.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">5. Elvárt használat</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ne használd az alkalmazást visszaélésszerűen, automatizált eszközökkel vagy hamis adatokkal.</li>
                <li>Visszaélés esetén a fiókot korlátozhatjuk vagy megszüntethetjük.</li>
                <li>Igyál felelősséggel.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">6. Felelősség</h2>
              <p>
                A szolgáltatást „adott állapotában” nyújtjuk. A béta jellegből adódóan nem vállalunk felelősséget a
                folyamatos, hibamentes működésért, az ajánlatok elérhetőségéért, illetve a partnerhelyek
                szolgáltatásáért. A jogszabály szerint kizárható mértékig nem felelünk közvetett károkért.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">7. Adatkezelés</h2>
              <p>
                A személyes adatok kezeléséről az{" "}
                <Link className="text-nf-primary underline" to="/adatvedelmi-szabalyzat">
                  adatvédelmi szabályzat
                </Link>{" "}
                rendelkezik.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">8. A feltételek módosítása</h2>
              <p>
                A feltételeket időről időre frissíthetjük. A módosított változat a közzététellel lép hatályba; a
                további használat a feltételek elfogadását jelenti.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">9. Kapcsolat</h2>
              <p>
                Kérdés esetén írj:{" "}
                <a className="text-nf-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>{" "}
                — további segítség a{" "}
                <Link className="text-nf-primary underline" to="/support">
                  támogatás oldalon
                </Link>
                .
              </p>
            </section>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
