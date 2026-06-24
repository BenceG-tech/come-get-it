import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Check, Clock, X, Inbox as InboxIcon, AlertTriangle, MessageSquare, FileText, Users, Rocket, TrendingUp, Copy, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageIntro from "@/components/admin/help/PageIntro";

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
  lead_replied: { icon: MessageSquare, color: "text-emerald-400", label: "Partner válaszolt" },
  doc_stale: { icon: FileText, color: "text-nf-text-muted", label: "Elavuló doksi" },
  doc_review_needed: { icon: FileText, color: "text-yellow-400", label: "Doksi review" },
  lead_alert: { icon: Users, color: "text-electric-300", label: "Lead riasztás" },
  lead_promote: { icon: TrendingUp, color: "text-emerald-400", label: "Promote javaslat" },
  lead_stalled: { icon: Clock, color: "text-amber-400", label: "Elakadt lead" },
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
  const [replyData, setReplyData] = useState<Record<string, { sentiment?: string; summary?: string; suggested_reply?: string; partner_email?: string }>>({});
  const [classifying, setClassifying] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const now = new Date().toISOString();
    let q = supabase.from("inbox_items").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "open") q = q.eq("status", "open").or(`snoozed_until.is.null,snoozed_until.lte.${now}`);
    else if (filter === "snoozed") q = q.eq("status", "open").gt("snoozed_until", now);
    else q = q.eq("status", "done");
    const { data } = await q;
    const list = (data as any[]) ?? [];
    setItems(list);
    setLoading(false);

    // Fetch enrollment reply context for lead_replied items
    const replyItems = list.filter((x) => x.kind === "lead_replied" && x.payload?.enrollment_id);
    if (replyItems.length) {
      const enrollmentIds = replyItems.map((x) => x.payload.enrollment_id);
      const partnerIds = replyItems.map((x) => x.entity_id).filter(Boolean);
      const [en, parts] = await Promise.all([
        supabase.from("outreach_enrollments").select("id, reply_sentiment, reply_summary, suggested_reply").in("id", enrollmentIds),
        supabase.from("partners").select("id, email").in("id", partnerIds),
      ]);
      const partnerMap = new Map((parts.data ?? []).map((p: any) => [p.id, p.email]));
      const map: any = {};
      for (const item of replyItems) {
        const e = (en.data ?? []).find((x: any) => x.id === item.payload.enrollment_id);
        map[item.id] = {
          sentiment: e?.reply_sentiment,
          summary: e?.reply_summary,
          suggested_reply: e?.suggested_reply,
          partner_email: partnerMap.get(item.entity_id) ?? undefined,
        };
      }
      setReplyData(map);
    }
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
  const promoteLead = async (it: Item) => {
    if (it.entity_kind !== "partner" || !it.entity_id) return;
    const newStatus = it.kind === "lead_promote" ? "contacted" : "negotiating";
    const { error } = await supabase.from("partners").update({ status: newStatus }).eq("id", it.entity_id);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    await supabase.from("inbox_items").update({ status: "done", resolved_at: new Date().toISOString() }).eq("id", it.id);
    toast({ title: `Lead → ${newStatus}` });
    setItems((p) => p.filter((x) => x.id !== it.id));
  };

  const classifyReply = async (it: Item) => {
    if (!it.payload?.enrollment_id) return;
    setClassifying(it.id);
    try {
      const replyText = it.body ?? it.payload?.subject ?? "(üres)";
      const { error } = await supabase.functions.invoke("outreach-reply-classify", {
        body: { enrollment_id: it.payload.enrollment_id, reply_text: replyText, reply_subject: it.payload?.subject },
      });
      if (error) throw error;
      toast({ title: "AI elemezte a választ" });
      await load();
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally {
      setClassifying(null);
    }
  };

  const copyReply = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Vázlat másolva" });
  };

  const openGmail = (email: string, subject: string, body: string) => {
    const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Re: " + subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  };

  const counts = useMemo(() => ({
    warn: items.filter((i) => i.severity === "warning").length,
    info: items.filter((i) => i.severity === "info").length,
  }), [items]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-4">
      <PageIntro slug="inbox" />
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
            const reply = replyData[it.id];
            const isReply = it.kind === "lead_replied";
            return (
              <Card key={it.id} className="p-3 hover:border-electric-300/40">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs uppercase tracking-wider text-nf-text-muted">{meta.label}</span>
                      <span className="text-[10px] text-nf-text-muted">· {new Date(it.created_at).toLocaleString("hu-HU")}</span>
                      {reply?.sentiment && (
                        <Badge variant="outline" className={
                          reply.sentiment === "positive" ? "border-emerald-500/40 text-emerald-300"
                          : reply.sentiment === "negative" ? "border-red-500/40 text-red-300"
                          : "border-nf-border text-nf-text-muted"
                        }>
                          {reply.sentiment === "positive" ? "😊 pozitív" : reply.sentiment === "negative" ? "😕 negatív" : "neutrális"}
                        </Badge>
                      )}
                    </div>
                    <div className="font-medium text-sm mt-0.5">
                      {link ? <Link to={link} className="text-electric-300 hover:underline">{it.title}</Link> : it.title}
                    </div>
                    {it.body && <div className="text-xs text-nf-text-muted mt-1">{it.body}</div>}

                    {isReply && reply?.summary && (
                      <div className="mt-2 p-2 rounded-md bg-nf-surface-alt/60 border border-nf-border/60 text-xs text-nf-text-muted">
                        <span className="text-electric-300 font-semibold">Összegzés:</span> {reply.summary}
                      </div>
                    )}
                    {isReply && reply?.suggested_reply && (
                      <div className="mt-2 p-2 rounded-md bg-electric-300/5 border border-electric-300/30">
                        <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Javasolt válasz-vázlat
                        </div>
                        <div className="text-xs whitespace-pre-wrap text-white/90">{reply.suggested_reply}</div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => copyReply(reply.suggested_reply!)}>
                            <Copy className="w-3 h-3 mr-1" /> Másol
                          </Button>
                          {reply.partner_email && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openGmail(reply.partner_email!, it.payload?.subject ?? "Köszi a választ", reply.suggested_reply!)}>
                              <Mail className="w-3 h-3 mr-1" /> Gmail-ben nyitom
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {isReply && !reply?.suggested_reply && (
                      <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={() => classifyReply(it)} disabled={classifying === it.id}>
                        {classifying === it.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        AI elemzés + válasz-vázlat
                      </Button>
                    )}
                  </div>
                  {filter === "open" && (
                    <div className="flex gap-1 shrink-0">
                      {(it.kind === "lead_promote" || it.kind === "lead_stalled") && it.entity_kind === "partner" && (
                        <Button size="sm" variant="default" className="h-7 bg-emerald-500 hover:bg-emerald-600 text-black" title="Promote 1 click" onClick={() => promoteLead(it)}>
                          <Rocket className="w-3 h-3 mr-1" /> Promote
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" title="Kész" onClick={() => resolve(it.id)}><Check className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" title="Szundi 1 óra" onClick={() => snooze(it.id, 1)}><Clock className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2" title="Szundi 1 nap" onClick={() => snooze(it.id, 24)}>1n</Button>
                      <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2" title="Szundi 7 nap" onClick={() => snooze(it.id, 168)}>7n</Button>
                      <Button size="icon" variant="ghost" title="Eltüntet" onClick={() => dismiss(it.id)}><X className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
