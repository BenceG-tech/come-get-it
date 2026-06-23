import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_BOTTOM_NAV, MOBILE_MORE_ITEMS } from "@/lib/admin-nav-config";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function MobileBottomNav() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

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
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-nf-text-muted"
              aria-label="Több"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>Több</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Több</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {MOBILE_MORE_ITEMS.map((it) => (
                <button
                  key={it.to}
                  onClick={() => { setMoreOpen(false); navigate(it.to); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-nf-border bg-nf-surface-alt/40 hover:border-electric-300/50 transition"
                >
                  <it.icon className="h-5 w-5 text-electric-300" />
                  <span className="text-[11px] text-center leading-tight">{it.label}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
