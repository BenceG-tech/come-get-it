import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ExternalLink, Copy, ChevronDown, ChevronRight, Upload, FileText, Image as ImageIcon, Star, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { v: "one_pager_venue", l: "1-pager vendéglátóhely" },
  { v: "long_pitch_venue", l: "Hosszú pitch vendéglátóhely" },
  { v: "drink_brand_deck", l: "Italmárka deck" },
  { v: "rewards_onboarding", l: "Rewards onboarding" },
  { v: "email_template", l: "Email sablon" },
  { v: "social_post", l: "Poszt szöveg" },
  { v: "ai_generated", l: "AI által generált" },
  { v: "other", l: "Egyéb" },
];

const UNFILED = "00 — Mappázatlan";

const fmtBytes = (b?: number | null) => {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export default function AdminDocuments() {
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [showNew, setShowNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    folder: "",
    category: "other",
    description: "",
    when_to_use: "",
    content: "",
    file: null as File | null,
  });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("folder", { ascending: true, nullsFirst: false })
      .order("title", { ascending: true });
    setDocs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  // Group by folder
  const filtered = search
    ? docs.filter((d) => `${d.title} ${d.description ?? ""} ${d.when_to_use ?? ""}`.toLowerCase().includes(search.toLowerCase()))
    : docs;

  const grouped: Record<string, any[]> = {};
  for (const d of filtered) {
    const key = d.folder ?? UNFILED;
    (grouped[key] ||= []).push(d);
  }
  const folderKeys = Object.keys(grouped).sort();

  // Auto-open all folders when searching
  const isFolderOpen = (k: string) => (search ? true : openFolders[k] ?? folderKeys.length <= 3);

  // External links open in new tab; uploaded files go to the internal viewer page (no popup blocker, no blank screens)
  const openExternal = (storage_path: string) => window.open(storage_path, "_blank", "noopener");


  const copyLink = async (storage_path: string | null) => {
    if (!storage_path) return;
    let url = storage_path;
    if (!storage_path.startsWith("http")) {
      const { data } = await supabase.storage.from("admin-docs").createSignedUrl(storage_path, 3600 * 24);
      if (!data) return;
      url = data.signedUrl;
    }
    await navigator.clipboard.writeText(url);
    toast({ title: "Link másolva (24 órán át érvényes)" });
  };

  const create = async () => {
    if (!form.title.trim()) return;
    setUploading(true);
    try {
      let storage_path: string | null = null;
      let mime_type: string | null = null;
      let file_size_bytes: number | null = null;
      if (form.file) {
        const folderSlug = (form.folder || "egyeb")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const path = `${folderSlug}/${Date.now()}-${form.file.name}`;
        const { error } = await supabase.storage.from("admin-docs").upload(path, form.file, {
          contentType: form.file.type || "application/octet-stream",
          upsert: false,
        });
        if (error) throw error;
        storage_path = path;
        mime_type = form.file.type || null;
        file_size_bytes = form.file.size;
      }
      const { error: insErr } = await supabase.from("documents").insert([{
        title: form.title,
        folder: form.folder || null,
        category: form.category as any,
        description: form.description || null,
        when_to_use: form.when_to_use || null,
        content: form.content || null,
        storage_path,
        mime_type,
        file_size_bytes,
      }]);
      if (insErr) throw insErr;
      setShowNew(false);
      setForm({ title: "", folder: "", category: "other", description: "", when_to_use: "", content: "", file: null });
      load();
      toast({ title: "Mentve" });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (d: any) => {
    if (!confirm(`Törlöd: "${d.title}"?`)) return;
    if (d.storage_path && !d.storage_path.startsWith("http")) {
      await supabase.storage.from("admin-docs").remove([d.storage_path]);
    }
    await supabase.from("documents").delete().eq("id", d.id);
    load();
  };

  const toggleFolder = (k: string) => setOpenFolders((p) => ({ ...p, [k]: !(p[k] ?? folderKeys.length <= 3) }));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Dokumentumok</h1>
          <p className="text-sm text-nf-text-muted">{docs.length} doksi · {folderKeys.length} mappa</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(!showNew)} className="shrink-0">
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Új doksi</span>
        </Button>
      </div>

      {showNew && (
        <Card className="p-4 md:p-5 space-y-3 border-electric-300/40">
          <Input placeholder="Cím *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Mappa (pl. 06 — Befektetői)" value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} list="folder-list" />
            <datalist id="folder-list">
              {folderKeys.filter((k) => k !== UNFILED).map((k) => <option key={k} value={k} />)}
            </datalist>
            <select className="w-full rounded-lg bg-nf-surface-alt border border-nf-border px-3 h-10 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
          <Input placeholder="Rövid leírás" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder={'Mikor használd? (pl. „első kontakt kávézóknál")'} value={form.when_to_use} onChange={(e) => setForm({ ...form, when_to_use: e.target.value })} />
          <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-nf-border bg-nf-surface-alt cursor-pointer hover:border-electric-300/50">
            <Upload className="h-4 w-4 text-electric-300 shrink-0" />
            <span className="text-sm text-nf-text-muted truncate">
              {form.file ? `${form.file.name} (${fmtBytes(form.file.size)})` : "Fájl választása (PDF, kép, doksi…)"}
            </span>
            <input type="file" className="hidden" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })} />
          </label>
          <Textarea rows={4} placeholder="Szöveges tartalom (opcionális — email/poszt sablon szövege)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowNew(false)} disabled={uploading}>Mégse</Button>
            <Button variant="neon" onClick={create} disabled={uploading}>{uploading ? "Feltöltés…" : "Mentés"}</Button>
          </div>
        </Card>
      )}

      <Input placeholder="Keresés a doksik között…" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {folderKeys.length === 0 && <div className="text-center text-nf-text-muted py-12">Nincs dokumentum.</div>}
        {folderKeys.map((k) => {
          const open = isFolderOpen(k);
          return (
            <div key={k} className="border border-nf-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFolder(k)}
                className="w-full flex items-center justify-between p-4 bg-nf-surface hover:bg-nf-surface-alt text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {open ? <ChevronDown className="h-4 w-4 text-electric-300 shrink-0" /> : <ChevronRight className="h-4 w-4 text-electric-300 shrink-0" />}
                  <span className="font-medium truncate">{k}</span>
                </div>
                <span className="text-xs text-nf-text-muted shrink-0 ml-2">{grouped[k].length}</span>
              </button>
              {open && (
                <div className="divide-y divide-nf-border">
                  {grouped[k].map((d) => {
                    const isImg = d.mime_type?.startsWith("image/");
                    return (
                      <div key={d.id} className="p-4 space-y-2 bg-nf-surface-alt/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {d.storage_path && (isImg ? <ImageIcon className="h-4 w-4 text-electric-300 shrink-0" /> : <FileText className="h-4 w-4 text-electric-300 shrink-0" />)}
                              <h3 className="font-medium truncate">{d.title}</h3>
                            </div>
                            <div className="text-xs text-nf-text-muted mt-0.5">
                              {CATEGORIES.find((c) => c.v === d.category)?.l}
                              {d.file_size_bytes ? ` · ${fmtBytes(d.file_size_bytes)}` : ""}
                            </div>
                          </div>
                          <button onClick={() => remove(d)} className="text-nf-text-muted hover:text-red-400 p-1 shrink-0" aria-label="Törlés">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {d.description && <p className="text-sm text-nf-text-muted">{d.description}</p>}
                        {d.when_to_use && <p className="text-xs"><span className="text-electric-300">Mikor:</span> <span className="text-nf-text-muted">{d.when_to_use}</span></p>}
                        {d.storage_path && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button size="sm" variant="neon" onClick={() => openFile(d.storage_path)}>
                              <ExternalLink className="h-3.5 w-3.5" /> Megnyitás
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => copyLink(d.storage_path)}>
                              <Copy className="h-3.5 w-3.5" /> Link másol
                            </Button>
                          </div>
                        )}
                        {d.content && (
                          <details className="text-sm text-nf-text-muted">
                            <summary className="cursor-pointer text-electric-300 text-xs">Szöveges tartalom</summary>
                            <pre className="whitespace-pre-wrap mt-2 text-xs bg-nf-surface p-3 rounded">{d.content}</pre>
                          </details>
                        )}
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
