import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { v: "one_pager_venue", l: "1-pager vendéglátóhely" },
  { v: "long_pitch_venue", l: "Hosszú pitch vendéglátóhely" },
  { v: "drink_brand_deck", l: "Italmárka deck" },
  { v: "rewards_onboarding", l: "Rewards onboarding" },
  { v: "email_template", l: "Email sablon" },
  { v: "social_post", l: "Poszt szöveg" },
  { v: "ai_generated", l: "AI által generált" },
  { v: "other", l: "Egyéb" },
];

interface Props {
  doc: any;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function DocumentEditDialog({ doc, open, onClose, onSaved }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: doc?.title ?? "",
    folder: doc?.folder ?? "",
    category: doc?.category ?? "other",
    description: doc?.description ?? "",
    when_to_use: doc?.when_to_use ?? "",
    content: doc?.content ?? "",
  });

  const save = async () => {
    if (!form.title.trim()) {
      toast({ title: "Cím kötelező", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("documents").update({
        title: form.title.trim(),
        folder: form.folder.trim() || null,
        category: form.category,
        description: form.description.trim() || null,
        when_to_use: form.when_to_use.trim() || null,
        content: form.content || null,
      }).eq("id", doc.id);
      if (error) throw error;
      toast({ title: "Mentve" });
      onSaved();
      onClose();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doksi szerkesztése</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Cím *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Mappa" value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} />
            <select className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
          <Input placeholder="Rövid leírás" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Mikor használd?" value={form.when_to_use} onChange={(e) => setForm({ ...form, when_to_use: e.target.value })} />
          <div>
            <label className="text-xs text-nf-text-muted mb-1 block">Szöveges tartalom (Markdown)</label>
            <Textarea rows={10} className="font-mono text-sm" placeholder="# Cím..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Mégse</Button>
          <Button variant="neon" onClick={save} disabled={saving}>{saving ? "Mentés…" : "Mentés"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
