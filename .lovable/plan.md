
# Admin felület — audit és fejlesztési terv

## 1. Mit látok ma (állapot)

**Méret:** 23 admin oldal, ~60 edge function, ~80 admin komponens, 4+1 fő nav-csoport, Bento dashboard 7 szekcióval, ~15 dashboard kártya.

### Funkcionális térkép (rövid)

```text
MA           PARTNEREK         TARTALOM         TUDÁS            TÖBB
├ Dashboard  ├ Pipeline         ├ Studio         ├ Documents      ├ Simulator
├ Inbox      ├ Outreach         ├ Calendar       ├ Doc Chat       ├ Checklist
└ Mission    └ Leads            ├ Brand          ├ Trends         ├ Decisions
                                └ Media          └ AI             ├ Retro
                                                                  └ Drive
                                                  + Instagram queue, Documents/audit
```

### Mi működik jól
- **Leadek**: Readiness pipeline + bulk akciók + Apify scrape + outreach modal — tiszta, fókuszált.
- **Content Studio + Brand Memory**: a "1 brief → minden formátum" jó pattern.
- **Dokumentumok bulk review + chat doksikkal**: hasznos és letisztult.
- **Outreach Quick Drafts**: 3 hangnem chip + inline szerkesztés — egyszerű.
- **Section-nav (dot rail) + Bento grid**: a dashboard navigálható.

### Mi NEM működik / fájó pontok
1. **Dashboard túlterhelt** — 15+ kártya, 7 collapsible szekció, sok átfedés:
   - `DailyBriefing` ≈ `EveningSummary` ≈ `TodayTasks` ≈ `MissionTracker` mind "mai fókuszról" beszél.
   - `PipelineFunnel` + `ConversionFunnel` + `StalledLeads` + `OutreachHealth` ugyanazt a sales-képet darabolják.
   - `WeeklyGoals` + `WeeklyContentSprint` + `Checklist` + `DecisionsDue` heti listák, három különböző helyen.
   - `NorthstarCard` + `CompanyHealth` + `WaitlistGrowth` + `Trend` + `AiUsage` + `TimeTracker` riport-zaj.
2. **Funkció-duplikáció oldalak között**:
   - `Checklist` ↔ `TodayTasks` (dashboard) ↔ `Mission` feladatok — 3 hely, 3 modell.
   - `Mission` ↔ `Retro` ↔ `Decisions` — célok és visszanézés szétszórva.
   - `Outreach` ↔ `Leads/outreach modal` ↔ `InstagramQueue` — három outreach belépő.
   - `Documents` ↔ `Documents/audit` ↔ `Doc Chat` ↔ `Drive` — négy doksi-felület.
   - `AI asszisztens` ↔ `FloatingAIAssistant` ↔ `InlineAIHelper` ↔ `CommandPalette` — sok AI belépő, nincs egy "fő" csatorna.
3. **IA súrlódások**:
   - "Mission" külön hub, miközben funkcionálisan Ma + Heti retro kombinációja.
   - `Simulator`, `Retro`, `Decisions` a "Több" alatt, így senki nem találja meg.
   - `Inbox` címke összemosódik az emailes inboxszal (valójában mixed-feed action queue).
4. **Design / megjelenés**:
   - A "Neon Fidelity" tokenek jók, de a dashboard kártyák vizuálisan egyforma sűrűségűek — nincs hierarchia.
   - Sok kártya cím egyformán cyan uppercase, nehéz a szemnek prioritizálni.
   - Section-nav (dot rail) és AdminFabCluster + FloatingAIAssistant + MobileBottomNav együtt zsúfolt — három overlay-réteg verseng.
   - PageHeader + PageIntro + Breadcrumb + PageSectionNav minden oldalon 4 fej-elem ⇒ tartalom messze lent kezdődik.
5. **User flow problémák**:
   - "Új lead → kutatás → score → grade → outreach" most 3-4 oldal ugrálással.
   - "Új poszt brief → naptár → publikálás" 2 oldal + külön Brand ellenőrzés.
   - "Heti tervezés" nem egy helyen történik (Retro + Mission + Checklist + WeeklyGoals).

## 2. Vezérelvek a továbbiakhoz

1. **Egy munkafolyamat = egy oldal.** Ne kelljen ugrálni egy taszk közben.
2. **Dashboard = válaszok, nem kártya-katalógus.** Max 5 modul fold-above.
3. **Egy AI belépő.** Minden más AI hívás kontextuális helyen él (inline).
4. **Konszolidálj, ne törölj.** A meglévő edge functionöket megtartjuk; a felület hajtogatja össze őket.

## 3. Fejlesztési terv (4 fázis)

### Fázis 1 — Dashboard radikális egyszerűsítés *(1 nap, csak frontend)*

Új "Ma" fold-above, **max 4 modul**:

```text
┌──────────────────────────┬──────────────────┐
│  TODAY (mai 3 feladat +  │  PIPELINE PULSE  │
│  streak + esti összegzés │  (1 funnel + új  │
│  egy kártyában)          │  leadek + stalled│
├──────────────────────────┤  + outreach KPI) │
│  INBOX ZERO (action q.)  │                  │
└──────────────────────────┴──────────────────┘
QUICK ACTIONS (chips)
```

Konkrét lépések:
- Összevon: `DailyBriefing + EveningSummary + TodayTasks + DailyStreak + MissionTracker` → **`TodayCard`** (1 kártya, 3 tab: Reggel / Most / Este).
- Összevon: `PipelineFunnel + ConversionFunnel + StalledLeads + OutreachHealth` → **`PipelinePulseCard`** (1 funnel, alá 3 mini-KPI).
- Összevon: `WeeklyGoals + WeeklyContentSprint + DecisionsDue + Checklist` → **`WeekCard`** (1 oldalsó kártya, fülek).
- Áthelyez egy "Riportok" aloldalra: `Northstar, CompanyHealth, AiUsage, TimeTracker, Trend, Waitlist`. Új route: `/admin/reports` (régi `Mission` page-et erre nevezem át).
- Eltávolít: `BentoGrid` 12-oszlopos rács → egyszerű 2-oszlopos `grid md:grid-cols-2`.

### Fázis 2 — IA konszolidáció *(1 nap)*

**Új nav (4 hub, nincs "Több" lenyíló a fő sávban):**

```text
MA  ·  PIPELINE  ·  TARTALOM  ·  TUDÁS                [⋯ Több]
```

- **MA** = Dashboard + Inbox (fülek egy oldalon, nem külön route).
- **PIPELINE** = Leadek + Partners kanban + Outreach **egy oldalon, fülekkel** (`/admin/pipeline?tab=leads|partners|outreach|instagram`).
- **TARTALOM** = Studio + Calendar + Brand + Media (már most fülezhető, csak egy `/admin/content` shellbe rakjuk).
- **TUDÁS** = Documents (lista + audit + chat fülek) + Trends + Drive.
- **Több** menüpont megmarad sheet-ként: Reports, Retro, Decisions, Simulator, Checklist, AI asszisztens (mert most már inline mindenhol elérhető).

Hatás: 23 route → ~8 elsődleges + másodlagosak. Mély-linkek megmaradnak (redirect a régiekről).

### Fázis 3 — User flow varratmentesítés *(2 nap)*

1. **Lead → Outreach pipeline egy oldalon**: a `Pipeline` oldalon a kanban kártya jobb oldali drawerje már most létezik (`EntityDrawer`) — bővítjük "Outreach lépés" gombbal, hogy ne kelljen másik oldalra menni.
2. **Content brief → publish flow**: Studio belépőn új "wizard" mód (3 lépés: Brief → AI variánsok → Naptárba). Brand-check inline a 2. lépésben.
3. **Heti tervezés egy helyen**: a `WeekCard` (Fázis 1) modal-ban kinyitható → ugyanaz a UI, mint a Retro page; megszünteti az ugrálást.
4. **Egy AI belépő**: `FloatingAIAssistant` marad a globális fő csatorna; `CommandPalette` lesz a "go to / do" rétege (Cmd-K). Az `AdminFabCluster`-t eltüntetjük (a tagjait a Command Palette parancsai alá visszük).

### Fázis 4 — Design hierarchia *(0.5 nap)*

- **3-szintű kártya-skála**:
  - `hero` (nagy, gradient border, KPI-szám 36px) — fold-above-ra.
  - `default` (jelenlegi).
  - `dense` (kompakt lista — listáknál).
- **Cím-hierarchia**: csak a szekciók maradnak cyan uppercase; kártya-címek `text-foreground` semleges + ikon cyan.
- **Page chrome diéta**: `PageSectionNav` csak akkor jelenik meg, ha ≥4 szekció; `PageIntro` alapból kollapszolva (már így van, csak ellenőrzés).
- **Overlay-tisztítás**: max 2 lebegő elem egyszerre (AI assistant + MobileBottomNav mobilon, AI assistant + Cmd-K hint desktopon).

## 4. Mit NEM csinálunk

- Nem törlünk edge functionöket.
- Nem nyúlunk a publikus oldalakhoz (csak `/admin/*`).
- Nem cseréljük a tokeneket, palettát, fontokat.
- Nem írjuk újra az adatmodellt.

## 5. Sorrend és priorizálás

| # | Fázis | Hatás | Kockázat | Becslés |
|---|-------|-------|----------|---------|
| 1 | Dashboard egyszerűsítés | Nagy (napi élmény) | Alacsony | 1 nap |
| 2 | IA konszolidáció (4 hub) | Nagy (navigáció) | Közepes (redirektek) | 1 nap |
| 3 | User flow varratok | Közepes | Alacsony | 2 nap |
| 4 | Design hierarchia | Közepes (átláthatóság) | Alacsony | 0.5 nap |

## 6. Kérdés mielőtt indulunk

1. **Melyik fázist kezdjük először?** Javaslat: **Fázis 1 (Dashboard)** — leggyorsabb látható javulás.
2. Van olyan oldal/funkció, amit **biztosan napi szinten használsz** és nem szabad átalakítani? (pl. Leadek, Outreach modal — ezeket nem terveztem bontani.)
3. A "Több" menüben lévők közül van olyan, amit **soha nem nyitsz meg**? Ha igen, azokat archiváljuk (route megmarad, de kikerül a navból).
