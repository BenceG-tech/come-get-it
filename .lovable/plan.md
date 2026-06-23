# Fázis C + D — AI tool-ok, chat mentés, motivációs réteg

## Fázis C — AI asszisztens mint központi munkafelület

### C1. `admin-ai-chat` edge function bővítése AI SDK tool-okkal
A jelenlegi `admin-ai-chat` átáll **AI SDK `streamText` + `tool()`** mintára (jelenleg sima chat completions). Új tool-ok:

| Tool | Mit csinál | Backend hatás |
|---|---|---|
| `createPartner` | Új partner rekord (név + opcionális város/típus/kapcsolat) | `partners` insert |
| `createContentBrief` | Új poszt-brief (cím, csatorna, dátum) | `content_briefs` insert |
| `scheduleCalendarEntry` | Naptár-bejegyzés (dátum/idő/csatorna/cím) | `marketing_calendar` insert |
| `saveConversationAsDocument` | Az aktuális thread → új doksi a tudásbázisban (cím + AI-summary) | `documents` insert |
| `searchDocuments` | Szemantikus keresés a meglévő doksikban | `doc-semantic-search` hívás |
| `createInboxItem` | Saját feladat / emlékeztető berakása az inboxba | `inbox_items` insert |

Minden tool **admin user-scope-ban** fut (a meglévő `has_role` check után). `stopWhen: stepCountIs(50)` az agent loop-ban.

### C2. Chat panel UI — thread-ek + akciók
`FloatingAIAssistant.tsx` kibővítése:
- **Thread lista** balra (mobil: drawer): localStorage-ban tárolt `{ id, title, updatedAt, messages: UIMessage[] }[]` kulcs `cgi.admin.ai.threads.v1`.
- Új gombok a panel fejlécén: **„Új beszélgetés"**, **„Mentés doksiként"** (= `saveConversationAsDocument` tool meghívása).
- Tool-call render: minden tool eredmény kap egy kis kártyát (pl. „✓ Partner létrehozva: Kőleves bisztró — [Megnyit]" link).
- Üzenetek `message.parts` alapján renderelnek (text + tool-invocation + tool-result).
- Composer textarea fókusz auto-restore (küldés után, thread-váltás után).

### C3. Egységes AI elérés
- A jelenlegi `marketing-assistant-chat` és `chat-with-documents` továbbra is megmaradnak (külön kontextus), de a **fő FAB chat** (`FloatingAIAssistant`) az új `admin-ai-chat`-et használja tool-okkal.

## Fázis D — Motivációs réteg

### D1. Streak DB tábla
Új tábla `public.user_streaks`:
```
user_id uuid PK, current_streak int, longest_streak int,
last_action_date date, weekly_goal int default 7,
weekly_progress int, week_start date, updated_at timestamptz
```
RLS: user csak a sajátját látja/írja. GRANT-ek a kontraktusnak megfelelően.
A `DailyStreakBar` átáll erre (jelenleg `marketing_calendar`-ból számol).

### D2. Confetti + esti összefoglaló
- `canvas-confetti` (már nincs a stack-ben → `bun add canvas-confetti`) hozzáadása.
- Trigger pontok: partner státusz → `signed`, új doksi mentés, naptár-bejegyzés posztolva.
- `EveningSummaryCard.tsx` — 18:00 után jelenik meg a Ma oldalon: napi eredmények + holnap fókusza (a `daily_focus` táblából + `marketing_calendar`).

### D3. Pozitív üres állapotok
Globális csere a fő hub-okon („Még nincs adat" → biztató CTA-s változatok, lásd a meglévő `EmptyState` komponensben). 4-5 string érintett.

## Technikai részletek

- **Edge function változás**: `supabase/functions/admin-ai-chat/index.ts` — AI SDK `streamText` + `toUIMessageStreamResponse`. Tool execute függvények ugyanitt (service role kliens, user-scope a JWT-ből kinyert `user.id`-vel).
- **Client**: `useChat` (`@ai-sdk/react`) — `DefaultChatTransport` a függvény URL-jére, `Authorization: Bearer <publishable key>`. Thread-id = AI SDK chat `id`.
- **Új secrets**: nincs (LOVABLE_API_KEY már megvan).
- **Új npm**: `canvas-confetti`, `@ai-sdk/react`, `ai`, `@ai-sdk/openai-compatible` (utóbbi 3 valószínűleg már fent — telepítéskor ellenőrzöm).
- **Migráció**: 1 új tábla (`user_streaks`) + GRANT-ek + RLS policy.

## Amit NEM csinálunk most
- Insta/FB API auto-poszt — csak emlékeztető marad.
- Tool-okhoz user approval flow (egyszerű tool-ok, írásnál toast-ban visszajelzés elég; később `needsApproval` bővíthető).
- Régi `admin-ai-chat` hívóhelyek (ha van) — kompat, de a tool-call választ csak az új panel renderel; szöveget mindenki kap.

## Sorrend (1 körben)
1. Migráció: `user_streaks` tábla.
2. Edge function átírás tool-okkal.
3. `FloatingAIAssistant` thread-lista + tool-render + mentés gomb.
4. `DailyStreakBar` átállítás új táblára.
5. Confetti + `EveningSummaryCard` + üres állapot szövegek.
6. Smoke teszt (build + 1-2 tool meghívás a preview-ban).
