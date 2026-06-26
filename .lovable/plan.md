## Build fix + Founder Inbox + Titkos admin belépés

### 1. Build hiba javítás (generic JSX)
- `src/components/admin/dashboard/TodayCard.tsx`: `<SegmentedControl<TabId> ...>` → `<SegmentedControl options={TABS} value={tab} onChange={(v) => setTab(v as TabId)} />`
- `src/components/admin/dashboard/WeekCard.tsx`: ugyanaz.

A Vite/SWC parser nem tudja eldönteni JSX-ben, hogy a `<TabId>` típusparaméter vagy új JSX elem — eltávolítjuk, a típus a `TABS` prop-ból kerül levezetésre.

### 2. Founder Inbox megjelenés
A build javítása után automatikusan az új, már megírt `InboxZeroCard` jelenik meg: dedup `×N` badge-dzsel, típus szerinti ikonokkal (TrendingUp/Users/FileText/Bell), relatív idővel, "Inbox zero" üres-állapot illusztrációval.

### 3. Titkos admin belépés a főoldalról
- Új hook `src/hooks/useSecretAdminEntry.ts`: 5 kattintás 2 mp-en belül egy elemen → ha a user be van jelentkezve admin szerepkörrel, `navigate("/admin")`. Egyébként csendben semmi (nem áruljuk el random kattintóknak).
- `src/components/Footer.tsx`: a copyright sorra (`© 2026 Come Get It`) rákötjük a hookot. Nincs vizuális hint, cursor marad default.

### Érintett fájlok
```text
src/components/admin/dashboard/TodayCard.tsx
src/components/admin/dashboard/WeekCard.tsx
src/hooks/useSecretAdminEntry.ts        (új)
src/components/Footer.tsx
```
