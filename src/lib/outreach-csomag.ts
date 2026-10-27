// „Megkeresési csomag” egy leadhez: szabályalapú ajánlatjavaslat + magyar, tegező szövegek.
// Kizárólag az alábbi tényeket és a lead saját adatait használja — kitalált számot nem ír.
import { computeRubric, toRoman } from "@/lib/lead-score-rubric";
import { asObject, getLeadProfile, type LeadProfile, type LeadRow } from "@/lib/lead-profile";

export const OUTREACH_FACTS = [
  "A Come Get It budapesti helyfelfedező app.",
  "Indulás: 2026. november 2., a VII. kerületi bulinegyedből.",
  "A vendég QR-kóddal napi egy ingyen italt vált be, a pultos a Venue Hub appal beolvassa.",
  "A pilotban nincs platformdíj.",
  "A hely szabja meg az ajánlatot, a készletet, a napokat és az időablakot.",
  "A keretet előre írásban rögzítjük.",
  "Eredményt nem ígérünk, a beváltást mérjük.",
  "15 Founding Partner helyet keresünk.",
];

export type OfferKind = "bisztro" | "kavezo" | "reggelizo" | "borbar" | "sor" | "etterem" | "bar" | "pekseg" | "egyeb";

export type Offer = {
  kind: OfferKind;
  kindLabel: string;
  item: string;
  itemShort: string;
  alcoholFreeOption: string;
  slot: string;
  days: string;
  dailyCap: number;
  rationale: string;
  slotFromOpeningHours: boolean;
};

export type OutreachTexts = {
  emailSubject: string;
  emailBody: string;
  dm: string;
  followup: string;
  opener: string;
  postInstagram: string;
  postTiktok: string;
};

export type MediaRef = { url: string; path: string | null; mockup_id?: string | null; created_at: string; mime?: string };

export type OutreachCsomag = {
  version: 1;
  generated_at: string;
  source: "rule" | "rule+ai";
  offer: Offer;
  texts: OutreachTexts;
  ai?: { email_subject: string; email_body: string; followup?: string; generated_at: string } | null;
  media?: { feed?: MediaRef; story?: MediaRef; video?: MediaRef };
  score?: { total: number; grade: string };
};

// ---- Ajánlat -------------------------------------------------------------------

type KindRule = {
  re: RegExp;
  kind: OfferKind;
  label: string;
  item: string;
  itemShort: string;
  alcoholFree: string;
  slot: [number, number];
  days: string;
  rationale: string;
};

const KIND_RULES: KindRule[] = [
  {
    re: /bisztr[óo]|bistro|gastropub|gasztropub/, kind: "bisztro", label: "bisztró",
    item: "egy pohár házi limonádé vagy egy kis fröccs", itemShort: "limonádé vagy fröccs", alcoholFree: "házi limonádé",
    slot: [14, 17], days: "hétfő–csütörtök",
    rationale: "Bisztróban az ebéd és a vacsora közti sáv a legcsendesebb, egy limonádé vagy fröccs alacsony költséggel hozhat be délutáni vendéget, aki mellé rendelhet is.",
  },
  {
    re: /reggeliz|breakfast|brunch/, kind: "reggelizo", label: "reggeliző",
    item: "egy kávé vagy egy pohár házi limonádé", itemShort: "kávé vagy limonádé", alcoholFree: "házi limonádé",
    slot: [13, 15], days: "hétköznap (H–P)",
    rationale: "Reggelizőnél a délelőtti csúcs után lassul a forgalom, egy kávé vagy limonádé erre a sávra hozhat új vendéget.",
  },
  {
    re: /k[áa]v[ée]z[óo]|k[áa]v[ée]h[áa]z|coffee|caf[ée]|espresso|kávé/, kind: "kavezo", label: "kávézó",
    item: "egy kávé (espresso, americano vagy cappuccino)", itemShort: "kávé", alcoholFree: "házi limonádé",
    slot: [8, 10], days: "hétköznap (H–P)",
    rationale: "Kávézónál a nyitás utáni két óra jól tervezhető sáv: egy kávé alacsony önköltségű, a vendég pedig megismeri a helyet.",
  },
  {
    re: /bor ?b[áa]r|wine|borozó|borkocsma|vinot/, kind: "borbar", label: "borbár",
    item: "egy fröccs vagy egy pohár (1 dl) bor", itemShort: "fröccs vagy pohár bor", alcoholFree: "házi limonádé vagy alkoholmentes fröccs",
    slot: [16, 18], days: "hétfő–csütörtök",
    rationale: "Borbárban a nyitás utáni első órák csendesebbek; egy fröccs kis költségű nyitás, a második pohár már a ti forgalmatok.",
  },
  {
    re: /k[ée]zm[űu]ves s[öo]r|craft|brewery|s[öo]rf[őo]z|brewpub|taproom/, kind: "sor", label: "kézműves söröző",
    item: "egy kis (0,3 l) csapolt sör vagy alkoholmentes sör", itemShort: "kis csapolt sör", alcoholFree: "alkoholmentes sör",
    slot: [15, 18], days: "hétfő–csütörtök",
    rationale: "Kézműves sörözőben a kora délután és a munka utáni sáv közti idő a csendesebb, egy kis sör kóstoló jelleggel hozhat be új vendéget.",
  },
  {
    re: /p[ée]ks[ée]g|bakery|cukr[áa]sz|patisserie|pastry/, kind: "pekseg", label: "pékség/cukrászda",
    item: "egy kávé vagy egy pohár limonádé", itemShort: "kávé vagy limonádé", alcoholFree: "limonádé",
    slot: [14, 17], days: "hétköznap (H–P)",
    rationale: "Délután a pékségek és cukrászdák forgalma jellemzően lassabb, egy kávé erre a sávra csalogathat vendéget, aki mellé süteményt is vehet.",
  },
  {
    re: /[ée]tterem|restaurant|vend[ée]gl[őo]|kifőzde|trattoria|pizz|ramen|eatery|konyha/, kind: "etterem", label: "étterem",
    item: "egy házi limonádé vagy egy kávé", itemShort: "limonádé vagy kávé", alcoholFree: "házi limonádé",
    slot: [15, 17], days: "hétfő–csütörtök",
    rationale: "Étteremben az ebéd és a vacsora közti sáv a leglazább, egy alkoholmentes ital alacsony költséggel töltheti fel.",
  },
  {
    re: /\bb[áa]r\b|\bbar\b|pub|s[öo]r[öo]z[őo]|kocsma|kokt[ée]l|cocktail|lounge|club|klub/, kind: "bar", label: "bár",
    item: "egy fröccs, egy kis sör vagy egy alkoholmentes ital", itemShort: "fröccs vagy kis sör", alcoholFree: "alkoholmentes ital",
    slot: [17, 19], days: "hétfő–csütörtök",
    rationale: "Bárnál a nyitás utáni korai este a legcsendesebb, ezt töltheti fel egy olcsó első ital.",
  },
];

const DEFAULT_RULE: KindRule = {
  re: /.*/, kind: "egyeb", label: "vendéglátóhely",
  item: "egy alkoholmentes ital (limonádé vagy kávé)", itemShort: "limonádé vagy kávé", alcoholFree: "limonádé",
  slot: [14, 17], days: "hétfő–csütörtök",
  rationale: "Délután a legtöbb helyen csendesebb a forgalom, egy alkoholmentes ital alacsony költséggel hozhat be új vendéget.",
};

function pickRule(category: string | null, name: string): KindRule {
  const c = (category ?? "").toLowerCase();
  if (c) for (const r of KIND_RULES) if (r.re.test(c)) return r;
  const n = name.toLowerCase();
  for (const r of KIND_RULES) if (r.re.test(n)) return r;
  return DEFAULT_RULE;
}

const hh = (h: number, m = 0) => `${h}:${String(m).padStart(2, "0")}`;

/** Első nyitási időpont a nyitvatartás szövegből (pl. „Hétfő: 8:00–16:00” → 8:00). */
export function firstOpeningTime(hours: string | null): { h: number; m: number } | null {
  if (!hours) return null;
  const re = /(\d{1,2})[:.](\d{2})\s*(?:–|-|—|to)\s*\d{1,2}[:.]\d{2}/g;
  let best: { h: number; m: number } | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(hours))) {
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h < 5 || h > 23) continue;
    if (!best || h * 60 + min < best.h * 60 + best.m) best = { h, m: min };
  }
  return best;
}

export function suggestOffer(p: LeadRow, profile: LeadProfile = getLeadProfile(p)): Offer {
  const rule = pickRule(profile.category, profile.name);
  let slot = `${hh(rule.slot[0])}–${hh(rule.slot[1])}`;
  let slotFromOpeningHours = false;
  if (rule.kind === "kavezo") {
    const open = firstOpeningTime(profile.openingHours);
    if (open) {
      slot = `${hh(open.h, open.m)}–${hh(open.h + 2, open.m)} (nyitás utáni 2 óra)`;
      slotFromOpeningHours = true;
    } else {
      slot = `nyitás utáni 2 óra (pl. ${hh(rule.slot[0])}–${hh(rule.slot[1])})`;
    }
  }
  const reviews = profile.reviews ?? 0;
  const dailyCap = reviews > 800 ? 10 : reviews > 150 ? 8 : 5;
  return {
    kind: rule.kind,
    kindLabel: rule.label,
    item: rule.item,
    itemShort: rule.itemShort,
    alcoholFreeOption: rule.alcoholFree,
    slot,
    days: rule.days,
    dailyCap,
    rationale: rule.rationale,
    slotFromOpeningHours,
  };
}

// ---- Szövegek -------------------------------------------------------------------

function districtAdjective(d: number | null): string | null {
  if (!d) return null;
  if (d === 14) return "zuglói";
  return `${toRoman(d)}. kerületi`;
}
function districtInessive(d: number | null): string | null {
  if (!d) return null;
  if (d === 14) return "Zuglóban";
  return `a ${toRoman(d)}. kerületben`;
}
/** Határozott névelő a név elé: „az” magánhangzó (vagy 1, 5) előtt, egyébként „a”. */
export function article(name: string): "a" | "az" {
  const c = name.trim().charAt(0).toLowerCase();
  return /[aáeéiíoóöőuúüű15]/.test(c) ? "az" : "a";
}
const Article = (name: string) => (article(name) === "az" ? "Az" : "A");

const fmtRating = (r: number) => r.toFixed(1).replace(".", ",");

function hookSentence(profile: LeadProfile, offer: Offer): string {
  if (profile.rating && profile.rating >= 4.4 && profile.reviews) {
    return `Láttam, hogy ${fmtRating(profile.rating)}★-on álltok a Google-ön ${profile.reviews} értékelés alapján – ilyen helyeket szeretnénk az induló kínálatban látni.`;
  }
  const adj = districtAdjective(profile.district);
  if (adj) return `${adj.charAt(0).toUpperCase()}${adj.slice(1)} ${offer.kindLabel}ként pont olyan hely vagytok, amilyet az induló kínálatba keresünk.`;
  return `Budapesti ${offer.kindLabel}ként pont olyan hely vagytok, amilyet az induló kínálatba keresünk.`;
}

const hashtag = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export function buildTexts(profile: LeadProfile, offer: Offer): OutreachTexts {
  const name = profile.name;
  const hook = hookSentence(profile, offer);
  const where = districtInessive(profile.district);

  const emailSubject = `${name} – Founding Partner hely a Come Get It-ben?`;
  const emailBody = [
    "Sziasztok!",
    "",
    "Bence vagyok, a Come Get It alapítója. A Come Get It egy budapesti helyfelfedező app: 2026. november 2-án indulunk, a VII. kerületi bulinegyedből kiindulva. " + hook,
    "",
    "Így működik: a vendég az appban QR-kóddal napi egy ingyen italt vált be, a pultos a Venue Hub appal beolvassa, és kész. Az ajánlatot, a készletet, a napokat és az időablakot ti szabjátok meg.",
    "",
    `Amit ${article(name)} ${name} esetében kezdésnek javasolnék:`,
    `• Ital: ${offer.item} (alkoholmentes opció: ${offer.alcoholFreeOption})`,
    `• Időablak: ${offer.days}, ${offer.slot}`,
    `• Napi keret: ${offer.dailyCap} ital – alacsonyról indulunk, később ti növelhetitek`,
    "",
    offer.rationale,
    "",
    "A pilotban nincs platformdíj. A keretet előre írásban rögzítjük. Eredményt nem ígérünk, de minden beváltást mérünk, így pontosan látjátok, mit hoz. Az induláshoz 15 Founding Partner helyet keresünk.",
    "",
    "Beugorhatok hozzátok jövő héten 15 percre, hogy megmutassam, hogyan nézne ki nálatok?",
    "",
    "Bence – Come Get It",
  ].join("\n");

  const dm = [
    `Szia! Bence vagyok, a Come Get It alapítója – budapesti helyfelfedező app, 2026. november 2-án indulunk.`,
    `${Article(name)} ${name} csapatát szívesen látnám a 15 Founding Partner hely között: a vendég QR-kóddal napi egy ingyen italt vált be nálatok, a pultos a Venue Hub appal beolvassa.`,
    `Kezdésnek ezt javasolnám: ${offer.itemShort}, ${offer.days} ${offer.slot}, napi ${offer.dailyCap} itallal indulva – az ajánlatot és a keretet ti szabjátok meg, a pilotban nincs platformdíj.`,
    `Átküldhetem e-mailben a részleteket, vagy beugorhatok egy kávéra?`,
  ].join(" ");

  const followup = [
    "Sziasztok!",
    "",
    `Pár napja írtam a Come Get It kapcsán, csak rákérdeznék, eljutott-e hozzátok. Röviden: napi ${offer.dailyCap} ingyen ${offer.itemShort} a ${offer.slot} sávban, QR-kódos beváltással, a pilotban platformdíj nélkül – minden feltételt ti szabtok meg.`,
    "",
    "Ha most nem aktuális, az is teljesen rendben, egy rövid válasz is sokat segít.",
    "",
    "Bence – Come Get It",
  ].join("\n");

  const opener = `Szia, Bence vagyok a Come Get It-től – ez egy budapesti helyfelfedező app, november 2-án indulunk. Két percet kérnék a tulajdonostól vagy az üzletvezetőtől: a csendesebb ${offer.slot} sávba hoznánk vendégeket egy ingyen ${offer.itemShort} ajánlattal, amit ti szabtok meg. Mikor tudnék vele beszélni?`;

  const tags = ["#comegetit", "#budapest", `#${hashtag(offer.kindLabel.split("/")[0])}`, profile.district ? `#budapest${toRoman(profile.district).toLowerCase()}kerulet` : null, "#ingyenital"].filter(Boolean).join(" ");

  const postInstagram = [
    `Új partnerhely a Come Get It-ben: ${name}!`,
    "",
    `${offer.kindLabel.charAt(0).toUpperCase()}${offer.kindLabel.slice(1)}${where ? ` ${where}` : " Budapesten"}${profile.address ? ` (${profile.address})` : ""}.`,
    "Az appban QR-kóddal napi egy ingyen italt válthatsz be – az aktuális ajánlat és készlet szerint.",
    "",
    "A Come Get It 2026. november 2-án indul Budapesten.",
    "",
    tags,
  ].join("\n");

  const postTiktok = [
    `Új hely a térképen: ${name}${where ? `, ${where}` : ""}.`,
    "Nézd meg az appban, mi az aktuális ajánlat – QR-kód, egy ingyen ital naponta, a készlet erejéig.",
    "Indulás: 2026. november 2.",
    "",
    "#comegetit #budapest #budapestfood #ingyenital",
  ].join("\n");

  return { emailSubject, emailBody, dm, followup, opener, postInstagram, postTiktok };
}

export function buildCsomag(p: LeadRow): OutreachCsomag {
  const profile = getLeadProfile(p);
  const offer = suggestOffer(p, profile);
  const rubric = computeRubric(p as Parameters<typeof computeRubric>[0]);
  return {
    version: 1,
    generated_at: new Date().toISOString(),
    source: "rule",
    offer,
    texts: buildTexts(profile, offer),
    ai: null,
    media: {},
    score: { total: rubric.total, grade: rubric.grade },
  };
}

/** A leadhez mentett csomag (partners.contacts_blob.outreach_csomag), ha van. */
export function readSavedCsomag(p: LeadRow | null | undefined): OutreachCsomag | null {
  if (!p) return null;
  const c = asObject(p.contacts_blob).outreach_csomag;
  const o = asObject(c);
  return o.version === 1 && o.texts && o.offer ? (o as unknown as OutreachCsomag) : null;
}

/** Új contacts_blob érték a csomaggal (a meglévő kulcsok megmaradnak). */
export function mergeCsomagIntoBlob(blob: unknown, csomag: OutreachCsomag) {
  return { ...asObject(blob), outreach_csomag: csomag };
}

/** Utasítás a meglévő `outreach-quick-drafts` Edge Function `extra` mezőjéhez (AI-finomítás). */
export function aiExtraInstruction(profile: LeadProfile, offer: Offer): string {
  return [
    "Ez egy Founding Partner megkeresés. A javasolt kezdő ajánlat, ezt építsd bele konkrétan:",
    `- ital: ${offer.item} (alkoholmentes opció: ${offer.alcoholFreeOption})`,
    `- időablak: ${offer.days}, ${offer.slot}`,
    `- napi keret: ${offer.dailyCap} ital, a hely később növelheti`,
    `- indoklás: ${offer.rationale}`,
    "KIZÁRÓLAG ezeket a tényeket használd a Come Get It-ről (minden mást hagyj ki, a brand contextben szereplő lifetime fee-t és szeptemberi soft launchot is):",
    ...OUTREACH_FACTS.map((f) => `- ${f}`),
    `A hely: ${profile.name}${profile.category ? `, ${profile.category}` : ""}${profile.districtLabel ? `, ${profile.districtLabel}` : ""}.`,
    "Ne írj kitalált számot vagy eredményt. Tegező, magyar hang. A short_nudge legyen a 3 nappal későbbi utánkövető.",
  ].join("\n");
}
