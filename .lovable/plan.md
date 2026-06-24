
# Leadek oldal újragondolása — v2

## 1) Azonnali takarítás (egyszeri, most)
- Törlöm a **103 db non-apify** leadet (`partners` ahol `type='venue' AND source <> 'apify_google_maps'`), kivéve azokat amelyeknek már van `status IN ('contacted','negotiating','proposal_sent','signed')` — ezeket megőrzöm, hogy ne veszítsünk élő dealt.
- Megerősítést kérek a UI-ban ("103 lead törlése — biztos?") — ha nem akarod a guardot, szólj.

## 2) Új Leads UI — egy oldal, három réteg

```text
┌────────────────────────────────────────────────────────────┐
│  Header: stats + AI Autopilot CTA + Apify scrape           │
├────────────────────────────────────────────────────────────┤
│  Toolbar:  [keresés] [városi chip] [grade chip] [score]    │
│            [drag-select toggle] [oszlop-választó]          │
├──────────────────┬─────────────────────────────────────────┤
│  Lista (bal)     │  Insight panel (jobb, sticky)           │
│  - sűrű sor      │  ┌─ Áttekintés ─ Kutatás ─ Outreach ─┐  │
│  - inline check  │  │  EGYESÍTETT "AI Insight"          │  │
│  - drag-select   │  │  (brief + auto-kutatás összevonva)│  │
│  - hover-quick   │  │  + Fit/Risk/Talking points        │  │
│    actions       │  │  + Google/IG/web metrikák         │  │
│  - virtualized   │  │  + kapcsolat blokk + következő    │  │
│                  │  │    lépés gomb                     │  │
└──────────────────┴─────────────────────────────────────────┘
```

### Listanézet újítások
- **Drag-select**: bal egér lehúzással téglalap-kijelölés (mint Finder). Shift+klikk range, Ctrl/Cmd+klikk egyenkénti toggle.
- **Inline gyors-műveletek** hoverre: ✏️ jegyzet, 📞 hívás, ✉️ email, 🔭 kutat, 🗑️ töröl.
- **Több info egyből** a sorban (kompakt, de olvasható):
  - név + emoji-badge (🔥/⭐ kontextus)
  - 2. sor: város · kategória · ⭐google · 📷 IG follower · 📧 ✓/✗ · 📞 ✓/✗
  - jobb oldal: score-pill + grade-pill + státusz-chip + utolsó interakció relatív idő
- **Oszlop-választó** (gear ikon): a user maga eldöntheti mit lát.
- **Virtualizáció** (>500 sor): `@tanstack/react-virtual`, hogy 2000 lead se lassuljon.

### Bulk akciók — minden egyszerre
A `BulkActionBar` kibővítve:
- 🔭 **"Kutass mindet"** → új `lead-bulk-research` edge function: queue-zva, párhuzamos `lead-auto-research` hívások (max 5 concurrent), élő progress toast.
- 🤖 **"AI grade mindet"** → meglévő `lead-grade-ai-bulk` a kijelöltekre, nem fix top20-ra.
- ✦ **"Score mindet"** (már van)
- 🚀 **"Outreach mindet"** (már van)
- 🗑️ **"Töröl"** (már van)
- 📤 **"CSV"** (már van)

## 3) AI Insight — brief + kutatás összevonása
Jelenleg két különálló dolog: 3 mondatos `generateBrief` (admin-ai-chat) + részletes `lead-auto-research` (Fit/Risk/Talking points). **Összeolvasztom egybe**:

- Új egységes edge function: `lead-insight` (refaktor a `lead-auto-research`-ből)
  - Ha még nincs kutatás → futtatja a web scrape-et + Gemini elemzést
  - Ha van → friss `insight_summary`-t ad (TL;DR 2 mondat) + a meglévő Fit/Risk/Talking points-ot
  - Cache: ha `last_researched_at` < 14 nap, csak újragenerálja a TL;DR-t a meglévő adatból (olcsó)
- A drawerben **egy gomb**: ⚡ **AI Insight** (brief gomb megszűnik)
- A meglévő `auto-kutatás` card mindig látszik ha van adat; a TL;DR a tetején

### Hiba javítása ("AI brief hiba: Failed to send a request to the Edge Function")
- A `generateBrief` jelenleg `admin-ai-chat`-et hív — ez vagy nincs deployolva, vagy nincs CORS-a. A `lead-insight`-ra váltással ez a hívás megszűnik. Az új function-ön ellenőrzöm a CORS-t és deploy után curl-lel tesztelem.

## 4) Új funkciók az Insight panelhez
- **🎯 Következő lépés** gomb: AI generál 1 konkrét akciót ("küldj IG DM-et X szöveggel") → 1 kattintásra végrehajt (másol+megnyit / outreach enroll).
- **📊 Versenytárs-kontextus**: ugyanabban a kerületben hány hasonló kategóriájú hely van már a piszkában — segít priorizálni.
- **🔗 Hasonló nyertes**: ha van már signed partnered hasonló profillal, kiemeli ("Ez nagyon hasonlít a már signed Kandalló Bistro-ra").
- **💬 Drafted message preview**: az IG DM / email első mondata, hogy ne kelljen modalba lépni.
- **⏰ Best time to contact**: Google "popular times" adatból (ha Apify hozza) javasol időpontot.
- **🏷️ Auto-tags**: AI tag-eli (pl. "rooftop", "kutyabarát", "élő zene") — szűrhetőek lesznek.

## 5) Menü-dropdown bug
A bal admin sidebar dropdown-jai jelenleg `onMouseEnter` + `onClick` mixet használnak → első klikk csak hover-state-et trigger-el, második nyit. Áttérek **single-click toggle**-re (Radix DropdownMenu vagy `useState` controlled). Egy klikk → nyit.

## 6) Technikai részletek

### Új / módosított fájlok
- **Új**: `src/components/admin/leads/LeadsListV2.tsx` (virtualizált lista + drag-select)
- **Új**: `src/components/admin/leads/LeadInsightPanel.tsx` (egységes AI insight)
- **Új**: `src/hooks/useDragSelect.ts`
- **Új edge function**: `supabase/functions/lead-insight/index.ts` (egyesíti brief+research)
- **Új edge function**: `supabase/functions/lead-bulk-research/index.ts` (párhuzamos batch)
- **Módosított**: `src/pages/admin/AdminLeads.tsx` (új layout, sticky insight panel)
- **Módosított**: `src/components/admin/leads/BulkActionBar.tsx` (új gombok: research, grade)
- **Módosított**: `src/components/admin/crm/EntityDrawer.tsx` (brief gomb → AI Insight, hiba fix)
- **Módosított**: sidebar dropdown komponens (single-click)
- **Migráció**: `partners` táblára 2 új oszlop: `auto_tags text[]`, `insight_summary text`

### DB takarítás SQL
```sql
DELETE FROM partners
WHERE type='venue'
  AND (source IS NULL OR source <> 'apify_google_maps')
  AND status IN ('lead');  -- aktív dealt nem bántunk
```

### Függőség
`bun add @tanstack/react-virtual` (kis, ~3KB)

## 7) Mi marad változatlan
- Kanban + térkép nézet
- Apify scrape modal és napi autopilot
- Outreach sequences logika
- Score rubric

## Kérdés mielőtt nekiállok
1. **Törlés guard**: tényleg töröljem azt a 103 importált leadet most, vagy csak archiváljam (új `archived_at` mező)?
2. **Insight panel**: jobb oldali sticky panel (desktop only), vagy a meglévő drawer maradjon és csak átdolgozzam?
3. **Új funkciók közül** (4. pont): melyik 2-3 a legfontosabb most? Mindegyik belefér, de prioritás segítene a sorrendben.
