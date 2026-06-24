## Hibajavítás + következő lépések

### A tényleges error
Csak egy React DOM warning a konzolon:
```
React does not recognize the `fetchPriority` prop on a DOM element.
```
Forrás: `src/components/HeroSection.tsx:44` — `<img fetchPriority="high" />`. React 18 a camelCase `fetchPriority`-t nem ismeri natívan a DOM-on; lowercase `fetchpriority` kell (mint a `HeroBackground.tsx`-ben már jól van).

**Nem törésfunkció**, csak warning — az E fázis (ConversionFunnel, StalledLeadsCard, lead-promote-suggest) buildje rendben lefutott.

### Javítás (1 sor)
- `src/components/HeroSection.tsx` 44. sor: `fetchPriority="high"` → `fetchpriority={"high" as any}` (vagy ts-ignore + lowercase, ugyanúgy mint `HeroBackground.tsx`-ben).

### Következő lépések — válassz irányt

**E2 — Lead→Partner konverzió bővítés** (folytatás az E fázishoz)
- "Promote to partner" gomb az Inbox `lead_promote` itemen → státusz `lead` → `contacted` egy kattintással, opcionálisan AI üzenetjavaslat.
- `lead_promote-suggest` cron schedule (naponta reggel 8-kor) — `pg_cron`-nal.
- Konverziós ráta time-series a `ConversionFunnel`-hez (heti összehasonlítás).

**F fázis — Content ↔ Outreach összekötés**
- Saved snippet mint outreach step (eddig csak email_template volt).
- "Mit küldjek ennek?" AI gomb a partner drawer-en (3 snippet javaslat).
- Snippet → reply-rate visszacsatolás.

**G fázis — Daily ops cockpit**
- Reggeli "today screen": ma kihez kell visszanyúlni, mi a legforróbb lead, mi a legfontosabb 1 döntés. Egy oldal, 30 mp alatt átlátható.

Melyik irányba menjünk a fix után?
