import { ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Sparkles, Calendar, LogOut, ExternalLink, Menu, X, ListChecks, Target, Image as ImageIcon, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import FloatingAIAssistant from "@/components/admin/FloatingAIAssistant";

const items = [
  { to: "/admin", label: "Áttekintés", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Leadek (vendéglátó)", icon: Target },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/documents", label: "Dokumentumok", icon: FileText },
  { to: "/admin/media", label: "Média (kép/videó)", icon: ImageIcon },
  { to: "/admin/documents/chat", label: "Chat a doksikkal", icon: MessageSquare },
  { to: "/admin/checklist", label: "Master checklist", icon: ListChecks },
  { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
  { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const Sidebar = (
    <aside className="w-64 shrink-0 border-r border-nf-border bg-nf-surface flex flex-col h-full">
      <div className="p-5 border-b border-nf-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-nf-text-muted">Come Get It</div>
          <div className="text-lg font-bold text-electric-300">Admin</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-nf-text-muted hover:text-white p-1"
          aria-label="Bezárás"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-electric-300/15 text-electric-300"
                  : "text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
              }`
            }
          >
            <it.icon className="h-4 w-4 shrink-0" />
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-nf-border space-y-1">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> Vissza az oldalra
        </button>
        <div className="px-3 py-1 text-xs text-nf-text-muted truncate">{user?.email}</div>
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
        >
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
          <div className="w-8" />
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

        <main className="flex-1 min-w-0 overflow-auto">{children}</main>

        <FloatingAIAssistant />
      </div>
    </AIAssistantProvider>
  );
};
