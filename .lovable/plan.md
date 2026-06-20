## Cél
Egyszerre javítjuk a legégetőbb hibát: a dokumentumok ne fehér/üres nézetet mutassanak, hanem azonnal legyen látható preview vagy biztos fallback. Emellett a Content Studio kapjon AI brief-ajánlót, stratégiai content javaslatokat, médiatár-kép ajánlást/generálást, a naptár pedig tömeges törlést.

## 1. Dokumentum preview végleges javítása
- Az `/admin/documents/:id` oldalon megszüntetem a PDF iframe-re épülő fő megjelenítést, mert ez böngészőben és új lapon is gyakran fehér képernyőt ad privát signed URL-nél.
- Beépítek egy biztos preview fallbacket:
  - ha van `content`, `summary`, `ai_summary`, `description` vagy elemzett szöveg: az jelenjen meg elsődlegesen olvasható panelben;
  - PDF esetén legyen nagy, egyértelmű „Megnyitás új lapon” és „Letöltés” blokk, plusz metaadatok;
  - képnél saját image preview marad;
  - nem támogatott fájlnál sem üres felület lesz, hanem fájl-információ + letöltés.
- Az új lapos megnyitásnál signed URL helyett lehetőség szerint kontrollált app-route nyíljon meg, ami ugyanazt a fallback preview-t mutatja, így nem fehér storage/PDF nézetre visz.
- A dokumentum listából a „Megnyitás” minden dokumentumnál az app preview route-ra vigyen, ne közvetlen signed URL-re.

## 2. Content Studio egyszerűbb, de okosabb workflow
- A Content Studio tetejére kerül egy „AI brief-ajánló” blokk:
  - cél kiválasztása: vendéglátó partner toborzás, founding partner, waitlist, brand edukáció, heti social;
  - AI gomb: a Brand Memory, dokumentumok, mentett snippetek és marketing naptár alapján javasol 3-5 stratégiai briefet;
  - egy kattintással bármelyik brief betölthető és generálható.
- A generált tartalom nem csak „szövegvariáns” lesz, hanem javaslatcsomag:
  - miért ez a szög;
  - kinek szól;
  - melyik csatornára való;
  - javasolt posztidő;
  - képirány / kreatív brief;
  - CTA.
- Megmarad a multi-favorite és a mentett könyvtár, de a felületet tisztábbra rendezem: elsődleges gombok: „Mentés”, „Kép ajánlás”, „Kép generálás”, „Naptárba”.

## 3. A második képen lévő chat-kérés megoldása
A kérésed lényege: „tudsz ehhez illő Insta poszt képet csinálni, el tudjuk menteni későbbre, egybe rakod a képet a szöveggel, és az admin felületen legyen később felhasználható”.

Megoldás:
- Az AI asszisztens válaszai mellé kerül egy „Tartalommá alakítás” workflow:
  - a chatben kiválasztott posztszöveget el lehet menteni snippetként;
  - automatikusan kérhet hozzá médiatár-ajánlást;
  - lehet hozzá új képet generálni;
  - a kép + szöveg együtt menthető a Content Studio könyvtárba;
  - innen naptárba ütemezhető.
- Ha egyszerűbb első kör kell: a Content Studio-ban lesz egy „Szöveg beillesztése AI chatből” mező, amelyre ugyanaz a képajánló/generáló/mentő pipeline fut.

## 4. Marketing naptár tömeges kezelés
- A naptár listában checkboxok lesznek a bejegyzések mellett.
- Fejlécben megjelenik egy bulk action bar:
  - kijelöltek törlése;
  - státusz módosítása;
  - kijelölés törlése.
- A törlés előtt egyetlen megerősítés lesz: hány bejegyzést törlünk.

## 5. Instagram összekapcsolás: mit lehet most és mit később
Első körben az appon belül megcsinálom az „Instagram-ready” workflow-t:
- poszt szöveg + kép + hashtagek + időpont mentése;
- logózott kép letöltése;
- naptárból másolható caption.

Valódi Instagram automatikus publikáláshoz később Meta/Instagram Graph API kell:
- Instagram Business vagy Creator account;
- Facebook Page-hez kapcsolva;
- Meta app jogosultságokkal (`instagram_content_publish`, pages permissions);
- review/engedélyezés szükséges lehet.
Ezt külön integrációs hullámban érdemes megcsinálni, mert OAuth + token tárolás + publikálási szabályok kellenek hozzá.

## 6. Technikai részletek
- Frontend módosítások:
  - `AdminDocumentViewer.tsx`: iframe helyett robust preview/fallback layout.
  - `AdminDocuments.tsx`: dokumentumok megnyitása mindig app preview route-ra.
  - `AdminContentStudio.tsx`: AI brief-ajánló, stratégiai kártyák, chatből/importált szöveg kezelés, mentés/kép/naptár flow tisztítás.
  - `AdminCalendar.tsx`: bulk select + bulk delete/status.
- Edge function módosítások/újak:
  - `generate-multi-format`: stratégiai mezők bővítése.
  - új `suggest-content-briefs`: Brand Memory + doksik + naptár alapján brief ajánlások.
  - opcionálisan új `save-chat-content-snippet`, ha az AI chatből közvetlen mentést is bekötjük.
- Adatbázis:
  - ha szükséges, a `saved_content_snippets` kaphat plusz mezőket: `strategy`, `recommended_channel`, `recommended_time`, `creative_brief`.
  - minden új/alter migration RLS-kompatibilis, admin-only hozzáféréssel.

## 7. Validálás
- Megnézem egy konkrét PDF doksinál, hogy többé ne legyen fehér preview.
- Megnézem egy képnél és egy nem-PDF fájlnál is a megnyitást.
- Kipróbálom a Content Studio-ban: AI brief ajánlás → generálás → kép ajánlás/generálás → mentés.
- Kipróbálom a marketing naptárban a több kijelöléses törlést.