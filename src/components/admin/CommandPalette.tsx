import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon, MessageSquare, Upload, ScanSearch, Cloud, Wand2, Palette } from "lucide-react";

type Hit = { id: string; title: string; kind: "doc" | "partner" };

const NAV = [
  { to: "/admin", label: "Áttekintés", icon: LayoutDashboard },
  { to: "/admin/content", label: "Content Studio (multi-format)", icon: Wand2 },
  { to: "/admin/brand", label: "Brand Memory", icon: Palette },
  { to: "/admin/leads", label: "Leadek", icon: Target },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/documents", label: "Dokumentumok", icon: FileText },
  { to: "/admin/media", label: "Média", icon: ImageIcon },
  { to: "/admin/drive", label: "Google Drive", icon: Cloud },
  { to: "/admin/documents/chat", label: "Chat a doksikkal", icon: MessageSquare },
  { to: "/admin/checklist", label: "Master checklist", icon: ListChecks },
  { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
  { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (!term) { setHits([]); return; }
    let cancel = false;
    (async () => {
      const [docs, partners] = await Promise.all([
        supabase.from("documents").select("id,title").ilike("title", `%${term}%`).limit(6),
        supabase.from("partners").select("id,name").ilike("name", `%${term}%`).limit(6),
      ]);
      if (cancel) return;
      const out: Hit[] = [
        ...(docs.data ?? []).map((d: any) => ({ id: d.id, title: d.title, kind: "doc" as const })),
        ...(partners.data ?? []).map((p: any) => ({ id: p.id, title: p.name, kind: "partner" as const })),
      ];
      setHits(out);
    })();
    return () => { cancel = true; };
  }, [q, open]);

  const go = (path: string) => { setOpen(false); navigate(path); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Keresés vagy parancs… (⌘K)" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>Nincs találat.</CommandEmpty>
        {hits.length > 0 && (
          <CommandGroup heading="Találatok">
            {hits.map((h) => (
              <CommandItem key={`${h.kind}-${h.id}`} onSelect={() => go(h.kind === "doc" ? `/admin/documents/${h.id}` : `/admin/partners/${h.id}`)}>
                {h.kind === "doc" ? <FileText className="h-4 w-4 mr-2" /> : <Users className="h-4 w-4 mr-2" />}
                <span>{h.title}</span>
                <span className="ml-auto text-xs text-nf-text-muted">{h.kind === "doc" ? "doksi" : "partner"}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Navigáció">
          {NAV.map((n) => (
            <CommandItem key={n.to} onSelect={() => go(n.to)}>
              <n.icon className="h-4 w-4 mr-2" /> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Gyors műveletek">
          <CommandItem onSelect={() => go("/admin/documents?upload=1")}>
            <Upload className="h-4 w-4 mr-2" /> Tömeges feltöltés
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/documents?organize=1")}>
            <ScanSearch className="h-4 w-4 mr-2" /> AI rendezés javaslat
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
