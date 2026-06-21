
# Fázis 7 — Cockpit egységesítés + Trend Radar + kevesebb kattintás

A jelenlegi admin felület **17 menüpont** mély, sok hasonló funkció szétszórva (Inbox, Simulator, Retro, Decisions, Drive, Documents, Documents Chat, Audit…), nincs **globális kereső**, nincs **élő web/piaci jelfigyelés**, és minden művelet 3–4 kattintásra van. Ez a kör ezt rendezi.

## Audit — mi hiányzik most

**Navigáció & UX:**
- 17 oldalsáv item, nincs csoportosítás → kognitív teher
- Nincs globális kereső (lead/partner/doksi/döntés egy helyen)
- Nincs ⌘K command palette → minden 3+ kattintás
- EntityDrawer csak Leads/Partners alatt, nincs Documents/Decisions linkből
- Mobile: oldalsáv minden megnyitásra bezárul, nincs "vissza a listához" breadcrumb

**Adat-összeköttetés:**
- `decisions` nincs összekötve `inbox_items`-szel vizuálisan (review-k nem jelennek meg lead/partner drawerben)
- `outreach_events` reply ≠ trigger döntés-prompt
- `documents` nem ajánl automatikusan releváns leadhez/partnerhez (van bridge, nincs UI prompt)
- KPI snapshot izolált, nem köti vissza `decisions` outcome-hoz

**Élő piaci intelligencia (teljesen hiányzik):**
- Nincs web search a versenytársak (Wolt, Foodora, REVO, Dining City, OTP Szép-kártya partnerprogramok) követésére
- Nincs trend-figyelés (HORECA hírek, Gen Z fogyasztói viselkedés, drink trends)
- Nincs auto-research lead előtt (étterem nyitva van? friss review-k? Instagram aktív?)
- Heti retro nem tartalmaz külső piaci kontextust

**Stratégia & előrelátás:**
- Simulator csak rövid távú (lineáris pipeline), nincs szcenárió-mentés
- Nincs "Pre-mortem" eszköz a döntésekhez
- Nincs OKR / Northstar metric tracking a dashboardon
- Health Radar csak partner, nincs **portfolio-szintű** "company health"

## Mit szállítunk

### 1. Globális Command Palette (⌘K) — minden 1 kattintásra
Új `src/components/admin/CommandPalette.tsx` (shadcn `cmdk`). Globális hotkey (⌘K / Ctrl+K). Funkciók:
- **Keresés** mindenben: leadek, partnerek, dokumentumok, döntések, inbox itemek (fuzzy, real-time)
- **Műveletek** "verb-first": "Új lead", "Új döntés", "Indíts outreach-et X-nek", "Kérj AI javaslatot", "Jump to retro"
- **Navigáció**: bármelyik admin oldalra ugrás
- **Recent**: utolsó 5 megnyitott entitás

Integráció: `AdminLayout`-ban globálisan, minden oldalon elérhető. A felső bar gombja is ezt nyitja meg.

### 2. Navigáció átstrukturálás — 17 → 6 csoport
`AdminLayout` oldalsáv collapsible szekciókba:
```text
🏠 Áttekintés          (dashboard + inbox + döntésnapló)
🎯 Pipeline            (leads + partners + outreach + simulator)
📚 Tudás               (documents + chat + drive + media + brand)
✍️  Content             (content studio + calendar + checklist)
🔭 Intelligencia        (AI asszisztens + Trend Radar — ÚJ)
📊 Reflexió             (retro + audit + KPI)
```
Kis pötty badge szám (pl. Inbox 3, Pipeline 2 lejárt task).

### 3. Trend Radar — élő web kutatás (ÚJ)
Új oldal `/admin/trends` + edge function `trend-radar`:
- **Firecrawl search** (már elérhető a stack-ben) — heti pg_cron-nal lekér piaci jeleket előre definiált queryk alapján:
  - "magyar HORECA trendek 2026"
  - "Gen Z drink preferences Hungary"
  - "Wolt / Foodora partner program changes"
  - "loyalty app benchmarks F&B"
  - egyedi queryk admin által
- **AI** (`google/gemini-3-flash-preview` via Lovable AI) összefoglalja → `trend_signals` tábla (title, summary, source_url, category, relevance_score, published_at)
- **UI**: kártya-feed, kategória szűrő, "Mentés döntésnaplóba" / "Hozzáad inboxhoz" gombok
- **Dashboard widget**: TOP 3 új jel a héten
- **Weekly retro** prompt bővítés: "Külső jelek, amik befolyásolhatják a stratégiát"

Manuális kereső is: bárki indíthat ad-hoc Firecrawl query-t és AI-vel összegezteti.

### 4. Lead Auto-Research
Új edge function `lead-auto-research`: új lead beérkezésekor (vagy gombnyomásra) Firecrawl-lal megnézi:
- Étterem honlapja (`firecrawl scrape` → branding + főbb adatok)
- Google reviews summary (search query)
- Instagram aktivitás (van-e profil, friss-e)
- Versenytárs partner programokban van-e
→ Eredmény `partners.research_notes` jsonb mezőbe, és a Drawer "Áttekintés" tabjára kártyaként.
**Trigger**: új lead beérkezésekor automatikusan (background), vagy "Kutass utána" gomb.

### 5. Universal EntityDrawer + 1-kattintásos actionök
- Drawer **mindenhonnan** elérhető (Inbox, Decisions, Documents linkből is)
- **Quick Action Bar** drawer tetején: "Új task" / "Outreach indítása" / "Döntés rögzítése" / "Doksi csatolása" — mind modal, nem új oldal
- **AI brief** gomb: a drawer adataiból AI 3 mondatos összefoglalót + következő lépés javaslatot ad

### 6. Decision ↔ Outcome auto-loop
- `outreach_events` reply event → automatikus prompt: "Volt erre döntés? Értékeled?"
- Lead → partner konverzió → ha volt kapcsolódó decision, auto-review prompt
- `decisions` widget a dashboard helyett a Drawer "Áttekintés" tabjára kerül kontextusba (entity-specific döntések listája)

### 7. Northstar Dashboard + Pre-mortem
- Dashboard tetejére **Northstar metric** kártya (signed partnerek / hó vs cél) — egyetlen szám, trend ikonnal
- 4 másodlagos KPI (Pipeline value, Win rate, Avg cycle days, NPS placeholder)
- **Pre-mortem mód** új Simulator szcenárió: "Mi mehet rosszul?" — AI 5 kockázat + mitigation, mentés döntésnaplóba

### 8. Transzparencia
- Minden AI hívás (chat, suggest, trend, research) loggolva `metric_events`-be `cost_estimate`-tel
- Új dashboard kártya: **AI Usage Today** (hívások száma, becsült cost, top function)
- Minden Drawer-en "Honnan tudjuk?" expand: forrás-időszalag (mikor mi történt, ki/mi módosította)

## Technikai

**Új fájlok:**
- `src/components/admin/CommandPalette.tsx`
- `src/components/admin/QuickActionBar.tsx`
- `src/components/admin/trends/TrendFeed.tsx`, `TrendSignalCard.tsx`
- `src/components/admin/dashboard/NorthstarCard.tsx`, `AiUsageCard.tsx`, `TrendDigestCard.tsx`
- `src/pages/admin/AdminTrends.tsx`
- `supabase/functions/trend-radar/index.ts`
- `supabase/functions/lead-auto-research/index.ts`
- `supabase/migrations/*` — `trend_signals` tábla + pg_cron (heti), `partners.research_notes` jsonb mező

**Módosított:**
- `src/components/admin/AdminLayout.tsx` — collapsible csoportok + badge számok + ⌘K gomb
- `src/App.tsx` — `/admin/trends` route
- `src/components/admin/crm/EntityDrawer.tsx` — Quick Action Bar + research-notes kártya + AI brief
- `src/pages/admin/AdminDashboard.tsx` — Northstar + AI usage + Trend digest
- `src/pages/admin/AdminSimulator.tsx` — Pre-mortem mód
- `src/pages/admin/AdminLeads.tsx` — auto-research trigger új leadre
- `src/lib/track.ts` — `command_palette_used`, `trend_signal_saved`, `auto_research_run`, `premortem_run`

**Firecrawl**: már van connector a stack-ben (lásd knowledge). Server-side hívás edge functionből, `FIRECRAWL_API_KEY` Deno env-ből.

**Adatbázis (migration):**
- `trend_signals` (id, title, summary, source_url, category, relevance_score, query, published_at, ingested_at, saved_to_decision_id) — admin RLS
- `partners` ALTER: `research_notes jsonb`, `last_researched_at timestamptz`

## Mit NEM csinálunk most
- 6.B.4 Voice morning ritual
- 6.B.9 Email-to-CRM (Resend inbound)
- 6.B.10 Drive Watcher auto-sync
- Public Founder Pulse
- Content Remix Engine

Ezeket egy következő körben, ha a most szállítottak beváltak.

## Kérdés
1. **Firecrawl** connector már él? Ha nem, a Trend Radar és Lead Auto-Research előtt összekapcsoljuk.
2. A **17 → 6 csoportos navigáció** rendben, vagy ragaszkodsz a sima flat listához?
3. **Northstar metric** mi legyen pontosan: aláírt partnerek/hó, vagy MRR-prediktor, vagy waitlist signups?
