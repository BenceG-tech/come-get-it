import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Loader2, ExternalLink } from "lucide-react";

export const ChecklistDriveSearch = ({ title }: { title: string }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [matches, setMatches] = useState<any[] | null>(null);

  const run = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("drive-checklist-fill", { body: { query: title, limit: 5 } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setMatches((data as any)?.matches ?? []);
    } catch (e: any) {
      toast({ title: "Drive hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={run} disabled={busy} className="text-xs">
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Cloud className="h-3 w-3" />} Drive-ban keresd
      </Button>
      {matches && (
        <div className="space-y-1">
          {matches.length === 0 && <div className="text-[11px] text-nf-text-muted">Nincs találat a Drive-on.</div>}
          {matches.map((m: any) => (
            <a key={m.id} href={m.webViewLink} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 p-1.5 text-[11px] bg-nf-surface border border-nf-border rounded hover:border-electric-300">
              <span className="truncate">{m.name}</span>
              <ExternalLink className="h-3 w-3 shrink-0 text-electric-300" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistDriveSearch;
