import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Send } from "lucide-react";

export default function EmailComposer({ partnerIds, onClose, onDone }: { partnerIds: string[]; onClose: () => void; onDone: () => void }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 border-electric-300/40">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Email küldés ({partnerIds.length} címzett)</h2>
          <button onClick={onClose} className="text-nf-text-muted hover:text-white"><X className="h-5 w-5" /></button>
        </div>

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
      </Card>
    </div>
  );
}
