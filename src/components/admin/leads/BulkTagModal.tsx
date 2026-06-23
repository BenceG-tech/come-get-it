import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function BulkTagModal({
  partnerIds, open, onOpenChange, onDone,
}: {
  partnerIds: string[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const apply = async () => {
    const t = tag.trim();
    if (!t) return;
    setSaving(true);
    try {
      // Read current tags then merge per partner (small batch — fine on client).
      const { data: rows, error: e1 } = await supabase.from("partners").select("id, tags").in("id", partnerIds);
      if (e1) throw e1;
      const updates = (rows ?? []).map((r: any) => {
        const next = Array.from(new Set([...(r.tags ?? []), t]));
        return supabase.from("partners").update({ tags: next } as any).eq("id", r.id);
      });
      const results = await Promise.all(updates);
      const failed = results.filter((r) => (r as any).error).length;
      if (failed > 0) toast({ title: `${failed} sor hibázott`, variant: "destructive" });
      else toast({ title: `${partnerIds.length} partner címkézve: ${t}` });
      onDone?.();
      onOpenChange(false);
      setTag("");
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Címke hozzáadása ({partnerIds.length})</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <Input placeholder="pl. q1-prio, dunaparti, retro" value={tag} onChange={(e) => setTag(e.target.value)} autoFocus />
          <p className="text-xs text-nf-text-muted">A címke a meglévők mellé kerül (duplikátum nélkül).</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Mégse</Button>
          <Button variant="neon" onClick={apply} disabled={saving || !tag.trim()}>Hozzáad</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
