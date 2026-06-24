import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Lead = {
  id: string;
  company_name: string;
  ai_score: number | null;
  status: string;
  updated_at: string;
  ai_next_action: string | null;
};

export function StalledLeadsCard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);

  const load = async () => {
    setLoading(true);
    const cutoff = new Date(Date.now() - 14 * 86400000).toISOString();
    const { data } = await supabase
      .from("partners")
      .select("id, company_name, ai_score, status, updated_at, ai_next_action")
      .in("status", ["lead", "contacted"])
      .lt("updated_at", cutoff)
      .order("ai_score", { ascending: false, nullsFirst: false })
      .limit(8);
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runSuggest = async () => {
    setSuggesting(true);
    try {
      const { error } = await supabase.functions.invoke("lead-promote-suggest", { body: { limit: 20 } });
      if (error) throw error;
      toast.success("Javaslatok az Inbox-ban");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Hiba történt");
    } finally {
      setSuggesting(false);
    }
  };

  const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-400" /> Beragadt leadek
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={runSuggest} disabled={suggesting}>
          {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          <span className="ml-1 text-xs">AI javaslat</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <div className="text-xs text-nf-text-muted">Betöltés…</div>}
        {!loading && leads.length === 0 && (
          <div className="text-xs text-nf-text-muted">Nincs beragadt lead 🎉</div>
        )}
        {leads.map((l) => (
          <Link
            key={l.id}
            to={`/admin/partners/${l.id}`}
            className="block p-2 rounded-md hover:bg-nf-surface-alt/60 border border-nf-border/40"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate text-white">{l.company_name}</div>
                {l.ai_next_action && (
                  <div className="text-[11px] text-nf-text-muted truncate">→ {l.ai_next_action}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <Badge variant="outline" className="text-[10px]">{daysSince(l.updated_at)}n</Badge>
                {l.ai_score != null && (
                  <span className="text-[10px] text-electric-300">{l.ai_score}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export default StalledLeadsCard;
