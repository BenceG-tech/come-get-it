// MÁSOLAT: src/lib/lead-score-rubric.ts — a két fájl tartalma legyen azonos (ezt használja a score-lead Edge Function).
// Átlátható Come Get It lead-pontozás (0–100) és grade (A–D).
// Ugyanezt a képletet használja a `score-lead` Edge Function a másolatból:
// supabase/functions/_shared/lead-score-rubric.ts — ha itt változtatsz, azt is frissítsd (cp).
//
// Képlet (összesen 100 pont):
//   1. Google-értékelés      max 25  — 4,7+ = 25 · 4,4+ = 20 · 4,2+ = 10 · 4,0+ = 5 · alatta / nincs = 0
//   2. Rejtett kincs         max 15  — 4,4+ és 30–800 értékelés = 15 · 30–800 de 4,4 alatt = 8
//                                      801–2000 = 7 · 2000 felett = 4 · 1–29 = 4 · nincs adat = 2
//   3. Kerület               max 25  — VII. = 25 · VI./VIII./V. = 20 · Zugló és egyéb belső
//                                      (I., II., IX., XI., XIII., XIV.) = 12 · Budapest, ismeretlen kerület = 8
//                                      · egyéb budapesti kerület = 6 · Budapesten kívül = 0
//   4. Kategória             max 20  — bisztró, kávézó, reggeliző, borbár, kézműves sör = 20 · pékség/cukrászda = 14
//                                      · étterem = 12 · bár/pub/koktélbár = 8 · ismeretlen = 5 · gyorsétterem = 2
//   5. Elérhetőség           max 15  — e-mail +7 · Instagram +5 · telefon +3
// Grade: A ≥ 80 · B ≥ 60 · C ≥ 40 · D < 40 (ugyanaz, mint a DB compute_lead_grade_from_score).

export type RubricInput = {
  company_name?: string | null;
  category?: string | null;
  type?: string | null;
  city?: string | null;
  address?: string | null;
  rating?: number | string | null;
  rating_count?: number | string | null;
  google_rating?: number | string | null;
  google_reviews_count?: number | string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram_handle?: string | null;
  instagram?: string | null;
  contacts_blob?: unknown;
};

export type RubricLine = { key: string; label: string; points: number; max: number; note?: string };
export type Grade = "A" | "B" | "C" | "D";
export type RubricBreakdown = {
  total: number;
  grade: Grade;
  lines: RubricLine[];
};

export const RUBRIC_VERSION = "2026-10-bisztro";

export const RUBRIC_DOC: { label: string; max: number; rule: string }[] = [
  { label: "Google-értékelés", max: 25, rule: "4,7+ = 25 · 4,4+ = 20 · 4,2+ = 10 · 4,0+ = 5 · alatta vagy nincs = 0" },
  { label: "Rejtett kincs", max: 15, rule: "4,4+ és 30–800 értékelés = 15 · 30–800, de 4,4 alatt = 8 · 801–2000 = 7 · 2000+ = 4 · 1–29 = 4 · nincs adat = 2" },
  { label: "Kerület", max: 25, rule: "VII. = 25 · VI., VIII., V. = 20 · Zugló és egyéb belső (I., II., IX., XI., XIII., XIV.) = 12 · Budapest, ismeretlen kerület = 8 · egyéb budapesti = 6 · vidék = 0" },
  { label: "Kategória", max: 20, rule: "bisztró, kávézó, reggeliző, borbár, kézműves sör = 20 · pékség/cukrászda = 14 · étterem = 12 · bár/pub = 8 · ismeretlen = 5 · gyorsétterem = 2" },
  { label: "Elérhetőség", max: 15, rule: "e-mail +7 · Instagram +5 · telefon +3" },
];

export function gradeFromScore(score: number): Grade {
  return score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function blobList(blob: unknown, key: string): string[] {
  if (!blob || typeof blob !== "object" || Array.isArray(blob)) return [];
  const v = (blob as Record<string, unknown>)[key];
  if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

// ---- Kerület -----------------------------------------------------------------

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII"];

const DISTRICT_NAMES: [RegExp, number][] = [
  [/erzs[ée]betv[áa]ros/i, 7],
  [/ter[ée]zv[áa]ros/i, 6],
  [/j[óo]zsefv[áa]ros/i, 8],
  [/lip[óo]tv[áa]ros|belv[áa]ros/i, 5],
  [/zugl[óo]/i, 14],
  [/ferencv[áa]ros/i, 9],
  [/[úu]jlip[óo]tv[áa]ros|angyalf[öo]ld/i, 13],
  [/[úu]jbuda/i, 11],
  [/[óo]buda/i, 3],
];

export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

/** Budapest kerület (1–23) a címből / városból: irányítószám (1XXY), római szám vagy kerületnév alapján. */
export function detectDistrict(address?: string | null, city?: string | null): number | null {
  const s = `${address ?? ""} ${city ?? ""}`;
  if (!s.trim()) return null;
  const looksBudapest = /budapest|\bbp\b/i.test(s);
  // Irányítószám: 1011–1239, a 2–3. számjegy a kerület. Csak ha budapesti a cím, vagy irányítószám-pozícióban áll.
  const zipRe = /(?:^|[\s,(])1(0[1-9]|1\d|2[0-3])\d(?=$|[\s,)])/g;
  let m: RegExpExecArray | null;
  while ((m = zipRe.exec(s))) {
    const d = Number(m[1]);
    if (d >= 1 && d <= 23 && (looksBudapest || m.index < 3)) return d;
  }
  const romanRe = /\b(XXIII|XXII|XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\.?\s*(?:ker(?:ület)?\b|kerulet\b)/i;
  const r = s.match(romanRe);
  if (r) return ROMAN.indexOf(r[1].toUpperCase()) + 1;
  const bp = s.match(/budapest[,\s]+(XXIII|XXII|XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\./i);
  if (bp) return ROMAN.indexOf(bp[1].toUpperCase()) + 1;
  const num = s.match(/\b([1-9]|1\d|2[0-3])\.\s*ker(?:ület)?\b/i);
  if (num) return Number(num[1]);
  for (const [re, d] of DISTRICT_NAMES) if (re.test(s)) return d;
  return null;
}

export function districtLabel(d: number | null): string | null {
  if (!d) return null;
  if (d === 14) return "XIV. (Zugló)";
  return `${toRoman(d)}. kerület`;
}

function districtLine(p: RubricInput): RubricLine {
  const base = { key: "district", label: "Kerület", max: 25 };
  const d = detectDistrict(p.address, p.city);
  const s = `${p.city ?? ""} ${p.address ?? ""}`.toLowerCase();
  if (d === 7) return { ...base, points: 25, note: "VII. kerület – bulinegyed, az indulás központja" };
  if (d === 6 || d === 8 || d === 5) return { ...base, points: 20, note: `${toRoman(d)}. kerület – a bulinegyed közvetlen szomszédja` };
  if (d && [1, 2, 9, 11, 13, 14].includes(d)) return { ...base, points: 12, note: `${districtLabel(d)} – belső kerület, közepes` };
  if (d) return { ...base, points: 6, note: `${toRoman(d)}. kerület – külső kerület` };
  if (/budapest/.test(s)) return { ...base, points: 8, note: "Budapest, a kerület nem derül ki a címből" };
  if (!s.trim()) return { ...base, points: 0, note: "nincs cím" };
  return { ...base, points: 0, note: "Budapesten kívül" };
}

// ---- Kategória -----------------------------------------------------------------

const CATEGORY_TIERS: { re: RegExp; points: number; note: string }[] = [
  { re: /bisztr[óo]|bistro|gastropub|gasztropub/, points: 20, note: "bisztró" },
  { re: /k[áa]v[ée]z[óo]|k[áa]v[ée]h[áa]z|coffee|caf[ée]|espresso|kávé/, points: 20, note: "kávézó" },
  { re: /reggeliz|breakfast|brunch/, points: 20, note: "reggeliző / brunch" },
  { re: /bor ?b[áa]r|wine|borozó|borkocsma|vinot/, points: 20, note: "borbár" },
  { re: /k[ée]zm[űu]ves s[öo]r|craft|brewery|s[öo]rf[őo]z|brewpub|taproom/, points: 20, note: "kézműves sör" },
  { re: /p[ée]ks[ée]g|bakery|cukr[áa]sz|patisserie|pastry/, points: 14, note: "pékség / cukrászda" },
  { re: /[ée]tterem|restaurant|vend[ée]gl[őo]|kifőzde|trattoria|pizz|ramen|bistrot|eatery|konyha/, points: 12, note: "étterem" },
  { re: /\bb[áa]r\b|\bbar\b|pub|s[öo]r[öo]z[őo]|kocsma|kokt[ée]l|cocktail|lounge|club|klub/, points: 8, note: "bár / pub" },
  { re: /gyors[ée]tterem|fast ?food|kebab|gyros|burger|hamburger|lángos/, points: 2, note: "gyorsétterem" },
];

function categoryLine(p: RubricInput): RubricLine {
  const base = { key: "category", label: "Kategória", max: 20 };
  const t = `${p.category ?? ""}`.toLowerCase().trim();
  const name = `${p.company_name ?? ""}`.toLowerCase();
  // A legjobb egyező kategória nyer; a „gyorsétterem” szó ne számítson „étterem”-nek.
  const pick = (text: string) => {
    const fastFood = CATEGORY_TIERS[CATEGORY_TIERS.length - 1].re.test(text);
    let best: { points: number; note: string } | null = null;
    for (const tier of CATEGORY_TIERS) {
      if (!tier.re.test(text)) continue;
      if (fastFood && tier.note === "étterem") continue;
      if (!best || tier.points > best.points) best = { points: tier.points, note: tier.note };
    }
    return best;
  };
  const fromCategory = t ? pick(t) : null;
  if (fromCategory) return { ...base, points: fromCategory.points, note: `${fromCategory.note} (${p.category})` };
  const fromName = name ? pick(name) : null;
  if (fromName) return { ...base, points: fromName.points, note: `${fromName.note} (a név alapján)` };
  return { ...base, points: 5, note: t ? `nem besorolható (${p.category})` : "nincs kategória" };
}

// ---- Értékelés -----------------------------------------------------------------

function ratingOf(p: RubricInput) {
  return num(p.google_rating) ?? num(p.rating);
}
function reviewsOf(p: RubricInput) {
  return num(p.google_reviews_count) ?? num(p.rating_count);
}

function ratingLine(p: RubricInput): RubricLine {
  const base = { key: "rating", label: "Google-értékelés", max: 25 };
  const r = ratingOf(p);
  if (r == null || r <= 0) return { ...base, points: 0, note: "nincs Google-értékelés" };
  const f = r.toFixed(1).replace(".", ",");
  if (r >= 4.7) return { ...base, points: 25, note: `${f}★ – kiemelkedő` };
  if (r >= 4.4) return { ...base, points: 20, note: `${f}★ – 4,4 felett` };
  if (r >= 4.2) return { ...base, points: 10, note: `${f}★ – jó, de 4,4 alatt` };
  if (r >= 4.0) return { ...base, points: 5, note: `${f}★ – átlagos` };
  return { ...base, points: 0, note: `${f}★ – gyenge` };
}

function hiddenGemLine(p: RubricInput): RubricLine {
  const base = { key: "hidden_gem", label: "Rejtett kincs", max: 15 };
  const r = ratingOf(p) ?? 0;
  const n = reviewsOf(p);
  if (n == null || n <= 0) return { ...base, points: 2, note: "nincs értékelésszám" };
  if (n >= 30 && n <= 800 && r >= 4.4) return { ...base, points: 15, note: `${n} értékelés 4,4+ mellett – jó, de még nem túlfutott hely` };
  if (n >= 30 && n <= 800) return { ...base, points: 8, note: `${n} értékelés – közepes ismertség` };
  if (n > 800 && n <= 2000) return { ...base, points: 7, note: `${n} értékelés – ismert hely` };
  if (n > 2000) return { ...base, points: 4, note: `${n} értékelés – nagyon ismert, kevésbé szorul rá` };
  return { ...base, points: 4, note: `${n} értékelés – kevés adat` };
}

// ---- Elérhetőség -----------------------------------------------------------------

function reachLine(p: RubricInput): RubricLine {
  const base = { key: "reach", label: "Elérhetőség", max: 15 };
  const hasEmail = !!(p.email || blobList(p.contacts_blob, "emails").length);
  const hasIg = !!(p.instagram_handle || p.instagram || blobList(p.contacts_blob, "instagrams").length);
  const hasPhone = !!(p.phone || blobList(p.contacts_blob, "phones").length);
  let points = 0;
  const parts: string[] = [];
  if (hasEmail) { points += 7; parts.push("e-mail +7"); }
  if (hasIg) { points += 5; parts.push("Instagram +5"); }
  if (hasPhone) { points += 3; parts.push("telefon +3"); }
  return { ...base, points, note: parts.join(", ") || "nincs elérhetőség" };
}

export function computeRubric(p: RubricInput): RubricBreakdown {
  const lines: RubricLine[] = [ratingLine(p), hiddenGemLine(p), districtLine(p), categoryLine(p), reachLine(p)];
  const total = Math.max(0, Math.min(100, lines.reduce((a, l) => a + l.points, 0)));
  return { total, grade: gradeFromScore(total), lines };
}

/** A partners.score_reasons formátuma (ezt olvassa a LeadScoreBadge). */
export function rubricToScoreReasons(b: RubricBreakdown) {
  return {
    version: RUBRIC_VERSION,
    baseline: b.total,
    adjustment: 0,
    total: b.total,
    grade: b.grade,
    breakdown: b.lines.map(({ label, points, max, note }) => ({ label, points, max, note })),
  };
}
