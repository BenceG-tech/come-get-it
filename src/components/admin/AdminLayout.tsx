import { ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, LogOut, ExternalLink, Menu, X, ListChecks,
  Target, Image as ImageIcon, MessageSquare, Cloud, Wand2, Palette, Trophy, Send, Inbox, TrendingUp,
  Brain, Telescope, Home, Database, PenTool, BarChart3, ChevronDown, Command,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import FloatingAIAssistant from "@/components/admin/FloatingAIAssistant";
import CommandPalette from "@/components/admin/CommandPalette";
import { VoiceCaptureFAB } from "@/components/admin/VoiceCaptureFAB";
import MobileBottomNav from "@/components/admin/MobileBottomNav";

type NavItem = { to: string; label: string; icon: any; end?: boolean };
type NavGroup = { key: string; label: string; icon: any; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    key: "overview", label: "Áttekintés", icon: Home, items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/admin/inbox", label: "Inbox", icon: Inbox },
      { to: "/admin/decisions", label: "Döntésnapló", icon: Brain },
    ],
  },
  {
    key: "pipeline", label: "Pipeline", icon: Target, items: [
      { to: "/admin/leads", label: "Leadek", icon: Target },
      { to: "/admin/partners", label: "Partnerek", icon: Users },
      { to: "/admin/outreach", label: "Outreach", icon: Send },
      { to: "/admin/simulator", label: "Szimulátor", icon: TrendingUp },
    ],
  },
  {
    key: "knowledge", label: "Tudás", icon: Database, items: [
      { to: "/admin/documents", label: "Dokumentumok", icon: FileText },
      { to: "/admin/documents/chat", label: "Chat doksikkal", icon: MessageSquare },
      { to: "/admin/drive", label: "Google Drive", icon: Cloud },
      { to: "/admin/media", label: "Média", icon: ImageIcon },
      { to: "/admin/brand", label: "Brand Memory", icon: Palette },
    ],
  },
  {
    key: "content", label: "Content", icon: PenTool, items: [
      { to: "/admin/content", label: "Content Studio", icon: Wand2 },
      { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar },
      { to: "/admin/checklist", label: "Checklist", icon: ListChecks },
    ],
  },
  {
    key: "intel", label: "Intelligencia", icon: Telescope, items: [
      { to: "/admin/trends", label: "Trend Radar", icon: Telescope },
      { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
    ],
  },
  {
    key: "reflex", label: "Reflexió", icon: BarChart3, items: [
      { to: "/admin/retro", label: "Heti retro", icon: Trophy },
    ],
  },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Auto-expand the group containing the current route
  const activeGroup = GROUPS.find(g => g.items.some(i => i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));

  const toggle = (k: string) => setCollapsed(s => ({ ...s, [k]: !s[k] }));

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

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {GROUPS.map(g => {
          const isCollapsed = collapsed[g.key] ?? (activeGroup?.key !== g.key);
          const GIcon = g.icon;
          return (
            <div key={g.key}>
              <button onClick={() => toggle(g.key)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest text-nf-text-muted hover:text-white">
                <GIcon className="h-3 w-3" />
                <span className="flex-1 text-left">{g.label}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isCollapsed && "-rotate-90")} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {g.items.map(it => (
                    <NavLink
                      key={it.to} to={it.to} end={it.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive ? "bg-electric-300/15 text-electric-300" : "text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
                        }`
                      }
                    >
                      <it.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                    </NavLink>
                  ))}
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
      <div className="min-h-screen flex flex-col md:flex-row bg-nf-bg text-white">
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

        <main className="flex-1 min-w-0 overflow-auto pb-16 md:pb-0">{children}</main>

        <MobileBottomNav />
        <FloatingAIAssistant />
        <CommandPalette />
        <VoiceCaptureFAB />
      </div>
    </AIAssistantProvider>
  );
};
