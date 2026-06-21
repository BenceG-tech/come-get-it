/**
 * Egy helyen minden admin súgó-szöveg.
 * A szeptemberi misszióra fókuszálva: partner-előmegállapodás → előregisztráció → italszponzor.
 */

export type AdminPageHelpKey =
  | "dashboard"
  | "inbox"
  | "leads"
  | "partners"
  | "outreach"
  | "simulator"
  | "documents"
  | "documentsChat"
  | "drive"
  | "media"
  | "brand"
  | "content"
  | "calendar"
  | "checklist"
  | "trends"
  | "ai"
  | "retro"
  | "decisions";

export interface PageHelp {
  title: string;
  phase?: string;
  purpose: string;
  audience?: string;
  todos?: string[];
  missionLink?: string;
}

export const ADMIN_PAGE_HELP: Record<AdminPageHelpKey, PageHelp> = {
  dashboard: {
    title: "Ma — Napi vezérlőpult",
    phase: "Misszió",
    purpose:
      "Egy képernyőn látszik, hol tartasz a szeptemberi célokhoz képest, és mit kell ma megtenned.",
    audience: "Alapító, napi 1-2x megnyitva.",
    todos: [
      "Nézd meg a misszió-számlálót (partnerek, waitlist, italszponzor).",
      "Pipáld ki a 3 napi fókuszt.",
      "Ha valami pirosban → kattints és intézd el.",
    ],
    missionLink: "Ez a kontroll-panel — itt látszik, hogy haladsz-e ütemben.",
  },
  inbox: {
    title: "Inbox — Minden ami rád vár",
    phase: "Misszió",
    purpose:
      "Egy helyen gyűlnek: új leadek, válaszra váró emailek, AI-javaslatok, esedékes döntések. Mint egy email inbox, csak a CRM-edhez.",
    audience: "Te. Napi 1x végigmenni rajta.",
    todos: [
      "Olvasd át a tételeket fentről lefelé.",
      "Snooze (1-7 nap) ha most nem aktuális.",
      "Konvertáld lead-dé / taszkká, ha kell.",
    ],
    missionLink: "Itt landolnak az új lead-jelzések — innen indul a partner-pipeline.",
  },
  leads: {
    title: "Leadek — Potenciális partnerhelyek",
    phase: "1. Partner",
    purpose:
      "Helyek, amik még NEM partnerek, de azok lehetnek. Itt kutatsz, importálsz, és kiválasztod kinek írj.",
    audience: "Te + jövőben egy junior aki kutat.",
    todos: [
      "Heti 10-20 új lead importálása (Maps export, kézi, AI).",
      "Indítsd el az „AI auto-kutatás”-t — egy kattintással elemzi a helyet.",
      "A magas score-úakat lökd a Pipeline-ra.",
    ],
    missionLink: "Itt épül fel a meríthető partner-tömeg szept. 1-ig.",
  },
  partners: {
    title: "Partnerek — Pipeline & profilok",
    phase: "1. Partner",
    purpose:
      "Minden hely, akivel beszélgetsz: lead → kontaktban → tárgyalás → előmegállapodás → aláírt. Itt látszik kinél hol állsz.",
    audience: "Te.",
    todos: [
      "Húzd át a kártyákat ahogy halad a beszélgetés.",
      "Minden „tárgyalás”-stage-nél állíts be SLA-t (mikor lépj újra).",
      "Az előmegállapodás (LOI) doksit csatold a partnerhez.",
    ],
    missionLink: "Szeptemberig minél több hely jusson el „előmegállapodás”-ig.",
  },
  outreach: {
    title: "Outreach — Email sequence-ek",
    phase: "1. Partner",
    purpose:
      "Automatizált 3-5 lépéses email sorozatok. Beiratkoztatsz egy leadet egy sequence-be, és magától megy.",
    audience: "Te.",
    todos: [
      "Készíts 1 sequence-et a hideg leadekre.",
      "Iratkoztass be batchben 10-20 leadet egyszerre.",
      "Heti 1x nézd át a metrikákat (open / reply rate).",
    ],
    missionLink: "Ez gyorsítja fel a partner-kontaktálást — kézi email helyett.",
  },
  simulator: {
    title: "Szimulátor — What-if pipeline kalkulátor",
    purpose:
      "Mi lenne, ha heti X lead → Y% konverzió? Mennyi aláírt partnered lesz szept. 1-ig?",
    audience: "Te, tervezésnél.",
    todos: [
      "Állítsd be a heti lead-célt.",
      "Játssz a konverziós %-okkal.",
      "Igazítsd a valóságot a célhoz.",
    ],
    missionLink: "Mutatja, elég gyors vagy-e a szeptemberi célhoz.",
  },
  documents: {
    title: "Dokumentumok — Tudásbázis",
    phase: "4. Tudás",
    purpose:
      "Minden saját anyag egy helyen: pitch deck, 1-pager, brand guide, email sablonok, képek. Az AI ezt használja, amikor új tartalmat / pitch-et generál.",
    audience: "Te + AI.",
    todos: [
      "Mappázd a doksikat (vendéglátóhely / italmárka / brand / template).",
      "Futtass AI auditot → minőség-score-okat ad.",
      "AI cimkék + embedding → a chat doksikkal majd megtalálja.",
    ],
    missionLink: "Innen készül az italszponzor-pitch és a partner-onboarding anyag.",
  },
  documentsChat: {
    title: "Chat a doksikkal",
    purpose:
      "Kérdezz az összes saját anyagodtól. „Mi a USP-nk az italmárkáknak?” — összerakja a doksikból.",
    audience: "Te, amikor új deck / pitch / email kell.",
    todos: [
      "Kérdezz konkrétan (pl. „adj 5 fő benefitet bárnak”).",
      "Csatolj 1-2 releváns doksit a kérdéshez.",
      "Az exportot mentsd új doksinak.",
    ],
  },
  drive: {
    title: "Google Drive böngésző",
    purpose:
      "A Drive-on lévő fájlokat behúzod a tudásbázisba — egy katt és AI-elemezhető lesz.",
    audience: "Te.",
    todos: [
      "Görgesd át a friss fájlokat.",
      "Húzd be amit fontos.",
    ],
  },
  media: {
    title: "Média — Képek & videók",
    purpose: "Vizuális anyagok galéria-nézetben, AI képelemzéssel (mit ábrázol, hangulat, színek).",
    audience: "Te, content készítésnél.",
    todos: ["AI elemzés → kapsz description + tag-eket.", "Használd a content studio-ban."],
  },
  brand: {
    title: "Brand Memory",
    purpose:
      "A márka „agya”: hangnem, célközönség, USP-k, tiltott szavak. Az AI minden tartalom-generáláskor ezt használja.",
    audience: "Te (egyszer beállítod, ritkán frissíted).",
    todos: [
      "Töltsd ki a hangnemet (energikus, magázás nélkül stb.).",
      "Add meg a USP-ket (3-5 mondat).",
      "Sorold fel a tiltott szavakat.",
    ],
    missionLink: "Ez biztosítja, hogy minden generált anyag konzisztens.",
  },
  content: {
    title: "Content Studio — 1 briefből minden formátum",
    phase: "2. Waitlist",
    purpose:
      "Egy brief → IG poszt, FB poszt, story, email, landing headline. Brand-fit score is kerül rá.",
    audience: "Te + későbbi marketing kolléga.",
    todos: [
      "Írj 1 mondatos briefet (vagy emelj át trendből).",
      "Válassz formátumokat.",
      "Brand-fit score > 70 esetén publikáld; alatta finomíts.",
    ],
    missionLink: "Innen jön a waitlist-növelő content.",
  },
  calendar: {
    title: "Marketing naptár",
    phase: "2. Waitlist",
    purpose: "Mikor melyik posztot adjuk ki. Drag-and-drop, AI autofill.",
    audience: "Te.",
    todos: ["Heti 3-5 poszt időzítve.", "AI autofill → kitölti az üres napokat."],
  },
  checklist: {
    title: "Checklist — Teendő lista",
    purpose: "Egyszerű to-do, prioritással. Drive-fájlt is hozzá lehet kötni.",
    audience: "Te.",
    todos: ["Add hozzá a heti 5-10 nagy feladatot."],
  },
  trends: {
    title: "Trend Radar — HORECA piaci jelek",
    phase: "4. Tudás",
    purpose:
      "Heti Firecrawl scrape: mi történik a HORECA-ban (Wolt, Foodora, italmárkák, Gen Z). AI össze is foglalja.",
    audience: "Te, hetente 1x átolvasni.",
    todos: [
      "Olvasd át a heti digestet (vasárnap 8:00).",
      "Húzz egy érdekes signal-t → „Brief” gomb → poszt-tervezet.",
      "Ami partner-relevancia, lökd lead-dé.",
    ],
    missionLink: "Innen jön a tartalmi muníció és az italmárka-pitch insightok.",
  },
  ai: {
    title: "AI asszisztens — Általános chat",
    purpose:
      "Strategy-, copy-, follow-up javaslatok. Eléri a CRM-edet és a doksikat. Hosszú szálak menthetők.",
    audience: "Te.",
    todos: ["Kérdezz konkrétan.", "Csatolj kontextust (lead, doksi)."],
  },
  retro: {
    title: "Heti retro",
    purpose: "Mi sikerült, mi nem, mit változtatunk. AI is összerak egy summary-t.",
    audience: "Te, hetente 1x (péntek).",
    todos: ["Tölts 10 percet vasárnap este → szárnyalni fogsz hétfőn."],
  },
  decisions: {
    title: "Döntésnapló",
    purpose:
      "Minden fontos döntésedet (kit hívsz fel, milyen árazás) felírod, megadod mit vársz tőle, az AI X nap múlva emlékeztet → értékeled.",
    audience: "Te.",
    todos: [
      "Új döntés → írd be a várt eredményt.",
      "Esedékes review → értékeld őszintén.",
    ],
    missionLink: "Ettől leszel jobb stratéga: visszamérheted a saját döntéseidet.",
  },
};

/** Mező-szintű súgók: a form-mezőkbe pottyantott `<HelpTip>` szövegei. */
export const FIELD_HELP = {
  leadScore: {
    what: "0-100 közötti AI-érték: mennyire jó eséllyel lesz partner.",
    why: "Segít prioritálni: a 70+ score-osakkal kezdj.",
    how: "Kattints az „AI auto-kutatás”-ra a lead drawerben.",
  },
  partnerStatus: {
    what: "Hol tart a kapcsolat: lead → contacted → meeting → loi → signed → declined.",
    why: "A pipeline-on minden stage egy oszlop. Innen jönnek a riportok.",
    how: "Húzd a kártyát az új oszlopba vagy állítsd be a drawerben.",
  },
  nextFollowup: {
    what: "Mikor lépj újra ezzel a partnerrel.",
    why: "A dashboardon megjelenik mai/elmaradt follow-upként.",
    how: "Állíts be reális dátumot (jövő hét hétfő stb.).",
  },
  outreachChannel: {
    what: "Milyen csatornán mész utána: email, telefon, IG DM, személyes.",
    why: "Csatorna-alapú riportok és sequence-ek miatt fontos.",
  },
  decisionExpected: {
    what: "Mit vársz a döntéstől? (pl. 5 új lead, 1 aláírás).",
    why: "A reviewkor összeveted a valósággal → tanulsz a saját mintáidból.",
  },
  trendQuery: {
    what: "Mit keressen a Firecrawl heti scrape (pl. „budapest cafe trends 2026”).",
    why: "Minőségibb a heti digest, ha specifikus.",
  },
} as const;
