import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon,
  MessageSquare, Cloud, Wand2, Palette, Trophy, Send, Inbox, TrendingUp, Brain, Telescope,
  Database, PenTool, Beer, Megaphone,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: any;
  end?: boolean;
  description?: string;
};

export type NavGroup = {
  key: string;
  label: string;
  hint?: string;
  icon: any;
  items: NavItem[];
};

/**
 * A szeptemberi missziót követő logikai sorrend:
 * 1. Partner-előmegállapodás  (most a fókusz)
 * 2. Előregisztráció (waitlist + tartalom)
 * 3. Italszponzor
 * 4. Tudás & kutatás
 * 5. Beállítások
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "mission",
    label: "Szeptemberi misszió",
    hint: "Itt vezérled a napi munkát.",
    icon: LayoutDashboard,
    items: [
      { to: "/admin", label: "Ma", icon: LayoutDashboard, end: true, description: "Napi fókusz + misszió-számláló." },
      { to: "/admin/mission", label: "Misszió központ", icon: Target, description: "Forecast, trend, blockerek + heti PDF review." },
      { to: "/admin/inbox", label: "Inbox", icon: Inbox, description: "Minden, ami rád vár." },
      { to: "/admin/decisions", label: "Döntésnapló", icon: Brain, description: "Döntések + review." },
    ],
  },
  {
    key: "partner",
    label: "1. Partner-előmegállapodás",
    hint: "Most a fő fókusz — szept. 1-ig minél több LOI.",
    icon: Target,
    items: [
      { to: "/admin/leads", label: "Leadek", icon: Target, description: "Kutatás + új helyek." },
      { to: "/admin/partners", label: "Pipeline", icon: Users, description: "Kanban: lead → aláírt." },
      { to: "/admin/outreach", label: "Outreach", icon: Send, description: "Email sequence-ek." },
      { to: "/admin/simulator", label: "Szimulátor", icon: TrendingUp, description: "What-if pipeline." },
    ],
  },
  {
    key: "waitlist",
    label: "2. Előregisztráció",
    hint: "Waitlist növelés tartalommal.",
    icon: Megaphone,
    items: [
      { to: "/admin/content", label: "Content Studio", icon: Wand2, description: "1 brief → minden formátum." },
      { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar, description: "Mikor mit posztolj." },
      { to: "/admin/checklist", label: "Checklist", icon: ListChecks, description: "Heti to-do." },
    ],
  },
  {
    key: "sponsor",
    label: "3. Italszponzor",
    hint: "A waitlist + LOI adatokra építve.",
    icon: Beer,
    items: [
      { to: "/admin/brand", label: "Brand Memory", icon: Palette, description: "Pitch-hez használt brand-tudás." },
      // A specifikus „italmárkák target list” oldal jön későbbi fázisban.
    ],
  },
  {
    key: "knowledge",
    label: "4. Tudás & kutatás",
    hint: "Innen táplálkozik az AI minden generáláskor.",
    icon: Database,
    items: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText, description: "Tudásbázis." },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare, description: "Kérdezz a doksiktól." },
      { to: "/admin/drive", label: "Google Drive", icon: Cloud, description: "Drive böngésző." },
      { to: "/admin/media", label: "Média", icon: ImageIcon, description: "Képek + AI elemzés." },
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope, description: "Heti HORECA-jelek." },
      { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles, description: "Általános chat." },
      { to: "/admin/retro", label: "Heti retro", icon: Trophy, description: "Mi sikerült / mi nem." },
    ],
  },
];

/** Mobil bottom nav: a legfontosabb 4 + középen ⌘K. */
export const MOBILE_BOTTOM_NAV = [
  { to: "/admin", label: "Ma", icon: LayoutDashboard, end: true },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/partners", label: "Pipeline", icon: Target },
  { to: "/admin/documents", label: "Tudás", icon: Database },
];
