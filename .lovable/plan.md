# Következő fázis — Autopilot end-to-end + IG integráció

A scrape + scoring + lead-discovery már megy. Most a **napi munka tényleges automatizálását** zárjuk be: a "AI csinálja" gombnyomásból ténylegesen kimenjen az üzenet (vagy 1-kattintásra menjen), és az IG csatorna se legyen manuális copy-paste.

## 1) Autopilot → kiküldés zárása (email)

Most a task-autopilot **draft** enrollment-eket csinál — neked még külön jóvá kell hagyni egyenként. Ezt zárjuk be:
- **Auto-send küszöb a sequence guardrails-ben**: ha lead grade ≥ B és AI confidence ≥ 0.75 → automatikus `active` státusz, `outreach-tick` küldi.
- **Review queue**: ami alatta van, az marad `draft`, és a TaskAutopilotDialog tetején egy **"Mind jóváhagy A/B grade"** gomb (most csak "Approve All" van, ami mindent).
- **Daily cap**: max 30 új outreach/nap/csatornán, hogy ne küldjünk spamet és ne égessünk Resend kreditet feleslegesen.

## 2) Instagram — saját accountból küldés

Két szint, **mindkettőt megépítjük**, te döntöd melyiket használod:

**(a) Félautomata — instant működik**
- A LeadsKanban-ban már van „Send DM" → ig.me + vágólap. Ezt kibővítjük:
  - **Bulk IG queue oldal** (`/admin/outreach/instagram`): listázza az összes IG-célzott leadet, mindegyiknél personalizált draft + „Megnyit & másol" gomb sorban. 1 lead = 2 kattintás (megnyit, Ctrl+V+Enter).
  - Státusz tracking: `outreach_events.channel='instagram_manual'`, manuális „Elküldtem"/„Válasz jött" gombok.

**(b) Meta Graph API — teljes auto**
- **Előfeltétel (te csinálod, 1x):** Instagram Business/Creator account + összekötve egy FB Page-zel. (Ha még nem, segítek beállítani — link a Meta dashboardra.)
- **OAuth flow**: `/admin/settings/instagram` oldal egy „Connect Instagram" gombbal → Meta OAuth → access token mentve `comms_channels` táblába (új sor: `instagram_oauth jsonb`, `instagram_business_id`).
- **`instagram-dm-send` edge function**: `POST /me/messages` Graph API hívás.
- **Korlát amit a Meta szab**: hidegen indított DM **nincs**. Csak akkor küldhetünk, ha a lead már írt minket / mention-ölt / story replied. Tehát a Graph API itt **inbox + reply automation**-ra jó, nem cold outreach-re.
- Cold IG outreach-hez marad az (a) félautomata. Ezt nyíltan jelzem az UI-on.

**Meta App Review**: a `instagram_manage_messages` permission live-ban app review-t kér Meta-tól (2-5 munkanap). Dev/test módban a saját accountra megy review nélkül — első körre ez is elég.

## 3) Apify autopilot scheduling

Most kézzel indítod a scrape-et. Hozzáadunk egy **napi 1x automatikus scrape-et** pg_cron-ról:
- 06:00-kor `lead-discovery-plan` lefut → ha van gap és Apify balance > $5 → automatikusan indít 1 célzott scrape-et (max $3 limit).
- Beérkező új leadeket auto-score-olja, és a top 10 grade A/B-t **berakja a másnapi task-autopilot bemenetébe**.
- Toggle az AdminLeads-en: „Napi auto-scrape: BE/KI" + költségplafon slider.

## 4) Score átláthatóság a partner-listán

A `LeadScoreBadge` popover már van. Hozzáadjuk:
- **AdminLeads tábla nézetben** kis ℹ️ ikon a score mellett → ugyanaz a popover.
- **Bulk re-score gomb** a BulkActionBar-ban: kijelölsz N leadet → mind újraszámolódik az új rubrikával (a régieknek még nincs `score_reasons.breakdown`).

## 5) Mit NEM csinálunk most

- TikTok / WhatsApp / Telegram csatornák
- Hangposta / call agent (AI hívás)
- A/B test framework az outreach copy-ra (jövő fázis)

## Érintett fájlok

**Edge functions**
- `task-autopilot` *(módosítás)* — auto-activate B+ enrollments, daily cap check
- `instagram-dm-send` *(új)* — Graph API DM
- `instagram-oauth-callback` *(új)* — OAuth code → token csere
- `apify-daily-autopilot` *(új)* — cron-driven napi scrape orchestrator

**Frontend**
- `src/pages/admin/AdminInstagramQueue.tsx` *(új)* — bulk IG kiküldő UI
- `src/pages/admin/AdminInstagramSettings.tsx` *(új)* — Connect button + state
- `src/components/admin/leads/LeadScoreBadge.tsx` — kompakt mode AdminLeads táblához
- `src/components/admin/leads/BulkActionBar.tsx` — „Újraszámol" gomb
- `src/components/admin/outreach/SequenceGuardrailsEditor.tsx` — auto-send threshold mezők
- `src/components/admin/dashboard/TaskAutopilotDialog.tsx` — „Approve A/B" gomb
- `src/components/admin/leads/ApifyScrapeModal.tsx` — napi auto-scrape toggle + plafon

**DB migráció**
- `comms_channels`: új mezők `instagram_oauth jsonb`, `instagram_business_id text`
- `outreach_sequences`: új `auto_send_min_grade text`, `auto_send_min_confidence numeric`, `daily_cap int`
- `system_settings`: `apify_daily_autopilot bool`, `apify_daily_cap_usd numeric`
- pg_cron: `apify-daily-autopilot` 06:00 UTC-kor

**Secret amit kérek tőled (csak ha (b)-t is csináljuk most):**
- `META_APP_ID`, `META_APP_SECRET` — a Meta Developer dashboardról

## Mit válassz

Mondd meg, mi legyen:
- **A) Csak (1) + (3) + (4)** — autopilot zárás + napi scrape + score UI, IG marad félautomata. Gyors, 1 körben kész.
- **B) Teljes csomag** — A + IG OAuth + Graph API. Hosszabb, Meta credentials kell tőled.
- **C) Custom** — mondd meg mit hagyjunk ki/cseréljünk.
