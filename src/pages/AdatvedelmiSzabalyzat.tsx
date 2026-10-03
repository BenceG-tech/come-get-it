import React, { useEffect } from "react";
import { analytics } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";

export default function AdatvedelmiSzabalyzat() {
  useEffect(() => {
    analytics.pageView('adatvedelmi-szabalyzat');
  }, []);

  return (
    <>
      <SEO
        title="Adatvédelmi szabályzat – Come Get It"
        description="Hogyan kezeljük a személyes adataidat a Come Get It alkalmazásnál és weboldalán."
        canonical="/adatvedelmi-szabalyzat"
      />
    <main className="min-h-screen bg-background text-foreground">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Adatvédelmi szabályzat</h1>
          <p className="text-muted-foreground mt-2">Hatályos: 2026-09-28</p>
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
              Név: Gátai Bence, a Come Get It szolgáltatás üzemeltetője<br />
              E-mail: <a className="text-nf-primary underline" href="mailto:gataibence@gmail.com">gataibence@gmail.com</a><br />
              Telefon: <a className="text-nf-primary underline" href="tel:+36705852053">+36 70 585 2053</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Kezelt adatok köre</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Várólistás regisztráció: e‑mail cím, időbélyeg, forrás/UTM adatok.</li>
              <li>Üzleti jelentkezés: név, e‑mail, telefonszám (ha megadod), cégadatok (ha megadod).</li>
              <li>Hozzájárulások: marketing és kommunikációs beállítások.</li>
              <li>Mobilalkalmazás-fiók: felhasználói azonosító, e‑mail cím, megjelenített név, opcionális telefonszám és a fiók létrehozásának ideje.</li>
              <li>Bejelentkezési adatok: a Supabase által kezelt hitelesítési adatok; választható külső belépésnél a szolgáltató által átadott azonosító és engedélyezett profiladatok. A Google- vagy Apple-jelszót nem kapjuk meg.</li>
              <li>
                Pontos helyadat: csak külön engedéllyel, közeli helyek megjelenítéséhez és a helyszíni
                beváltás ellenőrzéséhez. Ha a Profilban külön bekapcsolod a „Közeli ingyen ital”
                értesítést, az alkalmazás „Mindig” helyengedélyt kérhet, és a háttérben is észlelheti,
                amikor egy részt vevő hely közelébe érsz. A háttérben észlelt helyzetet az eszköz dolgozza
                fel; azt nem továbbítjuk a szerverünkre, és a beváltási koordinátát sem mentjük el a
                beváltási rekord részeként.
              </li>
              <li>Használati adatok: kedvencek, pontok, jutalmak, partnerhely, kiválasztott ital, beváltási időpont, egyszer használatos beváltási token és annak állapota.</li>
              <li>Technikai és biztonsági adatok: IP-cím, munkamenet-azonosítók, kérés-, hiba- és visszaélés-megelőzési naplók.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              A jelenlegi ingyenes béta nem kér bankkártyaadatot, nem kapcsolódik a kártyás tranzakcióidhoz,
              nem tartalmaz appon belüli vásárlást, és nem használ adatot más vállalkozások alkalmazásain vagy
              weboldalain keresztüli követésre.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatkezelés céljai és jogalapja</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Várólista és kapcsolatfelvétel: hozzájárulásod alapján (GDPR 6. cikk (1) a)).</li>
              <li>Fiók, partnerhelyek, jutalmak és beváltások biztosítása: szerződés teljesítése vagy szerződéskötést megelőző lépések (GDPR 6. cikk (1) b)).</li>
              <li>
                Pontos helyadat és az opcionális közelségi értesítés: külön hozzájárulásod alapján
                (GDPR 6. cikk (1) a)); a funkció az alkalmazásban kikapcsolható, az engedély pedig az
                eszköz beállításaiban bármikor visszavonható.
              </li>
              <li>Szolgáltatás fejlesztése, biztonság, csalás- és visszaélés-megelőzés: jogos érdekünk (GDPR 6. cikk (1) f)).</li>
              <li>Jogszabályi vagy hatósági kötelezettségek: jogi kötelezettség (GDPR 6. cikk (1) c)).</li>
              <li>Marketing kommunikáció: csak hozzájárulással (bármikor visszavonható).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatfeldolgozók és címzettek</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supabase (adatbázis, hitelesítés, Edge Functions).</li>
              <li>Resend (tranzakciós és értesítő e‑mailek küldése).</li>
              <li>Expo/EAS és az alkalmazás-áruházak (alkalmazás-összeállítás és terjesztés).</li>
              <li>Hoszting- és infrastruktúra-szolgáltatók a weboldal és az alkalmazás üzemeltetéséhez.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              A partnereink csak a szolgáltatás nyújtásához szükséges mértékben férnek
              hozzá adatokhoz, és adatfeldolgozói megállapodás köti őket.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Sütik (cookie‑k)</h2>
            <p>
              A weboldalon jelenleg csak a működéshez szükséges tárolást használjuk (pl. bejelentkezési
              munkamenet). Külső analitikai vagy marketing követőkódot nem futtatunk. A böngésződ
              beállításaiban bármikor törölheted a tárolt adatokat.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatmegőrzés</h2>
            <p>
              A várólistás adatokat legfeljebb az indulást követő 24 hónapig, vagy a törlési kérelemig őrizzük meg.
              A fiókhoz tartozó adatokat a fiók fennállásáig, illetve a szükséges szolgáltatási cél teljesüléséig
              kezeljük. Fióktörléskor a közvetlenül azonosító profil- és aktivitási adatokat töröljük vagy
              anonimizáljuk, kivéve, ha jogszabály vagy jogi igény további megőrzést tesz szükségessé. A
              biztonsági naplókat csak a működéshez és incidenskezeléshez szükséges ideig őrizzük meg.
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
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Adatbiztonság</h2>
            <p>
              Hozzáférés-szabályozást, titkosított adatátvitelt, szerveroldali jogosultság-ellenőrzést és egyszer
              használatos beváltási tokent alkalmazunk. Egyetlen internetes szolgáltatás sem garantálhat teljes
              kockázatmentességet. Jelszót, teljes QR-kódot vagy beváltási titkot ne küldj e-mailben vagy chatben.
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
            <h2 className="text-xl md:text-2xl font-semibold mb-2">18 éven aluliak</h2>
            <p>
              Az alkoholtartalmú ajánlatokkal kapcsolatos funkciók 18 éven aluliaknak nem szólnak. Ha tudomásunkra
              jut, hogy szükséges hozzájárulás nélkül kezeltünk gyermekhez kapcsolódó személyes adatot, megtesszük
              a szükséges törlési lépéseket.
            </p>
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
              Ha kérdésed van, vagy szeretnéd gyakorolni jogaidat: gataibence@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Fiók és adatok törlése</h2>
            <p>
              A mobilalkalmazásban: Profil &gt; Fiók &gt; Fiók törlése. Ha nem tudsz belépni,
              írj a gataibence@gmail.com címre a regisztrált e‑mail címedről. További részletek a
              támogatás oldalon: /support
            </p>
          </section>

          <p className="text-muted-foreground">Utolsó frissítés: 2026-09-28</p>
        </section>
      </article>
    </main>
    <Footer />
    </>
  );
}
