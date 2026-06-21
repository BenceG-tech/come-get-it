
# Phase 9 — Élő adat, átláthatóság, mobil polish

Három párhuzamos sáv. A Firecrawl bekötése (külön user action) blokkolja az A sáv 1–2 lépését; B és C ettől függetlenül megy.

## A) Élő Firecrawl + heti cron

**A0. Connector bekötés** (user action)
- `standard_connectors--connect` hívás `firecrawl` connector ID-val.
- Eredmény: `FIRECRAWL_API_KEY` automatikusan elérhető edge function-ökben.

**A1. Megosztott helper:** `supabase/functions/_shared/firecrawl.ts`
- `firecrawlSearch(query, { limit, tbs, lang, country, scrapeOptions })` — REST v2 hívás `https://api.firecrawl.dev/v2/search`.
- `firecrawlScrape(url, { formats })` — REST v2 hívás.
- Hibakezelés: 402 → strukturált hiba "insufficient_credits", 401 → "auth_failed".

**A2. `trend-radar` átírása**
- Eddig: csak LLM szintézis témakörökre.
- Új flow: Firecrawl search (`qdr:w` heti szűrő) 4-6 előre definiált queryre (HORECA HU, Gen Z fogyasztói trendek, Wolt/Foodora hírek, italmárka kampányok, fenntarthatóság HORECA, élmény-gasztro).
- Eredmények → LLM (gateway, gemini-2.5-flash) összegzés → `trend_signals` insert `source_url`, `scraped_at`, `query` mezőkkel.
- Per-signal `ai_cost_estimate` mező.

**A3. `lead-auto-research` átírása**
- Inputra (partner_id vagy website_url) `firecrawlScrape(format: ['markdown', 'summary'])` + `firecrawlSearch("<név> vélemények site:google.com OR site:tripadvisor.com")`.
- LLM szintézis → `partners.research_notes` JSONB: `{ summary, strengths, gaps, sources: [{url, scraped_at}] }`.

**A4. Heti pg_cron** (supabase insert tool, nem migration — projekt-specifikus URL/key)
- `trend-radar-weekly`: vasárnap 08:00 CET.
- Inbox-itembe írás futás után ("Új trend digest érkezett").

**A5. UI — forrás transzparencia**
- Új komponens: `src/components/admin/SourceTimeline.tsx` — chronological forrás-URL lista + scraped_at timestamp + favicon.
- Beépítve: `TrendDigestCard`, `AdminTrends` lista, `EntityDrawer` (partners → research_notes).

## B) Quick wins + átláthatóság

**B1. Dashboard inline akciók**
- `NorthstarCard`, `TrendDigestCard` és `CompanyHealthCard` jobb-felső sarkába `Plus` icon-button.
- Northstar → `/admin/leads/new`; Trend → új trend query modal (inline AdminTrends dialógus); Health → `/admin/dashboard?view=actions`.

**B2. Decision review enhancement**
- `inbox_items` → decision_review típushoz "Snooze 3 nap / 7 nap" gomb (új `snoozed_until` mező az `inbox_items`-ben — migration).
- Drawer-ben Decision history-hoz "Új outcome rögzítése" inline form (eddig külön oldal).

**B3. Trend → Content brief konverzió**
- `AdminTrends` minden signal kártyára "→ Brief" gomb.
- Új edge function: `trend-to-brief` — LLM prompt a signal alapján, `content_briefs` insert, navigálás a brief oldalra.

**B4. Valós AI cost az AiUsageCard-ban**
- `metric_events` tábla már loggol AI hívásokat; bővítés: `input_tokens`, `output_tokens`, `model` mezők (migration).
- Edge function helper: `track-ai-usage` (gateway response usage objectből).
- `AiUsageCard` aggregálja Ft-ban (pricing táblázat const-ban: gemini-flash, gpt-5-mini stb.).

**B5. Sidebar shortcut hint-ek**
- `AdminLayout.tsx` sidebar item-ekhez `<kbd>G L</kbd>` jelölés tooltipben.
- Új hook: `useKeyboardShortcuts` — `G+L → /admin/leads`, `G+P → /admin/partners`, `G+T → /admin/trends`, `G+D → /admin/dashboard`, `G+K → /admin/knowledge`.

**B6. Toast → inbox híd**
- `src/lib/track.ts` bővítése: minden `severity: 'warning' | 'error'` toast egyúttal `inbox_items` insertet kap (dedupe_key-vel).

## C) Mobil polish + UX

**C1. EntityDrawer mobilon full-screen**
- Sheet `side="bottom"` mobilon, `h-[95vh]` magasság, drag handle felül.
- Desktop marad `side="right"`.

**C2. Dashboard swipe-elhető kártyák mobilon**
- `embla-carousel-react` (már installálva) használata `<768px` képernyőn — egy kártya/oldal, dots indikátor.

**C3. Pipeline drag-and-drop stage váltás**
- `@dnd-kit/core` (telepítés szükséges: `bun add @dnd-kit/core @dnd-kit/sortable`).
- `AdminPipeline.tsx`: kanban oszlopok között drag.
- Optimistic UI + `pipeline_transitions` insert.

**C4. Bulk akciók a Leads listán**
- Checkbox oszlop + sticky bottom bar: "Outreach indítás", "Címke hozzáadás", "Export CSV".

## Technikai részletek

**Új fájlok:**
- `supabase/functions/_shared/firecrawl.ts`
- `supabase/functions/trend-to-brief/index.ts`
- `src/components/admin/SourceTimeline.tsx`
- `src/hooks/useKeyboardShortcuts.ts`

**Módosított fájlok:**
- `supabase/functions/trend-radar/index.ts`
- `supabase/functions/lead-auto-research/index.ts`
- `src/components/admin/dashboard/{NorthstarCard,TrendDigestCard,CompanyHealthCard,AiUsageCard}.tsx`
- `src/components/admin/crm/EntityDrawer.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/pages/admin/{AdminTrends,AdminPipeline,AdminLeads}.tsx`
- `src/lib/track.ts`

**Migration (1 db):**
- `inbox_items.snoozed_until timestamptz`
- `metric_events.input_tokens int, output_tokens int, model text, cost_huf numeric`
- `trend_signals.source_url text, scraped_at timestamptz, query text, ai_cost_estimate numeric`
- `partners.research_notes jsonb` (ha nincs)

**pg_cron (supabase insert):**
- weekly `trend-radar` vasárnap 08:00

**Költségbecslés futásonként:**
- Firecrawl: ~6 search × 1 credit = 6 credit/hét
- LLM szintézis: ~5k tokens gemini-flash = ~0.5 Ft/hét

## Mi NEM van benne (későbbi fázisok)
- Forecast widget (30/60/90 napos pipeline regression)
- Risk radar auto-flagging
- Voice ritual, Email-to-CRM, Drive Watcher, Content Remix Engine
