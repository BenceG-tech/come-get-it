import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const MODULES = ["lead", "content", "doc", "partner", "admin"] as const;

export function TimeTracker() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [module, setModule] = useState<string>("lead");
  const [minutes, setMinutes] = useState<string>("");
  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("time_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .order("created_at", { ascending: false });
    setLogs(data ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !minutes) return;
    const n = parseInt(minutes, 10);
    if (isNaN(n) || n <= 0) return;
    const { error } = await supabase.from("time_logs").insert({
      user_id: user.id,
      log_date: today,
      module,
      minutes: n,
    });
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    setMinutes("");
    load();
  };

  const totals = MODULES.reduce<Record<string, number>>((acc, m) => {
    acc[m] = logs.filter((l) => l.module === m).reduce((s, l) => s + l.minutes, 0);
    return acc;
  }, {});
  const total = Object.values(totals).reduce((s, v) => s + v, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-electric-300" /> Mai idő
          <span className="ml-auto text-xs text-nf-text-muted font-normal">{Math.floor(total / 60)}h {total % 60}m</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-5 gap-1 text-[10px]">
          {MODULES.map((m) => (
            <div key={m} className="text-center p-1.5 rounded bg-nf-surface-alt">
              <div className="text-nf-text-muted uppercase">{m}</div>
              <div className="font-bold text-electric-300">{totals[m] || 0}'</div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="bg-nf-surface-alt rounded px-2 text-xs"
          >
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <Input
            type="number"
            placeholder="perc"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="h-8 text-xs"
          />
          <Button size="sm" onClick={add} className="h-8 px-2"><Plus className="h-3 w-3" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
