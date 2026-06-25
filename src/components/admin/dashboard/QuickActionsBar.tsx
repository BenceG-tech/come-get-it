import { Link } from "react-router-dom";
import { Plus, Wand2, MessageSquare, Users, Calendar, Mic } from "lucide-react";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";
import { Zap } from "lucide-react";

export default function QuickActionsBar() {
  const ai = useAIAssistant();

  const linkActions = [
    { label: "Új partner", to: "/admin/partners", icon: Users },
    { label: "Új poszt", to: "/admin/content", icon: Wand2 },
    { label: "Naptár", to: "/admin/calendar", icon: Calendar },
  ];

  return (
    <SurfaceCard tone="base" icon={<Zap className="h-4 w-4" />} title="Gyors akciók" subtitle="Egy kattintásos parancsok">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => ai.open()}
          className="col-span-2 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-electric-300/15 text-electric-300 hover:bg-electric-300/25 border border-electric-300/30 text-sm font-medium transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Kérdezd az AI-t
        </button>
        {linkActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-white/80 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <a.icon className="h-3.5 w-3.5 text-electric-300" />
            <span className="truncate">{a.label}</span>
          </Link>
        ))}
        <button
          onClick={() => ai.open()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-white/80 transition-colors"
          title="Hangjegyzet"
        >
          <Mic className="h-3.5 w-3.5 text-electric-300" />
          <span className="truncate">Hangjegyzet</span>
        </button>
      </div>
    </SurfaceCard>
  );
}
