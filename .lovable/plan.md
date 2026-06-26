# Plan: Jobb animált ikonok + telefon mockup javítás

## 1. Új, érthetőbb karakter-animációk (`src/components/how-it-works/AnimatedStepIcon.tsx`)

A jelenlegi `walk`, `drink`, `give` ikonok absztraktak. Lecserélem őket konkrétabb, „mesélő" jelenetekre, mind keret nélkül, nagyobb karakterekkel, hogy a 64×64 viewBox-ban olvashatóak legyenek.

### `walk` — sétáló ember oldalnézetből, ténylegesen halad
- Teljes alak (fej + nyak + törzs + 2 kar + 2 láb) oldalnézetben, profilban.
- A teljes figura **vízszintesen mozog** balról jobbra (loop): bal szélről beúszik, középen, jobb szélen kilép, újraindul — így vizuálisan tényleg "menj el".
- Lábak váltakozva előre-hátra lendülnek (térdhajlítás SVG path-szal, nem csak egyenes vonalak).
- Karok ellentétes lengéssel.
- Talaj alatti scrolling kötőjel-vonal a haladás érzékeltetésére.
- Apró por-pöttyök a sarka mögött (fade out).

### `drink` — ember pohárral, tényleg iszik
- Frontális/háromnegyed nézetből: fej (kerek), nyak, vállak, **2 kar** amelyek a pohár két oldalát fogják.
- Pohár (talpas, koktél-pohár sziluett) a két kéz között.
- Animáció ciklus (~3s): pohár + kezek **felemelkednek a szájhoz** (translateY -10), fej picit hátradől (rotate -8°), a pohárban a folyadék-szint **lecsökken** (rect height animál), majd vissza alaphelyzetbe.
- Apró kortyolási „gyöngyök" a száj mellett amikor iszik.
- Csillám-szikrák a pohár fölött (a jutalom érzet).

### `give` — két ember, egyik ad a másiknak
- Bal oldalon **adó alak** (fej + törzs + kinyújtott kar) ami egy kis ajándék/szív ikont tart.
- Jobb oldalon **kapó alak** (fej + törzs + nyitott tenyér).
- Animáció ciklus (~3s): a szív/ajándék **átúszik** a bal kéztől a jobb kézig (translateX), közben enyhén pulzál; amikor megérkezik, a kapó feje picit bólint és felette `+1` érme száll fel.
- Mindkét figura enyhe légzés-bobing.

Mindhárom animáció `useReducedMotion` esetén statikus.

Méret: a karakterek a 64×64 viewBox ~80%-át töltik ki (most ~40% csak), hogy a medallionban is jól látszódjanak.

## 2. Térkép screenshot fix a hero telefon mockup-ban

A `/` oldal hero `PhoneMockup` jelenleg `object-cover object-top` 9:19.5 aspect ratio-val. Ha a screenshot nem pontosan ebben az arányban van, vagy a r2 URL nem tölt → fekete telefon látszik.

Megoldás:
- A `PhoneMockup` kap egy új default fallback viselkedést: ha `fit="cover"` és a kép `naturalRatio` eltér a frame ratio-tól >15%-kal, automatikusan `contain`-re vált (state-ben `onLoad` után számolva). Így a térképes screenshot teljes egészében látszik, nem vágódik le.
- A `Index.tsx`-ben a hero PhoneMockup-nak explicit `fit="contain"` propot adok, mert a hero-ban a teljes screenshot fontosabb mint a kitöltés.
- Ellenőrzöm hogy a `heroVenuesAsset.url` ténylegesen elérhető-e (a `/__l5e/...` path Lovable asset CDN-re mutat — ha 404, akkor kicserélem a public/lovable-uploads alól egy meglévő képre, vagy kérek új feltöltést).

## Érintett fájlok
- `src/components/how-it-works/AnimatedStepIcon.tsx` — 3 új karakter-jelenet komponens
- `src/components/PhoneMockup.tsx` — auto-contain fallback + `object-position` finomítás
- `src/pages/Index.tsx` — `fit="contain"` a hero mockup-on (1 sor)

## Nyitott kérdés
Ha az `/__l5e/...` asset URL tényleg nem tölt (404), újra fel kell töltened a térkép screenshotot, vagy mondd meg melyik `/lovable-uploads/...` képet használjam helyette.
