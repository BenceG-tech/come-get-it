import { ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, ExternalLink, Menu, X, ChevronDown, Command } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import AdminFabCluster from "@/components/admin/AdminFabCluster";
import CommandPalette from "@/components/admin/CommandPalette";
import MobileBottomNav from "@/components/admin/MobileBottomNav";
import HubTabs from "@/components/admin/HubTabs";
import { useKeyboardShortcuts, SHORTCUT_LABELS } from "@/hooks/useKeyboardShortcuts";
import { NAV_GROUPS } from "@/lib/admin-nav-config";
import HelpTip from "@/components/admin/help/HelpTip";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

const HUB_FOR_PATH: Array<{ match: (p: string) => boolean; hub: "partners" | "content" | "knowledge" }> = [
  { match: (p) => p === "/admin/partners" || p.startsWith("/admin/outreach") || p.startsWith("/admin/leads"), hub: "partners" },
  { match: (p) => p.startsWith("/admin/content") || p.startsWith("/admin/calendar") || p.startsWith("/admin/brand") || p.startsWith("/admin/media"), hub: "content" },
  { match: (p) => p === "/admin/documents" || p.startsWith("/admin/documents/chat") || p.startsWith("/admin/trends"), hub: "knowledge" },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useKeyboardShortcuts();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const activeGroup = NAV_GROUPS.find(g =>
    g.items.some(i => i.end ? location.pathname === i.to : location.pathname.startsWith(i.to))
  );

  const isGroupCollapsed = (key: string) => collapsed[key] ?? (activeGroup?.key !== key);
  const toggle = (k: string) => setCollapsed(s => ({ ...s, [k]: !isGroupCollapsed(k) }));

  const Sidebar = (
    <aside className="w-64 shrink-0 border-r border-nf-border bg-nf-surface flex flex-col h-full">
      <div className="p-5 border-b border-nf-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-nf-text-muted">Come Get It</div>
          <div className="text-lg font-bold text-electric-300">Admin</div>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-nf-text-muted hover:text-white p-1" aria-label="Bezárás">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pt-3">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/80 text-sm text-nf-text-muted"
        >
          <span className="flex items-center gap-2"><Command className="h-3.5 w-3.5" /> Keresés / parancs</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-nf-bg border border-nf-border">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {NAV_GROUPS.map(g => {
          const isCollapsed = isGroupCollapsed(g.key);
          const GIcon = g.icon;
          return (
            <div key={g.key}>
              <div className="flex items-start gap-1 px-2 mb-1">
                <button onClick={() => toggle(g.key)} className="flex items-center gap-2 flex-1 min-w-0 text-left text-nf-text-muted hover:text-white">
                  <GIcon className="h-3.5 w-3.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-semibold truncate">{g.label}</div>
                    {g.hint && !isCollapsed && (
                      <div className="text-[10px] text-nf-text-muted/70 mt-0.5 leading-tight">{g.hint}</div>
                    )}
                  </div>
                  <ChevronDown className={cn("h-3 w-3 transition-transform shrink-0", isCollapsed && "-rotate-90")} />
                </button>
              </div>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {g.items.map(it => {
                    const sc = SHORTCUT_LABELS[it.to];
                    return (
                      <NavLink
                        key={it.to} to={it.to} end={it.end}
                        title={it.description ? `${it.label} — ${it.description}` : it.label}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${
                            isActive ? "bg-electric-300/15 text-electric-300" : "text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
                          }`
                        }
                      >
                        <it.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate flex-1">{it.label}</span>
                        {it.description && (
                          <HelpTip
                            what={it.description}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            side="right"
                          />
                        )}
                        {sc && <kbd className="text-[9px] px-1 py-0.5 rounded bg-nf-bg/60 border border-nf-border text-nf-text-muted opacity-0 group-hover:opacity-100 transition-opacity">{sc}</kbd>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-nf-border space-y-1">
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white">
          <ExternalLink className="h-4 w-4" /> Vissza az oldalra
        </button>
        <div className="px-3 py-1 text-xs text-nf-text-muted truncate">{user?.email}</div>
        <button onClick={async () => { await signOut(); navigate("/"); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white">
          <LogOut className="h-4 w-4" /> Kijelentkezés
        </button>
      </div>
    </aside>
  );

  return (
    <AIAssistantProvider>
      <div className="min-h-[100dvh] flex flex-col md:flex-row bg-nf-bg text-white">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-nf-border bg-nf-surface px-4 h-14">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-white" aria-label="Menü">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-widest text-nf-text-muted">CGI</span>
            <span className="text-sm font-bold text-electric-300">Admin</span>
          </div>
          <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))} className="p-2 -mr-2 text-white" aria-label="Keresés">
            <Command className="h-5 w-5" />
          </button>
        </header>

        <div className="hidden md:flex">{Sidebar}</div>

        {open && (
          <>
            <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className={cn("md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl", "animate-in slide-in-from-left duration-200")}>
              {Sidebar}
            </div>
          </>
        )}

        {/* pb-32 mobilon hogy a bottom nav + FAB ne takarja az oldalalját */}
        <main className="flex-1 min-w-0 overflow-auto pb-32 md:pb-8">
          <div className="hidden md:block sticky top-0 z-20 bg-nf-bg/85 backdrop-blur-md border-b border-nf-border/40 px-6 py-2">
            <AdminBreadcrumb />
          </div>
          {(() => {
            const hub = HUB_FOR_PATH.find((h) => h.match(location.pathname))?.hub;
            return hub ? (
              <div className="px-4 md:px-6 pt-3 md:pt-4">
                <HubTabs hub={hub} />
              </div>
            ) : null;
          })()}
          {children}
        </main>

        <MobileBottomNav />
        <AdminFabCluster />
        <CommandPalette />
      </div>
    </AIAssistantProvider>
  );
};
