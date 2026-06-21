import { NavLink, useLocation } from "react-router-dom";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_BOTTOM_NAV } from "@/lib/admin-nav-config";

export default function MobileBottomNav() {
  const loc = useLocation();
  const openCmd = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-nf-border bg-nf-surface/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {MOBILE_BOTTOM_NAV.map((it) => {
          const active = it.end ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors",
                active ? "text-electric-300" : "text-nf-text-muted"
              )}
            >
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={openCmd}
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-nf-text-muted"
          aria-label="Parancspaletta"
        >
          <Command className="h-5 w-5" />
          <span>⌘K</span>
        </button>
      </div>
    </nav>
  );
}
