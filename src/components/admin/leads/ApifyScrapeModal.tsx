import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Sparkles, Loader2, Wand2, ListChecks, ChevronRight, Globe, Zap, Coins, AlertTriangle } from "lucide-react";

type Step = "choose" | "configure" | "autopilot-plan" | "running" | "done";

export default function ApifyScrapeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState<Step>("choose");
  const [mode, setMode] = useState<"autopilot" | "ai" | "task" | "dataset">("autopilot");
  const [actors, setActors] = useState<any>({ tasks: [], actors: [], curated: [], balance: null });
  const [loadingActors, setLoadingActors] = useState(false);
  const [query, setQuery] = useState("");
  const [taskId, setTaskId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [aiInput, setAiInput] = useState<any>(null);
  const [autopilotPlan, setAutopilotPlan] = useState<any>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [dailySettings, setDailySettings] = useState<{ enabled: boolean; cap_usd: number }>({ enabled: false, cap_usd: 3 });
  const [savingDaily, setSavingDaily] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoadingActors(true);
    supabase.functions.invoke("apify-actors-list").then(({ data, error }) => {
      if (error) toast({ title: "Apify lista hiba", description: error.message, variant: "destructive" });
      else setActors(data);
    }).finally(() => setLoadingActors(false));
    supabase.from("system_settings").select("value").eq("key", "apify_daily_autopilot").maybeSingle()
      .then(({ data }) => {
        if (data?.value) setDailySettings({ enabled: !!(data.value as any).enabled, cap_usd: Number((data.value as any).cap_usd ?? 3) });
      });
  }, []);

  const saveDailySettings = async (next: { enabled: boolean; cap_usd: number }) => {
    setSavingDaily(true);
    const { error } = await supabase.from("system_settings")
      .upsert({ key: "apify_daily_autopilot", value: { ...next, hour_utc: 6 } as any }, { onConflict: "key" });
    setSavingDaily(false);
    if (error) { toast({ title: "Mentés hiba", description: error.message, variant: "destructive" }); return; }
    setDailySettings(next);
    toast({ title: next.enabled ? "Napi auto-scrape BE" : "Napi auto-scrape KI" });
  };


  const planAutopilot = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-discovery-plan");
      if (error) throw error;
      setAutopilotPlan(data);
      setStep("autopilot-plan");
    } catch (e: any) {
      toast({ title: "Tervezés hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const startAutopilot = async () => {
    if (!autopilotPlan?.apify_input) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-start", {
        body: {
          input: autopilotPlan.apify_input,
          actor_name: "Google Maps Autopilot",
          estimated_cost_usd: autopilotPlan.cost_estimate_usd,
        },
      });
      if (error) throw error;
      setRunId(data.run_id); setStatus(data.status); setAiInput(data.input); setStep("running");
      poll(data.run_id);
    } catch (e: any) {
      toast({ title: "Indítás hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const startAiScrape = async () => {
    if (!query.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-start", { body: { natural_query: query } });
      if (error) throw error;
      setAiInput(data.input); setRunId(data.run_id); setStatus(data.status); setStep("running");
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
      setRunId(data.run_id); setStatus(data.status); setStep("running");
      poll(data.run_id);
    } catch (e: any) {
      toast({ title: "Indítás hiba", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const importDataset = async () => {
    if (!datasetId.trim()) return;
    setBusy(true); setStep("running");
    try {
      const { data, error } = await supabase.functions.invoke("apify-run-import", { body: { dataset_id: datasetId.trim(), do_import: true } });
      if (error) throw error;
      setResult(data); setStep("done"); onDone();
    } catch (e: any) {
      toast({ title: "Import hiba", description: e.message, variant: "destructive" });
      setStep("configure");
    } finally { setBusy(false); }
  };

  const poll = async (rid: string) => {
    for (let i = 0; i < 180; i++) {
      await new Promise((r) => setTimeout(r, 10000));
      const { data } = await supabase.functions.invoke("apify-run-import", { body: { run_id: rid, do_import: false } });
      if (data?.status) setStatus(data.status);
      if (data?.status === "SUCCEEDED") {
        const { data: imp } = await supabase.functions.invoke("apify-run-import", { body: { run_id: rid, do_import: true } });
        setResult(imp); setStep("done"); onDone(); return;
      }
      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(data?.status)) {
        toast({ title: "Scrape sikertelen", description: data?.status, variant: "destructive" });
        setStep("configure"); return;
      }
    }
  };

  const balance = actors.balance;
  const balanceLabel = balance?.current_month_usd != null
    ? `~$${Number(balance.current_month_usd).toFixed(2)} fogyott / ${balance.max_monthly_usd ? `$${balance.max_monthly_usd}` : "limit n/a"}`
    : "ismeretlen egyenleg";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto p-6 bg-nf-surface border-nf-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-electric-300" /> Új leadek scrape-elése</h2>
            <p className="text-xs text-nf-text-muted mt-1">Apify Google Maps Scraper — fizetős, kb. $0.006 / hely (place + contact enrichment).</p>
          </div>
          <button onClick={onClose} className="text-nf-text-muted hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-[11px] text-nf-text-muted">
          <Coins className="w-3.5 h-3.5 text-electric-300" />
          <span>Apify: {balanceLabel}</span>
          <a href="https://console.apify.com/billing" target="_blank" rel="noreferrer" className="text-electric-300 underline ml-auto">Egyenleg / töltés</a>
        </div>

        {step === "choose" && (
          <div className="space-y-3">
            <button onClick={() => { setMode("autopilot"); planAutopilot(); }} className="w-full p-4 rounded-lg border-2 border-electric-300/60 bg-electric-300/5 hover:border-electric-300 text-left flex items-start gap-3 transition">
              <Zap className="w-5 h-5 text-electric-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">⚡ AI Autopilot <span className="text-[10px] bg-electric-300/20 text-electric-300 px-1.5 py-0.5 rounded ml-1">AJÁNLOTT</span></div>
                <div className="text-xs text-nf-text-muted mt-1">Nem kell semmit beírnod. Az AI megnézi mi van már lefedve, kiválasztja a hiányzó szegmenseket, és összeállítja a scrape-et.</div>
              </div>
              {busy ? <Loader2 className="w-4 h-4 animate-spin self-center text-electric-300" /> : <ChevronRight className="w-4 h-4 text-nf-text-muted self-center" />}
            </button>
            <button onClick={() => { setMode("ai"); setStep("configure"); }} className="w-full p-4 rounded-lg border border-nf-border hover:border-electric-300 text-left flex items-start gap-3 transition">
              <Wand2 className="w-5 h-5 text-electric-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold">🪄 Magam írom meg mit keressen</div>
                <div className="text-xs text-nf-text-muted mt-1">Te adsz egy magyar query-t, az AI scrape-input-ot épít belőle.</div>
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

            <div className="mt-4 p-3 rounded-lg border border-nf-border bg-nf-surface-alt/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-electric-300" /> Napi auto-scrape
                  </div>
                  <div className="text-[11px] text-nf-text-muted mt-1">
                    Minden reggel 06:00 UTC-kor az AI automatikusan keres új helyeket, a megadott napi költségplafonig.
                  </div>
                </div>
                <button
                  onClick={() => saveDailySettings({ ...dailySettings, enabled: !dailySettings.enabled })}
                  disabled={savingDaily}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${dailySettings.enabled ? "bg-electric-300/20 text-electric-300 border-electric-300/40" : "bg-nf-surface text-nf-text-muted border-nf-border"}`}
                >
                  {dailySettings.enabled ? "BE" : "KI"}
                </button>
              </div>
              {dailySettings.enabled && (
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-[11px] text-nf-text-muted">Napi plafon (USD):</label>
                  <Input
                    type="number" step="0.5" min="0.5" max="20"
                    value={dailySettings.cap_usd}
                    onChange={(e) => setDailySettings((s) => ({ ...s, cap_usd: Number(e.target.value) || 3 }))}
                    onBlur={() => saveDailySettings(dailySettings)}
                    className="h-7 w-20 text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}


        {step === "autopilot-plan" && autopilotPlan && (
          <div className="space-y-4">
            <div className="text-sm font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-electric-300" /> AI-terv elkészült</div>
            <div className="text-xs text-nf-text-muted italic">{autopilotPlan.plan?.rationale}</div>
            <div className="space-y-1">
              <div className="text-[11px] uppercase text-nf-text-muted">Keresések</div>
              {autopilotPlan.plan?.search_strings?.map((s: string, i: number) => (
                <div key={i} className="text-sm bg-nf-surface-alt rounded px-2 py-1.5">🔍 {s}</div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-nf-surface-alt rounded p-2">
                <div className="text-electric-300 font-bold">~{autopilotPlan.expected_places}</div>
                <div className="text-nf-text-muted">várt hely</div>
              </div>
              <div className="bg-nf-surface-alt rounded p-2">
                <div className="text-electric-300 font-bold">~${autopilotPlan.cost_estimate_usd}</div>
                <div className="text-nf-text-muted">becsült ár</div>
              </div>
              <div className="bg-nf-surface-alt rounded p-2">
                <div className="text-amber-400 font-bold">max ${autopilotPlan.cost_ceiling_usd}</div>
                <div className="text-nf-text-muted">felső plafon</div>
              </div>
            </div>
            {balance?.current_month_usd != null && balance?.max_monthly_usd != null &&
              (Number(balance.max_monthly_usd) - Number(balance.current_month_usd)) < autopilotPlan.cost_ceiling_usd && (
              <div className="text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>Lehet hogy az Apify egyenleged nem fedi a felső plafont. Tölts fel a <a className="underline" href="https://console.apify.com/billing" target="_blank" rel="noreferrer">billing oldalon</a> ha a futás közben elakad.</div>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-3 border-t border-nf-border">
              <Button variant="ghost" onClick={() => setStep("choose")}>Vissza</Button>
              <Button onClick={startAutopilot} disabled={busy}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Indítás
              </Button>
            </div>
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
              <div className="text-sm text-nf-text-muted">Nincs még saved task az Apify accountodon.</div>
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
              const m = v.match(/datasets\/([A-Za-z0-9]+)/);
              setDatasetId(m ? m[1] : v);
            }} placeholder="pl. mc8GZQNqQyaPYjVHc vagy teljes URL" />
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
              <div className="text-xs text-nf-text-muted mt-1">Háttér-poller is figyeli a futást — bátran bezárhatod, a leadek automatikusan beimportálódnak.</div>
            </div>
            {aiInput && (
              <details className="text-left">
                <summary className="text-xs text-nf-text-muted cursor-pointer">Scrape input részletek</summary>
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
