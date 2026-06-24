## Következő iteráció — válassz irányt

A D fázis (Outreach Analytics) kész. Innen három logikus irány nyílik:

### Opció 1 — D2: Outreach analytics mélyítés
- **CSV export** a sequence teljesítmény táblából
- **Időbeli A/B összehasonlítás**: két sequence egymás mellett (side-by-side funnel + reply rate trend)
- **"Best step" kiemelés**: melyik lépésnél esik le legjobban a funnel → konkrét javaslat a lépés átírására (InlineAIHelper-rel)
- **Heatmap**: melyik napszakban / hétköznapon nyitnak legtöbbet → optimal send time javaslat
- Fájlok: `OutreachAnalytics.tsx` bővítés + új `OutreachABCompare.tsx` + `OutreachSendTimeHeatmap.tsx`

### Opció 2 — E fázis: Lead → Partner konverzió motorja
- **Auto-promote**: ha egy lead `score >= 80` ÉS válaszolt outreach-re → automatikus partner létrehozás + drawer felugró javaslat
- **Konverziós tölcsér widget** a dashboardon: lead → kontaktált → válaszolt → partner → aktív (számok + %)
- **"Stalled leads"** lista: 14+ napja nem mozdult, AI-javaslat következő lépésre
- Új edge function: `lead-promote-suggest` (cron, naponta)
- Fájlok: új `ConversionFunnel.tsx`, `StalledLeadsCard.tsx`, edge function, dashboard integráció

### Opció 3 — F fázis: Content ↔ Outreach összekötés
- Brief / saved snippet kiválasztható outreach step-ként (eddig csak email_template volt)
- "Mit küldjek ennek?" gomb a partner drawer-en: AI a partner profilja + meglévő briefek alapján 3 snippet-javaslatot ad
- Snippet performance → outreach reply rate visszacsatolás: melyik snippet hozott választ
- Fájlok: `outreach_sequences.steps` schema bővítés (snippet_id), `EntityDrawer.tsx` SuggestSnippetButton, `outreach-tick` bővítés

### Opció 4 — Más
Szabad szöveggel megmondom mit kérek.

---

**Melyik irány?** (Vagy mondj sajátot.)
