import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Sparkles, Calendar, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { to: "/admin", label: "Áttekintés", icon: LayoutDashboard, end: true },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/documents", label: "Dokumentumok", icon: FileText },
  { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
  { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-nf-bg text-white">
      <aside className="w-64 border-r border-nf-border bg-nf-surface flex flex-col">
        <div className="p-5 border-b border-nf-border">
          <div className="text-xs uppercase tracking-widest text-nf-text-muted">Come Get It</div>
          <div className="text-lg font-bold text-electric-300">Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-electric-300/15 text-electric-300"
                    : "text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
                }`
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-nf-border space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> Vissza az oldalra
          </button>
          <div className="px-3 text-xs text-nf-text-muted truncate">{user?.email}</div>
          <button
            onClick={async () => { await signOut(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Kijelentkezés
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
