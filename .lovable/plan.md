## Problémák

### 1. „AI segítség" (InlineAIHelper) nem működik
A popover az `admin-ai-chat` edge functiont hívja `supabase.functions.invoke`-val, de az a függvény **SSE streamet** ad vissza (`stream: true`). A kliens `data?.text ?? data?.message ?? …` mezőket próbál olvasni, ami sosem létezik streamben → vagy üres válasz, vagy nyers SSE szöveg JSON-ként megjelenítve. Ezért nem kapunk értelmes választ.

### 2. Outreach draftok nem elég meggyőzők
A `outreach-quick-drafts` prompt általános, nem használja a partner notes-t/score-t/next_action-t explicit horogként, nincs konkrét value prop (founding kedvezmény, 0 rizikó, valódi insightok), és nincsenek bizonyíték-elemek (Dusk benchmark, várólista méret, traction).

---

## Megoldás

### A) Új könnyű edge function: `admin-ai-quick` (nem-streaming)
Új fájl: `supabase/functions/admin-ai-quick/index.ts`
- Auth + admin check (mint a többi admin function).
- Bemenet: `{ surface, context, prompt }`.
- Lovable AI Gateway hívás **`stream: false`-szal**, `google/gemini-3-flash-preview`.
- System prompt: rövid, akcióközpontú magyar válasz, brand hang. Kontextus a userMsg-be JSON-ként.
- Visszaadja: `{ text: string }`.
- Hibakezelés: 429 (rate limit), 402 (credits) explicit üzenettel.

### B) `InlineAIHelper.tsx` frissítése
- `supabase.functions.invoke("admin-ai-quick", { body: { surface, context, prompt } })` hívás.
- Olvasás: `data.text`. Hiba esetén toast-ban a backend `error` mezőjét mutatjuk.
- A meglévő UI (chips, textarea, markdown render, Beillesztés) változatlan.

### C) `outreach-quick-drafts` prompt és bemenet feljavítása
Fájl: `supabase/functions/outreach-quick-drafts/index.ts`
1. **Több partner kontextus**: a `partners` select-be `website`, `phone`, `instagram`, `address`, `ai_summary`, `lead_score`, `lead_grade`, `apify_data` (rating, review_count) mezők beolvasása (amelyik létezik a sémában — előbb ellenőrzöm).
2. **Utolsó interakciók**: opcionálisan `partner_interactions` utolsó 3 sora — ha van, beépítjük a promptba „mire reagált korábban".
3. **Erősebb system prompt**:
   - Konkrét value prop blokk: „Founding kör (első 20 hely): 0 setup díj, 50% kedvezmény az első 6 hónapban, exkluzív city-launch PR".
   - Bizonyíték: „Dusk app benchmark (UK): 35% repeat visit lift; Come Get It már X várólistás user Budapesten" — placeholderként, hogy ne találjunk ki számokat, az AI-nak mondjuk: „csak akkor használj számot, ha a kontextusban szerepel".
   - Stílus szabályok: nyitás SOSEM „Tisztelt…", mindig egy konkrét megfigyelés a partnerről (név, város, kategória, rating, review szám → ha van). Tegező, energikus, nincs corporate-baromság.
   - Tiltólista: „remek lehetőség", „izgalmas együttműködés", „win-win", „forradalmasítjuk".
   - CTA: konkrét, alacsony súrlódású — „15 perc videohívás csütörtök 10:00 vagy péntek 14:00?" (két opció), vagy „dobok egy kávét nálatok jövő héten?".
   - 3 hangnem külön szabállyal:
     - `founding_pitch`: status + scarcity (limitált helyek), business case, 1 konkrét adat ha van. 90-140 szó.
     - `warm_intro`: 1 megfigyelés a helyről (Google rating / review highlight / city) → kérdés → kávé CTA. 70-110 szó.
     - `short_nudge`: max 50 szó, 1 kérdés, P.S. nélkül.
4. **Subject szabály**: alanyban szerepeljen a partner cégnév vagy város (pl. „Grumpy + Come Get It — 15 perc?" / „Budapesti bárok founding köre — Grumpy?").
5. **Önellenőrzés a promptban**: „mielőtt visszaadod, ellenőrizd: van-e benne tiltott kifejezés, konkrét személyre szabott elem, és világos CTA — ha nem, írd újra."
6. **Modell**: marad `google/gemini-2.5-flash` (gyors, jó magyar), `response_format: json_object`.

### Érintett fájlok
- `supabase/functions/admin-ai-quick/index.ts` (új)
- `src/components/admin/ai/InlineAIHelper.tsx` (1 invoke csere)
- `supabase/functions/outreach-quick-drafts/index.ts` (prompt + context bővítés)

### Amit NEM érintünk
- `admin-ai-chat` streaming endpoint marad változatlan (a fő AI chat használja).
- `LeadOutreachModal.tsx` UI változatlan — a placeholder-render már működik az előző körből.
- Adatbázis migrációk nincsenek.
