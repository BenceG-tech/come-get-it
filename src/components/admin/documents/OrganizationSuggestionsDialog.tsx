import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ArrowRight, FolderPlus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Suggestion {
  doc_id: string;
  current_folder: string | null;
  suggested_folder: string;
  reason: string;
  confidence: number;
}

interface NewFolder {
  name: string;
  rationale: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApplied: () => void;
}

export default function OrganizationSuggestionsDialog({ open, onClose, onApplied }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newFolders, setNewFolders] = useState<NewFolder[]>([]);
  const [docMap, setDocMap] = useState<Record<string, any>>({});
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [applying, setApplying] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      const sug: Suggestion[] = j.suggestions ?? [];
      setSuggestions(sug);
      setNewFolders(j.new_folders ?? []);
      // Fetch doc titles
      if (sug.length) {
        const ids = sug.map((s) => s.doc_id);
        const { data: docs } = await supabase.from("documents").select("id, title, mime_type, storage_path").in("id", ids);
        const m: Record<string, any> = {};
        (docs ?? []).forEach((d) => (m[d.id] = d));
        setDocMap(m);
      }
      // Pre-pick high-confidence suggestions
      const p: Record<string, boolean> = {};
      sug.forEach((s) => { if (s.confidence >= 0.75) p[s.doc_id] = true; });
      setPicked(p);
    } catch (e: any) {
      toast({ title: "AI hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) run(); }, [open]);

  const apply = async () => {
    const ids = Object.keys(picked).filter((id) => picked[id]);
    if (!ids.length) return;
    setApplying(true);
    try {
      for (const id of ids) {
        const s = suggestions.find((x) => x.doc_id === id);
        if (!s) continue;
        await supabase.from("documents").update({ folder: s.suggested_folder }).eq("id", id);
      }
      toast({ title: "Áthelyezve", description: `${ids.length} elem új mappába került.` });
      onApplied();
      onClose();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  const pickedCount = Object.values(picked).filter(Boolean).length;
  const toggleAll = () => {
    if (pickedCount === suggestions.length) setPicked({});
    else {
      const p: Record<string, boolean> = {};
      suggestions.forEach((s) => (p[s.doc_id] = true));
      setPicked(p);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !applying && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-300" /> AI mappa-javaslatok
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center gap-2 text-electric-300 py-12 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" /> AI átnézi a doksikat…
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center text-nf-text-muted py-12 text-sm">
            Nincs javaslat — a doksik szervezése jelenleg rendben van. 🎉
          </div>
        )}

        {!loading && newFolders.length > 0 && (
          <div className="bg-electric-300/5 border border-electric-300/30 rounded-lg p-3 space-y-2">
            <div className="text-xs uppercase tracking-wider text-electric-300 font-semibold flex items-center gap-1">
              <FolderPlus className="h-3.5 w-3.5" /> Javasolt új mappák
            </div>
            <div className="space-y-1">
              {newFolders.map((f, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-white">{f.name}</span>
                  <span className="text-nf-text-muted"> — {f.rationale}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <>
            <div className="flex items-center justify-between text-xs">
              <button onClick={toggleAll} className="text-electric-300 hover:underline">
                {pickedCount === suggestions.length ? "Egyiket sem" : "Mindet kiválaszt"}
              </button>
              <span className="text-nf-text-muted">{pickedCount} / {suggestions.length} kijelölve</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
              {suggestions.map((s) => {
                const doc = docMap[s.doc_id];
                const isPicked = !!picked[s.doc_id];
                return (
                  <label key={s.doc_id} className={cn(
                    "block p-3 rounded-lg border cursor-pointer transition-colors",
                    isPicked ? "border-electric-300/50 bg-electric-300/5" : "border-nf-border bg-nf-surface-alt/30 hover:border-electric-300/30",
                  )}>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={isPicked}
                        onChange={(e) => setPicked((p) => ({ ...p, [s.doc_id]: e.target.checked }))}
                        className="mt-1 accent-electric-300 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-sm font-medium truncate">{doc?.title ?? s.doc_id}</div>
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="text-nf-text-muted">{s.current_folder ?? "Mappázatlan"}</span>
                          <ArrowRight className="h-3 w-3 text-electric-300 shrink-0" />
                          <span className="text-electric-300 font-medium">{s.suggested_folder}</span>
                          <span className="ml-auto px-1.5 py-0.5 rounded-full bg-nf-surface text-[10px] text-nf-text-muted">
                            {Math.round(s.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-nf-text-muted italic">{s.reason}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-nf-border">
          <Button variant="outline" onClick={onClose} disabled={applying}>Bezár</Button>
          {suggestions.length > 0 && (
            <Button variant="neon" onClick={apply} disabled={applying || pickedCount === 0}>
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Áthelyezés ({pickedCount})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
