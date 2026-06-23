import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ExternalLink, Copy, ChevronDown, ChevronRight, Upload, FileText, Image as ImageIcon, Video as VideoIcon, Star, ClipboardList, Sparkles, X, Pencil, MessageSquare, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { cn } from "@/lib/utils";
import DocumentEditDialog from "@/components/admin/documents/DocumentEditDialog";
import DocumentSummary from "@/components/admin/documents/DocumentSummary";
import MediaLightbox from "@/components/admin/documents/MediaLightbox";
import BatchProcessDialog from "@/components/admin/documents/BatchProcessDialog";
import ImageAnalysisPanel from "@/components/admin/media/ImageAnalysisPanel";
import BulkUploadDialog from "@/components/admin/documents/BulkUploadDialog";
import OrganizationSuggestionsDialog from "@/components/admin/documents/OrganizationSuggestionsDialog";
import OrganizationBanner from "@/components/admin/documents/OrganizationBanner";
import PageIntro from "@/components/admin/help/PageIntro";

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

const mimeOfPath = (p?: string | null): string => {
  if (!p) return "";
  const ext = p.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "application/pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "heic"].includes(ext)) return `image/${ext === "jpg" ? "jpeg" : ext}`;
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return `video/${ext}`;
  return "";
};

type TabKey = "docs" | "images" | "videos";

const kindOf = (d: any): TabKey => {
  const mime = d.mime_type || mimeOfPath(d.storage_path);
  if (mime.startsWith("image/")) return "images";
  if (mime.startsWith("video/")) return "videos";
  return "docs";
};

const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

export default function AdminDocuments({ initialTab }: { initialTab?: TabKey } = {}) {
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabKey>(initialTab ?? "docs");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [showNew, setShowNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [ratingFilter, setRatingFilter] = useState<"all" | "high" | "mid" | "low" | "none">("all");
  const [auditing, setAuditing] = useState(false);
  const [tagging, setTagging] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [lightbox, setLightbox] = useState<{ url: string; title: string; isVideo: boolean } | null>(null);
  const [signedCache, setSignedCache] = useState<Record<string, string>>({});
  const [batchOpen, setBatchOpen] = useState(false);
  const [aiImage, setAiImage] = useState<any | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", folder: "", category: "other", description: "", when_to_use: "", content: "", file: null as File | null,
  });
  const { toast } = useToast();
  const { open: openAI, addAttachments, setPendingPrompt } = useAIAssistant();

  const load = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("folder", { ascending: true, nullsFirst: false })
      .order("title", { ascending: true });
    setDocs(data ?? []);
  };
  useEffect(() => { load(); }, []);

  // Preload signed URLs for media thumbnails on current tab
  useEffect(() => {
    const needed = docs.filter((d) => kindOf(d) === tab && d.storage_path && !d.storage_path.startsWith("http") && !signedCache[d.id]);
    if (needed.length === 0) return;
    (async () => {
      const next: Record<string, string> = {};
      await Promise.all(needed.slice(0, 40).map(async (d) => {
        const { data } = await supabase.storage.from("admin-docs").createSignedUrl(d.storage_path, 3600);
        if (data?.signedUrl) next[d.id] = data.signedUrl;
      }));
      if (Object.keys(next).length) setSignedCache((p) => ({ ...p, ...next }));
    })();
  }, [docs, tab]);

  const counts = useMemo(() => {
    const c = { docs: 0, images: 0, videos: 0 };
    for (const d of docs) c[kindOf(d)]++;
    return c;
  }, [docs]);

  const filtered = useMemo(() => {
    let list = docs.filter((d) => kindOf(d) === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => `${d.title} ${d.description ?? ""} ${d.when_to_use ?? ""}`.toLowerCase().includes(q));
    }
    if (ratingFilter !== "all") {
      list = list.filter((d) => {
        const s = d.quality_score;
        if (ratingFilter === "none") return s == null;
        if (s == null) return false;
        if (ratingFilter === "high") return s >= 8;
        if (ratingFilter === "mid") return s >= 5 && s < 8;
        if (ratingFilter === "low") return s < 5;
        return true;
      });
    }
    return list;
  }, [docs, search, ratingFilter, tab]);

  const grouped: Record<string, any[]> = {};
  for (const d of filtered) {
    const key = d.folder ?? UNFILED;
    (grouped[key] ||= []).push(d);
  }
  const folderKeys = Object.keys(grouped).sort();

  const isFolderOpen = (k: string) => (search || ratingFilter !== "all" ? true : openFolders[k] ?? folderKeys.length <= 3);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const selectedDocs = useMemo(() => docs.filter((d) => selected[d.id]), [docs, selected]);

  const toggleSelect = (id: string) => setSelected((p) => ({ ...p, [id]: !p[id] }));
  const clearSelection = () => setSelected({});

  const sendSelectedToAI = () => {
    addAttachments(selectedDocs.map((d) => ({ id: d.id, title: d.title, kind: "doc" as const })));
    setPendingPrompt(`Ezekkel a doksikkal dolgozz: ${selectedDocs.map((d) => `"${d.title}"`).join(", ")}. Mit szeretnél, hogy csináljak velük?`);
    openAI();
  };

  const chatWithSelected = () => {
    const ids = selectedIds.join(",");
    window.location.href = `/admin/documents/chat?ids=${ids}`;
  };

  const runAudit = async () => {
    if (auditing) return;
    if (!confirm("Az AI átnézi az összes még nem értékelt doksit (max 50). Folytatod?")) return;
    setAuditing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-audit-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ onlyMissing: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      toast({ title: "Audit kész", description: `${j.count} doksi értékelve` });
      load();
    } catch (e: any) {
      toast({ title: "Audit hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setAuditing(false);
    }
  };

  const runAiTagEmbed = async () => {
    if (tagging) return;
    const targetIds = selectedIds.length > 0
      ? selectedIds
      : docs.filter((d) => !d.ai_hook).slice(0, 30).map((d) => d.id);
    if (!targetIds.length) {
      toast({ title: "Nincs cimkézendő doksi", description: "Jelölj ki vagy adj hozzá újat." });
      return;
    }
    if (!confirm(`${targetIds.length} doksi AI cimkézése és embeddingje. Folytatod?`)) return;
    setTagging(true);
    try {
      const tagP = supabase.functions.invoke("doc-auto-tag", { body: { document_ids: targetIds } });
      const embP = supabase.functions.invoke("doc-embed", { body: { document_ids: targetIds } });
      const [tagR, embR] = await Promise.all([tagP, embP]);
      if (tagR.error) throw tagR.error;
      if (embR.error) throw embR.error;
      toast({ title: "AI cimkézés kész", description: `${targetIds.length} doksi feldolgozva.` });
      load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setTagging(false);
    }
  };

  const getSignedUrl = async (storage_path: string): Promise<string | null> => {
    if (storage_path.startsWith("http")) return storage_path;
    const { data, error } = await supabase.storage.from("admin-docs").createSignedUrl(storage_path, 3600);
    if (error || !data) {
      toast({ title: "Nem sikerült linket generálni", description: error?.message, variant: "destructive" });
      return null;
    }
    return data.signedUrl;
  };

  const handleOpen = async (d: any) => {
    const kind = kindOf(d);
    // Images/videos open in lightbox via signed URL (these render reliably)
    if (d.storage_path && (kind === "images" || kind === "videos")) {
      const url = await getSignedUrl(d.storage_path);
      if (!url) return;
      setLightbox({ url, title: d.title, isVideo: kind === "videos" });
      return;
    }
    // All other docs (incl. PDFs, no-file text docs) open in the in-app viewer
    // — guarantees a visible preview (tldr/content/key_points) plus PDF embed
    // and a reliable "open in new tab / download" fallback.
    window.location.href = `/admin/documents/${d.id}`;
  };

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
        const folderSlug = (form.folder || "egyeb").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
      const { data: inserted, error: insErr } = await supabase.from("documents").insert([{
        title: form.title, folder: form.folder || null, category: form.category as any,
        description: form.description || null, when_to_use: form.when_to_use || null,
        content: form.content || null, storage_path, mime_type, file_size_bytes,
      }]).select("id").maybeSingle();
      if (insErr) throw insErr;
      // Fire-and-forget AI auto-trigger
      if (inserted?.id) {
        supabase.functions.invoke("doc-auto-tag", { body: { document_id: inserted.id } }).catch(() => {});
        supabase.functions.invoke("doc-embed", { body: { document_id: inserted.id } }).catch(() => {});
        supabase.functions.invoke("doc-entity-bridge", { body: { document_id: inserted.id } }).catch(() => {});
      }
      setShowNew(false);
      setForm({ title: "", folder: "", category: "other", description: "", when_to_use: "", content: "", file: null });
      load();
      toast({ title: "Mentve · AI cimkézés indul" });
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

  const bulkDelete = async () => {
    if (!confirm(`Törlöd a ${selectedIds.length} kijelölt elemet?`)) return;
    const paths = selectedDocs.filter((d) => d.storage_path && !d.storage_path.startsWith("http")).map((d) => d.storage_path);
    if (paths.length) await supabase.storage.from("admin-docs").remove(paths);
    await supabase.from("documents").delete().in("id", selectedIds);
    clearSelection();
    load();
  };

  const bulkMove = async () => {
    const folder = prompt("Új mappa neve (üres = mappázatlan):", "");
    if (folder === null) return;
    await supabase.from("documents").update({ folder: folder.trim() || null }).in("id", selectedIds);
    clearSelection();
    load();
    toast({ title: "Áthelyezve" });
  };

  const toggleFolder = (k: string) => setOpenFolders((p) => ({ ...p, [k]: !(p[k] ?? folderKeys.length <= 3) }));

  const tabs: { k: TabKey; label: string; icon: any; count: number }[] = [
    { k: "docs", label: "Doksik", icon: FileText, count: counts.docs },
    { k: "images", label: "Képek", icon: ImageIcon, count: counts.images },
    { k: "videos", label: "Videók", icon: VideoIcon, count: counts.videos },
  ];

  return (
    <div className="p-4 md:p-8 pb-40 md:pb-12 max-w-6xl mx-auto space-y-4 md:space-y-6">
      <PageIntro slug={tab === "images" ? "media" : "documents"} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">{tab === "images" ? "Képek" : tab === "videos" ? "Videók" : "Dokumentumok"}</h1>
          <p className="text-sm text-nf-text-muted">{docs.length} elem · {folderKeys.length} mappa ebben a nézetben</p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/documents/chat"><MessageSquare className="h-4 w-4" /> <span className="hidden sm:inline">Chat a doksikkal</span></Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOrgOpen(true)}>
            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">AI rendezés</span>
          </Button>
          <Button variant="outline" size="sm" onClick={runAudit} disabled={auditing}>
            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">{auditing ? "Auditálás…" : "AI audit"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={runAiTagEmbed} disabled={tagging}>
            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">{tagging ? "Cimkézés…" : "AI cimkék + embed"}</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/documents/audit"><ClipboardList className="h-4 w-4" /> <span className="hidden sm:inline">Audit lista</span></Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setBulkOpen(true)}>
            <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Tömeges</span>
          </Button>
          <Button variant="neon" size="sm" onClick={() => setShowNew(!showNew)}>
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Egy fájl</span>
          </Button>
        </div>
      </div>

      <OrganizationBanner
        unfiledCount={docs.filter((d) => !d.folder).length}
        onOpen={() => setOrgOpen(true)}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-full bg-nf-surface border border-nf-border w-fit">
        {tabs.map((t) => {
          const active = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={cn("flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors",
                active ? "bg-electric-300 text-black" : "text-nf-text-muted hover:text-white")}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
              <span className={cn("text-[10px] px-1.5 rounded-full", active ? "bg-black/20 text-black" : "bg-nf-surface-alt text-nf-text-muted")}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Rating filter (docs only) */}
      {tab === "docs" && (
        <div className="flex flex-wrap gap-1.5 text-xs">
          {([["all", "Mind"], ["high", "★ 8+"], ["mid", "★ 5-7"], ["low", "★ <5"], ["none", "Nincs értékelve"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setRatingFilter(k)}
              className={cn("px-2.5 py-1 rounded-full border transition-colors",
                ratingFilter === k ? "bg-electric-300/15 border-electric-300/50 text-electric-300"
                : "bg-nf-surface-alt border-nf-border text-nf-text-muted hover:text-white")}>
              {l}
            </button>
          ))}
        </div>
      )}

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
          <Input placeholder={'Mikor használd?'} value={form.when_to_use} onChange={(e) => setForm({ ...form, when_to_use: e.target.value })} />
          <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-nf-border bg-nf-surface-alt cursor-pointer hover:border-electric-300/50">
            <Upload className="h-4 w-4 text-electric-300 shrink-0" />
            <span className="text-sm text-nf-text-muted truncate">
              {form.file ? `${form.file.name} (${fmtBytes(form.file.size)})` : "Fájl választása (PDF, kép, videó, doksi…)"}
            </span>
            <input type="file" className="hidden" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })} />
          </label>
          <Textarea rows={4} placeholder="Szöveges tartalom (opcionális)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowNew(false)} disabled={uploading}>Mégse</Button>
            <Button variant="neon" onClick={create} disabled={uploading}>{uploading ? "Feltöltés…" : "Mentés"}</Button>
          </div>
        </Card>
      )}

      <Input placeholder="Keresés…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Media grid for images/videos */}
      {tab !== "docs" && (
        <div>
          {filtered.length === 0 ? (
            <div className="text-center text-nf-text-muted py-12">Nincs {tab === "images" ? "kép" : "videó"} ebben a nézetben.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((d) => {
                const url = signedCache[d.id] || (d.storage_path?.startsWith("http") ? d.storage_path : null);
                const isVid = kindOf(d) === "videos";
                const isSel = !!selected[d.id];
                return (
                  <div key={d.id} className={cn("group relative rounded-xl overflow-hidden border bg-nf-surface-alt", isSel ? "border-electric-300 ring-2 ring-electric-300/40" : "border-nf-border")}>
                    <button onClick={() => handleOpen(d)} className="block w-full aspect-square bg-black/40 overflow-hidden">
                      {url ? (
                        isVid ? (
                          <video src={url} className="w-full h-full object-cover" muted preload="metadata" />
                        ) : (
                          <img src={url} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-nf-text-muted">
                          {isVid ? <VideoIcon className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
                        </div>
                      )}
                    </button>
                    <div className="p-2 space-y-1">
                      <div className="text-xs font-medium truncate" title={d.title}>{d.title}</div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-nf-text-muted truncate">{d.folder ?? "—"}</span>
                        <div className="flex gap-0.5">
                          {!isVid && (
                            <button onClick={() => setAiImage(d)} className={cn("p-1 rounded hover:bg-white/10", d.ai_description ? "text-electric-300" : "text-nf-text-muted hover:text-electric-300")} aria-label="AI elemzés" title={d.ai_description ? "AI elemzés megnézése" : "AI javaslatok"}>
                              <Sparkles className="h-3 w-3" />
                            </button>
                          )}
                          <button onClick={() => toggleSelect(d.id)} className={cn("p-1 rounded hover:bg-white/10", isSel && "text-electric-300")} aria-label="Kijelölés">
                            <input type="checkbox" checked={isSel} readOnly className="h-3 w-3 accent-electric-300 pointer-events-none" />
                          </button>
                          <button onClick={() => setEditing(d)} className="p-1 rounded text-nf-text-muted hover:bg-white/10 hover:text-white" aria-label="Szerkesztés"><Pencil className="h-3 w-3" /></button>
                          <button onClick={() => remove(d)} className="p-1 rounded text-nf-text-muted hover:bg-white/10 hover:text-red-400" aria-label="Törlés"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Docs list */}
      {tab === "docs" && (
        <div className="space-y-3">
          {folderKeys.length === 0 && <div className="text-center text-nf-text-muted py-12">Nincs dokumentum.</div>}
          {folderKeys.map((k) => {
            const open = isFolderOpen(k);
            return (
              <div key={k} className="border border-nf-border rounded-xl overflow-hidden">
                <button onClick={() => toggleFolder(k)} className="w-full flex items-center justify-between p-4 bg-nf-surface hover:bg-nf-surface-alt text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    {open ? <ChevronDown className="h-4 w-4 text-electric-300 shrink-0" /> : <ChevronRight className="h-4 w-4 text-electric-300 shrink-0" />}
                    <span className="font-medium truncate">{k}</span>
                  </div>
                  <span className="text-xs text-nf-text-muted shrink-0 ml-2">{grouped[k].length}</span>
                </button>
                {open && (
                  <div className="divide-y divide-nf-border">
                    {grouped[k].map((d) => {
                      const s = d.quality_score;
                      const ratingColor =
                        s == null ? "bg-nf-surface-alt text-nf-text-muted border-nf-border"
                        : s >= 8 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                        : s >= 5 ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
                        : "bg-red-500/15 text-red-400 border-red-500/40";
                      const isSel = !!selected[d.id];
                      return (
                        <div key={d.id} className={cn("p-4 space-y-2 bg-nf-surface-alt/30 transition-colors", isSel && "bg-electric-300/5 ring-1 ring-electric-300/30 ring-inset")}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <input type="checkbox" checked={isSel} onChange={() => toggleSelect(d.id)}
                                className="mt-1 h-4 w-4 rounded border-nf-border bg-nf-surface accent-electric-300 cursor-pointer shrink-0" aria-label="Kijelölés" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {d.storage_path && <FileText className="h-4 w-4 text-electric-300 shrink-0" />}
                                  <h3 className="font-medium truncate">{d.title}</h3>
                                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border shrink-0", ratingColor)}
                                    title={d.quality_notes ?? (s == null ? "Még nincs AI értékelés" : "")}>
                                    <Star className="h-3 w-3" /> {s != null ? `${s}/10` : "—"}
                                  </span>
                                </div>
                                <div className="text-xs text-nf-text-muted mt-0.5">
                                  {CATEGORIES.find((c) => c.v === d.category)?.l}
                                  {d.file_size_bytes ? ` · ${fmtBytes(d.file_size_bytes)}` : ""}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => setEditing(d)} className="text-nf-text-muted hover:text-electric-300 p-1" aria-label="Szerkesztés"><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => remove(d)} className="text-nf-text-muted hover:text-red-400 p-1" aria-label="Törlés"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                          {d.description && <p className="text-sm text-nf-text-muted">{d.description}</p>}
                          {d.when_to_use && <p className="text-xs"><span className="text-electric-300">Mikor:</span> <span className="text-nf-text-muted">{d.when_to_use}</span></p>}
                          {d.quality_notes && (
                            <p className="text-[11px] text-nf-text-muted italic border-l-2 border-electric-300/40 pl-2">
                              <Sparkles className="h-3 w-3 inline mr-1 text-electric-300" />{d.quality_notes}
                            </p>
                          )}

                          <DocumentSummary doc={d} onUpdated={load} />

                          <div className="flex flex-wrap gap-2 pt-1">
                            {d.storage_path && (
                              <>
                                <Button size="sm" variant="neon" onClick={() => handleOpen(d)}>
                                  <ExternalLink className="h-3.5 w-3.5" /> Megnyitás
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => copyLink(d.storage_path)}>
                                  <Copy className="h-3.5 w-3.5" /> Link másol
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/admin/documents/chat?ids=${d.id}`}>
                                <MessageSquare className="h-3.5 w-3.5" /> Chat
                              </Link>
                            </Button>
                            {d.duplicate_group && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                Dup: {d.duplicate_group}
                              </span>
                            )}
                          </div>

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
      )}

      {/* Selection action bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-nf-surface border border-electric-300/40 rounded-full shadow-2xl px-3 py-2 flex items-center gap-1.5 flex-wrap max-w-[95vw]">
          <span className="text-xs text-electric-300 font-medium px-2">{selectedIds.length} kijelölve</span>
          <Button variant="neon" size="sm" onClick={chatWithSelected}>
            <MessageSquare className="h-3.5 w-3.5" /> Chat
          </Button>
          <Button variant="outline" size="sm" onClick={() => setBatchOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" /> Batch AI
          </Button>
          <Button variant="outline" size="sm" onClick={sendSelectedToAI}>
            <Sparkles className="h-3.5 w-3.5" /> AI panel
          </Button>
          <Button variant="outline" size="sm" onClick={bulkMove}>Áthelyez</Button>
          <Button variant="outline" size="sm" onClick={bulkDelete} className="text-red-400 hover:text-red-300">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <button onClick={clearSelection} className="text-nf-text-muted hover:text-white p-1.5 rounded-full" aria-label="Kijelölés törlése">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {editing && <DocumentEditDialog doc={editing} open={!!editing} onClose={() => setEditing(null)} onSaved={load} />}
      <MediaLightbox open={!!lightbox} onClose={() => setLightbox(null)} url={lightbox?.url ?? null} title={lightbox?.title ?? ""} isVideo={!!lightbox?.isVideo} />
      {batchOpen && (
        <BatchProcessDialog
          open={batchOpen}
          onClose={() => setBatchOpen(false)}
          docs={selectedDocs}
          onDone={load}
        />
      )}
      <ImageAnalysisPanel
        open={!!aiImage}
        onClose={() => setAiImage(null)}
        doc={aiImage}
        thumbUrl={aiImage ? (signedCache[aiImage.id] || (aiImage.storage_path?.startsWith("http") ? aiImage.storage_path : null)) : null}
        onUpdated={load}
      />
      {bulkOpen && (
        <BulkUploadDialog
          open={bulkOpen}
          onClose={() => setBulkOpen(false)}
          onDone={() => load()}
          existingFolders={folderKeys.filter((k) => k !== UNFILED)}
        />
      )}
      {orgOpen && (
        <OrganizationSuggestionsDialog
          open={orgOpen}
          onClose={() => setOrgOpen(false)}
          onApplied={load}
        />
      )}
    </div>
  );
}
