import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon,
  MessageSquare, Cloud, Wand2, Palette, Trophy, Send, Inbox, TrendingUp, Brain, Telescope,
  Database, MoreHorizontal,
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
  secondary?: boolean;
};

/**
 * Letisztított IA — 4 fő hub + 1 másodlagos "Több" csoport.
 * MA · PARTNEREK · TARTALOM · TUDÁS — minden hub egy oldal, fülekkel.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "today",
    label: "Ma",
    hint: "Napi fókusz, inbox, misszió.",
    icon: LayoutDashboard,
    items: [
      { to: "/admin", label: "Ma — Dashboard", icon: LayoutDashboard, end: true, description: "Napi fókusz + streak + gyors akciók." },
      { to: "/admin/inbox", label: "Inbox", icon: Inbox, description: "Minden, ami rád vár." },
      { to: "/admin/mission", label: "Misszió központ", icon: Target, description: "Forecast, trend, blockerek." },
    ],
  },
  {
    key: "partners",
    label: "Partnerek",
    hint: "Pipeline · outreach · leadek.",
    icon: Users,
    items: [
      { to: "/admin/partners", label: "Pipeline", icon: Users, description: "Kanban: lead → aláírt." },
      { to: "/admin/outreach", label: "Outreach", icon: Send, description: "Email sequence-ek." },
      { to: "/admin/leads", label: "Leadek (kutatás)", icon: Target, description: "Kutatás + új helyek." },
    ],
  },
  {
    key: "content",
    label: "Tartalom",
    hint: "Studio · naptár · brand · média.",
    icon: Wand2,
    items: [
      { to: "/admin/content", label: "Content Studio", icon: Wand2, description: "1 brief → minden formátum." },
      { to: "/admin/calendar", label: "Naptár", icon: Calendar, description: "Mikor mit posztolj." },
      { to: "/admin/brand", label: "Brand Memory", icon: Palette, description: "Hangnem · personák · USP-k." },
      { to: "/admin/media", label: "Média", icon: ImageIcon, description: "Képek + AI elemzés." },
    ],
  },
  {
    key: "knowledge",
    label: "Tudás",
    hint: "Doksik · chat · trendek · AI.",
    icon: Database,
    items: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText, description: "Tudásbázis." },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare, description: "Kérdezz a doksiktól." },
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope, description: "Heti HORECA-jelek." },
      { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles, description: "Általános chat." },
    ],
  },
  {
    key: "more",
    label: "Több",
    hint: "Ritkábban használt eszközök.",
    icon: MoreHorizontal,
    secondary: true,
    items: [
      { to: "/admin/simulator", label: "Pipeline szimulátor", icon: TrendingUp, description: "What-if pipeline." },
      { to: "/admin/checklist", label: "Checklist", icon: ListChecks, description: "Heti to-do." },
      { to: "/admin/decisions", label: "Döntésnapló", icon: Brain, description: "Döntések + review." },
      { to: "/admin/retro", label: "Heti retro", icon: Trophy, description: "Mi sikerült / mi nem." },
      { to: "/admin/drive", label: "Google Drive", icon: Cloud, description: "Drive böngésző." },
    ],
  },
];

/** Mobil bottom nav: 4 hub + ⌘K. */
export const MOBILE_BOTTOM_NAV = [
  { to: "/admin", label: "Ma", icon: LayoutDashboard, end: true },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/content", label: "Tartalom", icon: Wand2 },
  { to: "/admin/documents", label: "Tudás", icon: Database },
];
