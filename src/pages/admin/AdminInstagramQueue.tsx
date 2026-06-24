import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Instagram, ExternalLink, Copy, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { buildIgPitch, igDeepLink, igHandle } from "@/lib/instagram-message";
import LeadScoreBadge from "@/components/admin/leads/LeadScoreBadge";
import { trackEvent } from "@/lib/track";

type Partner = {
  id: string;
  company_name: string;
  category: string | null;
  city: string | null;
  lead_score: number | null;
  lead_grade: string | null;
  instagram_handle: string | null;
  instagram: string | null;
  score_reasons: any;
};

export default function AdminInstagramQueue() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("partners")
        .select("id, company_name, category, city, lead_score, lead_grade, instagram_handle, instagram, score_reasons")
        .eq("type", "venue")
        .or("instagram_handle.not.is.null,instagram.not.is.null")
        .in("status", ["lead", "contacted"])
        .order("lead_score", { ascending: false, nullsFirst: false })
        .limit(200);
      setRows((data ?? []) as any);
      // mark partners that already had instagram_manual events
      const ids = (data ?? []).map((r: any) => r.id);
      if (ids.length) {
        const { data: enr } = await supabase.from("outreach_enrollments")
          .select("id, entity_id, metadata").eq("entity_type", "partner").in("entity_id", ids);
        const sent = new Set<string>();
        (enr ?? []).forEach((e: any) => {
          if (e.metadata?.channel === "instagram_manual") sent.add(e.entity_id);
        });
        setSentIds(sent);
      }
      setLoading(false);
    })();
  }, []);

  const draftFor = (p: Partner) => drafts[p.id] ?? buildIgPitch(p);

  const openAndCopy = async (p: Partner) => {
    const h = igHandle(p);
    if (!h) { toast({ title: "Nincs IG handle", variant: "destructive" }); return; }
    const msg = draftFor(p);
    try { await navigator.clipboard.writeText(msg); } catch { /* ignore */ }
    window.open(igDeepLink(h), "_blank", "noopener");
    toast({ title: "Üzenet vágólapon", description: "Instagram megnyitva — Ctrl+V + Enter" });
    trackEvent("ig_dm_opened", { entity_type: "partner", entity_id: p.id });
  };

  const markSent = async (p: Partner) => {
    setSentIds((s) => new Set(s).add(p.id));
    await supabase.from("outreach_enrollments").insert({
      entity_type: "partner",
      entity_id: p.id,
      status: "paused",
      current_step: 0,
      metadata: { channel: "instagram_manual", sent_at: new Date().toISOString(), body: draftFor(p) },
    });
    await supabase.from("partners").update({ status: "contacted" }).eq("id", p.id).eq("status", "lead");
    toast({ title: "Elküldve megjelölve" });
  };

  const filtered = rows.filter((r) => {
    if (filterGrade !== "all" && r.lead_grade !== filterGrade) return false;
    if (search && !r.company_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Instagram className="h-6 w-6 text-electric-300" /> Instagram outreach queue
        </h1>
        <p className="text-sm text-nf-text-muted mt-1">
          Félautomata: minden sornál 1 kattintás → Instagram megnyílik + üzenet a vágólapon. Ctrl+V + Enter.
          A Meta Graph API hidegen indított DM-et nem támogat, ez a legtisztább megoldás.
        </p>
      </div>

      <Card className="p-3 mb-4 bg-nf-surface border-nf-border flex flex-wrap gap-2 items-center">
        <Input placeholder="Keresés név alapján…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <div className="flex gap-1">
          {["all", "A", "B", "C", "D"].map((g) => (
            <Button key={g} size="sm" variant={filterGrade === g ? "neon" : "outline"} onClick={() => setFilterGrade(g)}>
              {g === "all" ? "Mind" : g}
            </Button>
          ))}
        </div>
        <div className="ml-auto text-sm text-nf-text-muted">
          {filtered.length} hely · {sentIds.size} már elküldve
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-electric-300" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const handle = igHandle(p);
            const isSent = sentIds.has(p.id);
            return (
              <Card key={p.id} className="p-3 bg-nf-surface border-nf-border">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/admin/partners/${p.id}`} className="font-semibold hover:text-electric-300">{p.company_name}</Link>
                      <LeadScoreBadge score={p.lead_score} reasons={p.score_reasons} />
                      {p.lead_grade && <Badge variant="outline" className="text-[10px]">{p.lead_grade}</Badge>}
                      {p.category && <Badge variant="outline" className="text-[10px]">{p.category}</Badge>}
                      {p.city && <span className="text-[11px] text-nf-text-muted">{p.city}</span>}
                      {handle && <span className="text-[11px] text-electric-300">@{handle}</span>}
                    </div>
                    <Textarea
                      className="mt-2 text-xs min-h-[100px] font-mono bg-nf-surface-alt/30"
                      value={draftFor(p)}
                      onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {isSent ? (
                      <Badge className="bg-electric-300/20 text-electric-300 border-electric-300/40">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> elküldve
                      </Badge>
                    ) : (
                      <>
                        <Button size="sm" variant="neon" onClick={() => openAndCopy(p)} disabled={!handle}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Nyit & másol
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(draftFor(p)).then(() => toast({ title: "Másolva" }))}>
                          <Copy className="h-3.5 w-3.5 mr-1" /> Csak másol
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => markSent(p)}>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Megjelöl
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-nf-text-muted text-sm">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-electric-300/40" />
              Nincs IG handle-lel rendelkező lead a szűrőkkel. Indíts Apify scrape-et!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
