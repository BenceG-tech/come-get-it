## Cél
A Kanban nézet zsúfolt, vízszintesen scrollozni kell, a drag & drop kínos, és a státuszok keverednek az AI readiness-szel. Ezért **töröljük a Kanbant** a `/admin/leads`-ről. Marad **List + Map**, és a List kap egy egyszerű csoportosító kapcsolót, ami pótolja a Kanban átláthatóságát anélkül, hogy oszlopokkal kellene küzdeni.

## Mit változtatunk

### 1. View kapcsolóból eltűnik a Kanban
`AdminLeads.tsx` view toggle: `list | kanban | map` → `list | map`.
- Ha valakinek `kanban` van localStorage-ban / state-ben mentve, fallback `list`.
- Az importok és a komponens hívás (`<LeadsKanban .../>`) törlődik.

### 2. List nézet: új "Csoportosítás" kapcsoló
A meglévő filter sorba egy kis select kerül a View toggle mellé:
- **Nincs csoportosítás** (alapértelmezett — a jelenlegi sima lista)
- **Státusz szerint** (Új lead / Megkeresve / Tárgyalás / Ajánlat / Aláírt / Elutasítva / Szünetel)
- **AI állapot szerint** (Nyers / Kutatva / Pontozva / Értékelve)

Csoportosított módban a táblázat **collapsible szekciókra bomlik**:
```
▼  Új lead · 142
   [táblázat sor]
   [táblázat sor]
   ...
▶  Megkeresve · 38
▶  Tárgyalás · 19
```
- Minden szekció fejléce: ikon + label + count + (státusz csoportnál) gyors „összes feldolgozása" gomb csak readiness-módban, a meglévő `processLevel` újrahasznosítva.
- Drag & drop **nincs** — státuszváltás a meglévő drawer + sor-action útján (nem szükséges új UI).
- A táblázat oszlopok, sort, bulk-select **változatlanok** maradnak.

### 3. ReadinessPipelineBar marad
A 4 kártyás sáv az oldal tetején megmarad — gyors szűrőként és „mind feldolgozása" akcióként továbbra is hasznos. Ez pótolja a vizuális overview-t, amit eddig a Kanban próbált adni.

### 4. Map nézet
Változatlan.

## Mit NEM bántunk
- `LeadsKanban.tsx` fájl egyelőre **a repo-ban marad** (nincs törölve), csak nem rendereljük. Ha később kell, könnyen visszaköthető. _Opcionális:_ ha szeretnéd, törlöm — kérdés a végén.
- `EntityDrawer`, outreach flow, edge functionök, DB schema, bulk action bar, readiness-rendszer — mind változatlan.
- A státuszváltás logika (`pipeline_transitions` insert) **átkerül a drawer-be** ha még nincs ott (ellenőrzendő); jelenleg is működik onnan.

## Technikai részletek

**Módosított fájlok**
- `src/pages/admin/AdminLeads.tsx`
  - `type View = "list" | "map"` (kanban kivéve)
  - View toggle gomb-csoportból Kanban gomb kivéve
  - Új state: `groupMode: "none" | "status" | "readiness"`
  - List render: ha `groupMode !== "none"`, a `filtered` tömböt csoportosítjuk és szekciónként renderelünk `<Collapsible>`-ben.
  - `<LeadsKanban>` import és render törölve
  - `kanbanGroup` state törölve (már nem kell)
- (semmi más fájl)

**Collapsible implementáció**
A meglévő `@/components/ui/collapsible` (Radix) használata, vagy egyszerű `useState` per szekció. Default: első szekció nyitva, többi csukva — gyors átlátás.

**Csoportosító logika (vázlat)**
```ts
const groups = useMemo(() => {
  if (groupMode === "none") return null;
  const map = new Map<string, any[]>();
  filtered.forEach((p) => {
    const key = groupMode === "status" ? p.status : `r${getReadiness(p)}`;
    (map.get(key) ?? map.set(key, []).get(key)!).push(p);
  });
  return map;
}, [filtered, groupMode]);
```

## Sikerkritérium
- A `/admin/leads` oldalon nincs többé vízszintes Kanban scroll.
- 1 kattintással csoportosítható a lista státusz vagy AI állapot szerint, és bármelyik szekció be/kicsukható.
- A ReadinessPipelineBar továbbra is azonnali áttekintést ad a feldolgozottságról.

## Eldöntendő (mielőtt buildelek)
**Töröljem fizikailag a `LeadsKanban.tsx` fájlt is**, vagy hagyjuk benn a kódbázisban arra az esetre, ha vissza akarnád hozni? Alapból **benn hagyom** (kisebb diff), de szólj ha töröljem.