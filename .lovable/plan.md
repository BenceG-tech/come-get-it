# Admin UX átszervezés — "Tedd produktívvá Bencét"

## Cél
Az admin ne egy "eszköz-gyűjtemény" legyen, hanem egy **napi társ**, ami:
1. Megmondja **mit csinálj most** (és miért fontos).
2. Egy helyről **el is végezhetőek** a fontos dolgok (poszt, partner, regisztráció).
3. **Motivál** — láthatóvá teszi a haladást, ünnepli a sikert.
4. Az **AI asszisztens a központ** — beszélgetésből doksi/poszt/email/feladat lesz.

---

## 1. Új információs architektúra — 4 fül + AI mindig kéznél

A jelenlegi 4 csoport (Ma · Munka · Tudás · Több) jó, de **túl sok aloldal**. Csökkentsük a napi navigációt **4 fő munkafelületre**, a többi a ⌘K / "Több" alatt marad.

```
┌──────────────────────────────────────────────────┐
│  MA          PARTNEREK    TARTALOM    TUDÁS      │
│  (fókusz)    (pipeline)   (poszt)     (doksi)    │
└──────────────────────────────────────────────────┘
                    ↑
            AI asszisztens (FAB) — bárhol megnyitható
```

- **MA** = Dashboard, ami most is van, de letisztítva (lásd 2.)
- **PARTNEREK** = Pipeline + Outreach + Leadek **egy tabos oldalon** (most 3 külön menüpont)
- **TARTALOM** = Content Studio + Naptár + Brand + Média **egy tabos oldalon**
- **TUDÁS** = Dokumentumok + Chat doksikkal + Trend Radar **egy tabos oldalon**
- A "Több" csoport marad ritkán használt eszközöknek (szimulátor, retro, checklist, drive, döntésnapló).

**Mobile bottom nav**: Ma · Partnerek · Tartalom · Tudás · ⌘K (5 ikon, ujjbarát).

---

## 2. "MA" oldal — egyetlen képernyő, ami megmondja mit csinálj

A jelenlegi Dashboard 7 collapsible szekciója sok. **Új struktúra**:

```
┌─ ÜDV, BENCE — 23. heti nap, hajrá! ─────────────┐
│  🔥 3 napos streak  •  Heti cél: 4/7 poszt      │
├──────────────────────────────────────────────────┤
│  MA ESTÉRE 3 DOLOG (AI által javasolt)          │
│  ☐ Hívd vissza: Kőleves bisztró  → [Megnyit]    │
│  ☐ Posztolj: "Miért váltunk?"   → [Generálj]    │
│  ☐ Reagálj: 2 új előregisztráció → [Megnéz]     │
├──────────────────────────────────────────────────┤
│  GYORS AKCIÓK (1 kattintás)                      │
│  [+ Új partner] [+ Poszt] [+ Hangjegyzet]       │
│  [🎤 Mondd el az AI-nak]                        │
├──────────────────────────────────────────────────┤
│  HALADÁS  (kis kártyák, motiváló számokkal)     │
│  Partnerek: 12 → cél 25   ▓▓▓▓░░ 48%           │
│  Waitlist: 340 → cél 1000 ▓▓░░░░ 34%           │
│  Heti poszt: 4/7          ▓▓▓▓░░░               │
└──────────────────────────────────────────────────┘
       ↓ collapsible: minden további (mostani szekciók)
```

**Mit változtatunk**:
- A "Ma 3 dolga" az AI által generált napi fókusz (`generate-daily-focus` már létezik!) — minden item **akciógombbal** (nem csak link).
- **Streak + heti cél** legyen mindig fent → motivál.
- A többi card (PipelineFunnel, WaitlistGrowth, OutreachHealth stb.) **alapból csukva**, alul.
- Az összes "üres állapot" pozitív, biztató hangnemben ("Nincs lemaradás 🎉").

---

## 3. AI asszisztens = a központi munkafelület

Jelenleg az AI chat csak válaszol. **Bővítsük ki tool-okkal**, hogy a beszélgetésből **kész dolog** legyen:

| Felhasználói mondat | AI mit tegyen |
|---|---|
| "Írj egy posztot a Kőlevesről" | Generál posztot + képet, mented egy kattintással Naptárba |
| "Mentsd el ezt a beszélgetést" | Egész thread → Dokumentumok közé, AI-summary-vel |
| "Csinálj ebből egy doksit" | Aktuális chat → új doksi a tudásbázisban |
| "Adj hozzá partnerként: Bambi presszó" | Új partner-rekord létrejön, megnyitja |
| "Mit posztoljak ma?" | 3 javaslat, mindegyik mellett [Készítsd el] gomb |
| "Foglald össze a heti haladást" | Streak, számok, mit kell még csinálni |

**Technikai**:
- AI SDK `tool()` calls (már a stack része): `createPartner`, `createPost`, `saveConversationAsDocument`, `scheduleContent`, `searchDocuments`.
- A `FloatingAIAssistant` panel kap egy **"Mentés doksiként"** és **"Új beszélgetés"** gombot.
- Beszélgetések **mentődnek** localStorage-ba (thread lista a panelen belül) — később opcionálisan DB-be.

---

## 4. Partnerek hub — 1 oldal, 3 fül

```
PARTNEREK
[ Pipeline ] [ Outreach ] [ Leadek (kutatás) ]
```

- **Pipeline tab**: a jelenlegi Kanban.
- **Outreach tab**: email sequence-ek.
- **Leadek tab**: kutatás + bulk import.
- Közös felül: **kereső + "Új partner" gomb** (mindenhol elérhető).
- Üres állapotban: "Még nincs lead — [AI kutatás indítása] vagy [Importálj CSV-t]".

---

## 5. Tartalom hub — 1 oldal, 4 fül + sticky AI

```
TARTALOM
[ Studio ] [ Naptár ] [ Brand ] [ Média ]
            ↓
  jobb oldalon mindig: AI panel ("Mit posztoljunk?")
```

- A naptáron közvetlenül **látszik a streak** ("3 napja posztolsz, ne hagyd abba!").
- "Mai ötlet" kártya tetejen → 1 kattintás generálás.
- **Insta/FB posztolás reminder**: ha 2 napja nincs poszt → push szerű figyelmeztetés a Ma oldalon.

---

## 6. Tudás hub — 1 oldal, 3 fül

```
TUDÁS
[ Dokumentumok ] [ Chat doksikkal ] [ Trend Radar ]
```

- Doksi listából **közvetlen "Kérdezd meg az AI-tól"** gomb minden soron.
- Chat oldalon a beszélgetés **menthető új doksiként** (lásd 3. pont).

---

## 7. Motivációs réteg (apró, de erős)

- **Streak counter** a header jobb sarkában (🔥 3 nap).
- **Heti progress bar** (poszt, partner, waitlist).
- **Mikro-ünneplés**: amikor új partner aláírja → confetti + toast ("12 → 13, hajrá a 25-ig!").
- **Esti összefoglaló kártya** este 18 után jelenik meg a Ma oldalon: "Ma elvégezted: 2 hívás, 1 poszt. Holnap: …"
- Üres állapot szövegek átírása biztatóra (nem "Nincs adat", hanem "Még szűz terep — kezdjük? [Új partner]").

---

## 8. Mobil-first finomítások

- Minden hub oldalon **fülek vízszintesen görgethetők** mobilon.
- Mindenhol `pb-32` a `main`-en, hogy a FAB cluster + bottom nav ne takarjon.
- Hosszú listák: végtelen scroll helyett "Mutass többet" gomb (jobban kontrollálható).
- Hub-tetején **sticky kereső** ami az aktív tab tartalmát szűri.

---

## 9. Mit építünk ebben a körben (fázisokra bontva)

### Fázis A — IA átalakítás (gyors, nagy hatás)
- `admin-nav-config.ts` → 4 fő menüpont + Több
- 3 új hub oldal: `AdminPartnersHub`, `AdminContentHub`, `AdminKnowledgeHub` (tabokkal, a meglévő oldalakat embeddeli)
- Régi route-ok megmaradnak (deep link kompatibilitás), redirect a hubokra
- Mobile bottom nav frissítése

### Fázis B — Új "MA" oldal
- Streak + heti cél komponens (`DailyStreakBar`)
- "Ma 3 dolga" `TodayFocusCard` — `generate-daily-focus` edge function eredménye akciógombokkal
- Gyors akciók sáv (`QuickActionsBar`)
- A meglévő szekciók alapból csukva

### Fázis C — AI tool-ok + beszélgetés mentés
- `admin-ai-chat` edge function bővítése tool-okkal (createPartner, savePost, saveAsDocument)
- Chat panel: thread lista, "Új beszélgetés", "Mentsd doksiként" gomb
- LocalStorage thread persistence (per-user)

### Fázis D — Motivációs réteg
- Confetti partner aláíráskor
- Esti összefoglaló kártya
- Üres állapot szövegek átírása
- Streak állapot tárolás (DB: `user_streaks` tábla)

---

## Mit NEM csinálunk most
- Nem írunk át backend logikát (csak edge function bővítés tool-okhoz).
- Nem nyúlunk a Supabase sémához a `user_streaks` táblán kívül.
- A landing oldalakhoz (/, /vendeglatohelyek stb.) nem nyúlunk.
- Insta/FB API integráció (csak emlékeztető, nem auto-poszt) — később.

---

## Kérdés mielőtt nekikezdek

1. **Mind a 4 fázist** egyszerre csináljam, vagy **kezdjük A + B-vel** (IA + új Ma oldal) és utána lássuk?
2. Az **AI tool-okhoz** (Fázis C) szükségem lesz a meglévő `admin-ai-chat` átalakítására — ez érintheti a mostani chat viselkedését. OK?
3. Streak tárolásához (Fázis D) **új Supabase tábla** kell (`user_streaks`). Rendben?
