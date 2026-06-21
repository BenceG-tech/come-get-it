import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/track";
import {
  LayoutDashboard, Users, FileText, Sparkles, Calendar, ListChecks, Target, Image as ImageIcon,
  MessageSquare, Upload, ScanSearch, Cloud, Wand2, Palette, Inbox, TrendingUp, Brain, Telescope,
  Send, Trophy, Plus, RefreshCw,
} from "lucide-react";

type Hit =
  | { kind: "partner"; id: string; title: string }
  | { kind: "lead"; id: string; title: string }
  | { kind: "doc"; id: string; title: string }
  | { kind: "decision"; id: string; title: string }
  | { kind: "inbox"; id: string; title: string };

const NAV = [
  { to: "/admin", label: "Áttekintés", icon: LayoutDashboard },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/decisions", label: "Döntésnapló", icon: Brain },
  { to: "/admin/trends", label: "Trend Radar", icon: Telescope },
  { to: "/admin/simulator", label: "Pipeline simulator", icon: TrendingUp },
  { to: "/admin/leads", label: "Leadek", icon: Target },
  { to: "/admin/partners", label: "Partnerek", icon: Users },
  { to: "/admin/outreach", label: "Outreach", icon: Send },
  { to: "/admin/content", label: "Content Studio", icon: Wand2 },
  { to: "/admin/brand", label: "Brand Memory", icon: Palette },
  { to: "/admin/documents", label: "Dokumentumok", icon: FileText },
  { to: "/admin/media", label: "Média", icon: ImageIcon },
  { to: "/admin/drive", label: "Google Drive", icon: Cloud },
  { to: "/admin/documents/chat", label: "Chat a doksikkal", icon: MessageSquare },
  { to: "/admin/checklist", label: "Master checklist", icon: ListChecks },
  { to: "/admin/ai", label: "AI asszisztens", icon: Sparkles },
  { to: "/admin/calendar", label: "Marketing naptár", icon: Calendar },
  { to: "/admin/retro", label: "Heti retro", icon: Trophy },
];

const RECENT_KEY = "cgi.cmdk.recent";
type Recent = { path: string; label: string; at: number };
const loadRecent = (): Recent[] => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; } };
const pushRecent = (r: Recent) => {
  const list = loadRecent().filter((x) => x.path !== r.path);
  list.unshift(r);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
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

  useEffect(() => { if (open) { trackEvent("command_palette_used"); setRecent(loadRecent()); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (!term) { setHits([]); return; }
    let cancel = false;
    (async () => {
      const [docs, partners, decisions, inbox] = await Promise.all([
        supabase.from("documents").select("id,title").ilike("title", `%${term}%`).limit(5),
        supabase.from("partners").select("id,company_name,status").ilike("company_name", `%${term}%`).limit(8),
        supabase.from("decisions").select("id,decision_text").ilike("decision_text", `%${term}%`).limit(4),
        supabase.from("inbox_items").select("id,title").ilike("title", `%${term}%`).limit(4),
      ]);
      if (cancel) return;
      const out: Hit[] = [
        ...(partners.data ?? []).map((p: any) => ({ kind: (p.status === "lead" ? "lead" : "partner") as "partner" | "lead", id: p.id, title: p.company_name })),
        ...(docs.data ?? []).map((d: any) => ({ kind: "doc" as const, id: d.id, title: d.title })),
        ...(decisions.data ?? []).map((d: any) => ({ kind: "decision" as const, id: d.id, title: d.decision_text })),
        ...(inbox.data ?? []).map((i: any) => ({ kind: "inbox" as const, id: i.id, title: i.title })),
      ];
      setHits(out);
    })();
    return () => { cancel = true; };
  }, [q, open]);

  const go = (path: string, label?: string) => {
    if (label) pushRecent({ path, label, at: Date.now() });
    setOpen(false);
    navigate(path);
  };

  const linkFor = (h: Hit) => {
    switch (h.kind) {
      case "doc": return `/admin/documents/${h.id}`;
      case "partner":
      case "lead": return `/admin/partners/${h.id}`;
      case "decision": return `/admin/decisions`;
      case "inbox": return `/admin/inbox`;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Keresés mindenben vagy parancs… (⌘K)" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>Nincs találat.</CommandEmpty>
        {hits.length > 0 && (
          <CommandGroup heading="Találatok">
            {hits.map((h) => (
              <CommandItem key={`${h.kind}-${h.id}`} onSelect={() => go(linkFor(h), h.title)}>
                {h.kind === "doc" && <FileText className="h-4 w-4 mr-2" />}
                {(h.kind === "partner" || h.kind === "lead") && <Users className="h-4 w-4 mr-2" />}
                {h.kind === "decision" && <Brain className="h-4 w-4 mr-2" />}
                {h.kind === "inbox" && <Inbox className="h-4 w-4 mr-2" />}
                <span className="truncate">{h.title}</span>
                <span className="ml-auto text-xs text-nf-text-muted">{h.kind}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {!q && recent.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Legutóbb">
              {recent.map((r) => (
                <CommandItem key={r.path} onSelect={() => go(r.path, r.label)}>
                  <RefreshCw className="h-4 w-4 mr-2" /> <span className="truncate">{r.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Gyors műveletek">
          <CommandItem onSelect={() => go("/admin/leads?new=1", "Új lead")}>
            <Plus className="h-4 w-4 mr-2" /> Új lead
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/decisions?new=1", "Új döntés")}>
            <Brain className="h-4 w-4 mr-2" /> Új döntés rögzítése
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/trends", "Trend Radar")}>
            <Telescope className="h-4 w-4 mr-2" /> Trend kutatás indítása
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/documents?upload=1", "Tömeges feltöltés")}>
            <Upload className="h-4 w-4 mr-2" /> Tömeges feltöltés
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/documents?organize=1", "AI rendezés")}>
            <ScanSearch className="h-4 w-4 mr-2" /> AI rendezés
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/retro")}>
            <RefreshCw className="h-4 w-4 mr-2" /> Heti retro
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigáció">
          {NAV.map((n) => (
            <CommandItem key={n.to} onSelect={() => go(n.to, n.label)}>
              <n.icon className="h-4 w-4 mr-2" /> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
