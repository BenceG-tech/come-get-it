import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, CheckCircle2, Target, Users, Beer, Zap } from "lucide-react";
import { toast } from "sonner";
import HelpTip from "@/components/admin/help/HelpTip";
import MissionLoopDialog from "./MissionLoopDialog";

type Task = {
  title: string;
  why?: string;
  mission_pillar?: "partner" | "waitlist" | "sponsor";
  priority?: "high" | "med" | "low";
  estimated_minutes?: number;
  entity_kind?: string | null;
  entity_id?: string | null;
  suggested_action?: string;
  completed?: boolean;
};

const PILLAR_ICON = { partner: Target, waitlist: Users, sponsor: Beer } as const;
const PRIORITY_COLOR = { high: "text-red-400 border-red-400/40", med: "text-electric-300 border-electric-300/40", low: "text-nf-text-muted border-nf-border" };

export default function TodayTasksCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [autopilot, setAutopilot] = useState<{ task: Task; index: number } | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("daily_focus").select("top_priorities").eq("focus_date", today).maybeSingle();
    const t = (data?.top_priorities as any) ?? [];
    setTasks(Array.isArray(t) ? t : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const regenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-daily-focus", { body: {} });
      if (error) throw error;
      toast.success("Mai feladatok frissítve");
      setTasks((data as any)?.tasks ?? []);
    } catch (e: any) {
      toast.error("Nem sikerült: " + (e?.message ?? e));
    }
    setGenerating(false);
  };

  const markComplete = async (idx: number) => {
    const next = [...tasks];
    next[idx] = { ...next[idx], completed: !next[idx].completed };
    setTasks(next);
    const { data: existing } = await supabase.from("daily_focus").select("id, user_id").eq("focus_date", today).maybeSingle();
    if (existing) {
      await supabase.from("daily_focus").update({ top_priorities: next }).eq("id", existing.id);
    }
  };

  const entityHref = (t: Task) => {
    if (t.entity_kind === "partner" && t.entity_id) return `/admin/partners/${t.entity_id}`;
    if (t.entity_kind === "inbox") return "/admin/inbox";
    if (t.entity_kind === "outreach") return "/admin/outreach";
    return null;
  };

  return (
    <Card className="border-electric-300/30 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-electric-300" /> Mai 3 feladat
          <HelpTip
            what="AI naponta összerakja 3 legfontosabb teendődet, valós CRM-adatok alapján (pangó partnerek, sürgős inbox, mission-gap)."
            why="Hogy ne te döntsd el reggel mivel kezdj — már priorizált sorrendben kapod."
            how="Pipáld ki ami kész, vagy klikk a feladatra → megnyitja a kapcsolódó entitást."
          />
          <div className="ml-auto flex items-center gap-2">
            <Link to="/admin/mission" className="text-[10px] text-electric-300 hover:underline">Misszió központ →</Link>
            <Button variant="ghost" size="sm" onClick={regenerate} disabled={generating} className="h-7 px-2">
              <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <div className="text-sm text-nf-text-muted">Töltés…</div>}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-6">
            <div className="text-sm text-nf-text-muted mb-3">Még nincs mai feladat-csomag.</div>
            <Button variant="neon" size="sm" onClick={regenerate} disabled={generating}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {generating ? "Generálás…" : "Generáld a mai 3 feladatot"}
            </Button>
          </div>
        )}
        {tasks.map((t, i) => {
          const Icon = PILLAR_ICON[t.mission_pillar ?? "partner"] ?? Target;
          const href = entityHref(t);
          const inner = (
            <div className={`p-3 rounded-lg border bg-nf-surface-alt/40 hover:bg-nf-surface-alt/70 transition-colors ${t.completed ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-2">
                <button onClick={(e) => { e.preventDefault(); markComplete(i); }} className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`h-4 w-4 ${t.completed ? "text-electric-300 fill-electric-300/20" : "text-nf-text-muted hover:text-electric-300"}`} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className="h-3 w-3 text-electric-300 shrink-0" />
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_COLOR[t.priority ?? "med"]}`}>{t.priority ?? "med"}</span>
                    {t.estimated_minutes && <span className="text-[10px] text-nf-text-muted">~{t.estimated_minutes}p</span>}
                  </div>
                  <div className={`font-medium text-sm mt-1 ${t.completed ? "line-through" : ""}`}>{t.title}</div>
                  {t.why && <div className="text-[11px] text-nf-text-muted mt-0.5">{t.why}</div>}
                  {t.suggested_action && <div className="text-[11px] text-electric-300/80 mt-1">→ {t.suggested_action}</div>}
                </div>
                <Button
                  variant="neon"
                  size="sm"
                  className="shrink-0 h-7 px-2 text-[11px]"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAutopilot({ task: t, index: i }); }}
                  title="AI végrehajtja: megkeresi a partnereket, kutat, draftol — te csak jóváhagyod."
                >
                  <Zap className="h-3 w-3 mr-1" /> AI csinálja
                </Button>
              </div>
            </div>
          );
          return href ? <Link key={i} to={href}>{inner}</Link> : <div key={i}>{inner}</div>;
        })}
      </CardContent>
      {autopilot && (
        <TaskAutopilotDialog
          open={!!autopilot}
          onOpenChange={(v) => !v && setAutopilot(null)}
          task={autopilot.task}
          taskIndex={autopilot.index}
        />
      )}
    </Card>
  );
}
