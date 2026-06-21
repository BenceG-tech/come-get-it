import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon,
  MessageSquare, Cloud, Wand2, Palette, Trophy, Send, Inbox, TrendingUp, Brain, Telescope,
  Database, Beer, MoreHorizontal,
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
  /** Ha true, alapból csukva van — másodlagos terület. */
  secondary?: boolean;
};

/**
 * Letisztított IA: 3 főcsoport (Ma · Munka · Tudás) + 1 másodlagos „Több" csoport.
 * Cél: napi 4-5 oldal egy kattintásra, a többi ⌘K-val vagy a "Több" alatt.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "today",
    label: "Ma",
    hint: "Napi fókusz.",
    icon: LayoutDashboard,
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, description: "Napi fókusz + misszió-számláló." },
      { to: "/admin/mission", label: "Misszió központ", icon: Target, description: "Forecast, trend, blockerek + heti PDF review." },
      { to: "/admin/inbox", label: "Inbox", icon: Inbox, description: "Minden, ami rád vár." },
    ],
  },
  {
    key: "work",
    label: "Munka",
    hint: "Pipeline, outreach, tartalom.",
    icon: Target,
    items: [
      { to: "/admin/partners", label: "Pipeline", icon: Users, description: "Kanban: lead → aláírt." },
      { to: "/admin/outreach", label: "Outreach", icon: Send, description: "Email sequence-ek." },
      { to: "/admin/content", label: "Content Studio", icon: Wand2, description: "1 brief → minden formátum." },
      { to: "/admin/calendar", label: "Naptár", icon: Calendar, description: "Mikor mit posztolj." },
    ],
  },
  {
    key: "knowledge",
    label: "Tudás",
    hint: "Doksik, brand, AI-segítség.",
    icon: Database,
    items: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText, description: "Tudásbázis." },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare, description: "Kérdezz a doksiktól." },
      { to: "/admin/brand", label: "Brand Memory", icon: Palette, description: "Pitch-hez használt brand-tudás." },
      { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles, description: "Általános chat." },
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope, description: "Heti HORECA-jelek." },
    ],
  },
  {
    key: "more",
    label: "Több",
    hint: "Ritkábban használt eszközök.",
    icon: MoreHorizontal,
    secondary: true,
    items: [
      { to: "/admin/leads", label: "Leadek (kutatás)", icon: Target, description: "Kutatás + új helyek." },
      { to: "/admin/simulator", label: "Pipeline szimulátor", icon: TrendingUp, description: "What-if pipeline." },
      { to: "/admin/checklist", label: "Checklist", icon: ListChecks, description: "Heti to-do." },
      { to: "/admin/decisions", label: "Döntésnapló", icon: Brain, description: "Döntések + review." },
      { to: "/admin/retro", label: "Heti retro", icon: Trophy, description: "Mi sikerült / mi nem." },
      { to: "/admin/drive", label: "Google Drive", icon: Cloud, description: "Drive böngésző." },
      { to: "/admin/media", label: "Média", icon: ImageIcon, description: "Képek + AI elemzés." },
    ],
  },
];

/** Mobil bottom nav: 4 legfontosabb + ⌘K (a komponens adja hozzá). */
export const MOBILE_BOTTOM_NAV = [
  { to: "/admin", label: "Ma", icon: LayoutDashboard, end: true },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/partners", label: "Pipeline", icon: Target },
  { to: "/admin/documents", label: "Tudás", icon: Database },
];
