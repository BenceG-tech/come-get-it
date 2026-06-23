import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, AlertTriangle, ChevronDown, ChevronRight, Sparkles, FileDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const KEEP_OPTIONS = [
  { v: "unreviewed", l: "Nem értékelt", c: "text-nf-text-muted" },
  { v: "keep", l: "Megtartani", c: "text-green-400" },
  { v: "merge", l: "Összevonni", c: "text-amber-400" },
  { v: "delete", l: "Törölni", c: "text-red-400" },
  { v: "rewrite", l: "Új verzió kell", c: "text-electric-300" },
];

const slug = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);

function detectDuplicates(docs: any[]): Record<string, string> {
  // Group by overlapping title words + same folder
  const groups: Record<string, string> = {};
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i], b = docs[j];
      if (a.folder !== b.folder) continue;
      const wa = new Set(slug(a.title));
      const wb = new Set(slug(b.title));
      const inter = [...wa].filter((w) => wb.has(w) && w.length > 3);
      const overlap = inter.length / Math.max(wa.size, wb.size, 1);
      if (overlap >= 0.5) {
        const key = a.duplicate_group || b.duplicate_group || `dup-${a.id.slice(0, 6)}`;
        groups[a.id] = key;
        groups[b.id] = key;
      }
    }
  }
  return groups;
}

export default function AdminDocumentsAudit() {
  const [docs, setDocs] = useState<any[]>([]);
  const [edits, setEdits] = useState<Record<string, any>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "unreviewed" | "dup" | "low" | "nocontent">("all");
  const [running, setRunning] = useState<null | "backfill" | "audit">(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("documents").select("*").order("folder").order("title");
    setDocs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const detected = useMemo(() => detectDuplicates(docs), [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (filter === "unreviewed") return (d.keep_status ?? "unreviewed") === "unreviewed";
      if (filter === "dup") return d.duplicate_group || detected[d.id];
      if (filter === "low") return d.quality_score != null && d.quality_score < 6;
      return true;
    });
  }, [docs, filter, detected]);

  const grouped: Record<string, any[]> = {};
  for (const d of filtered) (grouped[d.folder ?? "00 — Mappázatlan"] ||= []).push(d);
  const folderKeys = Object.keys(grouped).sort();

  const setField = (id: string, field: string, value: any) => {
    setEdits((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  };

  const save = async (d: any) => {
    const patch = edits[d.id];
    if (!patch) return;
    setSavingId(d.id);
    const { error } = await supabase.from("documents").update(patch).eq("id", d.id);
    setSavingId(null);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Mentve" });
    setEdits((p) => { const c = { ...p }; delete c[d.id]; return c; });
    load();
  };

  const tagDupGroup = async (id: string, key: string) => {
    await supabase.from("documents").update({ duplicate_group: key }).eq("id", id);
    load();
  };

  const stats = {
    total: docs.length,
    reviewed: docs.filter((d) => (d.keep_status ?? "unreviewed") !== "unreviewed").length,
    rated: docs.filter((d) => d.quality_score != null).length,
    dups: Object.values(detected).length + docs.filter((d) => d.duplicate_group).length,
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild><Link to="/admin/documents"><ArrowLeft className="h-4 w-4" /> Vissza</Link></Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold">Dokumentum audit</h1>
          <p className="text-xs text-nf-text-muted">{stats.reviewed}/{stats.total} értékelve · {stats.rated} pontozva · {stats.dups} duplikáció jelölve</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "all", l: "Mind" },
          { v: "unreviewed", l: "Nem értékelt" },
          { v: "dup", l: "Duplikáció gyanú" },
          { v: "low", l: "Pontszám < 6" },
        ].map((f) => (
          <Button key={f.v} variant={filter === f.v ? "neon" : "outline"} size="sm" onClick={() => setFilter(f.v as any)}>{f.l}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {folderKeys.map((k) => {
          const open = openFolders[k] ?? true;
          return (
            <div key={k} className="border border-nf-border rounded-xl overflow-hidden">
              <button onClick={() => setOpenFolders((p) => ({ ...p, [k]: !open }))} className="w-full flex items-center justify-between p-3 bg-nf-surface hover:bg-nf-surface-alt text-left">
                <div className="flex items-center gap-2 min-w-0">
                  {open ? <ChevronDown className="h-4 w-4 text-electric-300" /> : <ChevronRight className="h-4 w-4 text-electric-300" />}
                  <span className="font-medium truncate">{k}</span>
                </div>
                <span className="text-xs text-nf-text-muted">{grouped[k].length}</span>
              </button>
              {open && (
                <div className="divide-y divide-nf-border">
                  {grouped[k].map((d) => {
                    const e = edits[d.id] ?? {};
                    const dupGroup = d.duplicate_group || detected[d.id];
                    const dupCount = dupGroup ? docs.filter((x) => (x.duplicate_group || detected[x.id]) === dupGroup).length : 0;
                    return (
                      <div key={d.id} className="p-4 space-y-3 bg-nf-surface-alt/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <Link to={`/admin/documents/${d.id}`} className="font-medium hover:text-electric-300 block truncate">{d.title}</Link>
                            <div className="text-xs text-nf-text-muted truncate">{d.description}</div>
                          </div>
                          {dupGroup && dupCount > 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                              <AlertTriangle className="h-3 w-3" /> {dupCount}× hasonló
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] text-nf-text-muted">Pontszám 1-10</label>
                            <Input type="number" min={1} max={10} defaultValue={d.quality_score ?? ""} onChange={(ev) => setField(d.id, "quality_score", ev.target.value ? Number(ev.target.value) : null)} className="h-8" />
                          </div>
                          <div>
                            <label className="text-[10px] text-nf-text-muted">Státusz</label>
                            <select defaultValue={d.keep_status ?? "unreviewed"} onChange={(ev) => setField(d.id, "keep_status", ev.target.value)} className="w-full h-8 rounded-md bg-nf-surface-alt border border-nf-border px-2 text-sm">
                              {KEEP_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] text-nf-text-muted">Duplikáció csoport</label>
                            <Input defaultValue={d.duplicate_group ?? dupGroup ?? ""} onChange={(ev) => setField(d.id, "duplicate_group", ev.target.value || null)} className="h-8" placeholder="pl. fooldal-pitch" />
                          </div>
                        </div>

                        <Textarea rows={2} placeholder="Minőségi jegyzet (mi jó, mi nem, miért)" defaultValue={d.quality_notes ?? ""} onChange={(ev) => setField(d.id, "quality_notes", ev.target.value)} />
                        <Textarea rows={2} placeholder="Javaslat (megtart/töröl/összevon — miért, és mit kell csinálni)" defaultValue={d.duplicate_recommendation ?? ""} onChange={(ev) => setField(d.id, "duplicate_recommendation", ev.target.value)} />

                        <div className="flex gap-2 justify-end">
                          {!d.duplicate_group && detected[d.id] && (
                            <Button size="sm" variant="outline" onClick={() => tagDupGroup(d.id, detected[d.id])}>Csoport elfogad</Button>
                          )}
                          <Button size="sm" variant="neon" onClick={() => save(d)} disabled={!edits[d.id] || savingId === d.id}>
                            <Save className="h-3.5 w-3.5" /> {savingId === d.id ? "Mentés…" : "Mentés"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
