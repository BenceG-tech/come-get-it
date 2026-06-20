import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, X, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function DailyFocusCard() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [priorities, setPriorities] = useState<Array<{ text: string; done: boolean }>>([]);
  const [draft, setDraft] = useState("");
  const [id, setId] = useState<string | null>(null);

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
    })();
  }, [user]);

  const persist = async (next: Array<{ text: string; done: boolean }>) => {
    if (!user) return;
    if (id) {
      await supabase.from("daily_focus").update({ top_priorities: next }).eq("id", id);
    } else {
      const { data } = await supabase
        .from("daily_focus")
        .insert({ user_id: user.id, focus_date: today, top_priorities: next })
        .select()
        .single();
      if (data) setId(data.id);
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-electric-300" /> Top 3 fókusz ma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {priorities.length === 0 && (
          <div className="text-xs text-nf-text-muted">Mi a 3 legfontosabb dolog ma? Maximum 3 — fókusz.</div>
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
