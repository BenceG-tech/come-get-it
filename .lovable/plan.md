## Mit látunk most a screenshoton
Az AI azt írja, "tele van budapesti arcokkal" és olyan dolgokat ígér, amik nem igazak — mert az `outreach-personalize` prompt nem tud arról, hogy:
- Most **founding partnereket** keresünk (még nincs felhasználói tömeg).
- A launch **2026 szeptember**, addig csak waitlist van.
- Nincs videó, nincs élő app, nincs userbase, amit lehetne ígérni.
- A founding deal konkrét perkekkel jár (lifetime fee-kedvezmény, co-marketing stb.).

A modal funkcionálisan is sovány: 1 textarea, nincs lépésenkénti előnézet, nincs tone/hossz kontroll, nincs regenerálás, nincs tooltip.

## A terv — 3 réteg

### 1. Kontextus-tudatos AI (`outreach-personalize`)
Új system prompt blokk, ami minden hívásnál belerakja:
- **Fázis:** "founding partner toborzás, soft-launch 2026 szeptemberben, jelenleg waitlist + early access kohorsz épül"
- **Tiltott állítások:** "ne ígérj userbase-t / forgalmat / azonnali vendéget", "ne mondj 'tele van budapesti arcokkal' típusú túlzást", "ne hivatkozz videóra / demóra, csak ha a partner adatban explicit van link"
- **Ajánlott horgok:** founding kedvezmény, korai co-branding, részvétel a curated launch-line-upban, social-proof építés egymással
- **Tone presetek:** `founding_pitch` | `warm_intro` | `short_nudge` | `meeting_close` — a UI küldi, az AI ehhez igazítja a hangot és hosszt
- **Hossz cél:** szavakban paraméterezhető (60 / 120 / 200)
- Visszaad mostantól: `subject`, `preheader`, `body`, `cta`, `risks[]` (mit kerüljön a follow-up), `variants[]` (2 alternatív subject)

A founding kontextust egy `_shared/brand-context.ts` konstans tartja, hogy a többi AI fn (outreach-suggest, lead-promote-suggest stb.) is használhassa.

### 2. Komolyabb `LeadOutreachModal`
Átalakítás tabos felületre a meglévő `Dialog`-on belül:

```text
[ Tartalom ] [ Lépések ] [ Beállítások ]
```

**Tartalom tab** (alapértelmezett):
- Sequence select + step-picker (melyik lépést szerkesztjük — most csak az 1. megy)
- Tone preset chip-sor (4 opció)
- Hossz csúszka (rövid / közepes / hosszú)
- Subject input + **karakterszám** + 2 AI-alternatíva chip ("használom" gombbal)
- Preheader input (új)
- Body Textarea **resizable + szószámláló + monospace toggle**
- "AI személyre szabás" + "Regenerálás más hangnemmel" + "Csak a body-t" gombok
- Risks panel (collapsible): AI mit kerüljön / mire figyeljünk a partnernél
- Élő **email preview** kártya (sötét + világos toggle), placeholder-behelyettesítéssel ({{contact_name}}, {{company_name}})

**Lépések tab**:
- A sequence összes step-je listában, mindegyikhez "Override-ot adok" toggle → ugyanaz a szerkesztő, perszisztálva az enrollment `metadata.personalized_steps[]`-be
- `outreach-tick` ezt már tudja olvasni (kis bővítés)

**Beállítások tab**:
- Indítás időpontja (most / holnap reggel 9 / egyedi datetime picker)
- "Csak ha még nem írtunk neki 30 napja" guard
- Tag-ek hozzáadása az enrollment-hez
- "Founding pitch melléklet csatolása" checkbox (linkeli a Founding Partner PDF-et a body-ba)

### 3. Tooltipek mindenhol
Egy kis `<FieldHelp text="…" />` wrapper a `Tooltip` köré (info ikon a label mellett). Felteszem:
- Sequence select → "Melyik előre megírt levélfolyam menjen ki. Founding pitch = ajánlott."
- AI személyre szabás → "A partner adatai + founding kontextus alapján újraírja."
- Tone chip-ek → mindegyikhez 1 mondat
- Hossz csúszka → "Hány szó körül legyen a body."
- Subject / Preheader / Body → mi hová kerül a postafiókban
- Override toggle → "Csak ennél a partnernél írja felül az eredeti sequence lépést."
- Indítás időpont, guard, founding pitch attach → szintén
- Lead/Outreach kanban oszlopfejlécek és a stalled / promote kártyák → "Mit jelent ez a status?"

### Érintett fájlok
- `supabase/functions/_shared/brand-context.ts` (új) — founding kontextus konstans
- `supabase/functions/outreach-personalize/index.ts` — új prompt + tone/length/variants
- `supabase/functions/outreach-tick/index.ts` — `metadata.personalized_steps[index]` olvasása
- `src/components/admin/leads/LeadOutreachModal.tsx` — tabos átépítés
- `src/components/admin/leads/EmailPreviewCard.tsx` (új) — élő preview
- `src/components/admin/help/FieldHelp.tsx` (új) — tooltip-wrapper info ikonnal
- Pár sor a `BatchEnrollWizard`, `AdminOutreach`, `AdminInbox`-ba: ugyanazt a `FieldHelp`-et használja a fő kontrolloknál

### Mit NEM csinálunk most
- Nem írunk új sequence-engine-t, nem cseréljük a `outreach_sequences` schemát.
- Nem nyúlunk a homepage / landing kóphoz.
- A többi AI fn promptját csak akkor, ha kérsz rá külön zöld utat (most csak az import létrejön).

Mehet?
