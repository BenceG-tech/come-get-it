## Válaszok a kérdéseidre

### 1) Futtathatok 100+ lead-re egyszerre Research + Score + Grade-et?

**Rövid válasz:** technikailag igen, de **NEM ajánlott egyszerre mindhármat ugyanazokra**, és van pár veszély amit ma kezelni kell:

| Művelet | Hogyan fut most | Limit / Veszély |
|---|---|---|
| **Research** (`lead-bulk-research`) | háttérben, 4 párhuzamosan, lead-enként ~10–30s (Firecrawl scrape + AI) | 100 lead ≈ 5–10 perc. **Firecrawl rate-limit** és **AI gateway quota** könnyen elfogyhat. Edge worker 150s után lezárul → ha a háttér worker is leáll, részben befejezetlen marad. |
| **Score** (`score-lead`) | **szinkron**, lead-enként 1 AI hívás (Gemini overlay) a request-en belül | 100 lead × ~2s = 200s → **biztos 504 timeout**. Nincs background fallback. |
| **Grade** (`lead-grade-ai-bulk`) | **1 AI hívás az összesre együtt** (egy nagy prompt) | Skálázódik 20-ig jól. 100+ leadnél a prompt túl nagy / a JSON parse instabil. |

**Mit kockáztatunk ha mind a hármat egyszerre indítod 100+ lead-re:**
- AI gateway rate-limit (429) — felezi/kuktázza az eredményeket
- Firecrawl havi credit gyorsan elfogy
- `score-lead` 504-el elhasal
- Verseny: Research még fut amikor Grade már lekérdezi a `research_dossier`-t → üres/régi adat alapján gradel

### 2) Ha újra ránomyok Scrape-re, lesz duplikáció?

**Nem** — az `apify-run-import` és `apify-runs-tick` dedupol kétféleképp:
1. `apify_place_id` / `google_place_id` egyezés (Google Maps stabil ID)
2. `company_name + city` normalizált egyezés

Tehát ha **ugyanazt a keresést** futtatod (pl. "Budapest koktélbár"), a már meglévő helyek `duplicates++` számlálóra mennek, **nem kerülnek be újra**. A toast pontosan ezt írja ki: *"X új lead (Y duplikátum kihagyva)"*.

⚠️ **Edge case-ek ahol mégis lehet duplikáció:**
- Ha egy hely átnevezte magát (más `company_name`) és nincs `apify_place_id` az előző importon → új sornak látszik
- Ha más városban ugyanaz a név (pl. lánc) — szándékosan különböző
- Régi, kézzel felvitt leadeknél nincs `apify_place_id` → csak név+város egyezésre megy a dedup

---

## Javasolt fejlesztések (ezt építeném meg ha jóváhagyod)

### A) **Egységes "Process All" pipeline** — egy gomb, helyes sorrendben

Új edge function `lead-bulk-process` ami **chunk-okban** dolgozik:

```
Chunk = 10 lead
For each chunk (background, sequential):
  1. Research (4 párhuzamos a chunkon belül)
  2. Várj amíg mind kész → ekkor van friss research_dossier
  3. Score (deterministic baseline azonnal + AI overlay async)
  4. Grade (chunk-onként 1 AI hívás, mert így pontos)
Throttle: 2s pihenő chunkok között (rate-limit védelem)
Progress: minden chunk után update `task_runs` táblába → UI poll
```

**Eredmény 100 lead-re:** ~6–8 perc háttérben, hibák lokálisak (1 chunk bukik, többi megy), live progress bar a UI-on.

### B) **`score-lead` átírása background-ra** (mint a research)

`EdgeRuntime.waitUntil`-lel, hogy ne 504-eljen 20+ lead-nél. Frontend toast: *"Score-olás indult háttérben, ~X perc"*.

### C) **Bulk Action Bar új gomb: ⚡ "Teljes pipeline"**

A `BulkActionBar.tsx`-be új gomb a Research/Grade/Score mellé:
- címke: **"Mindent"** (Telescope + Sparkles + Bot ikon kombináció)
- meghívja `lead-bulk-process`-t
- konfirmáció ha > 50 lead: *"Ez ~X perc és ~Y AI hívás. Folytatod?"*

### D) **Apify dedup erősítés (opcionális)**

A `lead_import_jobs` táblába már mentődik melyik lead melyik run-ból jött. Adnék egy banner-t a Scrape Modal tetejére: *"Utolsó futás 2 órája volt ugyanezzel a query-vel — biztos újra akarod?"* — így csökkentjük a feleslegesen elhasznált Apify credit-et.

### E) **Rate-limit guard a `_shared/`-ben**

Egy `withRateLimit(fn, { perMinute: 30 })` wrapper az AI gateway hívásokra — ha közelítjük a limit-et, automatikusan throttle-ol és nem dob 429-et.

---

## Mit szeretnél?

- **(1) Csak A + C** — egy gombbal teljes pipeline 100+ lead-re biztonságosan *(ez a fő kérdésedre a megoldás)*
- **(2) A + B + C** — fenti + `score-lead` is background-ra (akkor önállóan is futtathatsz 100 lead score-t)
- **(3) Mind (A–E)** — teljes csomag, dedup banner + rate-limit guard is
- **(4) Csak válasz, ne építsünk** — most csak tudni akartad

Mondd meg melyiket, és nekiállok.