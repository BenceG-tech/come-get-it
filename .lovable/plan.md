## Mi a baj most

### 1) Posztok generálása "Failed to fetch" → BOOT ERROR
Edge function log (brief-to-posts):
```
worker boot error: Uncaught SyntaxError: The requested module
'../_shared/brand-context.ts' does not provide an export named 'loadBrandContext'
```
A `_shared/brand-context.ts` csak `BRAND_CONTEXT` konstansot exportál, **de 9 edge function `loadBrandContext()` függvényt importál belőle**, ami nincs. Emiatt mindegyik funkció már a boot-nál meghal — ezért dob "Failed to fetch"-et a UI.

Érintett (mind ugyanattól a hibától halott):
`brief-to-posts`, `suggest-content-briefs`, `content-brand-check`, `generate-multi-format`, `generate-post-image`, `marketing-plan-suggest`, `marketing-assistant-chat`, `calendar-autofill`, `admin-ai-chat`.

→ Emiatt nem megy a posztgenerálás, AI brief-ajánló, brand check, image generálás, marketing chat — egyszerre.

### 2) Top 3 fókusz üres
`DailyFocusCard.tsx` csak olvas a `daily_focus` táblából — **soha nem hívja meg** a már létező `generate-daily-focus` edge functiont. Az AI-os auto-fill kódja kész van, csak nincs bekötve.

---

## Mit csinálok

### A) Fix: `loadBrandContext` export hozzáadása
`supabase/functions/_shared/brand-context.ts`:
```ts
export async function loadBrandContext(supabase: any): Promise<string> {
  let extra = "";
  try {
    const { data } = await supabase.from("brand_memory").select("content").maybeSingle();
    if (data?.content) extra = `\n\nBRAND MEMORY (user overrides):\n${data.content}`;
  } catch (_) { /* tábla opcionális */ }
  return BRAND_CONTEXT + extra;
}
```
Ezzel a 9 funkció egyszerre élesedik — beleértve a "Posztok generálása", "AI brief-ajánló", brand check, image generálás, marketing chat.

(Deploy után curl-lel ellenőrzöm a `brief-to-posts`-ot egy létező brief_id-vel, hogy 200-at ad.)

### B) Top 3 fókusz auto-fill
`DailyFocusCard.tsx`-be:
- Ha mai `daily_focus` record üres / nincs → automatikusan meghívja a `generate-daily-focus` edge functiont (csak egyszer / nap, localStorage flag-gel, hogy ne pörögjön végtelenül ha az AI üres listát ad).
- Add hozzá egy 🪄 **"Újragenerál AI-val"** gombot a kártya headerjébe, hogy bármikor manuálisan is frissíthető.
- Loading state amíg pörög.

### C) Mi van még hátra (a korábbi tervekből, amiket még nem fejeztünk be)

A `.lovable/plan.md` szerint tudatosan kihagyott / félbemaradt elemek:

1. **Sticky jobb-oldali Insight panel** (drawer + sortűztű popover lefedi most)
2. **Virtualizáció** a leadlistára (`@tanstack/react-virtual`) — 720 leadnél még oké, de skálázódáshoz kell
3. **Versenytárs-kontextus / Hasonló nyertes / Best-time blokk** az insight panelen
4. **Auto-tags** (`auto_tags text[]` oszlop + AI tag-elés)
5. **Meta Graph API integráció (Option B)** — automatikus IG DM küldés `META_APP_ID` + `META_APP_SECRET` titkokkal (most semi-auto: copy + ig.me link)
6. **Apify napi autopilot** cron-monitor UI (manuálisan futtatható már, de nincs dashboard a futásokról)
7. **Inbox / reply detection** (most a kimenő szál van, az IG/email válaszok automatikus betöltése + classify nincs end-to-end kötve)

## Most milyen sorrendben menjek?

Először az A + B fix megy (ez kötelező, mert most a fél admin felület halott a brand-context hiba miatt). Aztán a fenti listából amit mondasz, abban a sorrendben építem.
