# Mi maradt ki + hogyan lépjünk szintet

Az admin most már sokat tud (Drive elemzés, képverziók, doksi-chat, checklist, leadek), de az élmény **eszközszerű** maradt — nem egy "Come Get It agent", aki tudja a brandet, a hangnemet és a célokat. Az alábbi terv ezt javítja, prioritizált hullámokban.

---

## Hullám 1 — Átláthatóság & felhasználóbarát (alacsony költség, nagy hatás)

**1.1 Admin Home / "Ma" dashboard**
- Egy `/admin` nyitólap, ami megmutatja: mai checklist-feladatok, follow-upra váró leadek (dátum alapján), új Drive változások (utolsó 24h), félbehagyott elemzések, függő doksi-review-k.
- "Folytasd ahol abbahagytad" kártya (utolsó megnyitott doksi/lead/chat).

**1.2 Globális Command Palette bővítés (⌘K)**
- Már létezik — adjunk hozzá: "elemezd ezt a képet", "küldd a chatbe", "új founding partner email", "ma kit hívjak". Természetes nyelvű parancsok az AI gatewayen keresztül.

**1.3 Egységes "Activity feed"**
- Egy oldalsáv-fül: ki módosított mit, mikor (doksi, lead státusz, képelemzés verzió). Egy helyen átlátható a teljes admin élet.

**1.4 Onboarding tooltipek + üres állapotok**
- Minden admin oldalon első látogatáskor 3-4 lépéses guided tour (driver.js). Üres listáknál konkrét következő-lépés CTA, ne csak "Nincs adat".

**1.5 Toast → Inline progress**
- Hosszú AI műveleteknél (image analyze, drive batch) toast helyett inline progress bar lépésekkel ("Letöltés → GPT-elemzés → Mentés → Verziózás").

---

## Hullám 2 — Értékesebb & időspóroló

**2.1 Napi AI brief (email + dashboard)**
- Reggel 8-kor edge function (cron): összefoglaló a maiakról: "3 follow-up esedékes, 2 új Drive doksi vár review-ra, IG poszt ma 18:00-kor megy ki." Resend-en keresztül.

**2.2 Smart templates könyvtár**
- `email_templates` már létezik — bővítsük: típus szerinti (founding pitch, follow-up #1/#2/#3, "no-response", thank-you), változókkal (`{{venue_name}}`, `{{city}}`, `{{last_contact}}`). AI generálja ki a Come Get It hangnemben.

**2.3 Bulk műveletek mindenhol**
- Leadek: kijelölés → tömeges email/státusz/címke. Doksik: tömeges review/újra-elemzés. Képek: tömeges re-analyze új prompttal.

**2.4 Keyboard shortcuts**
- `j/k` listanavigáció, `e` szerkesztés, `r` review, `a` AI assistant, `?` shortcuts lista.

**2.5 Auto-mentés mindenhol + undo toast**
- Doksi szerkesztésnél debounce-olt mentés, "Visszavonás" toast 5 mp-ig.

---

## Hullám 3 — Come Get It-személyreszabás (ez a legfontosabb)

**3.1 Brand Memory rendszer**
- Új tábla: `brand_knowledge` — strukturált tárolása: tone of voice példák, tiltott szavak, kötelező CTA-k, célközönség personák (vendéglátós, italmárka, rewards partner), founding partner ajánlat részletei, árazás, USP-k.
- **Minden** AI hívás (image analysis, doksi-chat, email gen, admin-ai-chat) ezt kapja system promptként. Egy helyen szerkeszthető admin felületen.

**3.2 Persona-aware generálás**
- Email/poszt/DM generálásnál választható célzott persona ("3. kerületi specialty kávézó tulaj, 32-45, family-run") — az AI ehhez igazítja a copy-t.

**3.3 Hangnem-ellenőrző**
- Minden generált szöveghez automatikus "brand-fit" pontszám (0-100) + javaslat: "túl formális", "hiányzik a tegezés", "nincs CTA".

**3.4 Style guide doksi auto-szinkron**
- A Drive-on lévő "Brand Guidelines" PDF/Doc tartalmát rendszeresen beolvassa egy edge function, frissíti a `brand_knowledge`-ot. Single source of truth.

---

## Hullám 4 — Jobb tartalomgyártás

**4.1 Multi-format generátor egy promptból**
- "Írj a founding partner programról" → egy gombbal: IG caption + Story script + FB poszt + LinkedIn + email subject+body + DM opener. Mind brand-tone-ban, mind variálható.

**4.2 A/B variánsok + szavazás**
- Minden generált tartalomhoz 3 verzió, gyors "kedvenc" jelölés. Az AI tanul a választásokból (kedvelt verziók = few-shot példák a következő prompthoz).

**4.3 Content calendar AI-jal**
- `marketing_calendar` tábla már létezik — AI javaslatok: "péntek estére IG Reel, szombat reggelre rewards-partner kiemelés". Drag & drop naptár.

**4.4 Visual content pipeline**
- Kép feltöltés → automatikus: elemzés (van) → 3 caption variáns → alt text → suggested hashtag set → posztolás-kész csomag exportálható.

**4.5 Hangalapú tartalom**
- Voice recorder már van — terjesszük ki: "diktálj egy ötletet", AI átalakítja: blog draft / IG carousel / email pitch. Egy 30 mp-es jegyzetből kész posztsorozat.

---

## Hullám 5 — Extra funkciók (high-leverage)

**5.1 Partner Intelligence Score 2.0**
- Lead score már van — bővítés: Instagram follower count auto-fetch (scraping/API), Google Reviews átlag, weboldal "specialty-fit" elemzés, becsült forgalom. Egyetlen szám 0-100 + indoklás.

**5.2 Outreach automation pipeline**
- Lead státusz változásra trigger: "új lead" → 24h múlva AI-által írt első DM draft; "no response 5 nap" → follow-up draft. Sose autoküld — mindig review-ra vár.

**5.3 Meeting prep generátor**
- Lead detail oldal: "Készíts felkészülőt holnapi meetingre" → 1 oldalas brief (cég, tulaj, social, várható ellenvetések + válaszok, ajánlat-személyreszabás).

**5.4 Drive ↔ Doksi kétirányú szinkron**
- Edit egy doksit az adminban → opcionálisan visszaír Drive-ra (új verzió). Egy igazság, két felület.

**5.5 Telefonhívás-asszisztens**
- Hívás közben gombnyomás → felvétel → transcript → AI összefoglaló + következő lépések → bekerül a lead időszalagra.

**5.6 "Mit mondjak?" panic gomb**
- Lead detail-en: "Visszahívott, mit mondjak?" → 30 mp-en belül egy bullet-pointos beszédvázlat a lead történet + brand pitch alapján.

**5.7 Heti retro AI**
- Vasárnap este: "Ezen a héten 12 leadet érintettél, 3 mondott igent. A 'specialty kávézó' szegmens 2x jobban konvertál mint a 'gasztropub'. Jövő héten fókuszálj erre."

**5.8 Public-facing AI showcase**
- A landing oldalon mini demo: "Próbáld ki: tölts fel egy fotót a kávézódról, mutatjuk milyen tartalmat tudunk gyártani neked." Lead magnet + WOW faktor.

---

## Javasolt sorrend (mit építsünk legközelebb?)

A legtöbb értéket gyors visszahozó **3 lépés**:
1. **Hullám 3.1 — Brand Memory** (mindent okosabbá tesz, fundamentum)
2. **Hullám 1.1 — Admin Home dashboard** (átláthatóság ugrás)
3. **Hullám 4.1 — Multi-format generátor** (napi időmegtakarítás)

Utána Hullám 2.1 (napi brief) és 5.3 (meeting prep) hozza a legtöbb "wow"-ot.

---

## Kérdés feléd

Melyik hullámmal / konkrét tétellel kezdjük? Vagy szeretnél több részletet egy adott pontról mielőtt eldöntöd?
