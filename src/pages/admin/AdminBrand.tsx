import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Save, Wand2, Loader2 } from "lucide-react";

type BrandRow = { key: string; label: string | null; description: string | null; value: any };

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export default function AdminBrand() {
  const { toast } = useToast();
  const [rows, setRows] = useState<BrandRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extraText, setExtraText] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("brand_knowledge").select("*").order("key");
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    const list = (data ?? []) as BrandRow[];
    setRows(list);
    const d: Record<string, string> = {};
    for (const r of list) d[r.key] = JSON.stringify(r.value, null, 2);
    setDrafts(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (key: string) => {
    setSaving(key);
    let parsed: any;
    try { parsed = JSON.parse(drafts[key] || "{}"); }
    catch (e: any) { toast({ title: "Hibás JSON", description: e?.message, variant: "destructive" }); setSaving(null); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("brand_knowledge").update({ value: parsed, updated_by: user?.id ?? null }).eq("key", key);
    setSaving(null);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Mentve" });
    await supabase.from("activity_log").insert({ user_id: user?.id ?? null, action: "update", entity_type: "brand_knowledge", entity_id: key, entity_label: key, metadata: {} });
    load();
  };

  const extractFromLanding = async () => {
    setExtracting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${FUNCTIONS_URL}/extract-brand-from-landing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ extraText }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Hiba");
      const suggestion = j.suggestion || {};
      // Merge suggestions into drafts (don't auto-save)
      const next = { ...drafts };
      for (const k of Object.keys(suggestion)) {
        if (k in next) next[k] = JSON.stringify(suggestion[k], null, 2);
      }
      setDrafts(next);
      toast({ title: "Javaslat betöltve", description: "Nézd át és mentsd kulcsonként, ha jó." });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message, variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-electric-300" /> Brand Memory
          </h1>
          <p className="text-sm text-nf-text-muted mt-1">
            Egy igazság-forrás a Come Get It hangneméhez, personákhoz, ajánlathoz. <strong>Minden AI hívás</strong> ezt kapja system promptként.
          </p>
        </div>
      </div>

      <Card className="border-electric-300/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wand2 className="h-4 w-4 text-electric-300" /> AI-javaslat a meglévő landingből + opcionális extra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-nf-text-muted">
            Beolvassa: come-get-it.app/, /vendeglatohelyek, /partnerek, /italmarkak, /rewards-partners. Ha akarsz, plusz szöveget is adhatsz (pl. Drive Brand Guidelines doksi tartalma copy-pastelve).
          </p>
          <Textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Opcionális extra szöveg (pl. Brand Guidelines doksi tartalma a Drive-ból)…"
            rows={4}
            className="bg-nf-surface-alt border-nf-border"
          />
          <Button variant="neon" onClick={extractFromLanding} disabled={extracting}>
            {extracting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Elemzés…</> : <><Wand2 className="h-4 w-4 mr-2" /> Generálj javaslatot</>}
          </Button>
        </CardContent>
      </Card>

      {loading && <div className="text-center text-nf-text-muted py-8">Betöltés…</div>}

      <div className="space-y-4">
        {rows.map((r) => (
          <Card key={r.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between gap-2">
                <span><span className="text-electric-300">{r.label || r.key}</span> <span className="text-xs text-nf-text-muted ml-2 font-normal">({r.key})</span></span>
                <Button size="sm" variant="neon" onClick={() => save(r.key)} disabled={saving === r.key}>
                  {saving === r.key ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3 mr-1" /> Mentés</>}
                </Button>
              </CardTitle>
              {r.description && <p className="text-xs text-nf-text-muted">{r.description}</p>}
            </CardHeader>
            <CardContent>
              <Textarea
                value={drafts[r.key] ?? ""}
                onChange={(e) => setDrafts((p) => ({ ...p, [r.key]: e.target.value }))}
                rows={Math.min(20, Math.max(6, (drafts[r.key] ?? "").split("\n").length))}
                className="bg-nf-surface-alt border-nf-border font-mono text-xs"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
