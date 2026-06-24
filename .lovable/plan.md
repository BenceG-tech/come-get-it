# Új megközelítés: receptek + eredmény panel (a ReAct loop helyett)

## Miért nem működik a jelenlegi
A mostani `agent-loop` egy általános ReAct ügynök: a modell maga dönti el melyik tool-t hívja, és ettől gyakran random irányba indul, üresben pörög, vagy `ask_human`-ba menekül. Sok think/observe szöveg jön, de nincs a végén semmi, amit ki tudnál küldeni vagy elfogadni.

## Új modell: "Recept" pipeline-ok feladat-típusonként
A feladatnak van egy **típusa** (outreach / research / scoring / follow-up / inbox-triage). Minden típushoz tartozik egy fix, determinisztikus pipeline — nem az AI dönti el a lépéseket, hanem a kód. Az AI **csak a kreatív részt** csinálja (személyre szabás, szövegírás, döntés egy konkrét leadről), a többi sima DB lekérdezés és edge function hívás.

Eredmény: minden run végén **konkrét, jóváhagyható kimenet** kerül egy panelbe.

### Példa receptek

**1. Outreach pipeline** (pl. „Küldj 5 megkeresést koktélbárokba")
```
1. search_partners(city, kategória, min_grade) → top 5 lead
2. minden leadre párhuzamosan: draft_outreach(lead) → personalizált email
3. eredmény panel: 5 kártya, mindegyiken {lead név, score, draft email, [Küldés] [Edit] [Skip]}
```

**2. Research pipeline** (pl. „Nézz utána az új budapesti helyeknek")
```
1. bulk_pipeline(scrape + score + grade) — háttérben
2. amikor kész → top 10 új A/B grade lead riport
3. eredmény panel: lista + [Felvenni az outreach queue-ba] gomb
```

**3. Inbox triage** 
```
1. check_inbox → unread items
2. minden itemhez AI kategorizál: válasz kell / spam / info
3. eredmény panel: csoportosított lista, gyors válasz drafttal
```

**4. Follow-up pipeline**
```
1. lekérdezi a 7+ napja nem válaszolt outreach-eket
2. AI ír follow-up draftot mindegyikre (rövidebb hangnem)
3. eredmény panel: lista + [Küldés mind] / egyenkénti jóváhagyás
```

## Hogyan választódik ki a recept
A task létrehozásakor (vagy első kattintásra) egy rövid AI hívás **klasszifikálja** a feladat szövegét egyetlen típusba (`outreach` | `research` | `followup` | `inbox` | `custom`) + kihúzza a paramétereket (város, kategória, mennyiség). Ez 1 db gyors `generateText` hívás strukturált outputtal — nem loop.

Ha a típus `custom` (nem illik egyik sablonra sem), akkor — és **csak akkor** — fallback a mostani agent-loop egy szigorúbb verziójára, max 3 lépéssel.

## UI változás: `MissionLoopDialog` → `TaskResultDialog`
A mostani think/tool/observe stream helyett:
- **Felül**: 1 mondat státusz („5 lead feldolgozása… 3/5 kész")
- **Progress bar** a recept lépéseihez (Lead keresés → Draftok írása → Kész)
- **Középen**: az eredmény panel — kártyák, draftok, akció gombok
- **Alul**: „Mindet elfogadom" / „Bezárás"

Háttérben futás közben push toast: „AI végzett: 5 draft vár jóváhagyásra".

## Technikai változások

**Új edge functions** (cseréli az `agent-loop`-ot a fő útvonalon):
- `task-classify` — egy gyors AI hívás, ami eldönti a recept típusát + paramétereit
- `task-run-recipe` — a determinisztikus pipeline futtató, recept ID alapján dispatch-el
  - belül: `recipes/outreach.ts`, `recipes/research.ts`, `recipes/followup.ts`, `recipes/inbox.ts`
  - mindegyik egy egyszerű async függvény, ami DB-t olvas/ír és AI-t hív a kreatív részhez
- `agent-loop` megmarad fallbacknek `custom` típusra (de szigorítva: max 3 iter, kötelező `finish`)

**DB**: `task_runs` táblához:
- `recipe_type` (text) — melyik recept fut
- `recipe_params` (jsonb) — kinyert paraméterek
- `result_items` (jsonb) — a kártyák amiket a UI mutat (leadek, draftok, stb.)
- `progress` (jsonb) — `{step: 2, total: 3, label: "Draftok írása"}`

**UI**:
- Új `TaskResultDialog.tsx` (cseréli a `MissionLoopDialog`-ot)
- Realtime sub a `task_runs` sorra → progress + result_items frissül
- Kártya komponensek típusonként: `OutreachDraftCard`, `LeadCard`, `InboxItemCard`
- Akció gombok: a UI gombnyomásra hívja a megfelelő edge functiont (send-email, mark-read, stb.)
- Háttérben futáskor toast notification + badge a feladat melletti gombon

**Régi kód**: `MissionLoopDialog.tsx` törölve, `agent-loop` egyszerűsítve fallbacknek.

## Mit nyer ezzel a felhasználó
- **Látja** mit csinál: konkrét lépések, nem absztrakt „thinking"
- **Konkrét output**: minden run végén kártyák amiket egy kattintással elfogadhat
- **Nem akad el**: a recept fix lépéseken megy végig, nem találgat
- **Háttérben fut**: nem kell nézni, jön a toast ha kész

## Scope ennek az iterációnak
Első körben 2 recept élesben: **outreach** és **research** (a leggyakoribb use case-ek). A `followup` és `inbox` recept szerkezete megvan, de később aktiváljuk. `custom` fallback megmarad ritka esetekre.
