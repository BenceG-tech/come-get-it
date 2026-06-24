import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, X, Check, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type Priority = { text: string; done: boolean };

export function DailyFocusCard() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [draft, setDraft] = useState("");
  const [id, setId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("daily_focus")
        .select("*")
        .eq("user_id", user.id)
        .eq("focus_date", today)
        .maybeSingle();
      if (data) {
        setId(data.id);
        setPriorities((data.top_priorities as any) ?? []);
      }
      setLoaded(true);
    })();
  }, [user, today]);

  // Auto-generate once per day if empty
  useEffect(() => {
    if (!loaded || !user) return;
    if (priorities.length > 0) return;
    const flagKey = `daily_focus_autogen_${user.id}_${today}`;
    if (localStorage.getItem(flagKey)) return;
    localStorage.setItem(flagKey, "1");
    void generate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, user, today]);

  const persist = async (next: Priority[]) => {
    if (!user) return;
    if (id) {
      await supabase.from("daily_focus").update({ top_priorities: next as any }).eq("id", id);
    } else {
      const { data } = await supabase
        .from("daily_focus")
        .insert({ user_id: user.id, focus_date: today, top_priorities: next as any })
        .select()
        .single();
      if (data) setId(data.id);
    }
  };

  const generate = async (silent = false) => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("generate-daily-focus", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
      });
      if (error) throw error;
      // Re-fetch the saved record (function persists it server-side)
      const { data: row } = await supabase
        .from("daily_focus")
        .select("*")
        .eq("user_id", user!.id)
        .eq("focus_date", today)
        .maybeSingle();
      if (row) {
        setId(row.id);
        setPriorities((row.top_priorities as any) ?? []);
      } else if (data?.priorities) {
        const next = (data.priorities as any[]).map((p: any) => ({
          text: typeof p === "string" ? p : (p.text ?? ""),
          done: false,
        })).filter(p => p.text);
        setPriorities(next);
        await persist(next);
      }
      if (!silent) toast({ title: "Top 3 frissítve AI-val" });
    } catch (e: any) {
      if (!silent) toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const add = () => {
    if (!draft.trim() || priorities.length >= 3) return;
    const next = [...priorities, { text: draft.trim(), done: false }];
    setPriorities(next); persist(next); setDraft("");
  };
  const toggle = (i: number) => {
    const next = priorities.map((p, idx) => idx === i ? { ...p, done: !p.done } : p);
    setPriorities(next); persist(next);
  };
  const remove = (i: number) => {
    const next = priorities.filter((_, idx) => idx !== i);
    setPriorities(next); persist(next);
  };

  return (
    <Card className="border-electric-300/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-electric-300" /> Top 3 fókusz ma
        </CardTitle>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => generate(false)}
          disabled={generating}
          title="AI-val újragenerál"
        >
          {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-electric-300" />}
          <span className="ml-1">AI</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {priorities.length === 0 && !generating && (
          <div className="text-xs text-nf-text-muted">Mi a 3 legfontosabb dolog ma? Maximum 3 — fókusz.</div>
        )}
        {generating && priorities.length === 0 && (
          <div className="text-xs text-nf-text-muted flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> AI generálja a mai fókuszt…
          </div>
        )}
        {priorities.map((p, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded bg-nf-surface-alt">
            <button onClick={() => toggle(i)} className={`h-4 w-4 rounded border flex items-center justify-center ${p.done ? "bg-electric-300 border-electric-300" : "border-nf-text-muted"}`}>
              {p.done && <Check className="h-3 w-3 text-black" />}
            </button>
            <span className={`flex-1 text-sm ${p.done ? "line-through text-nf-text-muted" : ""}`}>{p.text}</span>
            <button onClick={() => remove(i)}><X className="h-3 w-3 text-nf-text-muted hover:text-destructive" /></button>
          </div>
        ))}
        {priorities.length < 3 && (
          <div className="flex gap-1.5">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Új prioritás..."
              className="h-8 text-xs"
            />
            <Button size="sm" onClick={add} className="h-8 px-2"><Plus className="h-3 w-3" /></Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
