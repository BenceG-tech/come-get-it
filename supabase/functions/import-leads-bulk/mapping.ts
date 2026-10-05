// CSV/XLSX lead-import: oszlopnév-felismerés (magyar + angol + Apify export), sor → partners rekord,
// duplikátumszűrés (google_place_id, különben normalizált név + cím). Tiszta TS, Deno-függőség nélkül.

export type Field =
  | "company_name" | "address" | "city" | "district" | "contact_name" | "email" | "phone" | "website"
  | "instagram" | "facebook" | "category" | "rating" | "reviews" | "maps_url" | "place_id" | "lat" | "lng"
  | "description" | "opening_hours" | "photo" | "notes";

// Összevont (ékezet, szóköz, _ és - nélküli) oszlopnevek.
const ALIASES: Record<Field, string[]> = {
  company_name: ["companyname", "cegnev", "ceg", "nev", "name", "title", "hely", "helyneve", "place", "placename", "business", "businessname", "company", "venue"],
  address: ["address", "cim", "teljescim", "utca", "street", "fulladdress", "streetaddress"],
  city: ["city", "varos", "telepules"],
  district: ["district", "kerulet", "neighborhood", "neighbourhood"],
  contact_name: ["contactname", "kapcsolat", "kapcsolattarto", "contact", "person", "owner", "tulajdonos"],
  email: ["email", "mail", "emails", "emailcim", "emailaddress"],
  phone: ["phone", "telefon", "tel", "mobil", "phonenumber", "telefonszam", "phones", "phoneunformatted"],
  website: ["website", "web", "weboldal", "honlap", "websites", "site", "url"],
  instagram: ["instagram", "ig", "insta", "instagrams", "instagramhandle", "instagramurl"],
  facebook: ["facebook", "fb", "facebooks", "facebookurl"],
  category: ["category", "kategoria", "categoryname", "tipus", "type", "categories"],
  rating: ["rating", "ertekeles", "totalscore", "stars", "googlerating", "csillag"],
  reviews: ["reviews", "ratingcount", "reviewscount", "reviewcount", "ertekelesek", "ertekelesekszama", "googlereviews", "googlereviewscount"],
  maps_url: ["mapsurl", "googlemapsurl", "googlemaps", "maps", "terkep", "mapslink", "gmaps"],
  place_id: ["placeid", "googleplaceid", "gplaceid"],
  lat: ["lat", "latitude", "szelesseg", "locationlat"],
  lng: ["lng", "lon", "long", "longitude", "hosszusag", "locationlng"],
  description: ["description", "leiras", "rovidleiras", "about", "bemutatkozas", "summary"],
  opening_hours: ["openinghours", "nyitvatartas", "nyitva", "hours", "openhours"],
  photo: ["image", "imageurl", "photo", "photourl", "kep", "foto", "thumbnail"],
  notes: ["notes", "note", "jegyzet", "megjegyzes", "komment"],
};

export function compactHeader(h: string): string {
  return String(h ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Fejléc → mező hozzárendelés. Az első egyező oszlop nyer; a fel nem ismert oszlopok külön listában. */
export function buildHeaderMap(headers: string[]): { map: Record<string, Field>; unmapped: string[] } {
  const map: Record<string, Field> = {};
  const used = new Set<Field>();
  const unmapped: string[] = [];
  // Apify-exportban az „url” a Google Maps link, ha külön „website” oszlop is van.
  const hasWebsiteCol = headers.some((h) => ["website", "web", "weboldal", "honlap", "websites"].includes(compactHeader(h)));
  for (const h of headers) {
    const c = compactHeader(h);
    if (c === "url" && hasWebsiteCol && !used.has("maps_url")) { map[h] = "maps_url"; used.add("maps_url"); continue; }
    let found: Field | null = null;
    for (const [field, aliases] of Object.entries(ALIASES) as [Field, string[]][]) {
      if (aliases.includes(c) && !used.has(field)) { found = field; break; }
    }
    if (found) { map[h] = found; used.add(found); } else unmapped.push(h);
  }
  return { map, unmapped };
}

const isEmpty = (v: unknown) => v === null || v === undefined || String(v).trim() === "";
const toNum = (v: unknown): number | null => {
  if (isEmpty(v)) return null;
  const n = Number(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const splitList = (v: unknown): string[] =>
  isEmpty(v) ? [] : String(v).split(/[;,|\n]+/).map((x) => x.trim()).filter(Boolean);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

export function normalizeIgHandle(v: unknown): string | null {
  if (isEmpty(v)) return null;
  const s = String(v).trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9_.]+)/i);
  const h = (m ? m[1] : s).replace(/^@/, "").replace(/\/$/, "");
  return /^[A-Za-z0-9_.]{1,30}$/.test(h) ? h : null;
}

export type MappedLead = Record<string, unknown> & { company_name: string };

export function mapRow(row: Record<string, unknown>, headerMap: Record<string, Field>, unmapped: string[]): MappedLead | null {
  const v: Partial<Record<Field, unknown>> = {};
  for (const [col, field] of Object.entries(headerMap)) if (!isEmpty(row[col])) v[field] = row[col];
  const name = isEmpty(v.company_name) ? "" : String(v.company_name).trim();
  if (!name) return null;

  const emails = splitList(v.email).filter((e) => EMAIL_RE.test(e));
  const phones = splitList(v.phone);
  let website = isEmpty(v.website) ? null : String(v.website).trim();
  let mapsUrl = isEmpty(v.maps_url) ? null : String(v.maps_url).trim();
  // Az Apify-exportban az „url” a Google Maps link — ne kerüljön a weboldal mezőbe.
  if (website && /google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(website)) {
    mapsUrl = mapsUrl ?? website;
    website = null;
  }
  const igRaw = isEmpty(v.instagram) ? null : splitList(v.instagram)[0];
  const address = isEmpty(v.address) ? null : String(v.address).trim();
  let city = isEmpty(v.city) ? null : String(v.city).trim();
  if (!city && (/budapest/i.test(address ?? "") || !isEmpty(v.district))) city = "Budapest";
  const rating = toNum(v.rating);
  const reviews = toNum(v.reviews);
  const lat = toNum(v.lat);
  const lng = toNum(v.lng);
  const placeId = isEmpty(v.place_id) ? null : String(v.place_id).trim();

  const extra: Record<string, unknown> = {};
  for (const col of unmapped) if (!isEmpty(row[col])) extra[col] = row[col];

  const blob: Record<string, unknown> = { source: "csv_import" };
  if (emails.length > 1) blob.emails = emails;
  if (phones.length > 1) blob.phones = phones;
  if (!isEmpty(v.description)) blob.description = String(v.description).trim();
  if (!isEmpty(v.opening_hours)) blob.opening_hours = String(v.opening_hours).trim();
  if (!isEmpty(v.photo)) blob.photo_url = String(v.photo).trim();
  if (!isEmpty(v.district)) blob.district_raw = String(v.district).trim();
  if (!isEmpty(v.facebook) && splitList(v.facebook).length > 1) blob.facebooks = splitList(v.facebook);
  if (Object.keys(extra).length) blob.import_extra = extra;

  const out: MappedLead = {
    type: "venue",
    status: "lead",
    source: "import",
    company_name: name,
    address,
    city,
    contact_name: isEmpty(v.contact_name) ? null : String(v.contact_name).trim(),
    email: emails[0] ?? null,
    phone: phones[0] ?? null,
    website,
    instagram: igRaw,
    instagram_handle: normalizeIgHandle(igRaw),
    facebook_url: isEmpty(v.facebook) ? null : splitList(v.facebook)[0],
    category: isEmpty(v.category) ? null : String(v.category).trim(),
    rating,
    google_rating: rating,
    rating_count: reviews != null ? Math.round(reviews) : null,
    google_reviews_count: reviews != null ? Math.round(reviews) : null,
    google_maps_url: mapsUrl,
    google_place_id: placeId,
    lat, lng, latitude: lat, longitude: lng,
    notes: isEmpty(v.notes) ? null : String(v.notes).trim(),
    contacts_blob: blob,
  };
  // null mezőket kihagyjuk, hogy a DB default-ok érvényesüljenek
  for (const k of Object.keys(out)) if (out[k] === null) delete out[k];
  return out;
}

// ---- duplikátumok -------------------------------------------------------------------

const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function normName(s: unknown): string {
  return strip(String(s ?? "")).replace(/[^a-z0-9]/g, "");
}

export function normAddress(s: unknown): string {
  return strip(String(s ?? ""))
    .replace(/\bbudapest\b|\bhungary\b|\bmagyarorszag\b/g, " ")
    .replace(/\b1\d{3}\b/g, " ")
    .replace(/\butca\b|\bu\./g, " u ")
    .replace(/\b(ut|utja)\b/g, " ut ")
    .replace(/[^a-z0-9]/g, "");
}

export type ExistingLead = { company_name?: string | null; address?: string | null; city?: string | null; google_place_id?: string | null; apify_place_id?: string | null };

export function dedupKeys(r: { company_name?: unknown; address?: unknown; city?: unknown }): string[] {
  const n = normName(r.company_name);
  if (!n) return [];
  const a = normAddress(r.address);
  return a ? [`na:${n}|${a}`] : [`nc:${n}|${normName(r.city)}`];
}

export function splitDuplicates(rows: MappedLead[], existing: ExistingLead[]) {
  const placeSet = new Set<string>();
  const keySet = new Set<string>();
  for (const e of existing) {
    if (e.google_place_id) placeSet.add(String(e.google_place_id));
    if (e.apify_place_id) placeSet.add(String(e.apify_place_id));
    for (const k of dedupKeys(e)) keySet.add(k);
  }
  const fresh: MappedLead[] = [];
  const dups: { company_name: string; reason: string }[] = [];
  for (const r of rows) {
    const pid = r.google_place_id ? String(r.google_place_id) : null;
    if (pid && placeSet.has(pid)) { dups.push({ company_name: r.company_name, reason: "google_place_id" }); continue; }
    const keys = dedupKeys(r);
    if (keys.some((k) => keySet.has(k))) { dups.push({ company_name: r.company_name, reason: "név + cím" }); continue; }
    if (pid) placeSet.add(pid);
    keys.forEach((k) => keySet.add(k));
    fresh.push(r);
  }
  return { fresh, dups };
}
