Megcsinálom ezt a csomagot, fókuszban azzal, hogy először a mostani hibák megszűnjenek, utána jöhet a dokumentum-rendszer rendbetétele.

## 1. Azonnali hibajavítások

### Dokumentum megnyitás
- Kiveszem a mostani `about:blank` új ablakos megoldást, mert mobilon/Lovable preview-ben blank screenhez vezethet.
- Helyette lesz egy saját admin dokumentum-néző:
  - `Megnyitás` gomb egy belső admin néző oldalra navigál.
  - PDF-ek iframe/object nézetben jelennek meg.
  - Képek natív előnézettel jelennek meg.
  - Mindig lesz külön `Letöltés` és `Link másolása` fallback.
  - Ha a böngésző nem tud PDF-et renderelni, nem blank képernyő lesz, hanem egy tiszta letöltési/megnyitási állapot.

### AI asszisztens 403 hiba
- A `admin-ai-chat` edge function AI Gateway hívását javítom.
- A mostani hívás `Authorization: Bearer LOVABLE_API_KEY` formát használ, ezt átállítom a Lovable AI Gateway által várt headerre:
  - `Lovable-API-Key: <key>`
  - plusz SDK jelölés: `X-Lovable-AIG-SDK`
- Újradeployolom és letesztelem az edge functiont.
- A frontend hibaüzenetét is barátságosabbá teszem, hogy ne nyers JSON-t láss mobilon.

## 2. Dokumentum-rendszer rendbetétele

### Meglévő dokumentumok auditja
- Lekérem a mostani összes dokumentumot és storage file-t.
- Készítek egy admin audit nézetet / riportot, ami mutatja:
  - dokumentum címe
  - mappa
  - típus
  - mire való
  - minőségi pontszám
  - duplikáció gyanú
  - ajánlás: megtartani / törölni / összevonni / új verziót készíteni
  - rövid indoklás

### Rating mezők
- A `documents` táblához hozzáadok admin mezőket:
  - `quality_score`
  - `quality_notes`
  - `duplicate_group`
  - `duplicate_recommendation`
  - `keep_status`
- Ezek csak adminoknak lesznek láthatók/szerkeszthetők.

### Duplikációkezelés
- Első körben cím, mappa, fájlméret, kategória és leírás alapján jelölöm a valószínű duplikátumokat.
- Ha két dokumentum hasonló, az admin felületen látszik majd, hogy:
  - melyik az erősebb
  - miért jobb
  - melyiket érdemes megtartani
  - érdemes-e fúzionált új verziót készíteni

## 3. AI asszisztens tudása

### Mostani tudás javítása
- Az AI jelenleg csak a dokumentumok metaadatait látja, nem biztos, hogy a PDF-ek teljes tartalmát.
- Rövid távon beteszem a dokumentumok `content`, `description`, `when_to_use`, `category`, `folder` mezőit a kontextusba, hogy többet lásson.
- A válaszban mindig jelezze, ha valamelyik doksi teljes szövegét még nem látja.

### Következő nagy lépés: teljes dokumentum-tudás
- Későbbi blokkban jöhet a PDF/text kinyerés + chunkolás + embeddings/RAG, hogy az AI tényleg minden dokumentum tartalmából tudjon válaszolni.
- Ezt külön nagyobb lépésként kezelem, mert database + edge function + indexelés kell hozzá.

## 4. Brand media / képek használata dokumentumokhoz és AI-hoz

- Lesz külön `Brand Media` rész az adminban.
- Képek feltölthetők lesznek önállóan és dokumentumhoz csatolva is.
- Minden képhez tárolható:
  - leírás
  - brand tag
  - használati javaslat
  - kapcsolódó dokumentum
- Az AI asszisztens később ezekből tud javasolni:
  - melyik kép jó Insta poszthoz
  - melyik lehet videó start frame
  - melyik passzol pitch deckbe
  - mit érdemes belőle újragenerálni vagy módosítani

## 5. Önellőrző rendszer az AI outputokra

Az asszisztens minden fontosabb pitch/email/DM/poszt generálásnál ezt a logikát kapja:

```text
v1 draft
pontszám 1-10
kritika dimenziók szerint
javítási javaslatok
v2 jobb verzió
```

Pontozási dimenziók:
- magyar nyelv minősége
- Come Get It brand hang
- CTA erőssége
- konkrétság
- személyre szabás
- rövidség/ritmus
- üzleti meggyőzőerő

## 6. Óriás dokumentum checklist

Készítek egy külön admin dokumentumot / checklist oldalt, ami összegyűjti, mi hiányzik még a Come Get It működéséhez.

Fő kategóriák:
- Jogi dokumentumok
  - ÁSZF
  - Adatkezelési tájékoztató
  - Cookie policy
  - partneri szerződés
  - rewards partner szerződés
  - founding partner megállapodás
  - befektetői LOI / term sheet
- Partner sales anyagok
  - 1-pagerek
  - hosszú pitch deckek
  - follow-up email sablonok
  - IG DM sablonok
  - objection handling
  - onboarding guide
- App / termék dokumentáció
  - felhasználói flow
  - reward flow
  - pontgyűjtés szabályai
  - admin folyamatok
  - későbbi fejlesztési roadmap
- Marketing stratégia
  - launch terv
  - social content terv
  - influencer/UGC terv
  - venue activation terv
  - brand image guideline
- Üzleti / befektetői anyagok
  - master overview
  - pénzügyi terv
  - growth stratégia
  - milestone-ok
  - KPI dashboard terv
- Operáció
  - partner onboarding checklist
  - support folyamatok
  - hibakezelés
  - belső felelősségi lista

## 7. Implementáció sorrend

1. AI Gateway header javítás és edge function deploy/test.
2. Dokumentum megnyitás átépítése saját admin viewerre.
3. Dokumentum audit/rating mezők migrationnel.
4. Admin dokumentum lista bővítése rating/duplikáció státuszokkal.
5. Meglévő dokumentumok első auditja és javaslati riport.
6. Óriás Come Get It dokumentum checklist létrehozása dokumentumként.
7. Következő blokkban: Brand Media + teljes RAG dokumentum-tudás + multimodális AI.