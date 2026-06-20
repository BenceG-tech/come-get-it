import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  doc: any;
  onUpdated: () => void;
}

export default function DocumentSummary({ doc, onUpdated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasSummary = !!doc.tldr || (Array.isArray(doc.key_points) && doc.key_points.length > 0);

  const generate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId: doc.id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      toast({ title: "Összefoglaló kész" });
      onUpdated();
      setExpanded(true);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!hasSummary) {
    return (
      <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        AI összefoglaló
      </Button>
    );
  }

  return (
    <div className="border border-electric-300/30 rounded-lg bg-electric-300/5 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-3 text-left hover:bg-electric-300/10 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-electric-300 shrink-0" />
          <span className="text-sm font-medium text-electric-300">AI összefoglaló</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-electric-300" /> : <ChevronDown className="h-4 w-4 text-electric-300" />}
      </button>
      {expanded && (
        <div className="p-3 pt-0 space-y-3 text-sm">
          {doc.tldr && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold mb-1">TL;DR</div>
              <p className="text-white/85 leading-relaxed">{doc.tldr}</p>
            </div>
          )}
          {Array.isArray(doc.key_points) && doc.key_points.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold mb-1">Kulcspontok</div>
              <ul className="space-y-1 text-white/85">
                {doc.key_points.map((p: string, i: number) => (
                  <li key={i} className="flex gap-2"><span className="text-electric-300">›</span>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(doc.faq) && doc.faq.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold mb-1">GYIK</div>
              <div className="space-y-2">
                {doc.faq.map((f: any, i: number) => (
                  <div key={i}>
                    <div className="font-medium text-white/90 text-xs">{f.q}</div>
                    <div className="text-white/70 text-xs">{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(doc.suggested_questions) && doc.suggested_questions.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-electric-300 font-semibold mb-1">Próbáld megkérdezni</div>
              <div className="flex flex-wrap gap-1.5">
                {doc.suggested_questions.map((q: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-nf-surface border border-nf-border text-[11px] text-white/80">{q}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Újragenerálás
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
