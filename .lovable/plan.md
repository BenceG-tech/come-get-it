## Audit — mi van, mi hiányzik, hova menjünk

### Helyzetkép a DB-ből
| Mit | Mennyi |
|---|---|
| Partnerek/leadek | **103** |
| Outreach sequence-ek | **0** ❗ |
| Enrollment-ek | **0** ❗ |
| Outreach event-ek | **0** ❗ |
| Inbox itemek | 29 |
| Decisions | 2 |
| Documents | 51 |
| Content briefs | 2 |

**A legnagyobb gap:** az egész outreach motor (D fázis analytics, E fázis reply-detection, lead-promote) **üresben pörög**, mert nincs egy sequence se élesben. 103 lead ül és vár. Ezen kívül **1 db cron** van (decision-review-tick) — minden napi automatika manuálisan indul.

### Mi hiányzik (operatív sorrendben)

1. **Outreach onboarding** — sequence template galéria + 1 kattintásos "indítsd el ezt a 103 leadre" flow. Enélkül az egész D/E fázis dísz.
2. **Cron-ok** — `outreach-tick`, `lead-promote-suggest`, `inbox-collect`, `kpi-snapshot`, `daily-briefing` nem fut magától. Reggel kell egy "minden frissítve" állapot.
3. **Inbox actionability** — a `lead_promote` és `lead_stalled` itemekre nincs egy-kattintásos akció. Most csak megjelenik, de promotálni kézzel kell.
4. **Health monitor** — nincs admin oldal ami mutatja: melyik edge function fut hibára, mikor futott utoljára egy cron, mennyi a `failed` event arány.
5. **Onboarding wizard új admin user-nek** — most 22 admin oldal van, nincs vezetett bevezetés. "Hol kezdjem?" érzés.
6. **Mobil élmény** — admin layout desktopra van optimalizálva, partner drawer mobilon kényelmetlen.

### Javasolt fázisok — válassz

**H — Outreach Activation Pack** (legnagyobb hatás, használhatóvá teszi a meglévőt)
- 3 előre megírt sequence template seed (cold outreach venue, follow-up no-reply, post-meeting nurture).
- `AdminOutreach.tsx`-en "Sequence galéria" tab + "Indítsd el N leadre" wizard (lead filter → sequence pick → preview → enroll).
- `outreach-tick` és `lead-promote-suggest` cron beállítása (naponta 8:00).
- Inbox `lead_promote` itemen "Promote 1 click" gomb.

**I — System Health & Automation cockpit**
- Új `/admin/system` oldal: cron státusz, edge function utolsó futás + error rate, failed outreach events, embed lemaradás.
- Cron registry tábla (`cron_jobs`: name, last_run_at, last_status, last_error) + minden cron-hívás végén heartbeat write.
- "Run now" gomb minden cron-hoz.

**J — Mobile-first admin polish**
- Partner drawer mobil layout (full-screen sheet helyett bottom sheet, swipe-elhető tab-ok).
- Inbox swipe-akciók (jobbra = done, balra = snooze 1 nap).
- Voice capture FAB minden admin oldalon (már van, de nem mindenhol).

**K — Onboarding & guided tours**
- Új user első login: 4 lépéses tour (Dashboard → Leads → Outreach → Inbox).
- Üres állapotok minden oldalon: "0 lead — importálj Apify-val vagy CSV-vel".
- `?tour=1` URL param → minden oldal saját mini-walkthrough.

**L — Cross-entity intelligence**
- Globális "AI most mit csinálnál?" panel (jobb felső): aktuális oldal kontextusából 3 javasolt akció.
- Lead → document linker: ha partnernek vannak küldött dokumentumai (partner_documents_sent), megjelenik a drawer-en + "küldd újra" gomb.
- Decision ↔ Outreach loop: ha egy döntés "blocked" → automatikus inbox item.

### Ajánlott útvonal
**1. H** (azonnal érzékelhető érték — végre élesedik az outreach) → **2. I** (a H-t fenntarthatóvá teszi) → **3. K vagy J** ízlés szerint.

Melyik fázist indítsuk?
