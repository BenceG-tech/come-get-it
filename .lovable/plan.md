## Probléma

A `LeadOutreachModal`-ban az AI által generált draftok `{{company_name}}`, `{{first_name}}`, `{{city}}` placeholdereket tartalmaznak. A subject/body inputmező ezeket nyersen mutatja (pl. "Exkluzív partnerkeresés, {{company_name}}"), csak a kis "Élesben" preview cseréli ki. Emiatt úgy tűnik, mintha a partner neve hiányozna.

## Megoldás

A `src/components/admin/leads/LeadOutreachModal.tsx` fájlban a placeholder behelyettesítés már létezik (`render()` + `previewVars`). Ezt alkalmazzuk a draftokra is, amikor betöltődnek vagy tone-t váltunk, hogy a szerkesztőmezőben azonnal a valódi cégnév / kapcsolattartó / város jelenjen meg.

### Konkrét változtatások

1. A `previewVars` és `render` definíciókat **`generate()` fölé** mozgatjuk (vagy a partner betöltése után számoljuk), hogy elérhetők legyenek a draft beállításakor. Mivel a `partner` state akkor frissül, amikor a draftokat generáljuk, a render-hez a friss `p` objektumot használjuk inline a `generate()`-en belül — paramétert adunk át, vagy a `useEffect` előbb beállítja a partnert, majd `generate(p)` hívás történik.

2. `generate()` átalakítása:
   - `useEffect` először `setPartner(p)` után hívja `generate(p)`.
   - `generate(partnerArg?)` belül összeállít egy lokális `vars` objektumot (`partnerArg ?? partner` alapján) és egy `applyVars(s)` helpert.
   - A draftokat betöltés után **eltároljuk render-elt formában** (`subject` és `body` mezőkben már a behelyettesített szöveg van), így a `drafts` state, az aktív `subject`/`body`, és a `pickTone()` is a kész szöveget mutatja.

3. `pickTone()` változatlan logikával működik, mert a draftok már render-eltek.

4. Az "Élesben" preview sor maradhat (idempotens, mert már nincs benne `{{...}}`), vagy egyszerűsíthetjük "Címzett: …" sorra. Megtartjuk változatlanul.

5. Az `outreach-quick-drafts` edge function-t **nem módosítjuk** — továbbra is használhat placeholdert, csak a kliens már feloldja küldés előtt is.

### Érintett fájl

- `src/components/admin/leads/LeadOutreachModal.tsx` (csak ez)

Nem érint backendet, nem érinti a sequence sablonokat, és nem törli az `{{...}}` támogatást más helyekről.
