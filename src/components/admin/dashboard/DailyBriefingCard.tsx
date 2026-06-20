import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, ArrowDownToLine, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Briefing = {
  id: string;
  date: string;
  summary_md: string;
  highlights: string[];
  suggested_focus: string[];
};

export function DailyBriefingCard() {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [adopting, setAdopting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    const { data } = await supabase.from("daily_briefings").select("*").eq("date", today).maybeSingle();
    setBriefing(data as any);
  };

  useEffect(() => { load(); }, []);

  const generate = async (force = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("daily-briefing", { body: { force } });
      if (error) throw error;
      if (data?.briefing) setBriefing(data.briefing);
      toast.success(data?.cached ? "Mai briefing betöltve" : "Új briefing kész");
    } catch (e: any) {
      toast.error("Briefing hiba: " + (e?.message ?? e));
    } finally { setLoading(false); }
  };

  const adoptFocus = async () => {
    if (!user || !briefing?.suggested_focus?.length) return;
    setAdopting(true);
    try {
      const top = briefing.suggested_focus.slice(0, 3).map((t) => ({ text: t, done: false }));
      const { data: existing } = await supabase.from("daily_focus").select("id").eq("user_id", user.id).eq("focus_date", today).maybeSingle();
      if (existing) {
        await supabase.from("daily_focus").update({ top_priorities: top }).eq("id", existing.id);
      } else {
        await supabase.from("daily_focus").insert({ user_id: user.id, focus_date: today, top_priorities: top });
      }
      toast.success("Mai fókusz átemelve");
      window.location.reload();
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    } finally { setAdopting(false); }
  };

  return (
    <Card className="border-electric-300/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-electric-300" /> AI napi briefing
          <div className="ml-auto flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => generate(true)} disabled={loading} className="h-7 px-2">
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!briefing && !loading && (
          <div className="space-y-2">
            <div className="text-sm text-nf-text-muted">Még nincs mai briefing. Generálj egyet — a héten történt KPI-okat, nyitott partnereket és a mai naptárt fogom elemezni.</div>
            <Button size="sm" variant="neon" onClick={() => generate(false)} className="w-full">Briefing generálása</Button>
          </div>
        )}
        {briefing && (
          <>
            <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-electric-300 [&_h2]:text-sm [&_h2]:mb-1 [&_h2]:mt-3 [&_p]:text-sm [&_ul]:text-sm [&_li]:my-0.5">
              <ReactMarkdown>{briefing.summary_md}</ReactMarkdown>
            </div>
            {briefing.suggested_focus?.length > 0 && (
              <div className="pt-2 border-t border-nf-border space-y-1.5">
                <div className="text-xs text-nf-text-muted uppercase tracking-wider">Javasolt fókusz</div>
                {briefing.suggested_focus.slice(0, 3).map((f, i) => (
                  <div key={i} className="text-sm flex gap-2"><span className="text-electric-300">{i + 1}.</span>{f}</div>
                ))}
                <Button size="sm" variant="outline" onClick={adoptFocus} disabled={adopting} className="w-full mt-2">
                  {adopting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <ArrowDownToLine className="h-3 w-3 mr-1" />} Átemelés Top 3 fókuszba
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
