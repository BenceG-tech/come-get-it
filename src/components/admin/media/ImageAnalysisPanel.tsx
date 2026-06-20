import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Copy, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnalysisActionsBar from "./AnalysisActionsBar";
import AnalysisVersionPicker from "./AnalysisVersionPicker";

interface Props {
  open: boolean;
  onClose: () => void;
  doc: any | null;
  thumbUrl?: string | null;
  onUpdated: () => void;
}

export default function ImageAnalysisPanel({ open, onClose, doc, thumbUrl, onUpdated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [fresh, setFresh] = useState<any | null>(null);

  useEffect(() => {
    if (open && doc) {
      setStream("");
      setFresh(null);
    }
  }, [open, doc?.id]);

  const view = fresh ?? doc;

  const copy = async (txt: string) => {
    await navigator.clipboard.writeText(txt);
    toast({ title: "Másolva" });
  };

  const analyze = async () => {
    if (!doc) return;
    setLoading(true);
    setStream("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId: doc.id }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStream(acc);
      }
      // Fetch fresh row
      const { data: d2 } = await supabase.from("documents").select("*").eq("id", doc.id).maybeSingle();
      setFresh(d2);
      onUpdated();
      toast({ title: "Elemzés kész" });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const hasAnalysis = !!view?.ai_description;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-nf-surface border-nf-border">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-300" />
            AI képelemzés
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {thumbUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-black/40">
              <img src={thumbUrl} alt={doc?.title} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="text-sm font-medium truncate">{doc?.title}</div>

          {!hasAnalysis && !loading && !stream && (
            <Button variant="neon" onClick={analyze} className="w-full">
              <Sparkles className="h-4 w-4" /> Elemzés indítása
            </Button>
          )}

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-electric-300 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> AI elemzi a képet…
              </div>
              {stream && (
                <pre className="text-[10px] text-white/50 bg-black/30 rounded p-2 max-h-48 overflow-auto font-mono whitespace-pre-wrap">
                  {stream}<span className="animate-pulse">▍</span>
                </pre>
              )}
            </div>
          )}

          {!loading && hasAnalysis && (
            <div className="space-y-4 text-sm">
              <Section label="Leírás">
                <p className="text-white/85">{view.ai_description}</p>
              </Section>

              {view.ai_mood && (
                <Section label="Hangulat">
                  <p className="text-white/85">{view.ai_mood}</p>
                </Section>
              )}

              {Array.isArray(view.ai_dominant_colors) && view.ai_dominant_colors.length > 0 && (
                <Section label="Domináns színek">
                  <div className="flex gap-2 flex-wrap">
                    {view.ai_dominant_colors.map((c: string, i: number) => (
                      <button key={i} onClick={() => copy(c)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-nf-surface-alt border border-nf-border hover:border-electric-300/50 transition-colors">
                        <span className="w-4 h-4 rounded border border-white/20" style={{ background: c }} />
                        <span className="text-[11px] font-mono">{c}</span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {Array.isArray(view.ai_tags) && view.ai_tags.length > 0 && (
                <Section label="Címkék">
                  <div className="flex flex-wrap gap-1.5">
                    {view.ai_tags.map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-electric-300/10 border border-electric-300/30 text-[11px] text-electric-300">#{t}</span>
                    ))}
                  </div>
                </Section>
              )}

              {view.ai_suggested_alt && (
                <CopySection label="Alt szöveg (SEO)" value={view.ai_suggested_alt} onCopy={copy} />
              )}

              {view.ai_suggested_caption && (
                <CopySection label="Rövid caption" value={view.ai_suggested_caption} onCopy={copy} />
              )}

              {Array.isArray(view.ai_use_cases) && view.ai_use_cases.length > 0 && (
                <Section label="Felhasználási ötletek">
                  <ul className="space-y-1 text-white/85">
                    {view.ai_use_cases.map((u: string, i: number) => (
                      <li key={i} className="flex gap-2"><span className="text-electric-300">›</span>{u}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {view.ai_suggested_copy?.instagram && (
                <CopySection label="Instagram poszt" value={view.ai_suggested_copy.instagram} onCopy={copy} multiline />
              )}
              {view.ai_suggested_copy?.facebook && (
                <CopySection label="Facebook poszt" value={view.ai_suggested_copy.facebook} onCopy={copy} multiline />
              )}
              {view.ai_suggested_copy?.landing_headline && (
                <CopySection label="Landing headline" value={view.ai_suggested_copy.landing_headline} onCopy={copy} />
              )}

              <Button variant="outline" onClick={analyze} className="w-full">
                <RotateCw className="h-4 w-4" /> Újragenerálás
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold mb-1">{label}</div>
      {children}
    </div>
  );
}

function CopySection({ label, value, onCopy, multiline }: { label: string; value: string; onCopy: (s: string) => void; multiline?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold">{label}</div>
        <button onClick={() => onCopy(value)} className="text-[11px] text-electric-300 hover:underline flex items-center gap-1">
          <Copy className="h-3 w-3" /> Másol
        </button>
      </div>
      <div className={`text-white/85 bg-nf-surface-alt border border-nf-border rounded-md p-2 text-xs ${multiline ? "whitespace-pre-wrap" : "truncate"}`}>
        {value}
      </div>
    </div>
  );
}
