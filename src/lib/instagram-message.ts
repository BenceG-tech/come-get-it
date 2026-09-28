// Default Instagram DM template + helpers used by the kanban and bulk IG queue.
export function buildIgPitch(p: { company_name?: string | null }) {
  const name = p.company_name?.trim() || "ott";
  return `Szia ${name}! Bence vagyok a Come Get It-ről 👋

Egy ingyenes béta appot építünk magyar vendéglátóhelyeknek: ti állítjátok be a korlátozott ajánlatot és időablakot, mi mérjük a QR-beváltásokat. Nincs garantált napi ital vagy automatikus kártyaadat.

Érdekel egy 10 perces telefonos egyeztetés?

https://come-get-it.app`;
}

export function igHandle(p: { instagram_handle?: string | null; instagram?: string | null }) {
  return (p.instagram_handle || p.instagram || "").toString().replace(/^@/, "").trim();
}

export function igDeepLink(handle: string) {
  return `https://ig.me/m/${handle}`;
}
