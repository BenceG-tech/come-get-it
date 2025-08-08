import React, { useEffect } from "react";
import { analytics } from "@/lib/analytics";

export default function AdatvedelmiSzabalyzat() {
  useEffect(() => {
    document.title = "Adatvédelmi szabályzat | Come Get It";
    // Meta description update
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = "Adatvédelmi szabályzat – hogyan kezeljük az adataidat a Come Get It alkalmazásnál.";

    // Canonical (best-effort in SPA)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/adatvedelmi-szabalyzat`;

    analytics.pageView('adatvedelmi-szabalyzat');
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Adatvédelmi szabályzat</h1>
          <p className="text-muted-foreground mt-2">Hatályos: 2025-08-08</p>
        </header>

        <section className="space-y-8 leading-relaxed text-sm md:text-base">
          <p>
            A Come Get It alkalmazás és weboldal (come-get-it.app) üzemeltetőjeként
            elkötelezettek vagyunk a személyes adatok védelme mellett. Ez a szabályzat
            összefoglalja, milyen adatokat kezelünk, milyen célból, milyen jogalapon,
            meddig őrizzük meg azokat, és milyen jogaid vannak.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatkezelő</h2>
            <p>
              Név: Come Get It<br />
              E-mail: hello@come-get-it.app
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Kezelt adatok köre</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Várólistás regisztráció: e‑mail cím, időbélyeg, forrás/UTM adatok.</li>
              <li>Üzleti jelentkezés: név, e‑mail, telefonszám (ha megadod), cégadatok (ha megadod).</li>
              <li>Hozzájárulások: marketing és kommunikációs beállítások.</li>
              <li>Technikai adatok: IP-cím, böngésző és eszköz adatok, sütikhez kapcsolódó azonosítók.</li>
              <li>Analitika: oldal- és esemény‑mérési adatok (összesített, anonimizált/pszeudonimizált módon).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatkezelés céljai és jogalapja</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Várólista és kapcsolatfelvétel: hozzájárulásod alapján (GDPR 6. cikk (1) a)).</li>
              <li>Szolgáltatás fejlesztése és biztonság: jogos érdekünk (GDPR 6. cikk (1) f)).</li>
              <li>Marketing kommunikáció: csak hozzájárulással (bármikor visszavonható).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatfeldolgozók és címzettek</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supabase (adatbázis, Edge Functions, e‑mail értesítések továbbítása).</li>
              <li>Google Analytics 4 (forgalom‑ és eseménymérés).</li>
              <li>Hoszting és infrastruktúra szolgáltatók a webalkalmazás üzemeltetéséhez.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              A partnereink csak a szolgáltatás nyújtásához szükséges mértékben férnek
              hozzá adatokhoz, és adatfeldolgozói megállapodás köti őket.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Sütik (cookie‑k)</h2>
            <p>
              A működéshez szükséges sütiket és analitikai sütiket használunk. A sütik
              a böngésződ beállításaiban korlátozhatók vagy törölhetők.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatmegőrzés</h2>
            <p>
              A várólistás adatokat legfeljebb az indulást követő 24 hónapig őrizzük meg,
              vagy az érintetti törlési kérelem beérkezéséig. A hozzájárulás bármikor
              visszavonható, a visszavonás nem érinti a korábbi kezelés jogszerűségét.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Nemzetközi adattovábbítás</h2>
            <p>
              Előfordulhat, hogy egyes szolgáltatók az Európai Unión kívül tárolnak adatot.
              Ilyen esetben a továbbítás megfelelő garanciák mellett történik (pl. EU
              által elfogadott szerződéses feltételek).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Érintetti jogok</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hozzáférés, helyesbítés, törlés, adatkezelés korlátozása.</li>
              <li>Adathordozhatóság és tiltakozás a jogos érdeken alapuló kezelés ellen.</li>
              <li>Hozzájárulás bármikori visszavonása.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Panasz benyújtása</h2>
            <p>
              Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)<br />
              Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
              Web: naih.hu | E‑mail: ugyfelszolgalat@naih.hu | Tel.: +36‑1‑391‑1400
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Kapcsolat</h2>
            <p>
              Ha kérdésed van, vagy szeretnéd gyakorolni jogaidat: hello@come-get-it.app
            </p>
          </section>

          <p className="text-muted-foreground">Utolsó frissítés: 2025-08-08</p>
        </section>
      </article>
    </main>
  );
}
