// Shared brand & phase context for all outreach / AI copy functions.
// Keep this single source of truth so the AI never invents user counts, videos, or live-app proof.

export const BRAND_CONTEXT = `
COMPANY: Come Get It (come-get-it.app)
FOUNDER: Bence Gátai (hello@come-get-it.app, +36 70 585 2053)

CURRENT PHASE — READ CAREFULLY:
- Soft launch: 2026 SZEPTEMBER. Today is BEFORE launch.
- Right now we are recruiting FOUNDING PARTNERS (vendéglátóhelyek + italmárkák) — a curated, limited cohort.
- There is NO live consumer userbase yet, only a growing waitlist in Budapest.
- There is NO public demo video, NO app screencast, NO case study yet.

WHAT THE FOUNDING PARTNER GETS (these are the legitimate hooks):
- Lifetime kedvezményes fee a launch utáni időszakra.
- Co-marketing: a launch kampányban kiemelt megjelenés (social, PR, in-app spotlight).
- Curated launch line-up: limitált számú hely az induló kínálatban — exkluzivitás.
- Early access az admin / partner dashboardhoz, közös termék-shapinghez.
- Mi hozzuk az első hullám fiatal budapesti vendéget — nem a meglévő tömeget ígérjük, hanem a launch momentumot.

HARD RULES — DO NOT WRITE ANY OF THESE:
- NE írd, hogy "tele van budapesti arcokkal", "rengeteg felhasználónk van", "már sokan használják", "azonnal jönnek a vendégek". Ez hazugság, mert még nincs launch.
- NE hivatkozz videóra, demóra, screencast-re, app-screenshotra, kivéve ha a partner-adatokban EXPLICIT link szerepel.
- NE ígérj konkrét forgalom-növekedést számokkal ("+30% vendég").
- NE használj generic "forradalmasítjuk" / "game-changer" típusú töltelékszavakat.
- NE köszöngess feleslegesen, NE legyél mesterkélt.

TONE: magyar, tegező, baráti-energikus, rövid mondatok, konkrét — mint egy founder, aki kávéra hív, nem mint egy ügynökség.
CTA mindig egy konkrét lépés: 15 perces hívás vagy egy személyes találkozó Budapesten.
`.trim();

export type TonePreset = "founding_pitch" | "warm_intro" | "short_nudge" | "meeting_close";

export const TONE_GUIDES: Record<TonePreset, string> = {
  founding_pitch:
    "Founding partner pitch: emeld ki, hogy LIMITÁLT a founding kör, sorold fel 2-3 konkrét perket (lifetime fee, co-marketing, launch line-up). Magabiztos, de nem nyomulós.",
  warm_intro:
    "Meleg bemutatkozás: hivatkozz 1 konkrét részletre a partnerről (kategória, IG poszt, review szám), majd vezesd fel a Come Get It-et 2 mondatban. CTA: kávé / 15 perc hívás.",
  short_nudge:
    "Rövid follow-up emlékeztető: max 60 szó, 1 kérdés a végén. Ne ismételd meg az egész pitch-et, csak utalj az előző levélre.",
  meeting_close:
    "Meeting close: feltételezd, hogy érdeklődnek. Ajánlj 2 konkrét időpontot (pl. szerda 10:00 vagy csütörtök 15:00) és egy helyszínt (Zoom vagy budapesti kávézó).",
};

export const LENGTH_TARGETS: Record<string, number> = {
  short: 60,
  medium: 120,
  long: 200,
};

/**
 * Loads brand context with optional overrides from brand_knowledge table.
 * Safe fallback: if DB unreachable, returns just the static BRAND_CONTEXT.
 */
export async function loadBrandContext(supabase: any): Promise<string> {
  let extra = "";
  try {
    const { data } = await supabase
      .from("brand_knowledge")
      .select("label, value")
      .limit(50);
    if (Array.isArray(data) && data.length) {
      const lines = data
        .map((r: any) => {
          const v = typeof r.value === "string" ? r.value : JSON.stringify(r.value ?? "");
          return v ? `- ${r.label}: ${v}` : null;
        })
        .filter(Boolean);
      if (lines.length) extra = `\n\nBRAND KNOWLEDGE (user overrides):\n${lines.join("\n")}`;
    }
  } catch (_) { /* ignore — fall back to static context */ }
  return BRAND_CONTEXT + extra;
}
