import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Props = {
  /** Context shown to the AI as additional grounding (any JSON-stringifiable). */
  context: any;
  /** Short label describing what the user is editing (helps the AI pick tone). */
  surface?: string;
  /** Quick prompt chips. */
  suggestions?: string[];
  /** Called when user clicks "Beillesztés"; receives raw markdown text. */
  onInsert?: (text: string) => void;
  /** Custom button position; default top-right floating. */
  className?: string;
};

export default function InlineAIHelper({
  context, surface = "form", suggestions, onInsert, className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const defaultSuggestions = suggestions ?? [
    "Foglald össze röviden, mit tudunk",
    "Javasolj 3 következő lépést",
    "Írj egy 2-mondatos megnyitót",
  ];

  const ask = async (prompt: string) => {
    setLoading(true); setAnswer(null);
    try {
      const { data, error } = await supabase.functions.invoke("admin-ai-quick", {
        body: { surface, context, prompt },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = typeof data?.text === "string" ? data.text : "";
      if (!text) throw new Error("Üres válasz az AI-tól.");
      setAnswer(text);
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setLoading(false); }
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={className ?? "h-7 px-2 text-xs gap-1 border-electric-300/40 text-electric-300 hover:bg-electric-300/10"}
        >
          <Sparkles className="h-3 w-3" /> AI segítség
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3 space-y-2" align="end">
        <div className="text-xs uppercase tracking-wider text-electric-300 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Inline AI ({surface})
        </div>
        <div className="flex flex-wrap gap-1">
          {defaultSuggestions.map((s) => (
            <button key={s} onClick={() => ask(s)}
              className="text-[11px] px-2 py-1 rounded-full bg-nf-surface-alt hover:bg-electric-300/10 border border-nf-border">
              {s}
            </button>
          ))}
        </div>
        <Textarea rows={2} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Egyedi kérdés / kérés…" className="text-xs" />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => { setAnswer(null); setQ(""); }}>Reset</Button>
          <Button size="sm" variant="neon" disabled={loading || !q.trim()} onClick={() => ask(q.trim())}>
            {loading && <Loader2 className="h-3 w-3 animate-spin" />} Kérdezz
          </Button>
        </div>
        {answer && (
          <div className="rounded-lg bg-nf-surface-alt/60 border border-nf-border p-2 max-h-64 overflow-y-auto">
            <div className="prose prose-sm prose-invert max-w-none text-xs">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
            {onInsert && (
              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" onClick={() => { onInsert(answer); setOpen(false); }}>
                  Beillesztés
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
