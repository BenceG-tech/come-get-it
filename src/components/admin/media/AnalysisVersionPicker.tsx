import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, History, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  docId: string;
  onSelect: (result: any | null) => void;
  refreshKey?: number;
}

type Version = {
  id: string;
  result: any;
  is_current: boolean;
  created_at: string;
};

export default function AnalysisVersionPicker({ docId, onSelect, refreshKey }: Props) {
  const { toast } = useToast();
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("image_analysis_versions")
        .select("id, result, is_current, created_at")
        .eq("document_id", docId)
        .order("created_at", { ascending: false });
      const list = (data ?? []) as Version[];
      setVersions(list);
      const cur = list.find((v) => v.is_current) ?? list[0] ?? null;
      if (cur) setActiveId(cur.id);
    })();
  }, [docId, refreshKey]);

  if (versions.length <= 1) return null;

  const select = (v: Version) => {
    setActiveId(v.id);
    onSelect(v.result);
  };

  const makeCurrent = async () => {
    if (!activeId) return;
    const v = versions.find((x) => x.id === activeId);
    if (!v || v.is_current) return;
    setLoading(true);
    try {
      await supabase.from("image_analysis_versions").update({ is_current: false }).eq("document_id", docId);
      await supabase.from("image_analysis_versions").update({ is_current: true }).eq("id", v.id);
      await supabase.from("documents").update(v.result).eq("id", docId);
      setVersions((prev) => prev.map((x) => ({ ...x, is_current: x.id === v.id })));
      toast({ title: "Aktuális verzió beállítva" });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d: string) => {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}.${dt.getDate()} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, "0")}`;
  };

  const active = versions.find((v) => v.id === activeId);

  return (
    <div className="bg-nf-surface-alt/40 border border-nf-border rounded-md p-2 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-electric-300 font-semibold">
        <History className="h-3 w-3" /> Verziók ({versions.length}/5)
      </div>
      <div className="flex flex-wrap gap-1">
        {versions.map((v, i) => (
          <button
            key={v.id}
            onClick={() => select(v)}
            className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
              v.id === activeId
                ? "bg-electric-300/20 border-electric-300 text-electric-300"
                : "bg-nf-surface border-nf-border text-white/70 hover:border-electric-300/50"
            }`}
          >
            v{versions.length - i} · {fmt(v.created_at)}
            {v.is_current && <span className="ml-1">●</span>}
          </button>
        ))}
      </div>
      {active && !active.is_current && (
        <Button size="sm" variant="outline" onClick={makeCurrent} disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Beállítás aktuálisnak
        </Button>
      )}
    </div>
  );
}
