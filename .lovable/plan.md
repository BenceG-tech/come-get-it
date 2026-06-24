## Cél
Tegyük átláthatóvá a leadek **AI-feldolgozottsági állapotát**: egy szempillantás alatt látszódjon, melyik lead **nyers**, melyik már **kutatva / score-olva / grade-elve**, és mi a következő lépés. Jelenleg minden egy listában van, a "score / grade / research" külön mezők, és nem lehet egyszerűen szűrni azokra, amik még feldolgozásra várnak.

## Új mentális modell: 4 readiness-szint

Minden leadhez egy **AI Readiness állapot** tartozik (kliens-oldalon számolt, partner mezők alapján — nincs DB migráció):

```
0 · Nyers       → nincs research, nincs score, nincs grade
1 · Kutatva     → van research_notes, de nincs score
2 · Pontozva    → van score (lead_score vagy ai_score), de nincs grade
3 · Értékelve   → van lead_grade (A/B/C/D) → kész, mehet outreach-re
```

## Mit építünk

### 1. Pipeline Readiness sáv az `/admin/leads` tetejére
A jelenlegi 5 stat-card (Összes / Új / Folyamatban / Aláírt / Hot) **alá** kerül egy 4-kártyás "AI Pipeline" sor:

```
[ Nyers 142 ]   [ Kutatva 38 ]   [ Pontozva 19 ]   [ Értékelve 24 ]
   →Research      →Score            →Grade            ✓ Kész
```

- Minden kártya **kattintható szűrő** (active state cyan border).
- Jobb sarokban kis "▶ Mind feldolgozása" gomb → az adott szint összes leadjére meghívja a következő lépést (research / score / grade).
- Kártya alatt vékony progress-bar mutatja: `Kutatva: 81/223 (36%)`.

### 2. Új "Readiness" szűrő a meglévő filter-sorba
Az `filterScore` mellé egy `filterReadiness` select:
- Minden szint / Csak nyers / Csak kutatva / Csak pontozva / Csak értékelve / Hiányzik valami.

A jelenlegi score-szűrőt **megtartjuk** — kompatibilis, csak ortogonális.

### 3. Lista nézet: Readiness oszlop a Score/Grade helyett
A "Score / Grade" oszlop **átalakul** "AI állapot" oszloppá: kis 4-pontos progress jelölővel.

```
●●●○   Pontozva (score 72)
●●●●   Értékelve A (score 88)
●○○○   Nyers
```

Mellé tooltip: melyik lépés hiányzik még + `→ Folytat` gomb (futtatja a következő lépést erre az egy leadre).

Score és Grade badge-ek **megmaradnak** a tooltipben / drawer-ben (nem veszünk el infót), csak a fő oszlop letisztul.

### 4. Kanban: új "View mode" toggle
A meglévő státusz-Kanban (`lead → contacted → ...`) mellé egy "Group by" váltó:
- **Státusz** (jelenlegi)
- **AI Readiness** (új) — 4 oszlop: Nyers / Kutatva / Pontozva / Értékelve

Drag & drop a Readiness módban **nincs** (csak vizuális csoportosítás), kattintásra megnyílik a drawer.

### 5. Bulk-bar: új "Hiányzó lépés futtatása" gomb
A meglévő Research / Score / Grade / "Teljes pipeline" gombok mellé:
- **"Folytasd a kiválasztottakat"** — minden kijelölt leadre csak azt a lépést futtatja, ami épp hiányzik. Egy gomb a leggyakoribb usecase-re.

### 6. Drawer: kis "Pipeline progress" sáv az `EntityDrawer` tetejére
A Quick Action Bar fölé 1 sor:
```
AI állapot: ●●●○ Pontozva  ·  Hiányzik: Grade  ·  [▶ Értékel most]
```

## Mit NEM bántunk

- `EntityDrawer`, `LeadOutreachModal`, `BulkOutreachModal` — outreach flow kész, marad.
- Edge functionök (`lead-auto-research`, `score-lead`, `lead-grade-ai-bulk`, `lead-bulk-process`) — változatlanok, csak több helyről hívjuk.
- DB schema — **nincs migráció**. A readiness 100%-ban a meglévő `research_notes` / `lead_score` / `ai_score` / `lead_grade` mezőkből számolódik.
- `partners` táblastruktúra, RLS, status-flow.

## Technikai részletek

**Új fájlok**
- `src/lib/lead-readiness.ts` — `getReadiness(partner) → 0|1|2|3`, `getReadinessLabel`, `getMissingStep`, `getNextAction`.
- `src/components/admin/leads/ReadinessPipelineBar.tsx` — 4-kártyás sáv a stats alatt.
- `src/components/admin/leads/ReadinessBadge.tsx` — ●●●○ jelölő + tooltip + "Folytat" gomb.
- `src/components/admin/leads/ReadinessKanban.tsx` — read-only 4-oszlopos nézet (vagy bővítjük a `LeadsKanban`-t egy `groupBy` prop-pal — ezt választjuk, kevesebb duplikáció).

**Módosított fájlok**
- `src/pages/admin/AdminLeads.tsx` — új readiness state, szűrő, pipeline-bar, oszlop-csere, kanban `groupBy` prop, új bulk-gomb.
- `src/components/admin/leads/LeadsKanban.tsx` — `groupBy?: "status" | "readiness"` prop, readiness módban DnD letiltva.
- `src/components/admin/crm/EntityDrawer.tsx` — 1 soros readiness progress a Quick Action Bar fölé.

**Readiness logika**
```ts
function getReadiness(p) {
  const hasResearch = !!(p.research_notes || p.research_dossier || p.last_researched_at);
  const hasScore    = p.lead_score != null || p.ai_score != null;
  const hasGrade    = !!p.lead_grade;
  if (hasGrade)    return 3;
  if (hasScore)    return 2;
  if (hasResearch) return 1;
  return 0;
}
```

## Sikerkritérium
- A leadek oldal megnyitásakor **első ránézésre** látszik: hány lead vár research-re, score-ra, grade-re.
- 1 kattintással szűrhető bármelyik szint, 1 kattintással elindítható a hiányzó lépés (akár tömegesen, akár 1 leadre).
- Semmilyen meglévő flow nem törik (status Kanban, outreach, bulk pipeline, drawer marad).
