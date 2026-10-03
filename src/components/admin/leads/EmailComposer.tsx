import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

// Kézi e-mail küldés a send-partner-email Edge Functionnel. Csak a „Küldés” gombra küld.
// initialSubject / initialBody: előtöltés (pl. a megkeresési csomagból).
export default function EmailComposer({ partnerIds, onClose, onDone, initialSubject, initialBody }: {
  partnerIds: string[];
  onClose: () => void;
  onDone: () => void;
  initialSubject?: string;
  initialBody?: string;
}) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [body, setBody] = useState(initialBody ?? "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("email_templates").select("*").order("name").then(({ data }) => setTemplates(data ?? []));
  }, []);

  useEffect(() => {
    const t = templates.find(t => t.id === templateId);
    if (t) { setSubject(t.subject); setBody(t.body_md); }
  }, [templateId, templates]);

  const send = async () => {
    if (!subject.trim() || !body.trim()) { toast({ title: "Hiányzik tárgy vagy szöveg", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-partner-email", {
        body: { partner_ids: partnerIds, template_id: templateId || null, subject_override: subject, body_override: body },
      });
      if (error) throw error;
      toast({ title: `Email küldve: ${data.sent?.length ?? 0}`, description: data.failed?.length ? `${data.failed.length} sikertelen` : undefined });
      onDone();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 border-electric-300/40">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Email küldés ({partnerIds.length} címzett)</DialogTitle>
        </DialogHeader>

        <div>
          <label className="text-xs uppercase text-nf-text-muted mb-1 block">Sablon</label>
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm">
            <option value="">— Egyedi szöveg —</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase text-nf-text-muted mb-1 block">Tárgy</label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase text-nf-text-muted mb-1 block">Üzenet (markdown, változók: {`{{contact_name}}, {{company_name}}, {{city}}`})</label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="font-mono text-sm" />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Mégse</Button>
          <Button variant="neon" disabled={loading} onClick={send}>
            <Send className="h-4 w-4" /> {loading ? "Küldés…" : `Küldés (${partnerIds.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
