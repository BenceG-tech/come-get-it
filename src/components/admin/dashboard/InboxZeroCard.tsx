import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Inbox, ArrowRight, AlertTriangle, Bell, FileText, TrendingUp, Users, Sparkles, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";

type Item = {
  id: string;
  kind: string | null;
  severity: string | null;
  title: string | null;
  entity_kind: string | null;
  entity_id: string | null;
  created_at: string;
};

type Group = {
  key: string;
  title: string;
  kind: string | null;
  severity: string | null;
  count: number;
  latest: string;
  entity_kind: string | null;
  entity_id: string | null;
};

function normalize(title: string | null) {
  if (!title) return "ismeretlen";
  return title.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim().slice(0, 80);
}

function iconFor(kind: string | null, severity: string | null) {
  if (severity === "warning" || severity === "critical") return AlertTriangle;
  switch (kind) {
    case "trend_digest":
    case "trend":
      return TrendingUp;
    case "lead":
    case "lead_signal":
      return Users;
    case "document":
    case "doc_review":
      return FileText;
    case "ai":
    case "ai_suggestion":
      return Sparkles;
    default:
      return Bell;
  }
}

function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "most";
  if (diff < 3600) return `${Math.round(diff / 60)}p`;
  if (diff < 86400) return `${Math.round(diff / 3600)}ó`;
  return `${Math.round(diff / 86400)}n`;
}

export default function InboxZeroCard() {
  const [items, setItems] = useState<Item[]>([]);
  const [counts, setCounts] = useState({ open: 0, warn: 0 });

  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("inbox_items")
        .select("id, kind, severity, title, entity_kind, entity_id, created_at")
        .eq("status", "open")
        .or(`snoozed_until.is.null,snoozed_until.lte.${now}`)
        .order("severity", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(20);
      setItems((data as any) ?? []);
      const { count } = await supabase.from("inbox_items").select("id", { count: "exact", head: true }).eq("status", "open");
      const { count: warn } = await supabase.from("inbox_items").select("id", { count: "exact", head: true }).eq("status", "open").eq("severity", "warning");
      setCounts({ open: count ?? 0, warn: warn ?? 0 });
    })();
  }, []);

  const groups: Group[] = useMemo(() => {
    const map = new Map<string, Group>();
    for (const it of items) {
      const k = `${it.kind ?? "x"}::${normalize(it.title)}`;
      const cur = map.get(k);
      if (cur) {
        cur.count += 1;
        if (it.created_at > cur.latest) cur.latest = it.created_at;
      } else {
        map.set(k, {
          key: k,
          title: it.title ?? "Névtelen",
          kind: it.kind,
          severity: it.severity,
          count: 1,
          latest: it.created_at,
          entity_kind: it.entity_kind,
          entity_id: it.entity_id,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => (b.severity === "warning" ? 1 : 0) - (a.severity === "warning" ? 1 : 0) || (a.latest < b.latest ? 1 : -1)).slice(0, 5);
  }, [items]);

  return (
    <SurfaceCard
      tone="accent"
      icon={<Inbox className="h-4 w-4" />}
      title="Founder Inbox"
      subtitle={counts.open > 0 ? `${counts.open} nyitott jelzés` : "Minden tiszta"}
      action={
        <Link to="/admin/inbox" className="text-xs text-electric-300 hover:underline inline-flex items-center gap-1">
          Nyitás <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {counts.open === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <div className="h-12 w-12 rounded-full bg-emerald-400/10 text-emerald-300 grid place-items-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium text-emerald-300">Inbox zero</div>
          <div className="text-xs text-white/50">Nincs nyitott teendő — szép munka.</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-electric-300 tabular-nums">{counts.open}</span>
            <span className="text-xs text-white/50">nyitott</span>
            {counts.warn > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-amber-300">
                <AlertTriangle className="h-3 w-3" /> {counts.warn} sürgős
              </span>
            )}
          </div>
          <div className="space-y-1">
            {groups.map((g) => {
              const Icon = iconFor(g.kind, g.severity);
              const isWarn = g.severity === "warning" || g.severity === "critical";
              return (
                <Link
                  key={g.key}
                  to="/admin/inbox"
                  className="group flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-1 hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg grid place-items-center shrink-0",
                      isWarn ? "bg-amber-400/10 text-amber-300" : "bg-electric-300/10 text-electric-300"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white/85 truncate">{g.title}</div>
                  </div>
                  {g.count > 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/70">
                      ×{g.count}
                    </span>
                  )}
                  <span className="text-[10px] text-white/40 tabular-nums">{relativeTime(g.latest)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/30 group-hover:text-electric-300 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
