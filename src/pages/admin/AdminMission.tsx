import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Target, Users, Beer, Download, FileText } from "lucide-react";
import MissionPillarPanel from "@/components/admin/mission/MissionPillarPanel";
import MissionTimeline from "@/components/admin/mission/MissionTimeline";
import { toast } from "sonner";
import { useEffect } from "react";

const PARTNER_TARGET = 20;
const WAITLIST_TARGET = 500;

export default function AdminMission() {
  const [loi, setLoi] = useState(0);
  const [waitlist, setWaitlist] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      const [l, w] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }).in("status", ["proposal_sent", "negotiating", "signed"]),
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }),
      ]);
      setLoi(l.count ?? 0);
      setWaitlist(w.count ?? 0);
    })();
  }, []);

  const fetchPartnerSnapshots = async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase.from("daily_kpi_snapshots").select("snapshot_date, qualified_total").gte("snapshot_date", since).order("snapshot_date");
    return (data ?? []).map((r: any) => ({ date: r.snapshot_date, value: r.qualified_total ?? 0 }));
  };
  const fetchWaitlistSnapshots = async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase.from("daily_kpi_snapshots").select("snapshot_date, waitlist_total").gte("snapshot_date", since).order("snapshot_date");
    return (data ?? []).map((r: any) => ({ date: r.snapshot_date, value: r.waitlist_total ?? 0 }));
  };
  const fetchPartnerBlockers = async () => {
    const { data } = await supabase.from("partners").select("status");
    const counts: Record<string, number> = {};
    (data ?? []).forEach((p: any) => { counts[p.status] = (counts[p.status] ?? 0) + 1; });
    return Object.entries(counts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  };
  const fetchWaitlistBlockers = async () => {
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data } = await supabase.from("waitlist_signups").select("source").gte("created_at", since);
    const counts: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { const s = r.source || "direct"; counts[s] = (counts[s] ?? 0) + 1; });
    return Object.entries(counts).map(([label, count]) => ({ label: `forrás: ${label}`, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  };
  const fetchSponsorBlockers = async () => {
    const items: { label: string; count: number }[] = [];
    items.push({ label: "Kell még LOI", count: Math.max(0, 10 - loi) });
    items.push({ label: "Kell még signup", count: Math.max(0, 300 - waitlist) });
    const { count: brandCount } = await supabase.from("brand_knowledge").select("id", { count: "exact", head: true });
    items.push({ label: "Brand memory tételek", count: brandCount ?? 0 });
    return items;
  };

  const downloadReview = async () => {
    setDownloading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weekly-mission-review`;
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!r.ok) throw new Error(await r.text());
      const blob = await r.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `heti-mission-review-${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      toast.success("Heti review letöltve");
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    }
    setDownloading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Misszió központ</h1>
          <p className="text-sm text-nf-text-muted">Szeptemberi misszió részletesen — trend, forecast, blockerek.</p>
        </div>
        <Button variant="neon" onClick={downloadReview} disabled={downloading}>
          <Download className="h-4 w-4 mr-2" />
          {downloading ? "Generálás…" : "Heti review (PDF)"}
        </Button>
      </div>

      <Tabs defaultValue="partner" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="partner"><Target className="h-3.5 w-3.5 mr-1.5" /> Partner LOI</TabsTrigger>
          <TabsTrigger value="waitlist"><Users className="h-3.5 w-3.5 mr-1.5" /> Waitlist</TabsTrigger>
          <TabsTrigger value="sponsor"><Beer className="h-3.5 w-3.5 mr-1.5" /> Italszponzor</TabsTrigger>
        </TabsList>

        <TabsContent value="partner" className="mt-4">
          <MissionPillarPanel
            pillar="partner" label="Partner-előmegállapodás (LOI / aláírt)"
            current={loi} target={PARTNER_TARGET}
            fetchSnapshots={fetchPartnerSnapshots}
            fetchBlockers={fetchPartnerBlockers}
          />
        </TabsContent>
        <TabsContent value="waitlist" className="mt-4">
          <MissionPillarPanel
            pillar="waitlist" label="Előregisztráció (waitlist)"
            current={waitlist} target={WAITLIST_TARGET}
            fetchSnapshots={fetchWaitlistSnapshots}
            fetchBlockers={fetchWaitlistBlockers}
          />
        </TabsContent>
        <TabsContent value="sponsor" className="mt-4">
          <Card className="p-5 border-electric-300/30 mb-4">
            <div className="text-xs uppercase tracking-wider text-nf-text-muted mb-2">Italszponzor pitch readiness</div>
            <div className="text-2xl font-bold">
              {loi >= 10 && waitlist >= 300 ? <span className="text-electric-300">✓ READY TO PITCH</span> : <span className="text-nf-text-muted">Még gyűjtjük az adatokat</span>}
            </div>
            <div className="text-sm text-nf-text-muted mt-2">Kritériumok: ≥10 LOI, ≥300 waitlist signup, kész brand memory.</div>
          </Card>
          <MissionPillarPanel
            pillar="sponsor" label="Italszponzor readiness (proxy: LOI)"
            current={loi} target={10}
            fetchSnapshots={fetchPartnerSnapshots}
            fetchBlockers={fetchSponsorBlockers}
          />
        </TabsContent>
      </Tabs>

      <MissionTimeline />

      <Card className="p-4 border-dashed">
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-electric-300 mt-0.5 shrink-0" />
          <div className="text-sm text-nf-text-muted">
            <strong className="text-foreground">Heti review PDF</strong>: 1 oldal a Founding Pitch stílusban — heti delta, top források, italszponzor readiness, jövő heti 3 fókusz. Letöltheted bármikor a fenti gombbal.
          </div>
        </div>
      </Card>
    </div>
  );
}
