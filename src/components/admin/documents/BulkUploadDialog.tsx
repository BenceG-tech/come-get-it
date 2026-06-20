import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FolderUp, X, Check, Loader2, AlertTriangle, Sparkles, Image as ImageIcon, FileText, Video as VideoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sha256 } from "@/lib/file-hash";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: (newDocs: any[]) => void;
  existingFolders: string[];
}

type Status = "pending" | "hashing" | "checking" | "duplicate" | "uploading" | "done" | "error" | "skipped";

interface Row {
  file: File;
  relPath: string;
  title: string;
  folder: string;
  hash?: string;
  status: Status;
  progress: number;
  error?: string;
  duplicateOf?: { id: string; title: string };
  newDocId?: string;
}

const fmtBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const kindIcon = (file: File) => {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type.startsWith("video/")) return VideoIcon;
  return FileText;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "egyeb";

const titleFromName = (name: string) =>
  name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();

const MAX_PARALLEL = 3;

export default function BulkUploadDialog({ open, onClose, onDone, existingFolders }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!open) { setRows([]); setRunning(false); } }, [open]);

  const addFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const arr: Row[] = Array.from(files).map((file) => {
      const relPath = (file as any).webkitRelativePath || file.name;
      const parts = relPath.split("/");
      const folder = parts.length > 1 ? parts.slice(0, -1).join(" / ") : "";
      return {
        file,
        relPath,
        title: titleFromName(file.name),
        folder,
        status: "pending" as Status,
        progress: 0,
      };
    });
    setRows((r) => [...r, ...arr]);
    // Kick off hashing + duplicate check in background
    void detectDuplicates(arr);
  };

  const detectDuplicates = async (newRows: Row[]) => {
    for (const r of newRows) {
      setRows((prev) => prev.map((x) => x.file === r.file ? { ...x, status: "hashing" } : x));
      try {
        const hash = await sha256(r.file);
        setRows((prev) => prev.map((x) => x.file === r.file ? { ...x, hash, status: "checking" } : x));
        const { data } = await supabase.from("documents").select("id, title").eq("file_hash", hash).limit(1);
        if (data && data.length > 0) {
          setRows((prev) => prev.map((x) => x.file === r.file ? { ...x, status: "duplicate", duplicateOf: data[0] as any } : x));
        } else {
          setRows((prev) => prev.map((x) => x.file === r.file ? { ...x, status: "pending" } : x));
        }
      } catch (e: any) {
        setRows((prev) => prev.map((x) => x.file === r.file ? { ...x, status: "error", error: e?.message } : x));
      }
    }
  };

  const updateRow = (idx: number, patch: Partial<Row>) =>
    setRows((r) => r.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  const uploadOne = async (idx: number, row: Row): Promise<string | null> => {
    if (row.status === "skipped" || row.status === "done") return row.newDocId ?? null;
    updateRow(idx, { status: "uploading", progress: 10 });
    try {
      const folderSlug = slugify(row.folder || "egyeb");
      const path = `${folderSlug}/${Date.now()}-${row.file.name}`;
      const { error: upErr } = await supabase.storage.from("admin-docs").upload(path, row.file, {
        contentType: row.file.type || "application/octet-stream",
        upsert: false,
      });
      if (upErr) throw upErr;
      updateRow(idx, { progress: 70 });

      const category =
        row.file.type.startsWith("image/") ? "other" :
        row.file.type.startsWith("video/") ? "other" : "other";

      const { data: ins, error: insErr } = await supabase.from("documents").insert([{
        title: row.title || row.file.name,
        folder: row.folder || null,
        category,
        storage_path: path,
        mime_type: row.file.type || null,
        file_size_bytes: row.file.size,
        file_hash: row.hash ?? null,
      }]).select("id").single();
      if (insErr) throw insErr;

      updateRow(idx, { status: "done", progress: 100, newDocId: ins.id });
      return ins.id;
    } catch (e: any) {
      updateRow(idx, { status: "error", error: e?.message ?? String(e) });
      return null;
    }
  };

  const runAll = async () => {
    setRunning(true);
    const work = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.status !== "done" && r.status !== "skipped");
    const newIds: string[] = [];
    let cursor = 0;
    const worker = async () => {
      while (cursor < work.length) {
        const my = work[cursor++];
        if (!my) break;
        // Re-read current row state (might have been edited)
        const current = rows[my.i] ?? my.r;
        const id = await uploadOne(my.i, current);
        if (id) newIds.push(id);
      }
    };
    await Promise.all(Array.from({ length: MAX_PARALLEL }, () => worker()));
    setRunning(false);

    // Auto AI analyze (images)
    if (autoAnalyze && newIds.length) {
      const { data: { session } } = await supabase.auth.getSession();
      const uploadedRows = rows.filter((r) => r.newDocId && r.file.type.startsWith("image/"));
      // Fire-and-forget, sequential with 1s delay
      (async () => {
        for (const r of uploadedRows) {
          try {
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
              body: JSON.stringify({ docId: r.newDocId }),
            }).then((r) => r.text());
          } catch { /* ignore */ }
          await new Promise((res) => setTimeout(res, 1000));
        }
        toast({ title: "AI háttér-elemzés kész", description: `${uploadedRows.length} kép elemezve.` });
        onDone([]);
      })();
    }

    toast({ title: "Feltöltés kész", description: `${newIds.length} fájl mentve.` });
    onDone([]);
  };

  const suggestFolders = async () => {
    setSuggesting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Build minimal payload from current rows
      const payload = rows.filter((r) => r.status !== "duplicate" && r.status !== "skipped").map((r, i) => ({
        id: `tmp-${i}`,
        title: r.title,
        mime: r.file.type,
        relPath: r.relPath,
        currentFolder: r.folder,
      }));
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ inline: payload, existingFolders }),
      });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      const sug = j.suggestions ?? [];
      // Apply by matching tmp-id
      setRows((prev) => prev.map((r, idx) => {
        const s = sug.find((x: any) => x.doc_id === `tmp-${idx}`);
        if (s && s.suggested_folder) return { ...r, folder: s.suggested_folder };
        return r;
      }));
      toast({ title: "Mappa-javaslatok beillesztve", description: `${sug.length} javaslat alkalmazva.` });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSuggesting(false);
    }
  };

  const doneCount = rows.filter((r) => r.status === "done").length;
  const dupCount = rows.filter((r) => r.status === "duplicate").length;
  const errCount = rows.filter((r) => r.status === "error").length;
  const pct = rows.length ? Math.round((doneCount / rows.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !running && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-electric-300" /> Tömeges feltöltés
          </DialogTitle>
        </DialogHeader>

        {/* Picker */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => filesInputRef.current?.click()} className="border-2 border-dashed border-nf-border hover:border-electric-300/60 rounded-xl p-4 flex flex-col items-center gap-1 text-sm transition-colors">
            <Upload className="h-5 w-5 text-electric-300" />
            <span>Fájlok kiválasztása</span>
            <span className="text-[11px] text-nf-text-muted">több is lehet</span>
          </button>
          <button onClick={() => folderInputRef.current?.click()} className="border-2 border-dashed border-nf-border hover:border-electric-300/60 rounded-xl p-4 flex flex-col items-center gap-1 text-sm transition-colors">
            <FolderUp className="h-5 w-5 text-electric-300" />
            <span>Mappa kiválasztása</span>
            <span className="text-[11px] text-nf-text-muted">alpaák is megőrződnek</span>
          </button>
        </div>
        <input ref={filesInputRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" multiple className="hidden"
          // @ts-ignore
          webkitdirectory="" directory=""
          onChange={(e) => addFiles(e.target.files)} />

        {/* Progress + actions */}
        {rows.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nf-text-muted">
                  {rows.length} fájl · {doneCount} kész · {dupCount} duplikátum{errCount > 0 ? ` · ${errCount} hiba` : ""}
                </span>
                <span className="text-electric-300 font-medium">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-nf-surface overflow-hidden">
                <div className="h-full bg-electric-300 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-nf-text-muted">
                <input type="checkbox" checked={autoAnalyze} onChange={(e) => setAutoAnalyze(e.target.checked)} className="accent-electric-300" />
                Képek auto AI elemzése feltöltés után
              </label>
              <Button size="sm" variant="outline" onClick={suggestFolders} disabled={suggesting || running}>
                {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                AI mappa-javaslatok
              </Button>
            </div>
          </>
        )}

        {/* Rows */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1 min-h-[100px]">
          {rows.length === 0 && (
            <div className="text-center text-nf-text-muted py-8 text-sm">Még nincs fájl kiválasztva.</div>
          )}
          {rows.map((r, i) => {
            const Icon = kindIcon(r.file);
            const isDup = r.status === "duplicate";
            const isSkipped = r.status === "skipped";
            return (
              <div key={i} className={cn(
                "p-2 rounded-lg border text-xs flex items-center gap-2",
                r.status === "uploading" && "border-electric-300/40 bg-electric-300/5",
                r.status === "done" && "border-emerald-500/30 bg-emerald-500/5",
                r.status === "error" && "border-red-500/30 bg-red-500/5",
                isDup && "border-amber-500/40 bg-amber-500/5",
                isSkipped && "opacity-50",
                !["uploading", "done", "error"].includes(r.status) && !isDup && !isSkipped && "border-nf-border bg-nf-surface-alt/30",
              )}>
                <Icon className="h-4 w-4 text-electric-300 shrink-0" />
                <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <Input
                    value={r.title}
                    onChange={(e) => updateRow(i, { title: e.target.value })}
                    disabled={running || r.status === "done"}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={r.folder}
                    onChange={(e) => updateRow(i, { folder: e.target.value })}
                    placeholder="Mappa"
                    disabled={running || r.status === "done"}
                    list="bulk-folder-list"
                    className="h-7 text-xs"
                  />
                </div>
                <div className="text-[10px] text-nf-text-muted shrink-0 w-14 text-right">{fmtBytes(r.file.size)}</div>
                <div className="shrink-0 w-20 flex items-center justify-end gap-1">
                  {r.status === "hashing" && <Loader2 className="h-3 w-3 animate-spin text-nf-text-muted" />}
                  {r.status === "checking" && <Loader2 className="h-3 w-3 animate-spin text-nf-text-muted" />}
                  {r.status === "uploading" && <Loader2 className="h-3 w-3 animate-spin text-electric-300" />}
                  {r.status === "done" && <Check className="h-3 w-3 text-emerald-400" />}
                  {r.status === "error" && <span className="text-red-400 truncate text-[10px]" title={r.error}>Hiba</span>}
                  {isDup && (
                    <button onClick={() => updateRow(i, { status: "skipped" })} className="flex items-center gap-1 text-amber-400 text-[10px]" title={`Már létezik: ${r.duplicateOf?.title}`}>
                      <AlertTriangle className="h-3 w-3" /> Dup
                    </button>
                  )}
                  {isSkipped && <span className="text-[10px] text-nf-text-muted">Kihagyva</span>}
                  <button onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))} disabled={running} className="text-nf-text-muted hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <datalist id="bulk-folder-list">
          {existingFolders.map((f) => <option key={f} value={f} />)}
        </datalist>

        <div className="flex justify-end gap-2 pt-2 border-t border-nf-border">
          <Button variant="outline" onClick={onClose} disabled={running}>Bezár</Button>
          <Button variant="neon" onClick={runAll} disabled={running || rows.length === 0 || rows.every((r) => r.status === "done" || r.status === "skipped")}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {running ? "Feltöltés…" : `Feltöltés (${rows.filter((r) => r.status !== "done" && r.status !== "skipped").length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
