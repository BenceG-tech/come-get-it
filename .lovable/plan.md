# Jobb alsó FAB-ok rendezése (admin)

## Probléma
A jobb alsó sarokban három független, fix pozíciós elem versenyzik:
- `FloatingAIAssistant` AI gomb — `bottom-5 right-5` (z-50)
- `VoiceCaptureFAB` mikrofon + szöveg gomb — `bottom-20 right-4` (z-40)
- Mobilon a `MobileBottomNav` (~56px) **eltakarja az AI gombot**, mert a `bottom-5` a nav alá esik.

Eredmény: mobilon az AI „marketing chat" gomb takarásban van, desktopon pedig három különálló kör verseng, nincs vizuális hierarchia.

## Cél
Egy összefogott, rendezett FAB-klaszter a jobb alsó sarokban, ami:
- Mobilon **a bottom nav fölött** lebeg (nem takarja semmi).
- Desktopon kompakt, nem zsúfolja a sarkot.
- Az AI marad az elsődleges, a hang/szöveg jegyzet másodlagos akció.

## Megoldás

### 1) Egységes pozicionálás
Új közös wrapper a sarokban. Minden FAB ehhez igazodik:
- Desktop: `md:bottom-5 md:right-5`
- Mobil: `bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4` — a bottom nav (kb. 56px + safe area) **fölött**.
- `MobileBottomNav` változatlan.

### 2) Egy elsődleges + összecsukható másodlagos gombok
- **Elsődleges (mindig látszik):** AI asszisztens (Sparkles) — neon kör, ~56px.
- **Másodlagos (összecsukva alapból):** Mic (hangjegyzet) és Type (szöveges jegyzet) — kisebb (~40px) körök, az AI gomb fölött jelennek meg `+` / `⋯` toggle-re kattintva.
- Felvétel közben a Mic gomb automatikusan kibontva marad piros pulse-szal.
- A toggle gomb (kis chevron) az AI gomb mellett balra, fade-in-nel hozza fel a stacket.

### 3) Z-index és átfedés
- A teljes klaszter `z-50`.
- Mobilon a nyitott AI panel továbbra is `inset-0` fullscreen (változatlan), tehát nincs ütközés.
- A `pb-32` a `main`-en marad, hogy a sarokba görgetve se takarjon tartalmat.

## Érintett fájlok
- `src/components/admin/FloatingAIAssistant.tsx` — a launcher gomb pozíciója közös wrapperre vált; a launcher API-ját kifelé exportáljuk vagy egy új közös komponensbe emeljük.
- `src/components/admin/VoiceCaptureFAB.tsx` — a saját fix wrappert eltávolítjuk, a két gomb a közös FAB-klaszterbe kerül másodlagos akcióként, „nyitva" állapotban jelenik meg.
- **Új:** `src/components/admin/AdminFabCluster.tsx` — összefogja az AI launcher + voice + text gombokat, kezeli a nyitva/csukva állapotot, a mobil/desktop pozíciót, és a felvétel-állapot kényszerített kibontását.
- `src/components/admin/AdminLayout.tsx` — a `FloatingAIAssistant` és `VoiceCaptureFAB` külön renderelés helyett egyetlen `<AdminFabCluster />` kerül be (a panel + dialog logika megmarad a meglévő komponensekben, csak a launcher-eket közösítjük).

## Nem érintett
- AI chat panel tartalma, streaming logika, voice capture feldolgozás, dialog UI.
- Mobil bottom nav, command palette, sidebar.
- Bármilyen backend / edge function / DB.

## Eredmény
- Mobilon az AI gomb mindig látható a bottom nav fölött, semmi nem takarja.
- Desktopon egy rendezett, hierarchikus FAB-stack a sarokban három versengő kör helyett.
- Minden funkció (AI chat, hangjegyzet, szöveges jegyzet) egy érintéssel elérhető marad.
