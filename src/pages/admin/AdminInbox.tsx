import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Check, Clock, X, Inbox as InboxIcon, AlertTriangle, MessageSquare, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Item = {
  id: string;
  kind: string;
  severity: string;
  title: string;
  body: string | null;
  entity_kind: string | null;
  entity_id: string | null;
  payload: any;
  status: string;
  snoozed_until: string | null;
  created_at: string;
};

const KIND_META: Record<string, { icon: any; color: string; label: string }> = {
  task_overdue: { icon: Clock, color: "text-amber-400", label: "Lejárt teendő" },
  sla_breach: { icon: AlertTriangle, color: "text-red-400", label: "SLA túllépés" },
  outreach_reply: { icon: MessageSquare, color: "text-electric-300", label: "Outreach válasz" },
  doc_stale: { icon: FileText, color: "text-nf-text-muted", label: "Elavuló doksi" },
  doc_review_needed: { icon: FileText, color: "text-yellow-400", label: "Doksi review" },
  lead_alert: { icon: Users, color: "text-electric-300", label: "Lead riasztás" },
};

const linkFor = (it: Item) => {
  if (it.entity_kind === "partner" && it.entity_id) return `/admin/partners/${it.entity_id}`;
  if (it.entity_kind === "document" && it.entity_id) return `/admin/documents/${it.entity_id}`;
  return null;
};

export default function AdminInbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"open" | "snoozed" | "done">("open");
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const now = new Date().toISOString();
    let q = supabase.from("inbox_items").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "open") q = q.eq("status", "open").or(`snoozed_until.is.null,snoozed_until.lte.${now}`);
    else if (filter === "snoozed") q = q.eq("status", "open").gt("snoozed_until", now);
    else q = q.eq("status", "done");
    const { data } = await q;
    setItems((data as any) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const collect = async () => {
    setRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke("inbox-collect");
      if (error) throw error;
      toast({ title: "Inbox frissítve" });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  const resolve = async (id: string) => {
    await supabase.from("inbox_items").update({ status: "done", resolved_at: new Date().toISOString() }).eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  };
  const snooze = async (id: string, hours: number) => {
    const until = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    await supabase.from("inbox_items").update({ snoozed_until: until }).eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  };
  const dismiss = async (id: string) => {
    await supabase.from("inbox_items").update({ status: "dismissed", resolved_at: new Date().toISOString() }).eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  };

  const counts = useMemo(() => ({
    warn: items.filter((i) => i.severity === "warning").length,
    info: items.filter((i) => i.severity === "info").length,
  }), [items]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><InboxIcon className="w-6 h-6 text-electric-300" /> Founder Inbox</h1>
          <p className="text-sm text-nf-text-muted">Minden döntés és értesítés egy helyen. Cél: <strong className="text-electric-300">Inbox zero</strong>.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={collect} disabled={refreshing}>
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Új jelek begyűjtése
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["open", "snoozed", "done"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "open" ? "Aktív" : f === "snoozed" ? "Szundi" : "Kész"}
          </Button>
        ))}
        {filter === "open" && (
          <div className="ml-auto flex gap-2 text-xs">
            <Badge variant="outline" className="border-red-500/40 text-red-300">{counts.warn} figyelmeztetés</Badge>
            <Badge variant="outline">{counts.info} info</Badge>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-electric-300" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="font-semibold text-electric-300">Inbox zero!</div>
          <div className="text-sm text-nf-text-muted">Nincs nyitott item ebben a nézetben.</div>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((it) => {
            const meta = KIND_META[it.kind] ?? { icon: InboxIcon, color: "text-nf-text-muted", label: it.kind };
            const Icon = meta.icon;
            const link = linkFor(it);
            return (
              <Card key={it.id} className="p-3 flex items-start gap-3 hover:border-electric-300/40">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wider text-nf-text-muted">{meta.label}</span>
                    <span className="text-[10px] text-nf-text-muted">· {new Date(it.created_at).toLocaleString("hu-HU")}</span>
                  </div>
                  <div className="font-medium text-sm mt-0.5">
                    {link ? <Link to={link} className="text-electric-300 hover:underline">{it.title}</Link> : it.title}
                  </div>
                  {it.body && <div className="text-xs text-nf-text-muted mt-1">{it.body}</div>}
                </div>
                {filter === "open" && (
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" title="Kész" onClick={() => resolve(it.id)}><Check className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" title="Szundi 1 óra" onClick={() => snooze(it.id, 1)}><Clock className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" title="Eltüntet" onClick={() => dismiss(it.id)}><X className="w-4 h-4" /></Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
