import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Star, Plus } from "lucide-react";
import DecisionPrompt from "@/components/admin/DecisionPrompt";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/track";

export default function AdminDecisions() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "due" | "reviewed">("all");
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("decisions").select("*").order("decided_at", { ascending: false }).limit(200);
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const now = new Date().toISOString();
  const filtered = items.filter((d) => {
    if (filter === "pending") return d.outcome == null;
    if (filter === "due") return d.outcome == null && d.review_at <= now;
    if (filter === "reviewed") return d.outcome != null;
    return true;
  });

  const submitReview = async (id: string) => {
    try {
      await supabase.from("decisions").update({
        outcome: { rating, note },
        outcome_rating: rating,
        outcome_note: note,
        reviewed_at: new Date().toISOString(),
      }).eq("id", id);
      trackEvent("decision_reviewed", { entity_id: id, value: rating });
      toast({ title: "Értékelés mentve" });
      setReviewing(null); setRating(3); setNote("");
      load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-electric-300 flex items-center gap-2"><Brain className="h-5 w-5" /> Döntésnapló</h1>
          <p className="text-xs text-nf-text-muted">Minden fontos döntés mögé egy 1 mondatos miért. Heti AI visszanézés.</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setNewOpen(true)}><Plus className="h-4 w-4" /> Új döntés</Button>
      </header>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "due", "reviewed"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "neon" : "outline"} onClick={() => setFilter(f)}>
            {f === "all" ? "Mind" : f === "pending" ? "Folyamatban" : f === "due" ? "Lejárt review" : "Értékelt"}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-sm text-nf-text-muted text-center py-8">Nincs döntés</div>}
        {filtered.map((d) => {
          const isDue = !d.outcome && d.review_at <= now;
          return (
            <Card key={d.id} className={`p-4 bg-nf-surface border ${isDue ? "border-red-500/60" : "border-nf-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{d.decision_text}</div>
                  {d.expected_outcome && <div className="text-xs text-nf-text-muted mt-1"><b>Várt:</b> {d.expected_outcome}</div>}
                  {d.context && <div className="text-[10px] text-nf-text-muted mt-1">{d.context}</div>}
                  <div className="text-[10px] text-nf-text-muted mt-2">
                    Döntve: {new Date(d.decided_at).toLocaleDateString("hu-HU")} · Review: {new Date(d.review_at).toLocaleDateString("hu-HU")}
                  </div>
                </div>
                {isDue && <Badge variant="destructive">Lejárt</Badge>}
                {d.outcome_rating && <Badge variant="outline" className="text-electric-300"><Star className="h-3 w-3 mr-1" />{d.outcome_rating}/5</Badge>}
              </div>

              {!d.outcome && (
                <div className="mt-3">
                  {reviewing === d.id ? (
                    <div className="space-y-2 border-t border-nf-border pt-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => setRating(n)} className={`p-1 ${n <= rating ? "text-electric-300" : "text-nf-text-muted"}`}>
                            <Star className="h-5 w-5" fill={n <= rating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mi történt? Mit tanultál?" rows={2} />
                      <div className="flex gap-2">
                        <Button size="sm" variant="neon" onClick={() => submitReview(d.id)}>Mentés</Button>
                        <Button size="sm" variant="outline" onClick={() => setReviewing(null)}>Mégse</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => { setReviewing(d.id); setRating(3); setNote(""); }}>Értékelés most</Button>
                  )}
                </div>
              )}
              {d.outcome_note && (
                <div className="mt-2 text-xs border-t border-nf-border pt-2"><b>Tanulság:</b> {d.outcome_note}</div>
              )}
            </Card>
          );
        })}
      </div>

      <DecisionPrompt open={newOpen} onOpenChange={setNewOpen} context="Manuális rögzítés" onSaved={load} />
    </div>
  );
}
