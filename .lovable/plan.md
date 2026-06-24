# Fix: Top 3 fókusz + Mission Loop értelmes működése

## Probléma
1. **Top 3 fókusz üres** — az AI legenerálja a feladatokat (`title`, `why`, …), de a `DailyFocusCard` `text`/`done` mezőket vár → üres checkboxokat mutat. Eközben a `TodayTasksCard` ugyanazt az adatot helyesen jeleníti meg → **két kártya, ugyanaz az adat, duplikáció**.
2. **„AI csinálja" hülyeséget csinál** — a Mission Loop ugyanazt a `check_inbox`-ot hívja 3× egymás után üres találattal, majd `awaiting_human`-be áll értelmes kérdés nélkül. Nincs guard duplikált tool-hívás ellen, és a prompt nem mondja meg, hogy üres eredmény után váltson stratégiát.

## Megoldás (kicsi, fókuszált változtatások)

### 1. `DailyFocusCard` eltávolítása a dashboardról
A „Top 3 fókusz ma" kártya ugyanazt az adatot olvasta, csak rossz formátumban. A `TodayTasksCard` („Mai 3 feladat") már szépen mutatja ugyanezt — kézi checkboxszal, AI gombbal, prioritás-címkével. A duplikációt kivesszük → tisztább, egyszerűbb dashboard. (A komponensfájlt megtartjuk, csak az `AdminDashboard`-ról kivesszük; ha később kell, vissza tudjuk tenni.)

### 2. `agent-loop` — duplikált tool-hívás megakadályozása
- A loop-ban ellenőrizzük: ha ugyanazt a tool-t ugyanazzal az inputtal hívná újra (előző iteráció), **automatikusan `ask_human`-re váltunk** explicit üzenettel: „Az AI elakadt — a(z) X tool nem ad új információt. Mit tegyek?" + felajánlott opciók (pl. „Indítsd a bulk scrape-et", „Ugorj a következő feladatra", „Zárd le").
- A system prompt-hoz hozzáadjuk: **„Ha egy tool üres eredményt ad (count=0, items=[]), NE hívd újra ugyanazokkal a paraméterekkel. Vagy próbálj más szűrőt, vagy hívd a `finish`/`ask_human` tool-t."**

### 3. `agent-loop` — `finish`-re kényszerítés, ha nincs értelmes következő lépés
- Maximum 2 egymást követő üres-eredményű tool-hívás után automatikus `finish` ezzel az összegzéssel: „Nincs releváns adat a feladathoz (X üres lekérdezés után). Javaslat: [konkrét emberi lépés]."
- A `task_runs.final_summary` mindig magyar, emberi nyelv — nem JSON dump.

### 4. `MissionLoopDialog` — egyszerűbb, érthetőbb UI
- A „(nincs explicit think)" sort csak akkor mutatjuk, ha tényleg van tartalom — különben elrejtjük.
- Az `input` blokkot összecsukva, csak „Lekérdezés: X várost, Y státuszt keresett" emberi összefoglalót mutatunk.
- Az `eredmény` JSON helyett: „0 találat" / „5 lead találva: Bar A, Bar B…" stb.

## Mit NEM változtatok
- A `daily_focus` tábla séma — marad.
- A `generate-daily-focus` edge function — marad (a kimenete amúgy is jó a TodayTasksCard-nak).
- A meglévő `agent-loop` tool-készlet (search_partners, bulk_pipeline, draft_outreach, check_inbox, mission_snapshot, ask_human, finish) — marad.
- A `TaskAutopilotDialog`, `MissionTracker` és egyéb kártyák — érintetlen.

## Érintett fájlok
- `src/pages/admin/AdminDashboard.tsx` — `DailyFocusCard` import + render eltávolítása
- `supabase/functions/agent-loop/index.ts` — dedup guard + prompt szigorítás + emberi `final_summary`
- `src/components/admin/dashboard/MissionLoopDialog.tsx` — JSON helyett emberi formázás

## Várt eredmény
- A dashboardon **egy** „Mai 3 feladat" kártya, AI által feltöltve, kipipálhatóan.
- A „AI csinálja" gomb vagy elvégzi a feladatot, vagy max 2-3 lépés után **konkrét emberi instrukciót** ad — nem köröz üres lekérdezéseken.
