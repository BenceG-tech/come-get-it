import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, ExternalLink, RefreshCw, FileText, Folder, Loader2, FileType, AlertTriangle, MessageSquare, Wand2, CheckCircle2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type DriveFile = {
  id: string; name: string; mimeType: string; modifiedTime?: string; size?: string; webViewLink?: string; iconLink?: string; parents?: string[];
};

const ICON_FOR = (mime: string) => {
  if (mime === "application/vnd.google-apps.folder") return <Folder className="h-4 w-4 text-amber-400" />;
  if (mime.includes("document")) return <FileText className="h-4 w-4 text-electric-300" />;
  if (mime.includes("spreadsheet")) return <FileType className="h-4 w-4 text-emerald-400" />;
  if (mime.includes("presentation")) return <FileType className="h-4 w-4 text-rose-400" />;
  return <FileText className="h-4 w-4 text-nf-text-muted" />;
};

export default function AdminDrive() {
  const { toast } = useToast();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [folderStack, setFolderStack] = useState<{ id: string | null; name: string }[]>([{ id: null, name: "Drive gyökér" }]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [analyzeStream, setAnalyzeStream] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [finalizeTopic, setFinalizeTopic] = useState("");
  const [finalizeOut, setFinalizeOut] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const currentFolder = folderStack[folderStack.length - 1];

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("drive-list", {
        body: { folderId: currentFolder.id, q: q || undefined, pageSize: 100 },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setFiles((data as any)?.files ?? []);
    } catch (e: any) {
      toast({ title: "Drive hiba", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const loadDecisions = async () => {
    const { data } = await supabase.from("drive_decisions").select("*").order("created_at", { ascending: false }).limit(50);
    setDecisions(data ?? []);
  };

  useEffect(() => { load(); }, [currentFolder.id]);
  useEffect(() => { loadDecisions(); }, []);

  const toggleSelect = (id: string) => {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const openFolder = (f: DriveFile) => {
    setSelected(new Set());
    setFolderStack((p) => [...p, { id: f.id, name: f.name }]);
  };
  const navTo = (i: number) => {
    setSelected(new Set());
    setFolderStack((p) => p.slice(0, i + 1));
  };

  const runAnalyze = async () => {
    const ids = Array.from(selected).filter((id) => {
      const f = files.find((x) => x.id === id);
      return f && f.mimeType !== "application/vnd.google-apps.folder";
    });
    if (ids.length === 0) { toast({ title: "Válassz legalább 1 fájlt" }); return; }
    if (ids.length > 12) { toast({ title: "Max 12 fájl", variant: "destructive" }); return; }
    setAnalyzeOpen(true); setAnalyzing(true); setAnalyzeStream(""); setAnalyzeResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drive-analyze-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ fileIds: ids }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setAnalyzeStream(acc);
        try { setAnalyzeResult(JSON.parse(acc)); } catch { /* partial */ }
      }
      loadDecisions();
    } catch (e: any) {
      toast({ title: "Elemzés hiba", description: e.message, variant: "destructive" });
    } finally { setAnalyzing(false); }
  };

  const answerDecision = async (id: string, answer: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("drive_decisions").update({ answer, status: "answered", decided_at: new Date().toISOString(), decided_by: user?.id }).eq("id", id);
    loadDecisions();
  };

  const runFinalize = async () => {
    const ids = Array.from(selected).filter((id) => {
      const f = files.find((x) => x.id === id);
      return f && f.mimeType !== "application/vnd.google-apps.folder";
    });
    if (ids.length === 0 || !finalizeTopic.trim()) return;
    setFinalizing(true); setFinalizeOut("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drive-finalize-doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ fileIds: ids, topic: finalizeTopic, includeDecisions: true }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setFinalizeOut(acc);
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setFinalizing(false); }
  };

  const downloadFinal = () => {
    const blob = new Blob([finalizeOut], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${finalizeTopic.replace(/[^\p{L}\p{N}]+/gu, "_")}_v${Date.now()}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const openDecisions = decisions.filter((d) => d.status === "open");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Google Drive átvilágító</h1>
        <p className="text-sm text-nf-text-muted">Böngészd a Drive-od, válassz fájlokat és kérd az AI-tól ellentmondás-elemzést, kérdéseket vagy konszolidált végleges verziót.</p>
      </div>

      {openDecisions.length > 0 && (
        <Card className="p-3 border-amber-400/40 bg-amber-400/5">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-2"><MessageSquare className="h-4 w-4" /> Nyitott kérdések ({openDecisions.length})</div>
          <div className="space-y-2 max-h-72 overflow-auto">
            {openDecisions.map((d) => (
              <details key={d.id} className="text-xs border border-nf-border rounded p-2 bg-nf-surface">
                <summary className="cursor-pointer text-sm font-medium">{d.topic && <span className="text-electric-300 mr-2">[{d.topic}]</span>}{d.question}</summary>
                <div className="mt-2 space-y-2">
                  <Textarea rows={2} placeholder="Válaszod…" id={`ans-${d.id}`} />
                  <Button size="sm" variant="neon" onClick={() => {
                    const v = (document.getElementById(`ans-${d.id}`) as HTMLTextAreaElement)?.value;
                    if (v?.trim()) answerDecision(d.id, v.trim());
                  }}><CheckCircle2 className="h-3 w-3" /> Mentés</Button>
                </div>
              </details>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {folderStack.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-nf-text-muted" />}
              <button onClick={() => navTo(i)} className="text-electric-300 hover:underline">{s.name}</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-nf-text-muted" />
            <Input placeholder="Keresés név szerint…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} className="pl-8" />
          </div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-electric-300/10 border border-electric-300/30 rounded-lg">
            <span className="text-sm self-center">{selected.size} kiválasztva</span>
            <Button size="sm" variant="neon" onClick={runAnalyze} disabled={analyzing}>
              <Sparkles className="h-3 w-3" /> AI elemzés (ellentmondás + kérdések)
            </Button>
            <Button size="sm" variant="outline" onClick={() => setFinalizeOpen(true)}>
              <Wand2 className="h-3 w-3" /> Konszolidált verzió
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Mégse</Button>
          </div>
        )}
      </Card>

      <Card className="divide-y divide-nf-border">
        {loading && files.length === 0 && <div className="p-8 text-center text-nf-text-muted"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>}
        {!loading && files.length === 0 && <div className="p-8 text-center text-nf-text-muted">Üres mappa vagy nincs találat.</div>}
        {files.map((f) => {
          const isFolder = f.mimeType === "application/vnd.google-apps.folder";
          return (
            <div key={f.id} className="p-2.5 flex items-center gap-3 hover:bg-nf-surface-alt/40">
              {!isFolder && (
                <input type="checkbox" checked={selected.has(f.id)} onChange={() => toggleSelect(f.id)} className="shrink-0" />
              )}
              {isFolder && <div className="w-4 shrink-0" />}
              <div className="shrink-0">{ICON_FOR(f.mimeType)}</div>
              <button onClick={() => isFolder && openFolder(f)} className="flex-1 min-w-0 text-left">
                <div className="text-sm truncate">{f.name}</div>
                <div className="text-[10px] text-nf-text-muted">{f.modifiedTime ? new Date(f.modifiedTime).toLocaleString("hu-HU") : ""}</div>
              </button>
              {f.webViewLink && (
                <a href={f.webViewLink} target="_blank" rel="noreferrer" className="text-nf-text-muted hover:text-electric-300 p-1"><ExternalLink className="h-3.5 w-3.5" /></a>
              )}
            </div>
          );
        })}
      </Card>

      {/* Analyze dialog */}
      <Dialog open={analyzeOpen} onOpenChange={setAnalyzeOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-electric-300" /> AI Drive elemzés</DialogTitle></DialogHeader>
          {analyzing && !analyzeResult && (
            <div className="text-xs text-nf-text-muted bg-nf-surface p-3 rounded border border-nf-border max-h-40 overflow-auto">
              <div className="mb-1 text-electric-300 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> AI olvassa a fájlokat és gondolkodik…</div>
              <pre className="whitespace-pre-wrap">{analyzeStream.slice(-800)}</pre>
            </div>
          )}
          {analyzeResult && (
            <div className="space-y-4">
              {analyzeResult.themes?.length > 0 && (
                <div>
                  <div className="text-xs font-bold mb-2 text-electric-300">Témák</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {analyzeResult.themes.map((t: any, i: number) => (
                      <div key={i} className="p-2 border border-nf-border rounded text-xs bg-nf-surface">
                        <div className="font-bold text-sm">{t.name}</div>
                        <div className="text-nf-text-muted">{t.summary}</div>
                        <div className="mt-1 text-[10px]">{t.file_ids?.length} fájl</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analyzeResult.contradictions?.length > 0 && (
                <div>
                  <div className="text-xs font-bold mb-2 text-rose-400 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Ellentmondások ({analyzeResult.contradictions.length})</div>
                  <div className="space-y-2">
                    {analyzeResult.contradictions.map((c: any, i: number) => (
                      <div key={i} className="p-3 border border-rose-400/30 rounded bg-rose-400/5 text-sm">
                        <div className="font-bold">{c.topic}</div>
                        <div className="text-xs text-nf-text-muted mt-1">{c.detail}</div>
                        <div className="text-xs text-emerald-300/90 mt-1">→ {c.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analyzeResult.outdated?.length > 0 && (
                <div>
                  <div className="text-xs font-bold mb-2 text-amber-400">Elavult tartalom</div>
                  <ul className="text-sm space-y-1">
                    {analyzeResult.outdated.map((o: any, i: number) => (
                      <li key={i} className="text-xs"><span className="font-mono text-nf-text-muted">{o.file_id?.slice(0, 8)}</span> — {o.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analyzeResult.questions?.length > 0 && (
                <div>
                  <div className="text-xs font-bold mb-2 text-electric-300">Kérdések neked ({analyzeResult.questions.length})</div>
                  <p className="text-xs text-nf-text-muted mb-2">Ezek megjelennek a fenti "Nyitott kérdések" panelben is — ott válaszolhatsz rájuk.</p>
                  <ul className="space-y-1 text-sm">
                    {analyzeResult.questions.map((q: any, i: number) => (
                      <li key={i} className="text-xs p-2 border border-nf-border rounded bg-nf-surface">
                        {q.topic && <span className="text-electric-300 mr-1">[{q.topic}]</span>}{q.question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Finalize dialog */}
      <Dialog open={finalizeOpen} onOpenChange={setFinalizeOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-electric-300" /> Konszolidált végleges verzió</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-nf-text-muted">Téma / cél (pl. "Végleges ÁSZF v2", "Egységes partner-megállapodás")</label>
              <Input value={finalizeTopic} onChange={(e) => setFinalizeTopic(e.target.value)} placeholder="ÁSZF végleges" />
            </div>
            <p className="text-xs text-nf-text-muted">{selected.size} forrásfájl kiválasztva. Az AI használja a már megválaszolt kérdéseket is.</p>
            <Button variant="neon" className="w-full" onClick={runFinalize} disabled={finalizing || !finalizeTopic.trim()}>
              {finalizing ? <><Loader2 className="h-4 w-4 animate-spin" /> Generálás…</> : <><Wand2 className="h-4 w-4" /> Generáld</>}
            </Button>
            {finalizeOut && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-nf-text-muted">{finalizeOut.length} karakter</span>
                  <Button size="sm" variant="outline" onClick={downloadFinal}>Letöltés .md</Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-nf-surface p-3 rounded border border-nf-border max-h-[50vh] overflow-auto">{finalizeOut}</pre>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
