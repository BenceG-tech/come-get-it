import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeadOutreachModal({
  partnerId, partnerName, open, onOpenChange, onDone,
}: {
  partnerId: string | null;
  partnerName?: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [sequences, setSequences] = useState<any[]>([]);
  const [sequenceId, setSequenceId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [personalizing, setPersonalizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setSubject(""); setBody("");
    (async () => {
      const { data } = await supabase.from("outreach_sequences").select("id, name, kind, steps").eq("active", true).order("name");
      setSequences(data ?? []);
      if (data && data[0]) setSequenceId(data[0].id);
    })();
  }, [open]);

  const personalize = async () => {
    if (!partnerId || !sequenceId) return;
    setPersonalizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-personalize", {
        body: { partner_id: partnerId, sequence_id: sequenceId },
      });
      if (error) throw error;
      setSubject(data?.subject ?? "");
      setBody(data?.body ?? "");
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setPersonalizing(false); }
  };

  const enroll = async () => {
    if (!partnerId || !sequenceId) return;
    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("outreach_enrollments").insert({
        sequence_id: sequenceId,
        entity_type: "partner",
        entity_id: partnerId,
        status: "active",
        created_by: auth.user?.id ?? null,
        metadata: subject || body ? { personalized: { subject, body } } : {},
      } as any);
      if (error) throw error;
      toast({ title: "Outreach indítva", description: `${partnerName ?? "Partner"} beléptetve.` });
      onDone?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>📨 Outreach indítása — {partnerName ?? "partner"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="text-xs text-nf-text-muted">Sequence</label>
            {sequences.length === 0 ? (
              <p className="text-sm text-nf-text-muted">Nincs aktív sequence — hozz létre egyet az Outreach oldalon.</p>
            ) : (
              <select value={sequenceId} onChange={(e) => setSequenceId(e.target.value)}
                className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
                {sequences.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.kind})</option>)}
              </select>
            )}
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={personalize} disabled={!sequenceId || personalizing}>
              {personalizing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              AI személyre szabás
            </Button>
          </div>

          <div>
            <label className="text-xs text-nf-text-muted">Subject (opcionális override)</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Generálás után tölt..." />
          </div>
          <div>
            <label className="text-xs text-nf-text-muted">Body (opcionális override)</label>
            <Textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} placeholder="AI személyre szabás után megjelenik..." />
            <p className="text-[10px] text-nf-text-muted mt-1">Ha üres, a sequence eredeti első lépése megy ki.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Mégse</Button>
          <Button variant="neon" onClick={enroll} disabled={submitting || !sequenceId}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Indítás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
