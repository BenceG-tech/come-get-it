# Fázis 8 — Élesítés és összekötés

A Fázis 7 leszállította a Trend Radart, Command Palette-et és Northstar dashboardot, de **AI-only módban** fut (nincs élő web), és pár auto-loop még hiányzik. Ez a kör élesít és összeköt.

## Mit szállítunk

### 1. Firecrawl élesítés (élő web kutatás)
- **Firecrawl connector** csatlakoztatása (`standard_connectors--connect`)
- `trend-radar` edge function: `firecrawl search` + `tbs: qdr:w` heti queryk magyar HORECA, Gen Z, Wolt/Foodora témákban → AI összefoglal → `trend_signals`
- `lead-auto-research`: `firecrawl scrape` étterem honlapra + Google review search → `partners.research_notes`
- Heti pg_cron (`trend-radar-tick`) — vasárnap 08:00 automatikus futás

### 2. Decision ↔ Outcome auto-loop
- `decision-review-tick` bővítés: `outreach_events` reply event-re auto-prompt ("Volt erre döntés?")
- Lead → partner konverzió trigger: ha volt kapcsolódó decision, auto-review prompt az inboxba
- EntityDrawer "Áttekintés" tabra: entity-specifikus döntések lista

### 3. Mobil cockpit (jelenleg 402px-en a sidebar elveszi a fél képernyőt)
- Bottom nav (5 ikon: Áttekintés, Pipeline, Tudás, Intel, ⌘K)
- Swipe-able dashboard kártyák
- `EntityDrawer` mobile-friendly: full-screen sheet, nem oldalsó drawer
- Command Palette mobile: nagy érintőfelület, voice input gomb

### 4. Portfolio Health (cég-szintű)
- Új `CompanyHealthCard` a dashboardra: 5 dimenzió radar (Pipeline, Content, Outreach, Knowledge, Cash runway placeholder)
- Forrás: `partner-health-radar` agregálva + `daily_kpi_snapshots`
- Heti delta jelzés (▲/▼ az előző héthez képest)

### 5. Transzparencia + AI Usage részletek
- `AiUsageCard` jelenleg csak hívásszám — bővítés: per-function breakdown, becsült cost (token × ár)
- Új "Honnan tudjuk?" popover EntityDrawer-en: forrás-időszalag (mikor, mi, ki/mi módosította)
- Trend signal kártyára: source URL + scrape timestamp

### 6. Quick Wins (kevesebb kattintás)
- ⌘K-ba: utolsó 5 megnyitott entity (Recent)
- Dashboard kártyákra **inline action**: "Új lead" gomb a Pipeline funnel mellett, "Új trend query" a TrendDigest mellett
- Keyboard shortcut hint a sidebar gombokon (G+L = Leads, G+P = Partners stb.)

## Technikai

**Új fájlok:**
- `src/components/admin/MobileBottomNav.tsx`
- `src/components/admin/dashboard/CompanyHealthCard.tsx`
- `src/components/admin/SourceTimeline.tsx`
- `supabase/functions/_shared/firecrawl.ts` (közös helper)

**Módosított:**
- `supabase/functions/trend-radar/index.ts` — Firecrawl integráció
- `supabase/functions/lead-auto-research/index.ts` — Firecrawl integráció
- `supabase/functions/decision-review-tick/index.ts` — outreach reply trigger
- `src/components/admin/AdminLayout.tsx` — mobile bottom nav + keyboard shortcuts
- `src/components/admin/crm/EntityDrawer.tsx` — mobile full-screen + decisions tab + source timeline
- `src/components/admin/dashboard/AiUsageCard.tsx` — per-function breakdown
- `src/components/admin/CommandPalette.tsx` — Recent items

**Migration:**
- `pg_cron` schedule: `trend-radar-tick` weekly
- Trigger: `outreach_events INSERT WHERE event_type='reply'` → inbox_item insert decision review-hoz

## Mit NEM csinálunk most
- Voice morning ritual (külön kör)
- Email-to-CRM (Resend inbound)
- Drive Watcher auto-sync
- Content Remix Engine

## Kérdések

1. **Firecrawl connector csatlakoztatás**: ok, hogy most élesítsük? (Lovable Cloud-on át, te választod a workspace connection-t)
2. **Mobil bottom nav**: oké az 5 ikonos megoldás, vagy maradjon a hamburger menü?
3. **pg_cron időzítés** a trend-radar futtatására: heti egy futás (vasárnap 08:00) jó, vagy gyakrabban kéred?
