import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

export const PartnerAIScoreCard = ({ partner, onUpdated }: { partner: any; onUpdated: () => void }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("score-partner", { body: { partnerId: partner.id } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "AI pontszám frissítve", description: `Pontszám: ${(data as any).score}/100` });
      onUpdated();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const score = partner.ai_score as number | null;
  const color = score == null ? "text-nf-text-muted" : score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="border border-nf-border rounded-lg p-4 bg-nf-surface space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-electric-300" />
          <h3 className="font-bold text-sm">AI lead pontszám</h3>
        </div>
        <Button size="sm" variant="outline" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {score == null ? "Pontozás" : "Újraértékelés"}
        </Button>
      </div>
      {score != null ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${color}`}>{score}</span>
            <span className="text-sm text-nf-text-muted">/ 100</span>
            {partner.ai_scored_at && (
              <span className="text-xs text-nf-text-muted ml-auto">{new Date(partner.ai_scored_at).toLocaleString("hu-HU")}</span>
            )}
          </div>
          {partner.ai_score_reason && <p className="text-sm text-nf-text-muted">{partner.ai_score_reason}</p>}
          {partner.ai_next_action && (
            <div className="border-l-2 border-electric-300 pl-3">
              <div className="text-[10px] uppercase tracking-wider text-electric-300">Következő lépés</div>
              <div className="text-sm">{partner.ai_next_action}</div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-nf-text-muted">Még nincs AI értékelés. Kattints a "Pontozás" gombra.</p>
      )}
    </div>
  );
};

export default PartnerAIScoreCard;
