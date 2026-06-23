import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users, Send, Target, Wand2, Calendar, Palette, Image as ImageIcon,
  FileText, MessageSquare, Telescope,
} from "lucide-react";

type HubKey = "partners" | "content" | "knowledge";

type Tab = { to: string; label: string; icon: any; end?: boolean };

const HUBS: Record<HubKey, { label: string; tabs: Tab[] }> = {
  partners: {
    label: "Partnerek",
    tabs: [
      { to: "/admin/partners", label: "Pipeline", icon: Users, end: false },
      { to: "/admin/outreach", label: "Outreach", icon: Send },
      { to: "/admin/leads", label: "Leadek", icon: Target },
    ],
  },
  content: {
    label: "Tartalom",
    tabs: [
      { to: "/admin/content", label: "Studio", icon: Wand2 },
      { to: "/admin/calendar", label: "Naptár", icon: Calendar },
      { to: "/admin/brand", label: "Brand", icon: Palette },
      { to: "/admin/media", label: "Média", icon: ImageIcon },
    ],
  },
  knowledge: {
    label: "Tudás",
    tabs: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText, end: true },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare },
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope },
    ],
  },
};

/**
 * Vízszintes fülek a hub oldalakon. Mobile: vízszintesen görgethető.
 * Helyezd az oldal tetejére (PageHeader fölé/alá).
 */
export default function HubTabs({ hub }: { hub: HubKey }) {
  const h = HUBS[hub];
  return (
    <div className="-mx-4 md:mx-0 mb-4">
      <div
        className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-nf-border px-4 md:px-0"
        role="tablist"
        aria-label={`${h.label} fülek`}
      >
        {h.tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-electric-300 text-electric-300"
                  : "border-transparent text-nf-text-muted hover:text-white"
              )
            }
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
