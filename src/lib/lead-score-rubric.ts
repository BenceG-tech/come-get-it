// Deterministic Come Get It lead scoring rubric.
// Used by both the UI (transparent breakdown popover) and `score-lead` edge function
// to ensure the user always sees WHY a venue got a given score.

export type RubricInput = {
  category?: string | null;
  type?: string | null;
  city?: string | null;
  address?: string | null;
  rating?: number | null;
  rating_count?: number | null;
  google_rating?: number | null;
  google_reviews_count?: number | null;
  email?: string | null;
  website?: string | null;
  instagram_handle?: string | null;
  instagram?: string | null;
};

export type RubricLine = { label: string; points: number; max: number; note?: string };
export type RubricBreakdown = {
  total: number;
  grade: "A" | "B" | "C" | "D";
  lines: RubricLine[];
};

const CENTRAL_DISTRICTS = ["v.", "vi.", "vii.", "viii.", "ix.", "v ker", "vi ker", "vii ker", "viii ker", "ix ker", "1051", "1052", "1053", "1054", "1055", "1056", "1061", "1062", "1063", "1064", "1065", "1066", "1067", "1068", "1071", "1072", "1073", "1074", "1075", "1076", "1077", "1078", "1081", "1082", "1083", "1084", "1085", "1086", "1087", "1088", "1089", "1091", "1092", "1093", "1094", "1095"];
const BIG_CITIES = ["debrecen", "szeged", "miskolc", "pécs", "pecs", "győr", "gyor", "nyíregyháza", "nyiregyhaza", "kecskemét", "kecskemet", "székesfehérvár", "szekesfehervar", "szombathely", "veszprém", "veszprem"];

function categoryPoints(cat?: string | null, type?: string | null): RubricLine {
  const t = `${cat ?? ""} ${type ?? ""}`.toLowerCase();
  let points = 0;
  let note = "egyéb";
  if (/koktél|cocktail/.test(t)) { points = 30; note = "koktélbár — top fit"; }
  else if (/craft|sörfőzde|brewery/.test(t)) { points = 28; note = "craft bár"; }
  else if (/specialty|specialty coffee|kávézó.*specialty|third.?wave/.test(t)) { points = 25; note = "specialty coffee"; }
  else if (/rom(kocsma|bar)|ruin/.test(t)) { points = 26; note = "romkocsma — magas turista forgalom"; }
  else if (/wine|bor/.test(t) && /bár|bar/.test(t)) { points = 24; note = "borbár"; }
  else if (/kávézó|coffee|cafe|kávé/.test(t)) { points = 20; note = "kávézó"; }
  else if (/bisztró|bistro|gastropub/.test(t)) { points = 22; note = "bisztró/gastropub"; }
  else if (/étterem|restaurant/.test(t)) { points = 16; note = "étterem"; }
  else if (/pub|söröző/.test(t)) { points = 14; note = "pub/söröző"; }
  else if (/bar|bár/.test(t)) { points = 22; note = "bár"; }
  else if (/gyors|fast.?food/.test(t)) { points = 5; note = "gyorsétterem — alacsony fit"; }
  return { label: "Kategória illeszkedés", points, max: 30, note };
}

function locationPoints(city?: string | null, address?: string | null): RubricLine {
  const s = `${city ?? ""} ${address ?? ""}`.toLowerCase();
  if (CENTRAL_DISTRICTS.some((d) => s.includes(d))) return { label: "Lokáció", points: 25, max: 25, note: "Budapest belváros (V/VI/VII/VIII/IX)" };
  if (/budapest/.test(s)) return { label: "Lokáció", points: 18, max: 25, note: "Budapest, külső kerület" };
  if (/(budaörs|budaors|érd|erd|gödöllő|godollo|szentendre|dunakeszi|vecsés|vecses)/.test(s)) return { label: "Lokáció", points: 10, max: 25, note: "agglomeráció" };
  if (BIG_CITIES.some((c) => s.includes(c))) return { label: "Lokáció", points: 8, max: 25, note: "vidéki nagyváros" };
  return { label: "Lokáció", points: 3, max: 25, note: "egyéb / ismeretlen" };
}

function trafficPoints(reviews?: number | null): RubricLine {
  const r = reviews ?? 0;
  if (r >= 500) return { label: "Forgalom (Google review)", points: 20, max: 20, note: `${r} review — nagyon erős` };
  if (r >= 200) return { label: "Forgalom (Google review)", points: 16, max: 20, note: `${r} review — erős` };
  if (r >= 100) return { label: "Forgalom (Google review)", points: 12, max: 20, note: `${r} review — jó` };
  if (r >= 50) return { label: "Forgalom (Google review)", points: 8, max: 20, note: `${r} review — közepes` };
  if (r >= 20) return { label: "Forgalom (Google review)", points: 4, max: 20, note: `${r} review — alacsony` };
  return { label: "Forgalom (Google review)", points: 1, max: 20, note: `${r} review — nincs adat / új hely` };
}

function qualityPoints(rating?: number | null): RubricLine {
  const r = rating ?? 0;
  if (r >= 4.6) return { label: "Minőség (Google rating)", points: 10, max: 10, note: `${r.toFixed(1)}★ — kiváló` };
  if (r >= 4.3) return { label: "Minőség (Google rating)", points: 7, max: 10, note: `${r.toFixed(1)}★ — jó` };
  if (r >= 4.0) return { label: "Minőség (Google rating)", points: 4, max: 10, note: `${r.toFixed(1)}★ — átlagos` };
  if (r > 0) return { label: "Minőség (Google rating)", points: 1, max: 10, note: `${r.toFixed(1)}★ — gyenge` };
  return { label: "Minőség (Google rating)", points: 0, max: 10, note: "nincs rating" };
}

function reachabilityPoints(p: RubricInput): RubricLine {
  let pts = 0;
  const parts: string[] = [];
  if (p.email) { pts += 6; parts.push("email +6"); }
  if (p.website) { pts += 5; parts.push("website +5"); }
  if (p.instagram_handle || p.instagram) { pts += 4; parts.push("instagram +4"); }
  return { label: "Elérhetőség", points: pts, max: 15, note: parts.join(", ") || "nincs csatorna" };
}

export function computeRubric(p: RubricInput): RubricBreakdown {
  const lines: RubricLine[] = [
    categoryPoints(p.category, p.type),
    locationPoints(p.city, p.address),
    trafficPoints(p.rating_count ?? p.google_reviews_count),
    qualityPoints(p.rating ?? p.google_rating),
    reachabilityPoints(p),
  ];
  const total = Math.max(0, Math.min(100, lines.reduce((a, l) => a + l.points, 0)));
  const grade: "A" | "B" | "C" | "D" = total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";
  return { total, grade, lines };
}
