import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function BulkOutreachModal({
  partnerIds, open, onOpenChange, onDone,
}: {
  partnerIds: string[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [sequences, setSequences] = useState<any[]>([]);
  const [sequenceId, setSequenceId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data } = await supabase.from("outreach_sequences").select("id, name, kind, active").eq("active", true).order("name");
      setSequences(data ?? []);
      if (data && data[0]) setSequenceId(data[0].id);
    })();
  }, [open]);

  const count = partnerIds.length;

  const enroll = async () => {
    if (!sequenceId) return;
    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const rows = partnerIds.map((pid) => ({
        sequence_id: sequenceId,
        entity_type: "partner" as const,
        entity_id: pid,
        status: "active" as const,
        created_by: auth.user?.id ?? null,
      }));
      const { error } = await supabase.from("outreach_enrollments").insert(rows as any);
      if (error) throw error;
      toast({ title: `${count} partner beléptetve a sequence-be` });
      onDone?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Outreach indítása ({count} partner)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-sm">Sequence</label>
          {sequences.length === 0 ? (
            <p className="text-sm text-nf-text-muted">Nincs aktív sequence. Hozz létre egyet az Outreach oldalon.</p>
          ) : (
            <select value={sequenceId} onChange={(e) => setSequenceId(e.target.value)}
              className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
              {sequences.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.kind})</option>
              ))}
            </select>
          )}
          <p className="text-xs text-nf-text-muted">A sequence első lépése automatikusan indul a meglévő trigger szerint.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Mégse</Button>
          <Button variant="neon" onClick={enroll} disabled={submitting || !sequenceId}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Beléptetés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
