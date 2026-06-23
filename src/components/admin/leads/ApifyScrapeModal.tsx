import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Sparkles, Loader2, Wand2, ListChecks, ChevronRight, Globe } from "lucide-react";

type Step = "choose" | "configure" | "running" | "done";

export default function ApifyScrapeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState<Step>("choose");
  const [mode, setMode] = useState<"ai" | "task" | "dataset">("ai");
  const [actors, setActors] = useState<any>({ tasks: [], actors: [], curated: [] });
  const [loadingActors, setLoadingActors] = useState(false);
  const [query, setQuery] = useState("");
  const [taskId, setTaskId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [aiInput, setAiInput] = useState<any>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoadingActors(true);
    supabase.functions.invoke("apify-actors-list").then(({ data, error }) => {
      if (error) toast({ title: "Apify lista hiba", description: error.message, variant: "destructive" });
      else setActors(data);
    }).finally(() => setLoadingActors(false));
  }, []);

  const startAiScrape = async () => {
    if (!query.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-start", { body: { natural_query: query } });
      if (error) throw error;
      setAiInput(data.input);
      setRunId(data.run_id);
      setStatus(data.status);
      setStep("running");
      poll(data.run_id);
    } catch (e: any) {
      toast({ title: "Indítás hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const startTaskRun = async () => {
    const task = actors.tasks.find((t: any) => t.id === taskId);
    if (!task) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-start", { body: { actor_id: task.actorId, actor_name: task.name, input: {} } });
      if (error) throw error;
      setRunId(data.run_id);
      setStatus(data.status);
      setStep("running");
      poll(data.run_id);
    } catch (e: any) {
      toast({ title: "Indítás hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const importDataset = async () => {
    if (!datasetId.trim()) return;
    setBusy(true);
    setStep("running");
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-import", { body: { dataset_id: datasetId.trim(), do_import: true } });
      if (error) throw error;
      setResult(data);
      setStep("done");
      onDone();
    } catch (e: any) {
      toast({ title: "Import hiba", description: e.message, variant: "destructive" });
      setStep("configure");
    } finally { setBusy(false); }
  };

  const poll = async (rid: string) => {
    for (let i = 0; i < 120; i++) { // up to ~20 min @ 10s
      await new Promise((r) => setTimeout(r, 10000));
      const { data } = await supabase.functions.invoke("apify-run-import", { body: { run_id: rid, do_import: false } });
      if (data?.status) setStatus(data.status);
      if (data?.status === "SUCCEEDED") {
        const { data: imp } = await supabase.functions.invoke("apify-run-import", { body: { run_id: rid, do_import: true } });
        setResult(imp);
        setStep("done");
        onDone();
        return;
      }
      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(data?.status)) {
        toast({ title: "Scrape sikertelen", description: data?.status, variant: "destructive" });
        setStep("configure");
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto p-6 bg-nf-surface border-nf-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-electric-300" /> Új leadek scrape-elése</h2>
            <p className="text-xs text-nf-text-muted mt-1">Apify-ról húzunk be friss adatot — AI állítja össze a scrape paramétereit.</p>
          </div>
          <button onClick={onClose} className="text-nf-text-muted hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {step === "choose" && (
          <div className="space-y-3">
            <button onClick={() => { setMode("ai"); setStep("configure"); }} className="w-full p-4 rounded-lg border border-nf-border hover:border-electric-300 text-left flex items-start gap-3 transition">
              <Wand2 className="w-5 h-5 text-electric-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">🪄 AI-vezérelt scrape <span className="text-[10px] bg-electric-300/20 text-electric-300 px-1.5 py-0.5 rounded ml-1">AJÁNLOTT</span></div>
                <div className="text-xs text-nf-text-muted mt-1">Magyarul írod le mit akarsz, az AI összerakja a Google Maps Extractor input-ot.</div>
              </div>
              <ChevronRight className="w-4 h-4 text-nf-text-muted self-center" />
            </button>
            <button onClick={() => { setMode("task"); setStep("configure"); }} className="w-full p-4 rounded-lg border border-nf-border hover:border-electric-300 text-left flex items-start gap-3 transition">
              <ListChecks className="w-5 h-5 text-electric-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">Saved Apify task futtatása</div>
                <div className="text-xs text-nf-text-muted mt-1">{actors.tasks?.length ?? 0} saved task érhető el az Apify accountodon.</div>
              </div>
              <ChevronRight className="w-4 h-4 text-nf-text-muted self-center" />
            </button>
            <button onClick={() => { setMode("dataset"); setStep("configure"); }} className="w-full p-4 rounded-lg border border-nf-border hover:border-electric-300 text-left flex items-start gap-3 transition">
              <Globe className="w-5 h-5 text-electric-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">Meglévő dataset import</div>
                <div className="text-xs text-nf-text-muted mt-1">Egy korábbi Apify run dataset ID-ját bemásolod, behúzzuk.</div>
              </div>
              <ChevronRight className="w-4 h-4 text-nf-text-muted self-center" />
            </button>
          </div>
        )}

        {step === "configure" && mode === "ai" && (
          <div className="space-y-3">
            <label className="block text-sm">Mit scrape-eljünk?</label>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='pl. "budapesti rooftop barok és koktélbarok"' className="text-base" />
            <div className="text-[11px] text-nf-text-muted">Példák: "budapesti rooftop bar", "VII. kerületi craft sörözők", "budai vendéglők kerttel", "kávézók a belvárosban".</div>
            <div className="flex gap-2 justify-end pt-3 border-t border-nf-border">
              <Button variant="ghost" onClick={() => setStep("choose")}>Vissza</Button>
              <Button onClick={startAiScrape} disabled={busy || !query.trim()}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Scrape indítás
              </Button>
            </div>
          </div>
        )}

        {step === "configure" && mode === "task" && (
          <div className="space-y-3">
            {loadingActors && <div className="text-sm text-nf-text-muted flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Apify task-ok betöltése…</div>}
            {!loadingActors && actors.tasks?.length === 0 && (
              <div className="text-sm text-nf-text-muted">Nincs még saved task az Apify accountodon. Hozz létre egyet az <a href="https://console.apify.com/actors/tasks" target="_blank" className="text-electric-300 underline">Apify console-ban</a>.</div>
            )}
            {actors.tasks?.length > 0 && (
              <div className="space-y-1 max-h-64 overflow-auto">
                {actors.tasks.map((t: any) => (
                  <button key={t.id} onClick={() => setTaskId(t.id)} className={`w-full text-left p-2 rounded border transition ${taskId === t.id ? "border-electric-300 bg-electric-300/10" : "border-nf-border hover:border-nf-text-muted"}`}>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-[10px] text-nf-text-muted">{t.actorId}</div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end pt-3 border-t border-nf-border">
              <Button variant="ghost" onClick={() => setStep("choose")}>Vissza</Button>
              <Button onClick={startTaskRun} disabled={busy || !taskId}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Task futtatása
              </Button>
            </div>
          </div>
        )}

        {step === "configure" && mode === "dataset" && (
          <div className="space-y-3">
            <label className="block text-sm">Apify dataset ID (vagy URL)</label>
            <Input value={datasetId} onChange={(e) => {
              const v = e.target.value;
              // extract ID if user pastes URL
              const m = v.match(/datasets\/([A-Za-z0-9]+)/);
              setDatasetId(m ? m[1] : v);
            }} placeholder="pl. mc8GZQNqQyaPYjVHc vagy teljes URL" />
            <div className="text-[11px] text-nf-text-muted">A Google Maps Extractor formátumát ismeri jelenleg. Más actor formátumhoz a bal alsó AI gombbal kérj segítséget.</div>
            <div className="flex gap-2 justify-end pt-3 border-t border-nf-border">
              <Button variant="ghost" onClick={() => setStep("choose")}>Vissza</Button>
              <Button onClick={importDataset} disabled={busy || !datasetId.trim()}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Import
              </Button>
            </div>
          </div>
        )}

        {step === "running" && (
          <div className="space-y-4 py-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-electric-300 mx-auto" />
            <div>
              <div className="font-medium">Scrape fut: <span className="text-electric-300">{status || "indítás…"}</span></div>
              <div className="text-xs text-nf-text-muted mt-1">Háttérben dolgozunk — 10 mp-enként pollolunk. Maradhatsz, vagy bezárhatod, akkor is befejezi.</div>
            </div>
            {aiInput && (
              <details className="text-left">
                <summary className="text-xs text-nf-text-muted cursor-pointer">AI által generált scrape input</summary>
                <pre className="text-[10px] bg-nf-surface-alt rounded p-2 mt-2 overflow-auto">{JSON.stringify(aiInput, null, 2)}</pre>
              </details>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>Bezárás (a háttérben fut)</Button>
          </div>
        )}

        {step === "done" && result && (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🎉</div>
              <div className="font-bold text-lg">Kész!</div>
              <div className="text-sm text-nf-text-muted">{result.total_items ?? 0} találat → <span className="text-electric-300 font-semibold">{result.imported ?? 0} új lead</span> ({result.duplicates ?? 0} duplikátum kihagyva)</div>
            </div>
            <Button className="w-full" onClick={onClose}>Vissza a leadekhez</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
