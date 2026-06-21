import { NavLink, useLocation } from "react-router-dom";
import { Home, Target, Database, Telescope, Command } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/admin", label: "Ma", icon: Home, end: true },
  { to: "/admin/leads", label: "Pipeline", icon: Target },
  { to: "/admin/documents", label: "Tudás", icon: Database },
  { to: "/admin/trends", label: "Intel", icon: Telescope },
];

export default function MobileBottomNav() {
  const loc = useLocation();
  const openCmd = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-nf-border bg-nf-surface/95 backdrop-blur supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const active = it.end ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
          return (
            <NavLink key={it.to} to={it.to} end={it.end} className={cn("flex flex-col items-center gap-0.5 py-2 text-[10px]", active ? "text-electric-300" : "text-nf-text-muted")}>
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </NavLink>
          );
        })}
        <button onClick={openCmd} className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-nf-text-muted">
          <Command className="h-5 w-5" />
          <span>⌘K</span>
        </button>
      </div>
    </nav>
  );
}
