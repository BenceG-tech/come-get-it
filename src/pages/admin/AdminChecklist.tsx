import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS = [
  { v: "todo", l: "Hátra van", c: "bg-nf-surface-alt text-nf-text-muted" },
  { v: "in_progress", l: "Folyamatban", c: "bg-electric-300/15 text-electric-300" },
  { v: "blocked", l: "Blokkolva", c: "bg-red-500/15 text-red-400" },
  { v: "done", l: "Kész", c: "bg-green-500/15 text-green-400" },
];
const PRIO = [
  { v: "high", l: "Magas", c: "text-red-400" },
  { v: "medium", l: "Közepes", c: "text-amber-400" },
  { v: "low", l: "Alacsony", c: "text-nf-text-muted" },
];

export default function AdminChecklist() {
  const [items, setItems] = useState<any[]>([]);
  const [openCat, setOpenCat] = useState<Record<string, boolean>>({});
  const [edits, setEdits] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");
  const [newCat, setNewCat] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("checklist_items").select("*").order("category").order("sort_order").order("created_at");
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((i) =>
    filter === "all" ? true : filter === "done" ? i.status === "done" : i.status !== "done"
  ), [items, filter]);

  const grouped: Record<string, any[]> = {};
  for (const i of filtered) (grouped[i.category] ||= []).push(i);
  const cats = Object.keys(grouped).sort();

  const stats = {
    total: items.length,
    done: items.filter((i) => i.status === "done").length,
    inprog: items.filter((i) => i.status === "in_progress").length,
    high: items.filter((i) => i.priority === "high" && i.status !== "done").length,
  };

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("checklist_items").update(patch).eq("id", id);
    if (error) toast({ title: "Hiba", description: error.message, variant: "destructive" });
    else { setItems((p) => p.map((i) => i.id === id ? { ...i, ...patch } : i)); setEdits((p) => { const c = { ...p }; delete c[id]; return c; }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Törlöd ezt a feladatot?")) return;
    await supabase.from("checklist_items").delete().eq("id", id);
    load();
  };

  const add = async () => {
    if (!newCat.trim() || !newTitle.trim()) return;
    await supabase.from("checklist_items").insert([{ category: newCat.trim(), title: newTitle.trim(), priority: "medium", status: "todo" }]);
    setNewCat(""); setNewTitle(""); load();
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Come Get It master checklist</h1>
        <p className="text-sm text-nf-text-muted">{stats.done}/{stats.total} kész · {stats.inprog} folyamatban · {stats.high} magas prioritású nyitott</p>
      </div>

      <Card className="p-4 space-y-2 border-electric-300/30">
        <div className="text-xs text-nf-text-muted">Új feladat hozzáadása</div>
        <div className="grid sm:grid-cols-[180px_1fr_auto] gap-2">
          <Input placeholder="Kategória" value={newCat} onChange={(e) => setNewCat(e.target.value)} list="cat-list" />
          <datalist id="cat-list">{cats.map((c) => <option key={c} value={c} />)}</datalist>
          <Input placeholder="Feladat címe" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Button variant="neon" size="sm" onClick={add} disabled={!newCat.trim() || !newTitle.trim()}><Plus className="h-4 w-4" /> Hozzáad</Button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {[
          { v: "open", l: "Nyitott" },
          { v: "all", l: "Mind" },
          { v: "done", l: "Kész" },
        ].map((f) => (
          <Button key={f.v} variant={filter === f.v ? "neon" : "outline"} size="sm" onClick={() => setFilter(f.v as any)}>{f.l}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {cats.map((cat) => {
          const open = openCat[cat] ?? true;
          const catItems = grouped[cat];
          const catDone = catItems.filter((i) => i.status === "done").length;
          return (
            <div key={cat} className="border border-nf-border rounded-xl overflow-hidden">
              <button onClick={() => setOpenCat((p) => ({ ...p, [cat]: !open }))} className="w-full flex items-center justify-between p-3 bg-nf-surface hover:bg-nf-surface-alt text-left">
                <div className="flex items-center gap-2 min-w-0">
                  {open ? <ChevronDown className="h-4 w-4 text-electric-300" /> : <ChevronRight className="h-4 w-4 text-electric-300" />}
                  <span className="font-medium truncate">{cat}</span>
                </div>
                <span className="text-xs text-nf-text-muted">{catDone}/{catItems.length}</span>
              </button>
              {open && (
                <div className="divide-y divide-nf-border">
                  {catItems.map((i) => {
                    const e = edits[i.id] ?? {};
                    const dirty = Object.keys(e).length > 0;
                    return (
                      <div key={i.id} className="p-3 space-y-2 bg-nf-surface-alt/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-semibold ${PRIO.find((p) => p.v === i.priority)?.c}`}>● {PRIO.find((p) => p.v === i.priority)?.l}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS.find((s) => s.v === i.status)?.c}`}>{STATUS.find((s) => s.v === i.status)?.l}</span>
                            </div>
                            <div className="font-medium text-sm mt-0.5">{i.title}</div>
                            {i.description && <div className="text-xs text-nf-text-muted mt-0.5">{i.description}</div>}
                          </div>
                          <button onClick={() => remove(i.id)} className="text-nf-text-muted hover:text-red-400 p-1 shrink-0"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select defaultValue={i.status} onChange={(ev) => setEdits((p) => ({ ...p, [i.id]: { ...p[i.id], status: ev.target.value } }))} className="h-8 rounded-md bg-nf-surface-alt border border-nf-border px-2 text-xs">
                            {STATUS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                          </select>
                          <select defaultValue={i.priority} onChange={(ev) => setEdits((p) => ({ ...p, [i.id]: { ...p[i.id], priority: ev.target.value } }))} className="h-8 rounded-md bg-nf-surface-alt border border-nf-border px-2 text-xs">
                            {PRIO.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
                          </select>
                        </div>
                        <Textarea rows={2} placeholder="Jegyzet (állapot, blokker, link…)" defaultValue={i.notes ?? ""} onChange={(ev) => setEdits((p) => ({ ...p, [i.id]: { ...p[i.id], notes: ev.target.value } }))} />
                        {dirty && (
                          <div className="flex justify-end">
                            <Button size="sm" variant="neon" onClick={() => update(i.id, e)}><Save className="h-3.5 w-3.5" /> Mentés</Button>
                          </div>
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
