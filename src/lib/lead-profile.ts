// Egy lead (partners sor) minden ismert adatának összegyűjtése egy helyre:
// oszlopok + contacts_blob (Apify / CSV-import extrák) + research_notes.
import { detectDistrict, districtLabel } from "@/lib/lead-score-rubric";

export type LeadRow = Record<string, unknown> & { id: string; company_name?: string | null };

export type LeadProfile = {
  name: string;
  category: string | null;
  address: string | null;
  city: string | null;
  district: number | null;
  districtLabel: string | null;
  emails: string[];
  phones: string[];
  website: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  rating: number | null;
  reviews: number | null;
  mapsUrl: string | null;
  openingHours: string | null;
  description: string | null;
  photoUrl: string | null;
  contactName: string | null;
  notes: string | null;
};

const str = (v: unknown): string | null => {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
};
const numOrNull = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

export function asObject(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function list(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : str(asObject(x).url ?? asObject(x).value ?? x))).map((x) => (x ?? "").trim()).filter(Boolean);
  const s = str(v);
  return s ? s.split(/[,;]\s*/).filter(Boolean) : [];
}

const uniq = (arr: (string | null | undefined)[]) => [...new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))];

export function normalizeIgHandle(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const m = s.match(/instagram\.com\/([A-Za-z0-9_.]+)/i);
  const h = (m ? m[1] : s).replace(/^@/, "").replace(/\/$/, "");
  return /^[A-Za-z0-9_.]{1,30}$/.test(h) ? h : null;
}

function hoursToText(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v.trim() || null;
  if (Array.isArray(v)) {
    const rows = v
      .map((x) => {
        if (typeof x === "string") return x;
        const o = asObject(x);
        const day = str(o.day ?? o.nap);
        const hours = str(o.hours ?? o.time ?? o.nyitva);
        return day && hours ? `${day}: ${hours}` : str(JSON.stringify(x));
      })
      .filter(Boolean);
    return rows.length ? rows.join("\n") : null;
  }
  const o = asObject(v);
  const entries = Object.entries(o).map(([k, val]) => `${k}: ${String(val)}`);
  return entries.length ? entries.join("\n") : null;
}

export function getLeadProfile(p: LeadRow): LeadProfile {
  const blob = asObject(p.contacts_blob);
  const research = asObject(p.research_notes);
  const dossier = asObject(p.research_dossier);
  const address = str(p.address);
  const city = str(p.city);
  const district = numOrNull(blob.district) ?? detectDistrict(address, city);
  const igHandle = normalizeIgHandle(p.instagram_handle) ?? normalizeIgHandle(p.instagram) ?? normalizeIgHandle(list(blob.instagrams)[0]);
  const placeId = str(p.google_place_id) ?? str(p.apify_place_id);
  const mapsUrl =
    str(p.google_maps_url) ??
    (placeId ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}` : null) ??
    (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.company_name ?? ""} ${address}`)}` : null);
  return {
    name: str(p.company_name) ?? "Névtelen hely",
    category: str(p.category),
    address,
    city,
    district,
    districtLabel: districtLabel(district),
    emails: uniq([str(p.email), ...list(blob.emails)]),
    phones: uniq([str(p.phone), ...list(blob.phones)]),
    website: str(p.website) ?? list(blob.websites)[0] ?? null,
    instagramHandle: igHandle,
    instagramUrl: igHandle ? `https://www.instagram.com/${igHandle}/` : null,
    facebookUrl: str(p.facebook_url) ?? list(blob.facebooks)[0] ?? null,
    linkedinUrl: str(p.linkedin_url) ?? list(blob.linkedIns)[0] ?? null,
    rating: numOrNull(p.google_rating) ?? numOrNull(p.rating),
    reviews: numOrNull(p.google_reviews_count) ?? numOrNull(p.rating_count),
    mapsUrl,
    openingHours: hoursToText(blob.opening_hours ?? dossier.opening_hours ?? research.opening_hours),
    description: str(blob.description) ?? str(dossier.description) ?? str(research.snapshot) ?? null,
    photoUrl: str(blob.photo_url) ?? str(blob.imageUrl) ?? str(dossier.photo_url) ?? null,
    contactName: str(p.contact_name),
    notes: str(p.notes),
  };
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function webHref(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
