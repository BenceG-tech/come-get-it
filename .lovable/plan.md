## Fázis A — 2. iteráció

Négy pont egyszerre, mind frontend (egy edge function kivételével).

### A4 — Pipeline mező-emlékeztetők
- `AdminPartners.tsx` Kanban + lista: `InlineEditCell` komponens a "—" cellákhoz (contact_name, next_followup_at).
  - Kattintás → popover input (text / date) → mentés `partners.update`-tel + toast.
- Kanban kártyán piros pötty badge, ha `contact_name` vagy `next_followup_at` üres.
- Új komponens: `src/components/admin/crm/InlineEditCell.tsx`.

### A9 — ⌘K parancspaletta bővítés
- `CommandPalette.tsx`: új "Akciók" csoport context-aware itemekkel:
  - "➕ Új partner" → `/admin/partners?new=1` (drawer auto-nyit)
  - "✏️ Lead státusz" → két lépéses: lead keresés → státusz választó (inline a Command List-en belül)
  - "📝 Gyors brief" → `/admin/content?brief=1`
  - "📞 Outreach a kiválasztott leadnek" → ha aktuális route partner detail, közvetlen outreach modal
  - "🔬 Deep research" → `/admin/trends?run=1`
- Új hook: `useCommandAction({ id, label, icon, group, handler })` — context-aware regisztráció (globális store-on át, hogy a Partner detail oldal pl. "Outreach küldés ennek" item-et regisztrálhasson).
- `src/components/admin/CommandPalette.tsx` + `src/lib/command-actions.ts` (registry).

### A10 — Bulk akciók
- `BulkActionBar.tsx` már létezik a Leads-en. Bővítés:
  - "Outreach küldés" → modal: sequence választó → `outreach_enrollments` batch insert (B5 előkészítés, most csak enrollment, send a meglévő trigger végzi).
  - "Címkézés" → tag input → `partners.tags` array append.
  - "Export CSV" → kliens-oldal CSV download a kijelölt sorokból.
  - Delete → új `bulk-leads-action` edge function (audit log + RLS-safe batch delete).
- `AdminPartners.tsx`-re is bekötjük ugyanazt a `BulkActionBar`-t (eddig csak Leads-en volt).
- Új edge function: `supabase/functions/bulk-leads-action/index.ts` (delete + tag bulk).

### A12 — Mobil bottom nav Outreach
- `src/lib/admin-nav-config.ts` `MOBILE_BOTTOM_NAV`: átstruktúrálás
  - Ma | Leadek | **Outreach** | Tartalom | Több (drawer)
- "Több" Sheet drawer: Dokumentumok, Riportok, Beállítások, Naptár, Brand, AI.
- `MobileBottomNav.tsx`: 5. cella az ⌘K helyett "Több" sheet trigger; ⌘K maradjon csak desktopon.

---

## Technikai részletek

- **Új fájlok:** `InlineEditCell.tsx`, `command-actions.ts` (registry + `useCommandAction` hook), `bulk-leads-action/index.ts`, `MobileMoreDrawer.tsx`.
- **Módosított:** `AdminPartners.tsx` (inline edit + bulk bar), `CommandPalette.tsx`, `MobileBottomNav.tsx`, `admin-nav-config.ts`, `BulkActionBar.tsx`.
- **Nincs DB migration** ehhez az iterációhoz (tags column már létezik; outreach_enrollments is).
- **1 edge function:** `bulk-leads-action` (audit log + service role delete).
- **Nincs új npm package.**

Mehetünk?
