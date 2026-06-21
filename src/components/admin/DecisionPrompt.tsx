import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/track";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  context: string;
  entityType?: string;
  entityId?: string;
  onSaved?: () => void;
}

export default function DecisionPrompt({ open, onOpenChange, context, entityType, entityId, onSaved }: Props) {
  const [decision, setDecision] = useState("");
  const [expected, setExpected] = useState("");
  const [reviewDays, setReviewDays] = useState("30");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!decision.trim()) { onOpenChange(false); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const review_at = new Date(Date.now() + (Number(reviewDays) || 30) * 86400000).toISOString();
      const { error } = await supabase.from("decisions").insert({
        decision_text: decision,
        expected_outcome: expected || null,
        context,
        entity_type: entityType ?? null,
        entity_id: entityId ?? null,
        review_at,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
      trackEvent("decision_created", { entity_type: entityType, entity_id: entityId });
      toast({ title: "Döntés rögzítve" });
      setDecision(""); setExpected(""); setReviewDays("30");
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-nf-surface border-nf-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-electric-300">Miért hozod ezt a döntést?</DialogTitle>
        </DialogHeader>
        <div className="text-xs text-nf-text-muted">{context}</div>
        <div className="space-y-2">
          <Textarea placeholder="1 mondat: miért most?" value={decision} onChange={(e) => setDecision(e.target.value)} rows={2} />
          <Textarea placeholder="Mit várok ettől? (opcionális)" value={expected} onChange={(e) => setExpected(e.target.value)} rows={2} />
          <div className="flex gap-2 items-center text-xs">
            <span className="text-nf-text-muted">Visszanézés:</span>
            <Input type="number" min={1} max={365} value={reviewDays} onChange={(e) => setReviewDays(e.target.value)} className="w-20 h-8" />
            <span className="text-nf-text-muted">nap múlva</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Skip</Button>
          <Button variant="neon" onClick={save} disabled={saving || !decision.trim()}>Rögzítés</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
