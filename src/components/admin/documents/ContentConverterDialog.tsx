import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Sparkles } from "lucide-react";

const FORMATS = [
  { value: "email_partner", label: "Partner email (hivatalos)" },
  { value: "email_followup", label: "Follow-up email (rövid)" },
  { value: "instagram_post", label: "Instagram poszt" },
  { value: "facebook_post", label: "Facebook poszt" },
  { value: "linkedin_post", label: "LinkedIn poszt" },
  { value: "tweet_thread", label: "X / Twitter thread" },
  { value: "press_release", label: "Sajtóközlemény" },
  { value: "one_liner", label: "5 db hook / one-liner" },
];

export const ContentConverterDialog = ({ open, onOpenChange, docId }: { open: boolean; onOpenChange: (v: boolean) => void; docId: string }) => {
  const { toast } = useToast();
  const [format, setFormat] = useState("email_partner");
  const [extra, setExtra] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setOut("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/convert-document-to-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId, format, extraInstructions: extra }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOut((p) => p + dec.decode(value, { stream: true }));
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(out);
    toast({ title: "Másolva" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-electric-300" /> Doksiból tartalom</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-nf-text-muted">Formátum</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-nf-text-muted">Extra utasítás (opcionális)</label>
            <Textarea value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Pl. Címezd Kiss Péternek, említsd hogy találkoztunk a Sziget Fesztiválon" rows={2} />
          </div>
          <Button onClick={run} disabled={busy} variant="neon" className="w-full">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Generálás…</> : <><Sparkles className="h-4 w-4" /> Generálás</>}
          </Button>
          {out && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-nf-text-muted">Eredmény ({out.length} karakter)</span>
                <Button size="sm" variant="outline" onClick={copy}><Copy className="h-3 w-3" /> Másolás</Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-nf-surface p-3 rounded border border-nf-border max-h-[40vh] overflow-auto">{out}</pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentConverterDialog;
