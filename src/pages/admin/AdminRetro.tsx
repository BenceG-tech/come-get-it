import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trophy, Plus, Loader2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Goal = { id: string; week_start: string; title: string; metric: string | null; target: number; actual: number; status: string };
type Retro = { id: string; week_start: string; summary_md: string; wins: string[]; blockers: string[]; next_week_focus: any[]; kpi_delta: any; created_at: string };

function weekStart(d = new Date()): string {
  const dt = new Date(d);
  const day = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - day);
  return dt.toISOString().slice(0, 10);
}

export default function AdminRetro() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [retros, setRetros] = useState<Retro[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMetric, setNewMetric] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [generating, setGenerating] = useState(false);
  const wk = weekStart();

  const load = async () => {
    const [g, r] = await Promise.all([
      supabase.from("weekly_goals").select("*").order("week_start", { ascending: false }).order("created_at"),
      supabase.from("weekly_retros").select("*").order("week_start", { ascending: false }).limit(8),
    ]);
    setGoals((g.data as any) ?? []);
    setRetros((r.data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  const currentGoals = goals.filter((g) => g.week_start === wk);
  const nextGoals = goals.filter((g) => g.week_start > wk);

  const addGoal = async () => {
    if (!newTitle.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("weekly_goals").insert({
      user_id: user?.id, week_start: wk, title: newTitle, metric: newMetric || null,
      target: Number(newTarget) || 0, status: "active",
    });
    setNewTitle(""); setNewMetric(""); setNewTarget("");
    load();
  };

  const updateActual = async (id: string, actual: number) => {
    await supabase.from("weekly_goals").update({ actual }).eq("id", id);
    load();
  };
  const setStatus = async (id: string, status: string) => {
    await supabase.from("weekly_goals").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("weekly_goals").delete().eq("id", id);
    load();
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("weekly-retro", { body: { force: true } });
      if (error) throw error;
      toast.success(data?.cached ? "Heti retro betöltve" : "Új retro kész");
      load();
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    } finally { setGenerating(false); }
  };

  const renderGoals = (list: Goal[]) => list.map((g) => {
    const pct = g.target > 0 ? Math.min(100, Math.round((Number(g.actual) / Number(g.target)) * 100)) : 0;
    return (
      <div key={g.id} className="p-3 rounded-lg bg-nf-surface-alt space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{g.title}</div>
            {g.metric && <div className="text-xs text-nf-text-muted">Mérőszám: {g.metric}</div>}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${g.status === "done" ? "bg-electric-300/20 text-electric-300" : g.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-nf-border text-nf-text-muted"}`}>{g.status}</span>
          <button onClick={() => remove(g.id)} className="text-nf-text-muted hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
        </div>
        <Progress value={pct} className="h-1.5" />
        <div className="flex items-center gap-2">
          <Input type="number" value={g.actual} onChange={(e) => updateActual(g.id, Number(e.target.value))} className="h-7 text-xs w-24" />
          <span className="text-xs text-nf-text-muted">/ {g.target}</span>
          <div className="ml-auto flex gap-1">
            {g.status !== "done" && <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setStatus(g.id, "done")}>Kész</Button>}
            {g.status === "pending" && <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setStatus(g.id, "active")}>Aktivál</Button>}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-electric-300" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Heti célok & retro</h1>
          <p className="text-sm text-nf-text-muted">Hét eleje: {wk}</p>
        </div>
        <Button className="ml-auto" variant="neon" onClick={generate} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Retro generálása
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Aktuális hét célok</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {currentGoals.length === 0 && <div className="text-sm text-nf-text-muted">Még nincs cél erre a hétre.</div>}
          {renderGoals(currentGoals)}
          <div className="pt-3 border-t border-nf-border grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_auto] gap-2">
            <Input placeholder="Cél címe" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input placeholder="Mérőszám (pl. waitlist_signup)" value={newMetric} onChange={(e) => setNewMetric(e.target.value)} />
            <Input placeholder="Cél" type="number" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} />
            <Button onClick={addGoal} variant="neon"><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {nextGoals.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Jövő heti javaslatok (AI)</CardTitle></CardHeader>
          <CardContent className="space-y-3">{renderGoals(nextGoals)}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Eddigi heti retrok</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {retros.length === 0 && <div className="text-sm text-nf-text-muted">Még nincs retro. Generálj egyet a hét végén.</div>}
          {retros.map((r) => (
            <div key={r.id} className="p-4 rounded-lg bg-nf-surface-alt">
              <div className="text-xs text-electric-300 uppercase tracking-wider mb-2">Hét: {r.week_start}</div>
              <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-electric-300 [&_h2]:text-sm [&_p]:text-sm">
                <ReactMarkdown>{r.summary_md}</ReactMarkdown>
              </div>
              {r.wins?.length > 0 && (
                <div className="mt-3"><div className="text-xs uppercase text-nf-text-muted mb-1">Eredmények</div>
                  <ul className="text-sm space-y-0.5">{r.wins.map((w, i) => <li key={i}>✓ {w}</li>)}</ul>
                </div>
              )}
              {r.blockers?.length > 0 && (
                <div className="mt-2"><div className="text-xs uppercase text-nf-text-muted mb-1">Akadályok</div>
                  <ul className="text-sm space-y-0.5">{r.blockers.map((b, i) => <li key={i}>⚠ {b}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
