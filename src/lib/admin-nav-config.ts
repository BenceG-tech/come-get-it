import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon,
  MessageSquare, Cloud, Wand2, Palette, Trophy, Send, Inbox, TrendingUp, Brain, Telescope,
  MoreHorizontal, BarChart3,
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
 * 4 elsődleges hub (Ma · Pipeline · Tartalom · Tudás) + 1 másodlagos "Több".
 * Minden hub egyetlen menüpontból áll — a tabsávot az AdminLayout renderel path alapján.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "today",
    label: "Ma",
    icon: LayoutDashboard,
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, description: "Mai fókusz + pipeline pulzus." },
      { to: "/admin/inbox", label: "Inbox", icon: Inbox, description: "Minden, ami rád vár." },
    ],
  },
  {
    key: "pipeline",
    label: "Pipeline",
    icon: Target,
    items: [
      { to: "/admin/leads", label: "Leadek", icon: Target, description: "Kutatás + új helyek." },
      { to: "/admin/partners", label: "Pipeline", icon: Users, description: "Kanban: lead → aláírt." },
      { to: "/admin/outreach", label: "Outreach", icon: Send, end: true, description: "Email sequence-ek." },
    ],
  },
  {
    key: "content",
    label: "Tartalom",
    icon: Wand2,
    items: [
      { to: "/admin/content", label: "Studio", icon: Wand2, description: "1 brief → minden formátum." },
      { to: "/admin/calendar", label: "Naptár", icon: Calendar, description: "Mikor mit posztolj." },
      { to: "/admin/brand", label: "Brand Memory", icon: Palette, description: "Hangnem · personák · USP-k." },
    ],
  },
  {
    key: "knowledge",
    label: "Tudás",
    icon: FileText,
    items: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText, end: true, description: "Tudásbázis." },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare, description: "Kérdezz a doksiktól." },
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope, description: "Heti HORECA-jelek." },
    ],
  },
  {
    key: "more",
    label: "Több",
    hint: "Riportok, retro, AI és további eszközök.",
    icon: MoreHorizontal,
    secondary: true,
    items: [
      { to: "/admin/reports", label: "Riportok", icon: BarChart3, description: "Northstar · health · waitlist." },
      { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles, description: "Általános chat." },
      { to: "/admin/mission", label: "Misszió központ", icon: Target, description: "Forecast, blockerek." },
      { to: "/admin/retro", label: "Heti retro", icon: Trophy, description: "Mi sikerült / mi nem." },
      { to: "/admin/decisions", label: "Döntésnapló", icon: Brain, description: "Döntések + review." },
      { to: "/admin/checklist", label: "Checklist", icon: ListChecks, description: "Heti to-do." },
      { to: "/admin/simulator", label: "Pipeline szimulátor", icon: TrendingUp, description: "What-if pipeline." },
      { to: "/admin/media", label: "Média", icon: ImageIcon, description: "Képek + AI elemzés." },
      { to: "/admin/drive", label: "Google Drive", icon: Cloud, description: "Drive böngésző." },
    ],
  },
];

/** Mobil bottom nav: 4 fő hub. */
export const MOBILE_BOTTOM_NAV = [
  { to: "/admin", label: "Ma", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Pipeline", icon: Target },
  { to: "/admin/content", label: "Tartalom", icon: Wand2 },
  { to: "/admin/documents", label: "Tudás", icon: FileText, end: true },
];

/** A "Több" sheet menüpontjai mobilon. */
export const MOBILE_MORE_ITEMS: NavItem[] = [
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/reports", label: "Riportok", icon: BarChart3 },
  { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
  { to: "/admin/mission", label: "Misszió", icon: Target },
  { to: "/admin/outreach", label: "Outreach", icon: Send },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/calendar", label: "Naptár", icon: Calendar },
  { to: "/admin/brand", label: "Brand", icon: Palette },
  { to: "/admin/media", label: "Média", icon: ImageIcon },
  { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare },
  { to: "/admin/trends", label: "Trendek", icon: Telescope },
  { to: "/admin/drive", label: "Google Drive", icon: Cloud },
  { to: "/admin/decisions", label: "Döntésnapló", icon: Brain },
  { to: "/admin/retro", label: "Heti retro", icon: Trophy },
  { to: "/admin/checklist", label: "Checklist", icon: ListChecks },
  { to: "/admin/simulator", label: "Szimulátor", icon: TrendingUp },
];
