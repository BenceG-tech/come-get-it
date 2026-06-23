import { Link } from "react-router-dom";
import { Plus, Wand2, Mic, MessageSquare, Users, Calendar } from "lucide-react";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

/**
 * Egy kattintásos akciók a Ma oldal tetején — minden gomb a produktivitást szolgálja.
 */
export default function QuickActionsBar() {
  const ai = useAIAssistant();

  const actions = [
    { label: "Új partner", to: "/admin/partners", icon: Users },
    { label: "Új poszt", to: "/admin/content", icon: Wand2 },
    { label: "Naptárba", to: "/admin/calendar", icon: Calendar },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Link
          key={a.label}
          to={a.to}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-nf-surface-alt hover:bg-electric-300/15 hover:text-electric-300 border border-nf-border text-xs font-medium transition-colors"
        >
          <Plus className="h-3 w-3" />
          <a.icon className="h-3.5 w-3.5" />
          <span>{a.label}</span>
        </Link>
      ))}
      <button
        onClick={() => ai.open()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-electric-300/15 text-electric-300 hover:bg-electric-300/25 border border-electric-300/40 text-xs font-medium transition-colors"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Kérdezd az AI-t</span>
      </button>
      <button
        onClick={() => ai.open()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-nf-surface-alt hover:bg-nf-surface-alt/70 border border-nf-border text-xs font-medium transition-colors"
        title="Hangjegyzet / diktálás"
      >
        <Mic className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Hangjegyzet</span>
      </button>
    </div>
  );
}
