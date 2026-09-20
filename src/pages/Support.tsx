import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { analytics } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";

const SUPPORT_EMAIL = "gataibence@gmail.com";

export default function Support() {
  useEffect(() => {
    analytics.pageView("support");
  }, []);

  return (
    <>
      <SEO
        title="Támogatás és kapcsolat – Come Get It"
        description="Segítség a Come Get It ingyenes béta alkalmazáshoz: kapcsolat, gyakori kérdések és fióktörlés lépésről lépésre."
        canonical="/support"
      />
      <main className="min-h-screen bg-background text-foreground">
        <article className="max-w-3xl mx-auto px-4 py-16">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Támogatás</h1>
            <p className="text-muted-foreground mt-2">
              A Come Get It jelenleg ingyenes bétaverzióban érhető el. Ha kérdésed vagy problémád van, írj nekünk.
            </p>
          </header>

          <section className="space-y-8 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Kapcsolat</h2>
              <p>
                E-mail:{" "}
                <a className="text-nf-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                Általában 2 munkanapon belül válaszolunk. Írj magyarul vagy angolul, és ha tudsz, csatolj
                képernyőképet — így gyorsabban tudunk segíteni.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Miben tudunk segíteni</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regisztráció és bejelentkezés (e-mail cím + jelszó), elfelejtett jelszó.</li>
                <li>Helyek keresése az appban, térkép és partnerhelyek listája.</li>
                <li>Ingyen ital beváltása a helyszínen, ha a beváltás nem sikerült.</li>
                <li>Pontok és jutalmak: hiányzó pont, be nem váltható jutalom.</li>
                <li>Hibabejelentés, javaslat, együttműködési megkeresés.</li>
                <li>Adatkezelési kérések: adathozzáférés, helyesbítés, törlés.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                A béta ideje alatt az elérhető jutalmak és ingyen italok a partnerhelyek aktuális készletétől és
                nyitvatartásától függnek, ezért időszakosan változhatnak vagy elfogyhatnak.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Fiók törlése</h2>
              <p>A fiókodat bármikor törölheted:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Nyisd meg a mobilalkalmazást.</li>
                <li>
                  Lépj a <strong>Profil</strong> &gt; <strong>Beállítások</strong> &gt;{" "}
                  <strong>Fiók törlése</strong> menüpontra.
                </li>
                <li>Erősítsd meg a törlést.</li>
              </ol>
              <p className="mt-3">
                Ha nem tudsz bejelentkezni, küldj e-mailt a{" "}
                <a className="text-nf-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>{" "}
                címre arról az e-mail címről, amivel regisztráltál, és töröljük a fiókodat.
              </p>
              <p className="text-muted-foreground mt-2">
                A törléssel a fiókodhoz tartozó adatok és az addig gyűjtött pontok véglegesen megszűnnek.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatvédelem</h2>
              <p>
                Az adatkezelés részleteit az{" "}
                <Link className="text-nf-primary underline" to="/adatvedelmi-szabalyzat">
                  adatvédelmi szabályzatban
                </Link>{" "}
                találod. A szolgáltatás használatára a{" "}
                <Link className="text-nf-primary underline" to="/felhasznalasi-feltetelek">
                  felhasználási feltételek
                </Link>{" "}
                vonatkoznak.
              </p>
            </section>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
