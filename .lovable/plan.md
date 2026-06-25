
# Fázis 2 — IA konszolidáció (4 hub + fülek)

## Cél
23 admin route helyett **4 elsődleges hub** a felső navban, mindegyik egy oldal fülekkel. A mély-linkek megmaradnak (redirect).

## Új struktúra

```text
MA              PIPELINE              TARTALOM           TUDÁS                 [⋯ Több]
/admin          /admin/pipeline       /admin/content     /admin/knowledge
└ Dashboard     ├ Leadek (tab)        ├ Studio (tab)     ├ Doksik (tab)
└ Inbox (tab)   ├ Partners (tab)      ├ Naptár (tab)     ├ Doksi chat (tab)
                ├ Outreach (tab)      ├ Brand (tab)      ├ Trendek (tab)
                └ Instagram (tab)     └ Média (tab)      └ Drive (tab)
```

A **Több** sheet-ben marad: Riportok, Retro, Decisions, Simulator, Checklist, Misszió, AI asszisztens.

## Konkrét lépések

### 1. Hub shell komponens
`src/components/admin/HubShell.tsx` — egységes wrapper:
- `PageHeader` címmel
- horizontális tab-sáv (a meglévő `HubTabs.tsx` újrahasznosítva, ha kompatibilis)
- URL-szinkron: `?tab=leads` query paraméter, mély-link barát
- billentyűs nyilakkal váltható tabok

### 2. Új hub oldalak (3 db)

**`src/pages/admin/AdminPipelineHub.tsx`**
```tsx
tabs = [
  { key: "leads",     label: "Leadek",     component: <AdminLeadsContent /> },
  { key: "partners",  label: "Pipeline",   component: <AdminPartnersContent /> },
  { key: "outreach",  label: "Outreach",   component: <AdminOutreachContent /> },
  { key: "instagram", label: "Instagram",  component: <AdminInstagramQueueContent /> },
]
```

**`src/pages/admin/AdminContentHub.tsx`** — Studio / Naptár / Brand / Média fülek.

**`src/pages/admin/AdminKnowledgeHub.tsx`** — Doksik / Doksi-chat / Trendek / Drive fülek.

A **Ma** hub (`/admin`) szintén kap egy Inbox fület a meglévő `AdminInbox` tartalommal — kis változtatás, csak a dashboard fölé tab-sáv kerül.

### 3. Page → Content refaktor
A meglévő oldal-komponenseket (`AdminLeads`, `AdminPartners`, stb.) NEM másoljuk át — a default exportokat hub-fülekként direktben renderelve használjuk (page chrome — `PageHeader`, `PageSectionNav` — opcionálisan elrejthető `hideChrome` propon át, ahol szükséges). Ha egy oldal nem fogad ilyen propot, mostani fej marad — vizuálisan kicsit dupla, de funkcionálisan helyes (későbbi finomítás).

Legtisztább: minden hub-tag kap egy egyszerű `embedded` prop-ot, ami elrejti a saját `PageHeader`-jét és `PageSectionNav`-ját. Ezt 7 oldalon kell felvenni (leads, partners, outreach, instagram, content-studio, calendar, brand, media, documents, doc-chat, trends, drive).

### 4. Redirect-ek
Régi route-ok megmaradnak, de a `Route element`-jük `<Navigate to="/admin/pipeline?tab=leads" replace />`-re cserélve:
- `/admin/leads`         → `/admin/pipeline?tab=leads`
- `/admin/partners`      → `/admin/pipeline?tab=partners`
- `/admin/outreach`      → `/admin/pipeline?tab=outreach`
- `/admin/outreach/instagram` → `/admin/pipeline?tab=instagram`
- `/admin/calendar`      → `/admin/content?tab=calendar`
- `/admin/brand`         → `/admin/content?tab=brand`
- `/admin/media`         → `/admin/content?tab=media`
- `/admin/documents/chat` → `/admin/knowledge?tab=chat`
- `/admin/documents/audit`→ `/admin/knowledge?tab=docs` (audit funkció a Doksik fülben akció)
- `/admin/trends`        → `/admin/knowledge?tab=trends`
- `/admin/drive`         → `/admin/knowledge?tab=drive`

Megmaradnak külön route-ként: `/admin/partners/:id`, `/admin/documents/:id` (detail oldalak), `/admin/ai`, `/admin/inbox` (deep linkek).

### 5. Nav config átírás
`src/lib/admin-nav-config.ts`:
- `NAV_GROUPS` → 4 lapos top-level item (`Ma`, `Pipeline`, `Tartalom`, `Tudás`) + 1 "Több" másodlagos.
- `MOBILE_BOTTOM_NAV` ugyanaz a 4 hub + Több sheet.
- `MOBILE_MORE_ITEMS` = a "Több" csoport tartalma.

A jelenlegi `AdminLayout` sidebar/topbar renderelése feltehetően `NAV_GROUPS`-ot olvas — meg kell néznem és igazítani, hogy ne csoportcímkék legyenek, hanem közvetlen linkek.

### 6. Cmd-K parancs-paletta frissítés
A `CommandPalette` jelenleg minden oldalra ugrik — bővítjük hub+tab kombókkal (`Pipeline · Outreach`, `Tartalom · Naptár`, stb.), hogy gyors hozzáférés legyen.

## Mit NEM csinálunk most
- Nem írjuk át a hub-tag oldalakat funkcionálisan — csak az `embedded` propot és a chrome elrejtését.
- Nem mozgatjuk a Doksik audit funkciót külön oldalról — beleolvasztjuk a Doksik fülbe (a régi oldal route-ja redirect lesz, de a komponens fülbe ágyazva továbbra is működik).
- A `/admin/partners/:id` és `/admin/documents/:id` mély oldalak változatlanul külön route-ok maradnak.

## Becslés
~3-4 óra: 3 új hub-fájl, 12 oldalon `embedded` prop, nav config + layout igazítás, ~10 redirect.

## Kérdés mielőtt indulunk

1. **`AdminInbox` legyen a Ma-hub egyik füle, vagy maradjon külön oldal (és csak a Dashboard-on legyen egy nagy belépő rá)?** Javaslat: maradjon külön route (`/admin/inbox`), de a Dashboard fold-above tegyen ki erős linket — a fülezés a Ma-on csak zavarná a tiszta "Ma reggel" élményt.
2. **A `Documents audit` oldal (`/admin/documents/audit`) tartalma — egyszerű akció gomb a Doksik fülben, vagy maradjon teljes aloldal, csak más helyen?** Javaslat: gomb + dialog (egyszerűbb).
3. **A "Misszió központ" (`/admin/mission`) maradjon-e a "Több" alatt, vagy a Ma-hub kapjon egy "Misszió" KPI panelt és ez az oldal eltűnjön?** Javaslat: Több alatt marad, a Dashboardon a `TodayCard` "Most" füle alá kerül egy mini misszió-sor.
